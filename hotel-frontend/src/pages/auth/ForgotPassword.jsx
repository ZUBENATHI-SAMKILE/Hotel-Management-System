import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft} from 'lucide-react'
import axios from 'axios'
import './Auth.css'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await axios.post(`${BASE}/auth/forgot-password`, { email })
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <Link to="/login" className="auth-back"><ArrowLeft size={14} style={{ display: 'inline', marginRight: 4 }} /> Back to Sign In</Link>
        <div className="auth-logo">
          <span style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#b8860b,#d4a017)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>DS</span>
          <span>DreamScape Hotel</span>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}><Mail /></div>
            <h2 className="auth-title">Check Your Email</h2>
            <p className="auth-sub">If that email is registered, you'll receive a reset link shortly.</p>
            <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', marginTop: 24, textDecoration: 'none' }}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-sub">Enter your email and we'll send you a reset link.</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <Mail size={16} className="field-icon" />
                <input type="email" placeholder="Email address" value={email}
                  onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="auth-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}