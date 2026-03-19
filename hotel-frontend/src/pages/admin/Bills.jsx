import { useEffect, useState } from 'react'
import { Plus, CreditCard } from 'lucide-react'
import { getBills, getBookings, generateBill, markAsPaid } from "../../api";
import './Dashboard.css'

const PAY_STATUS_COLORS = { PENDING: 'badge-yellow', PAID: 'badge-green', PARTIALLY_PAID: 'badge-blue', REFUNDED: 'badge-gray' }
const METHODS = ['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE']

export default function Bills() {
  const [bills, setBills] = useState([])
  const [bookings, setBookings] = useState([])
  const [showGenModal, setShowGenModal] = useState(false)
  const [genForm, setGenForm] = useState({ bookingId: '', additionalCharges: 0, discount: 0, notes: '' })
  const [payMethod, setPayMethod] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => {
    getBills().then(setBills).catch(console.error)
    getBookings().then(b => setBookings(b.filter(x => x.status === 'CHECKED_IN' || x.status === 'CHECKED_OUT'))).catch(console.error)
  }
  useEffect(() => { load() }, [])

  const handleGenerate = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await generateBill(genForm.bookingId, { additionalCharges: genForm.additionalCharges, discount: genForm.discount, notes: genForm.notes })
      setShowGenModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bill.')
    } finally { setLoading(false) }
  }

  const handlePay = async (id) => {
    const method = payMethod[id] || 'CASH'
    await markAsPaid(id, method); load()
  }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Bills</h1><p className="page-sub">Manage invoices and payments</p></div>
        <button className="btn btn-primary" onClick={() => setShowGenModal(true)}><Plus size={15} /> Generate Bill</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Booking</th><th>Guest</th><th>Room Charges</th><th>Extra</th><th>Discount</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bills.length === 0 && <tr><td colSpan={8}><div className="empty-state">No bills generated yet.</div></td></tr>}
            {bills.map(b => (
              <tr key={b.id}>
                <td>#{b.booking?.id}</td>
                <td>{b.booking?.guest?.name}</td>
                <td>R{Number(b.roomCharges || 0).toLocaleString()}</td>
                <td>R{Number(b.additionalCharges || 0).toLocaleString()}</td>
                <td>R{Number(b.discount || 0).toLocaleString()}</td>
                <td><strong>R{Number(b.totalAmount || 0).toLocaleString()}</strong></td>
                <td><span className={`badge ${PAY_STATUS_COLORS[b.paymentStatus]}`}>{b.paymentStatus}</span></td>
                <td>
                  {b.paymentStatus === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <select className="btn btn-outline btn-sm" value={payMethod[b.id] || 'CASH'} onChange={e => setPayMethod({ ...payMethod, [b.id]: e.target.value })}>
                        {METHODS.map(m => <option key={m}>{m}</option>)}
                      </select>
                      <button className="btn btn-success btn-sm" onClick={() => handlePay(b.id)}><CreditCard size={13} /> Pay</button>
                    </div>
                  )}
                  {b.paymentStatus === 'PAID' && <span style={{ color: '#16a34a', fontSize: 12 }}>✓ Paid</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGenModal && (
        <div className="modal-overlay" onClick={() => setShowGenModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Generate Bill</h3>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>Booking</label>
                <select value={genForm.bookingId} onChange={e => setGenForm({ ...genForm, bookingId: e.target.value })} required>
                  <option value="">Select booking...</option>
                  {bookings.map(b => <option key={b.id} value={b.id}>#{b.id} — {b.guest?.name} — Room {b.room?.roomNumber}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Additional Charges (R)</label><input type="number" min={0} value={genForm.additionalCharges} onChange={e => setGenForm({ ...genForm, additionalCharges: e.target.value })} /></div>
                <div className="form-group"><label>Discount (R)</label><input type="number" min={0} value={genForm.discount} onChange={e => setGenForm({ ...genForm, discount: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Notes</label><input value={genForm.notes} onChange={e => setGenForm({ ...genForm, notes: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowGenModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Bill'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}