import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, BedDouble, Clock, XCircle } from 'lucide-react'
import { getGuests, getMyBookings, cancelBooking } from '../../api'

const STATUS_COLORS = { CONFIRMED: 'badge-blue', CHECKED_IN: 'badge-green', CHECKED_OUT: 'badge-gray', CANCELLED: 'badge-red' }

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const load = async () => {
    try {
      const guests = await getGuests()
      const guest = guests.find(g => g.email === user.email)
      if (guest) {
        const myBookings = await getMyBookings(guest.id)
        setBookings(myBookings)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCancel = async id => {
    if (!confirm('Cancel this booking?')) return
    await cancelBooking(id); load()
  }

  const active = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN')
  const past = bookings.filter(b => b.status === 'CHECKED_OUT' || b.status === 'CANCELLED')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>My Bookings</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Welcome back, {user.name}! Manage your reservations here.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: '#2563eb', bg: '#eff6ff' },
          { icon: BedDouble, label: 'Active', value: active.length, color: '#16a34a', bg: '#f0fdf4' },
          { icon: Clock, label: 'Past Stays', value: past.length, color: '#9ca3af', bg: '#f3f4f6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Bookings */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Active Bookings</h2>
        {loading && <div style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>Loading...</div>}
        {!loading && active.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No active bookings</h3>
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20 }}>Ready to plan your next stay?</p>
            <Link to="/rooms" className="btn btn-gold">Browse Rooms</Link>
          </div>
        )}
        {active.map(b => (
          <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
        ))}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Past Stays</h2>
          {past.map(b => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking: b, onCancel }) {
  const STATUS_COLORS = { CONFIRMED: '#2563eb', CHECKED_IN: '#16a34a', CHECKED_OUT: '#9ca3af', CANCELLED: '#dc2626' }
  const nights = Math.max(0, Math.floor((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)))

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=80" alt="room" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h3 style={{ fontWeight: 700 }}>Room {b.room?.roomNumber} — {b.room?.type}</h3>
          <span style={{ background: STATUS_COLORS[b.status] + '20', color: STATUS_COLORS[b.status], padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{b.status}</span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          {b.checkIn} → {b.checkOut} · {nights} night{nights !== 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#b8860b', marginTop: 4 }}>R{Number(b.totalAmount || 0).toLocaleString()}</div>
      </div>
      {(b.status === 'CONFIRMED') && onCancel && (
        <button className="btn btn-outline btn-sm" onClick={() => onCancel(b.id)} style={{ color: '#dc2626', borderColor: '#fecaca' }}>
          <XCircle size={13} /> Cancel
        </button>
      )}
    </div>
  )
}