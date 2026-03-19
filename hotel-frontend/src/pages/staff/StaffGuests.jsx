import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { getGuests, searchGuests, createGuest, updateGuest, deleteGuest } from "../../api";
import "../admin/Dashboard.css";

export default function Guests() {
  const [guests, setGuests] = useState([])
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', nationality: '', idNumber: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => getGuests().then(setGuests).catch(console.error)
  useEffect(() => { load() }, [])

  const handleSearch = async e => {
    const q = e.target.value; setQuery(q)
    if (q.length > 1) searchGuests(q).then(setGuests).catch(console.error)
    else load()
  }

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '', nationality: '', idNumber: '' }); setShowModal(true) }
  const openEdit = g => { setEditing(g); setForm({ name: g.name, email: g.email, phone: g.phone || '', address: g.address || '', nationality: g.nationality || '', idNumber: g.idNumber || '' }); setShowModal(true) }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (editing) await updateGuest(editing.id, form)
      else await createGuest(form)
      setShowModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save guest.')
    } finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this guest?')) return
    await deleteGuest(id); load()
  }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Guests</h1><p className="page-sub">Manage hotel guests</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={query} onChange={handleSearch} placeholder="Search guests..." style={{ paddingLeft: 30, padding: '8px 12px 8px 30px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, fontFamily: 'var(--font)', outline: 'none', background: '#fff' }} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Add Guest</button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Nationality</th><th>ID Number</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {guests.length === 0 && <tr><td colSpan={6}><div className="empty-state">No guests found.</div></td></tr>}
            {guests.map(g => (
              <tr key={g.id}>
                <td><strong>{g.name}</strong></td>
                <td>{g.email}</td>
                <td>{g.phone || '—'}</td>
                <td>{g.nationality || '—'}</td>
                <td>{g.idNumber || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(g)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}><Trash2 size={13} /></button>
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
            <h3>{editing ? 'Edit Guest' : 'Add Guest'}</h3>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label>Nationality</label><input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>ID Number</label><input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} /></div>
              <div className="form-group"><label>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Guest'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}