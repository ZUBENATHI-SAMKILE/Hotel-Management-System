import { useEffect, useState } from 'react'
import { Plus, LogIn, LogOut, X } from 'lucide-react'
import { getBookings, createBooking, checkIn, checkOut, cancelBooking, getGuests, getAvailableRooms } from "../../api";
import "../admin/Dashboard.css";

const STATUS_COLORS = { CONFIRMED: 'badge-blue', CHECKED_IN: 'badge-green', CHECKED_OUT: 'badge-gray', CANCELLED: 'badge-red' }

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ guestId: '', roomId: '', checkIn: '', checkOut: '', specialRequests: '', numberOfGuests: 1 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => {
    getBookings().then(setBookings).catch(console.error)
    getGuests().then(setGuests).catch(console.error)
    getAvailableRooms().then(setRooms).catch(console.error)
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await createBooking(form.guestId, form.roomId, {
        checkIn: form.checkIn, checkOut: form.checkOut,
        specialRequests: form.specialRequests, numberOfGuests: form.numberOfGuests
      })
      setShowModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.')
    } finally { setLoading(false) }
  }

  const handleCheckIn = async id => { await checkIn(id); load() }
  const handleCheckOut = async id => { await checkOut(id); load() }
  const handleCancel = async id => { if (!confirm('Cancel this booking?')) return; await cancelBooking(id); load() }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Bookings</h1><p className="page-sub">Manage reservations</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> New Booking</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Guest</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bookings.length === 0 && <tr><td colSpan={7}><div className="empty-state">No bookings yet.</div></td></tr>}
            {bookings.map(b => (
              <tr key={b.id}>
                <td><strong>{b.guest?.name}</strong><br /><span style={{ color: '#9ca3af', fontSize: 12 }}>{b.guest?.email}</span></td>
                <td>Room {b.room?.roomNumber} ({b.room?.type})</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>R{Number(b.totalAmount || 0).toLocaleString()}</td>
                <td><span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.status === 'CONFIRMED' && <button className="btn btn-success btn-sm" onClick={() => handleCheckIn(b.id)}><LogIn size={13} /> Check In</button>}
                    {b.status === 'CHECKED_IN' && <button className="btn btn-outline btn-sm" onClick={() => handleCheckOut(b.id)}><LogOut size={13} /> Check Out</button>}
                    {(b.status === 'CONFIRMED' || b.status === 'CHECKED_IN') && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}><X size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New Booking</h3>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest</label>
                <select value={form.guestId} onChange={e => setForm({ ...form, guestId: e.target.value })} required>
                  <option value="">Select guest...</option>
                  {guests.map(g => <option key={g.id} value={g.id}>{g.name} — {g.email}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Room</label>
                <select value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })} required>
                  <option value="">Select available room...</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} — {r.type} — R{r.pricePerNight}/night</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Check In</label><input type="date" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} required /></div>
                <div className="form-group"><label>Check Out</label><input type="date" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} required /></div>
              </div>
              <div className="form-group"><label>Number of Guests</label><input type="number" min={1} value={form.numberOfGuests} onChange={e => setForm({ ...form, numberOfGuests: e.target.value })} /></div>
              <div className="form-group"><label>Special Requests</label><input value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Booking...' : 'Create Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}