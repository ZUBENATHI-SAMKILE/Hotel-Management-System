import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import Landing from './pages/public/Landing'
import PublicRooms from './pages/public/PublicRooms'
import BookRoom from './pages/public/BookRoom'

// Auth
import Login from './pages/auth/Login'
import CustomerRegister from './pages/auth/CustomerRegister'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Admin
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Rooms from './pages/admin/Rooms'
import Guests from './pages/admin/Guests'
import Bookings from './pages/admin/Bookings'
import Bills from './pages/admin/Bills'
import Staff from './pages/admin/Staff'

// Staff
import StaffLayout from './layouts/StaffLayout'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffRooms from './pages/staff/StaffRooms'
import StaffGuests from './pages/staff/StaffGuests'
import StaffBookings from './pages/staff/StaffBookings'

// Customer
import CustomerLayout from './layouts/CustomerLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard'

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/rooms" element={<PublicRooms />} />
        <Route path="/book/:roomId" element={<BookRoom />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="guests" element={<Guests />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bills" element={<Bills />} />
          <Route path="staff" element={<Staff />} />
        </Route>

        {/* Staff */}
        <Route path="/staff" element={<PrivateRoute roles={['RECEPTIONIST', 'HOUSEKEEPING']}><StaffLayout /></PrivateRoute>}>
          <Route index element={<StaffDashboard />} />
          <Route path="rooms" element={<StaffRooms />} />
          <Route path="guests" element={<StaffGuests />} />
          <Route path="bookings" element={<StaffBookings />} />
        </Route>

        {/* Customer */}
        <Route path="/my" element={<PrivateRoute roles={['CUSTOMER']}><CustomerLayout /></PrivateRoute>}>
          <Route index element={<CustomerDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}