import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck,PartyPopper } from 'lucide-react'
import { getRooms, getGuests, createGuest, createBooking } from '../../api'
import '../public/Landing.css'

export default function BookRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [room, setRoom] = useState(null)
  const [form, setForm] = useState({ checkIn: '', checkOut: '', numberOfGuests: 1, specialRequests: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getRooms().then(rooms => {
      const r = rooms.find(x => x.id === parseInt(roomId))
      setRoom(r)
    })
  }, [roomId])

  const calcNights = () => {
    if (!form.checkIn || !form.checkOut) return 0
    const diff = new Date(form.checkOut) - new Date(form.checkIn)
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const nights = calcNights()
    if (nights <= 0) { setError('Check-out must be after check-in.'); return }
    setLoading(true)
    try {
      // Find or create guest profile for this user
      let guests = await getGuests()
      let guest = guests.find(g => g.email === user.email)
      if (!guest) {
        guest = await createGuest({ name: user.name, email: user.email })
      }
      await createBooking(guest.id, roomId, form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!room) return <div style={{ padding: 48, textAlign: 'center' }}>Loading room...</div>

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}><PartyPopper size={56} className="w-8 h-8 text-pink-500" /></div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Booking Confirmed!</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>Your booking for Room {room.roomNumber} has been confirmed. We look forward to welcoming you!</p>
        <Link to="/my" className="btn btn-gold" style={{ justifyContent: 'center' }}>View My Bookings</Link>
      </div>
    </div>
  )

  const nights = calcNights()
  const total = nights * Number(room.pricePerNight)

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '80px 24px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link to="/rooms" className="btn btn-outline" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Rooms
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Complete Your Booking</h2>
            {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Check In Date</label>
                  <input type="date" value={form.checkIn} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, checkIn: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Check Out Date</label>
                  <input type="date" value={form.checkOut} min={form.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, checkOut: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input type="number" min={1} max={room.capacity || 4} value={form.numberOfGuests}
                  onChange={e => setForm({ ...form, numberOfGuests: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Special Requests (optional)</label>
                <textarea rows={3} value={form.specialRequests}
                  onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="Early check-in, high floor, etc." style={{ resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }} disabled={loading}>
                {loading ? <span className="spinner" /> : <><CalendarCheck size={18} /> Confirm Booking</>}
              </button>
            </form>
          </div>

          {/* Room Summary */}
          <div>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 24 }}>
              <img src={`https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80`} alt="room" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 18 }}>Room {room.roomNumber}</h3>
                    <span className="badge badge-gold">{room.type}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>R{Number(room.pricePerNight).toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>per night</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                  {nights > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                        <span>R{Number(room.pricePerNight).toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>R{total.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--primary)' }}>R{total.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {nights === 0 && <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>Select dates to see total price</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}