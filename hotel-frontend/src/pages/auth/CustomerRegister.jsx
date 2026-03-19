import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { registerCustomer } from '../../api'
import './Auth.css'

export default function CustomerRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try {
      const data = await registerCustomer(form.name, form.email, form.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }))
      navigate('/my')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <Link to="/" className="auth-back">← Back to Home</Link>
        <div className="auth-logo">
          <span style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#b8860b,#d4a017)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>DS</span>
          <span>DreamScape Hotel</span>
        </div>
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-sub">Join us and start booking your dream stay</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <User size={16} className="field-icon" />
            <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="auth-field">
            <Mail size={16} className="field-icon" />
            <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-field">
            <Lock size={16} className="field-icon" />
            <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <div className="auth-field">
            <Lock size={16} className="field-icon" />
            <input type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} minLength={6} required />
          </div>
          <button className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}