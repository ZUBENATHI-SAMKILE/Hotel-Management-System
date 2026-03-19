import { useEffect, useState } from 'react'
import { BedDouble, Users, CalendarCheck, BedSingle } from 'lucide-react'
import { getDashboardStats } from '../../api'
import '../admin/Dashboard.css'

export default function StaffDashboard() {
  const [stats, setStats] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => { getDashboardStats().then(setStats).catch(console.error) }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Dashboard</h1>
          <p className="page-sub">Welcome, {user.name} 👋 — {user.role}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: BedDouble, label: 'Total Rooms', value: stats?.totalRooms, color: '#2563eb', bg: '#eff6ff' },
          { icon: BedSingle, label: 'Available', value: stats?.availableRooms, color: '#16a34a', bg: '#f0fdf4' },
          { icon: Users, label: 'Total Guests', value: stats?.totalGuests, color: '#7c3aed', bg: '#f5f3ff' },
          { icon: CalendarCheck, label: 'Bookings Today', value: stats?.checkedInBookings, color: '#0891b2', bg: '#ecfeff' },
        ].map(s => (
          <div key={s.label} className="stat-card fade-up">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={20} /></div>
            <div className="stat-info">
              <div className="stat-value">{s.value ?? '—'}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Use the sidebar to manage rooms, guests, and bookings. Contact your admin for billing and staff management access.</p>
      </div>
    </div>
  )
}