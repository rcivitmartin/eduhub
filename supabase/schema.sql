-- ============================================================
-- EduHub — Schema complet
-- Executa aquest SQL al SQL Editor de Supabase Dashboard
-- ============================================================

-- Extensió per UUIDs (ja activa per defecte a Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TAULES PRINCIPALS
-- ============================================================

CREATE TABLE IF NOT EXISTS grups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nom text NOT NULL,
  professor text,
  ordre int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alumnes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grup_id uuid REFERENCES grups ON DELETE CASCADE,
  nom text NOT NULL,
  ordre int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  centre_id uuid,
  data_naix date,
  foto_url text
);

CREATE TABLE IF NOT EXISTS comentaris (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE,
  text text,
  generat_ia boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories_comportament (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nom text NOT NULL,
  valor int NOT NULL DEFAULT 1,
  color text DEFAULT '#22c55e',
  emoji text DEFAULT '⭐',
  ordre int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS registres_comportament (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE,
  categoria_id uuid REFERENCES categories_comportament ON DELETE CASCADE,
  professor_id uuid REFERENCES auth.users,
  sessio_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS familiars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE,
  nom text,
  cognoms text,
  email text,
  telefon text,
  relacio text
);

CREATE TABLE IF NOT EXISTS expedients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE UNIQUE,
  perfil_personalitat text,
  perfil_aprenentatge text,
  circumstancies_familiars text,
  fortaleses text,
  debilitats text,
  suports text,
  suports_visibles boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions_llista (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grup_id uuid REFERENCES grups ON DELETE CASCADE,
  professor_id uuid REFERENCES auth.users,
  data date NOT NULL,
  hora_inici time,
  hora_fi time
);

CREATE TABLE IF NOT EXISTS llista (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessio_id uuid REFERENCES sessions_llista ON DELETE CASCADE,
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE,
  estat text CHECK (estat IN ('present','absent','retard','justificat')) NOT NULL,
  comentari text,
  sortida_aula_at timestamptz
);

CREATE TABLE IF NOT EXISTS sortides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  centre_id uuid,
  titol text NOT NULL,
  data_ini date,
  data_fi date,
  descripcio text,
  cost decimal,
  estat text DEFAULT 'pendent'
);

CREATE TABLE IF NOT EXISTS guardies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sortida_id uuid REFERENCES sortides ON DELETE CASCADE,
  hora date,
  franja text,
  professor_absent_id uuid REFERENCES auth.users,
  professor_cobertor_id uuid REFERENCES auth.users,
  aula text,
  estat text DEFAULT 'pendent',
  incidencia text
);

CREATE TABLE IF NOT EXISTS incidencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumne_id uuid REFERENCES alumnes ON DELETE CASCADE,
  professor_id uuid REFERENCES auth.users,
  tipus text,
  gravetat text,
  descripcio text,
  accio text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- VISTA: Punts per alumne (ClassDojo)
-- ============================================================

CREATE OR REPLACE VIEW punts_alumnes AS
SELECT
  a.id as alumne_id,
  a.nom,
  a.grup_id,
  COALESCE(SUM(c.valor), 0) as punts_totals,
  COUNT(CASE WHEN c.valor > 0 THEN 1 END) as positius,
  COUNT(CASE WHEN c.valor < 0 THEN 1 END) as negatius
FROM alumnes a
LEFT JOIN registres_comportament r ON r.alumne_id = a.id
LEFT JOIN categories_comportament c ON c.id = r.categoria_id
GROUP BY a.id, a.nom, a.grup_id;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE grups ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_comportament ENABLE ROW LEVEL SECURITY;
ALTER TABLE registres_comportament ENABLE ROW LEVEL SECURITY;
ALTER TABLE familiars ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_llista ENABLE ROW LEVEL SECURITY;
ALTER TABLE llista ENABLE ROW LEVEL SECURITY;
ALTER TABLE sortides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardies ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencies ENABLE ROW LEVEL SECURITY;

-- Grups: cada usuari veu i gestiona els seus
CREATE POLICY "grups_owner" ON grups
  FOR ALL USING (auth.uid() = user_id);

-- Alumnes: via grup del mateix usuari
CREATE POLICY "alumnes_owner" ON alumnes
  FOR ALL USING (
    grup_id IN (SELECT id FROM grups WHERE user_id = auth.uid())
  );

-- Comentaris: via alumne → grup del mateix usuari
CREATE POLICY "comentaris_owner" ON comentaris
  FOR ALL USING (
    alumne_id IN (
      SELECT a.id FROM alumnes a
      JOIN grups g ON g.id = a.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- Categories comportament: cada usuari les seves
CREATE POLICY "categories_owner" ON categories_comportament
  FOR ALL USING (auth.uid() = user_id);

-- Registres comportament: via alumne del mateix usuari
CREATE POLICY "registres_owner" ON registres_comportament
  FOR ALL USING (
    alumne_id IN (
      SELECT a.id FROM alumnes a
      JOIN grups g ON g.id = a.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- Familiars: via alumne del mateix usuari
CREATE POLICY "familiars_owner" ON familiars
  FOR ALL USING (
    alumne_id IN (
      SELECT a.id FROM alumnes a
      JOIN grups g ON g.id = a.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- Expedients: via alumne del mateix usuari
CREATE POLICY "expedients_owner" ON expedients
  FOR ALL USING (
    alumne_id IN (
      SELECT a.id FROM alumnes a
      JOIN grups g ON g.id = a.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- Sessions llista: via grup del mateix usuari
CREATE POLICY "sessions_llista_owner" ON sessions_llista
  FOR ALL USING (
    grup_id IN (SELECT id FROM grups WHERE user_id = auth.uid())
  );

-- Llista: via sessió → grup del mateix usuari
CREATE POLICY "llista_owner" ON llista
  FOR ALL USING (
    sessio_id IN (
      SELECT s.id FROM sessions_llista s
      JOIN grups g ON g.id = s.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- Sortides: professor_id implícit — per ara accés autenticat
CREATE POLICY "sortides_authenticated" ON sortides
  FOR ALL USING (auth.role() = 'authenticated');

-- Guàrdies: accés autenticat
CREATE POLICY "guardies_authenticated" ON guardies
  FOR ALL USING (auth.role() = 'authenticated');

-- Incidències: via alumne del mateix usuari
CREATE POLICY "incidencies_owner" ON incidencies
  FOR ALL USING (
    alumne_id IN (
      SELECT a.id FROM alumnes a
      JOIN grups g ON g.id = a.grup_id
      WHERE g.user_id = auth.uid()
    )
  );

-- ============================================================
-- CATEGORIES PER DEFECTE (insereix quan l'usuari es registra)
-- Pots executar manualment per a un user_id concret:
-- ============================================================
-- INSERT INTO categories_comportament (user_id, nom, valor, color, emoji, ordre)
-- VALUES
--   ('<user_id>', 'Participació',     1, '#22c55e', '🙋', 0),
--   ('<user_id>', 'Respecte',         1, '#3b82f6', '🤝', 1),
--   ('<user_id>', 'Esforç',           1, '#f59e0b', '💪', 2),
--   ('<user_id>', 'Treball',          1, '#8b5cf6', '📚', 3),
--   ('<user_id>', 'Puntualitat',      1, '#06b6d4', '⏰', 4),
--   ('<user_id>', 'Disrupció',       -1, '#ef4444', '😤', 5),
--   ('<user_id>', 'Manca material',  -1, '#f97316', '🎒', 6);
