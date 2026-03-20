import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BedDouble, Users, CalendarCheck, Receipt, UserCog, LogOut, ExternalLink, Menu, X } from 'lucide-react'
import './AdminLayout.css'

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/rooms', icon: BedDouble, label: 'Rooms' },
  { to: '/admin/guests', icon: Users, label: 'Guests' },
  { to: '/admin/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/admin/bills', icon: Receipt, label: 'Bills' },
  { to: '/admin/staff', icon: UserCog, label: 'Staff' },
]

export default function AdminLayout() {
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
              <div style={{ fontSize: 11, color: '#d4a017', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end={to === '/admin'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}>
                <Icon size={17} /><span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <a href="/" target="_blank" className="view-site-btn"><ExternalLink size={13} /> View Site</a>
            <div className="sidebar-user">
              <div className="user-avatar">{user.name?.[0] || 'A'}</div>
              <div><div className="user-name">{user.name}</div><div className="user-role">Admin</div></div>
            </div>
            <button className="logout-btn" onClick={logout}><LogOut size={15} /></button>
          </div>
        </aside>

        <main className="content"><Outlet /></main>
      </div>
    </>
  )
}