export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      grups: {
        Row: {
          id: string
          user_id: string
          nom: string
          professor: string | null
          ordre: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          professor?: string | null
          ordre?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          professor?: string | null
          ordre?: number
          created_at?: string
        }
      }
      alumnes: {
        Row: {
          id: string
          grup_id: string
          nom: string
          ordre: number
          created_at: string
          centre_id: string | null
          data_naix: string | null
          foto_url: string | null
        }
        Insert: {
          id?: string
          grup_id: string
          nom: string
          ordre?: number
          created_at?: string
          centre_id?: string | null
          data_naix?: string | null
          foto_url?: string | null
        }
        Update: {
          id?: string
          grup_id?: string
          nom?: string
          ordre?: number
          centre_id?: string | null
          data_naix?: string | null
          foto_url?: string | null
        }
      }
      comentaris: {
        Row: {
          id: string
          alumne_id: string
          text: string | null
          generat_ia: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          alumne_id: string
          text?: string | null
          generat_ia?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          alumne_id?: string
          text?: string | null
          generat_ia?: boolean
          updated_at?: string
        }
      }
      categories_comportament: {
        Row: {
          id: string
          user_id: string
          nom: string
          valor: number
          color: string
          emoji: string
          ordre: number
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          valor: number
          color?: string
          emoji?: string
          ordre?: number
        }
        Update: {
          id?: string
          user_id?: string
          nom?: string
          valor?: number
          color?: string
          emoji?: string
          ordre?: number
        }
      }
      registres_comportament: {
        Row: {
          id: string
          alumne_id: string
          categoria_id: string
          professor_id: string
          sessio_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          alumne_id: string
          categoria_id: string
          professor_id: string
          sessio_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          alumne_id?: string
          categoria_id?: string
          professor_id?: string
          sessio_id?: string | null
          created_at?: string
        }
      }
      familiars: {
        Row: {
          id: string
          alumne_id: string
          nom: string | null
          cognoms: string | null
          email: string | null
          telefon: string | null
          relacio: string | null
        }
        Insert: {
          id?: string
          alumne_id: string
          nom?: string | null
          cognoms?: string | null
          email?: string | null
          telefon?: string | null
          relacio?: string | null
        }
        Update: {
          id?: string
          alumne_id?: string
          nom?: string | null
          cognoms?: string | null
          email?: string | null
          telefon?: string | null
          relacio?: string | null
        }
      }
      expedients: {
        Row: {
          id: string
          alumne_id: string
          perfil_personalitat: string | null
          perfil_aprenentatge: string | null
          circumstancies_familiars: string | null
          fortaleses: string | null
          debilitats: string | null
          suports: string | null
          suports_visibles: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          alumne_id: string
          perfil_personalitat?: string | null
          perfil_aprenentatge?: string | null
          circumstancies_familiars?: string | null
          fortaleses?: string | null
          debilitats?: string | null
          suports?: string | null
          suports_visibles?: boolean
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['expedients']['Insert']>
      }
      sessions_llista: {
        Row: {
          id: string
          grup_id: string
          professor_id: string
          data: string
          hora_inici: string | null
          hora_fi: string | null
        }
        Insert: {
          id?: string
          grup_id: string
          professor_id: string
          data: string
          hora_inici?: string | null
          hora_fi?: string | null
        }
        Update: Partial<Database['public']['Tables']['sessions_llista']['Insert']>
      }
      llista: {
        Row: {
          id: string
          sessio_id: string
          alumne_id: string
          estat: 'present' | 'absent' | 'retard' | 'justificat'
          comentari: string | null
          sortida_aula_at: string | null
        }
        Insert: {
          id?: string
          sessio_id: string
          alumne_id: string
          estat: 'present' | 'absent' | 'retard' | 'justificat'
          comentari?: string | null
          sortida_aula_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['llista']['Insert']>
      }
      sortides: {
        Row: {
          id: string
          centre_id: string | null
          titol: string
          data_ini: string | null
          data_fi: string | null
          descripcio: string | null
          cost: number | null
          estat: string
        }
        Insert: {
          id?: string
          centre_id?: string | null
          titol: string
          data_ini?: string | null
          data_fi?: string | null
          descripcio?: string | null
          cost?: number | null
          estat?: string
        }
        Update: Partial<Database['public']['Tables']['sortides']['Insert']>
      }
      guardies: {
        Row: {
          id: string
          sortida_id: string | null
          hora: string | null
          franja: string | null
          professor_absent_id: string | null
          professor_cobertor_id: string | null
          aula: string | null
          estat: string
          incidencia: string | null
        }
        Insert: {
          id?: string
          sortida_id?: string | null
          hora?: string | null
          franja?: string | null
          professor_absent_id?: string | null
          professor_cobertor_id?: string | null
          aula?: string | null
          estat?: string
          incidencia?: string | null
        }
        Update: Partial<Database['public']['Tables']['guardies']['Insert']>
      }
      incidencies: {
        Row: {
          id: string
          alumne_id: string
          professor_id: string
          tipus: string | null
          gravetat: string | null
          descripcio: string | null
          accio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          alumne_id: string
          professor_id: string
          tipus?: string | null
          gravetat?: string | null
          descripcio?: string | null
          accio?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['incidencies']['Insert']>
      }
    }
    Views: {
      punts_alumnes: {
        Row: {
          alumne_id: string
          nom: string
          grup_id: string
          punts_totals: number
          positius: number
          negatius: number
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
