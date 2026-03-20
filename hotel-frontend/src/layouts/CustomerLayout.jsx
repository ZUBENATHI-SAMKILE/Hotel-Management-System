import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { CalendarCheck, LogOut, Home, Menu, X } from 'lucide-react'

export default function CustomerLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav style={{ background: '#0f1523', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#b8860b,#d4a017)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>DS</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>DreamScape Hotel</span>
        </Link>

        {/* Desktop nav */}
        <div className="customer-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}><Home size={15} /> Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Hi, {user.name}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} className="customer-hamburger">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {open && (
        <div style={{ background: '#0f1523', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 12 }} className="customer-mobile-menu">
          <Link to="/" onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}><Home size={15} /> Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Hi, {user.name}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .customer-nav-desktop { display: none !important; }
          .customer-hamburger { display: flex !important; }
        }
      `}</style>

      <main style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}><Outlet /></main>
    </div>
  )
}