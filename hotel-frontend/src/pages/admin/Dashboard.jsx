import { useEffect, useState } from 'react'
import { BedDouble, Users, CalendarCheck, DollarSign, TrendingUp, UserCog, BedSingle, AlertCircle,Hand } from 'lucide-react'
import { getDashboardStats } from "../../api";
import './Dashboard.css'

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="stat-card fade-up">
      <div className="stat-icon" style={{ background: bg, color }}>
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error)
  }, [])

  const occupancyRate = stats
    ? stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0
    : 0

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back, {user.name} <Hand size={23} /></p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={BedDouble} label="Total Rooms" value={stats?.totalRooms} color="#2563eb" bg="#eff6ff" />
        <StatCard icon={BedSingle} label="Available Rooms" value={stats?.availableRooms} color="#16a34a" bg="#f0fdf4" />
        <StatCard icon={AlertCircle} label="Occupied Rooms" value={stats?.occupiedRooms} color="#d97706" bg="#fffbeb" />
        <StatCard icon={Users} label="Total Guests" value={stats?.totalGuests} color="#7c3aed" bg="#f5f3ff" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={stats?.totalBookings} color="#0891b2" bg="#ecfeff" />
        <StatCard icon={TrendingUp} label="Checked In" value={stats?.checkedInBookings} color="#be185d" bg="#fdf2f8" />
        <StatCard icon={UserCog} label="Active Staff" value={stats?.totalStaff} color="#b45309" bg="#fffbeb" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`R${Number(stats?.totalRevenue || 0).toLocaleString()}`} color="#16a34a" bg="#f0fdf4" />
      </div>

      <div className="dashboard-bottom">
        <div className="occupancy-card fade-up">
          <div className="occupancy-header">
            <h3>Occupancy Rate</h3>
            <span className="occupancy-pct">{occupancyRate}%</span>
          </div>
          <div className="occupancy-bar">
            <div className="occupancy-fill" style={{ width: `${occupancyRate}%` }} />
          </div>
          <div className="occupancy-legend">
            <span style={{ color: '#2563eb' }}>● Occupied: {stats?.occupiedRooms || 0}</span>
            <span style={{ color: '#16a34a' }}>● Available: {stats?.availableRooms || 0}</span>
          </div>
        </div>

        <div className="booking-status fade-up">
          <h3>Booking Status</h3>
          <div className="status-list">
            {[
              { label: 'Confirmed', value: stats?.confirmedBookings, color: '#2563eb' },
              { label: 'Checked In', value: stats?.checkedInBookings, color: '#16a34a' },
              { label: 'Total', value: stats?.totalBookings, color: '#6b7280' },
            ].map(s => (
              <div className="status-item" key={s.label}>
                <span className="status-dot" style={{ background: s.color }} />
                <span className="status-label">{s.label}</span>
                <span className="status-val">{s.value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}