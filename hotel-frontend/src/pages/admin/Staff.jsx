import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { getStaff, updateStaff, deleteStaff, toggleStaff } from '../../api'
import axios from 'axios'
import './Dashboard.css'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const DEPARTMENTS = ['FRONT_DESK', 'HOUSEKEEPING', 'MANAGEMENT', 'MAINTENANCE', 'FOOD_AND_BEVERAGE', 'SECURITY']

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', department: 'FRONT_DESK', position: '', salary: '', role: 'RECEPTIONIST' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => getStaff().then(setStaff).catch(console.error)
  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '', phone: '', department: 'FRONT_DESK', position: '', salary: '', role: 'RECEPTIONIST' })
    setShowModal(true)
  }

  const openEdit = s => {
    setEditing(s)
    setForm({ name: s.name, email: s.email, password: '', phone: s.phone || '', department: s.department, position: s.position, salary: s.salary || '', role: 'RECEPTIONIST' })
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (editing) {
        await updateStaff(editing.id, { name: form.name, email: form.email, phone: form.phone, department: form.department, position: form.position, salary: form.salary })
      } else {
        await axios.post(`${BASE}/auth/register`, {
          name: form.name, email: form.email, password: form.password, role: form.role,
        }, { headers: { Authorization: `Bearer ${token}` } })
        await axios.post(`${BASE}/staff`, {
          name: form.name, email: form.email, phone: form.phone, department: form.department, position: form.position, salary: form.salary,
        }, { headers: { Authorization: `Bearer ${token}` } })
      }
      setShowModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save staff member.')
    } finally { setLoading(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this staff member?')) return
    await deleteStaff(id); load()
  }

  const handleToggle = async id => { await toggleStaff(id); load() }

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Staff</h1><p className="page-sub">Manage hotel staff accounts</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Add Staff</button>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Salary</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {staff.length === 0 && <tr><td colSpan={7}><div className="empty-state">No staff members found.</div></td></tr>}
            {staff.map(s => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.email}</td>
                <td><span style={{ fontSize: 12 }}>{s.department?.replace(/_/g, ' ')}</span></td>
                <td>{s.position}</td>
                <td>{s.salary ? `R${Number(s.salary).toLocaleString()}` : '—'}</td>
                <td><span className={`badge ${s.active ? 'badge-green' : 'badge-red'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggle(s.id)}>{s.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={13} /></button>
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
            <h3>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
            {!editing && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Creates a login account. Share the email and password with the staff member.</p>}
            {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              {!editing && (
                <div className="form-row">
                  <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" minLength={6} required /></div>
                  <div className="form-group"><label>Role</label>
                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="RECEPTIONIST">Receptionist</option>
                      <option value="HOUSEKEEPING">Housekeeping</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label>Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} required /></div>
                <div className="form-group"><label>Salary (R)</label><input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editing ? 'Save Changes' : 'Create Staff Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}