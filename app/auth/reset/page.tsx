'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else router.push('/grups')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Nova contrasenya</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Nova contrasenya"
          />
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Guardant...' : 'Canvia la contrasenya'}
          </button>
        </form>
      </div>
    </div>
  )
}
