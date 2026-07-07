import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form,         setForm]         = useState({ username: '', password: '' })
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Both fields are required.'); return }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', form)
      login(data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-dark-text mb-1">Bliss Haven Edge</h1>
          <p className="font-inter text-[10px] tracking-[0.22em] uppercase text-gold">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft px-6 py-8">
          <h2 className="font-playfair text-xl text-dark-text mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            <div>
              <label className="block font-inter text-[10px] tracking-[0.18em] uppercase text-dark-text/55 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={set('username')}
                placeholder="alihassan13"
                autoComplete="username"
                className="w-full border border-dark-text/20 rounded-lg px-4 py-3 font-inter text-sm text-dark-text focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block font-inter text-[10px] tracking-[0.18em] uppercase text-dark-text/55 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full border border-dark-text/20 rounded-lg px-4 py-3 pr-11 font-inter text-sm text-dark-text focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text/35 hover:text-dark-text/70 transition-colors p-0.5"
                >
                  {showPassword ? (
                    /* Eye-off */
                    <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="font-inter text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-white font-inter py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center font-inter text-xs text-dark-text/35 mt-6">
          <a href="/" className="hover:text-gold transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}
