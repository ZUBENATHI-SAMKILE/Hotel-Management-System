import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { getRooms } from '../../api'
import './Landing.css'
import './PublicRooms.css'

const TYPE_IMAGES = {
  SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  DOUBLE: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80",
  SUITE: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  DELUXE: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  PENTHOUSE: 'https://images.unsplash.com/photo-1611755489400-3c53602ab783?w=600&q=80',
}

export default function PublicRooms() {
  const [rooms, setRooms] = useState([])
  const [filter, setFilter] = useState('ALL')
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => { getRooms().then(setRooms).catch(console.error) }, [])

  const filtered = filter === 'ALL' ? rooms : rooms.filter(r => r.type === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80) center/cover', padding: '100px 24px 60px', textAlign: 'center' }}>
        <Link to="/" className="btn btn-outline" style={{ color: '#0f0e0e', borderColor: 'rgba(255,255,255,0.3)', marginBottom: 24, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 style={{ color: '#fff', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, marginBottom: 12 }}>Our Rooms & Suites</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Discover your perfect retreat at DreamScape Hotel</p>
      </div>

      <div className="land-container" style={{ padding: '48px 24px' }}>
        {/* Filter */}
        <div className="rooms-filter">
          {['ALL', 'SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PENTHOUSE'].map(t => (
            <button key={t} className={`filter-btn ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
              {t === 'ALL' ? 'All Rooms' : t}
            </button>
          ))}
        </div>

        <div className="rooms-grid">
          {filtered.length === 0 && <div className="empty-state">No rooms available at the moment.</div>}
          {filtered.map(r => (
            <div className="room-card fade-up" key={r.id}>
              <div className="room-img">
                <img src={TYPE_IMAGES[r.type] || TYPE_IMAGES.SINGLE} alt={r.type} />
                <span className="room-badge">{r.type}</span>
                {r.status !== 'AVAILABLE' && <div className="room-unavail">Unavailable</div>}
              </div>
              <div className="room-body">
                <h3>Room {r.roomNumber}</h3>
                <div className="room-meta">
                  <span>Floor {r.floor || 1}</span>
                  <span>Up to {r.capacity || 2} guests</span>
                </div>
                <p className="room-desc">{r.description || 'A beautifully appointed room with premium amenities and stunning city views.'}</p>
                {r.amenities && <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>✓ {r.amenities}</p>}
                <div className="room-footer">
                  <div className="room-price">
                    <span className="price-amt">R{Number(r.pricePerNight).toLocaleString()}</span>
                    <span className="price-night">/ night</span>
                  </div>
                  {r.status === 'AVAILABLE' ? (
                    <Link to={token && user.role === 'CUSTOMER' ? `/book/${r.id}` : '/register'} className="btn btn-gold btn-sm">
                      {token && user.role === 'CUSTOMER' ? 'Book Now' : 'Sign Up to Book'}
                    </Link>
                  ) : (
                    <span className="badge badge-red">Unavailable</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}