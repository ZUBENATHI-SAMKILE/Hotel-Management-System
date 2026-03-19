import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { getRooms, createRoom, updateRoom, deleteRoom, updateRoomStatus } from "../../api";
import "../admin/Dashboard.css";

const STATUS_COLORS = { AVAILABLE: 'badge-green', OCCUPIED: 'badge-yellow', MAINTENANCE: 'badge-red', RESERVED: 'badge-blue' }
const TYPES = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PENTHOUSE']
const STATUSES = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ roomNumber: '', type: 'SINGLE', pricePerNight: '', floor: '', capacity: '', description: '', amenities: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => getRooms().then(setRooms).catch(console.error)
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm({ roomNumber: '', type: 'SINGLE', pricePerNight: '', floor: '', capacity: '', description: '', amenities: '' }); setShowModal(true) }
  const openEdit = r => { setEditing(r); setForm({ roomNumber: r.roomNumber, type: r.type, pricePerNight: r.pricePerNight, floor: r.floor || '', capacity: r.capacity || '', description: r.description || '', amenities: r.amenities || '' }); setShowModal(true) }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (editing) await updateRoom(editing.id, form)
      else await createRoom(form)
      setShowModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room.')
    } finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this room?')) return
    await deleteRoom(id); load()
  }

  const handleStatus = async (id, status) => {
    await updateRoomStatus(id, status); load()
  }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Rooms</h1><p className="page-sub">Manage hotel rooms</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Add Room</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Room</th><th>Type</th><th>Status</th><th>Price/Night</th><th>Floor</th><th>Capacity</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 && <tr><td colSpan={7}><div className="empty-state">No rooms found. Add your first room!</div></td></tr>}
            {rooms.map(r => (
              <tr key={r.id}>
                <td><strong>{r.roomNumber}</strong></td>
                <td>{r.type}</td>
                <td><span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                <td>R{Number(r.pricePerNight).toLocaleString()}</td>
                <td>{r.floor || '—'}</td>
                <td>{r.capacity || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select className="btn btn-outline btn-sm" value={r.status} onChange={e => handleStatus(r.id, e.target.value)}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={13} /></button>
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
            <h3>{editing ? 'Edit Room' : 'Add Room'}</h3>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Room Number</label>
                  <input value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Night (R)</label>
                  <input type="number" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Floor</label>
                  <input type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, AC, TV..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}