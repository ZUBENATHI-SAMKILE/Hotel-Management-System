import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BedDouble, Users, CalendarCheck, LogOut, Menu, X } from 'lucide-react'
import '../layouts/AdminLayout.css'

const nav = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/staff/guests', icon: Users, label: 'Guests' },
  { to: '/staff/bookings', icon: CalendarCheck, label: 'Bookings' },
]

export default function StaffLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-brand">
          <div className="sidebar-logo">DS</div>
          DreamScape
        </div>
        <button className="hamburger" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <div className="layout">
        <aside className={`sidebar ${open ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <div className="sidebar-logo">DS</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>DreamScape</div>
              <div style={{ fontSize: 11, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Staff Portal</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/staff'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}>
                <Icon size={17} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sidebar-user">
                <div className="user-avatar">{user.name?.[0] || 'S'}</div>
                <div><div className="user-name">{user.name}</div><div className="user-role">{user.role}</div></div>
              </div>
              <button className="logout-btn" onClick={logout}><LogOut size={15} /></button>
            </div>
          </div>
        </aside>
        <main className="content"><Outlet /></main>
      </div>
    </>
  )
}