import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Lock, CheckCircle } from 'lucide-react'
import axios from 'axios'
import './Auth.css'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try {
      await axios.post(`${BASE}/auth/reset-password`, { token, password: form.password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or has expired.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <span style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#b8860b,#d4a017)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>DS</span>
          <span>DreamScape Hotel</span>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <h2 className="auth-title">Password Reset!</h2>
            <p className="auth-sub">Your password has been reset. Redirecting to sign in...</p>
            <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 24, textDecoration: 'none' }}>Sign In Now →</Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-sub">Enter your new password below.</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <Lock size={16} className="field-icon" />
                <input type="password" placeholder="New password (min 6 chars)" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
              </div>
              <div className="auth-field">
                <Lock size={16} className="field-icon" />
                <input type="password" placeholder="Confirm new password" value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })} minLength={6} required />
              </div>
              <button className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Reset Password →'}
              </button>
            </form>

            <p className="auth-switch"><Link to="/login">Back to Sign In</Link></p>
          </>
        )}
      </div>
    </div>
  )
}