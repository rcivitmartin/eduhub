'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'register' | 'reset'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/grups')
    } else if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setInfo("Comprova el teu correu per confirmar el compte.")
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/reset`,
      })
      if (error) setError(error.message)
      else setInfo("T'hem enviat un correu per restablir la contrasenya.")
    }

    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  function switchMode(m: Mode) {
    setMode(m)
    setError('')
    setInfo('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl">🔔</span>
            <span className="text-3xl font-bold text-violet-700">EduHub</span>
          </div>
          <p className="text-sm text-gray-500">Gestió integral del centre educatiu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {mode === 'login' && 'Inicia sessió'}
            {mode === 'register' && 'Crea un compte'}
            {mode === 'reset' && 'Restableix la contrasenya'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correu electrònic
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="nom@escola.cat"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contrasenya
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            {info && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">{info}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading
                ? 'Carregant...'
                : mode === 'login'
                ? 'Entra'
                : mode === 'register'
                ? 'Crear compte'
                : 'Envia el correu'}
            </button>
          </form>

          {mode !== 'reset' && (
            <>
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-xs text-gray-400">o</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continua amb Google
              </button>
            </>
          )}

          <div className="mt-6 text-center space-y-2 text-sm">
            {mode === 'login' && (
              <>
                <button onClick={() => switchMode('reset')}
                  className="text-violet-600 hover:underline block w-full">
                  He oblidat la contrasenya
                </button>
                <button onClick={() => switchMode('register')}
                  className="text-gray-500 hover:text-gray-700">
                  No tens compte?{' '}
                  <span className="text-violet-600 hover:underline">Crea&apos;n un</span>
                </button>
              </>
            )}
            {mode === 'register' && (
              <button onClick={() => switchMode('login')} className="text-gray-500 hover:text-gray-700">
                Ja tens compte?{' '}
                <span className="text-violet-600 hover:underline">Inicia sessió</span>
              </button>
            )}
            {mode === 'reset' && (
              <button onClick={() => switchMode('login')} className="text-violet-600 hover:underline">
                Torna a l&apos;inici de sessió
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
