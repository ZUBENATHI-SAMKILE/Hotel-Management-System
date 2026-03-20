import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// To ensure response is always an array
const toArray = r => Array.isArray(r.data) ? r.data : (r.data?.content ?? r.data ?? [])

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data)

export const registerStaff = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role }).then(r => r.data)

export const registerCustomer = (name, email, password) =>
  api.post('/auth/register', { name, email, password, role: 'CUSTOMER' }).then(r => r.data)

// Dashboard
export const getDashboardStats = () =>
  api.get('/dashboard/stats').then(r => r.data)

// Rooms
export const getRooms = () => api.get('/rooms').then(toArray)
export const getAvailableRooms = () => api.get('/rooms/available').then(toArray)
export const createRoom = data => api.post('/rooms', data).then(r => r.data)
export const updateRoom = (id, data) => api.patch(`/rooms/${id}`, data).then(r => r.data)
export const deleteRoom = id => api.delete(`/rooms/${id}`)
export const updateRoomStatus = (id, status) =>
  api.patch(`/rooms/${id}/status?status=${status}`).then(r => r.data)

// Guests
export const getGuests = () => api.get('/guests').then(toArray)
export const searchGuests = name => api.get(`/guests/search?name=${name}`).then(toArray)
export const createGuest = data => api.post('/guests', data).then(r => r.data)
export const updateGuest = (id, data) => api.patch(`/guests/${id}`, data).then(r => r.data)
export const deleteGuest = id => api.delete(`/guests/${id}`)

// Bookings
export const getBookings = () => api.get('/bookings').then(toArray)
export const getBookingsByStatus = status => api.get(`/bookings/status/${status}`).then(toArray)
export const getMyBookings = guestId => api.get(`/bookings/guest/${guestId}`).then(toArray)
export const createBooking = (guestId, roomId, data) =>
  api.post(`/bookings/guest/${guestId}/room/${roomId}`, data).then(r => r.data)
export const checkIn = id => api.patch(`/bookings/${id}/checkin`).then(r => r.data)
export const checkOut = id => api.patch(`/bookings/${id}/checkout`).then(r => r.data)
export const cancelBooking = id => api.patch(`/bookings/${id}/cancel`).then(r => r.data)

// Bills
export const getBills = () => api.get('/bills').then(toArray)
export const generateBill = (bookingId, data) =>
  api.post(`/bills/generate/${bookingId}`, data).then(r => r.data)
export const markAsPaid = (id, method) =>
  api.patch(`/bills/${id}/pay?method=${method}`).then(r => r.data)
export const getTotalRevenue = () => api.get('/bills/revenue').then(r => r.data)

// Staff
export const getStaff = () => api.get('/staff').then(toArray)
export const createStaff = data => api.post('/staff', data).then(r => r.data)
export const updateStaff = (id, data) => api.patch(`/staff/${id}`, data).then(r => r.data)
export const toggleStaff = id => api.patch(`/staff/${id}/toggle`).then(r => r.data)
export const deleteStaff = id => api.delete(`/staff/${id}`)