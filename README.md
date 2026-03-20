# DreamScape Hotel Management System

A full-stack hotel management system with a public-facing website, customer booking portal, staff dashboard, and admin panel.
---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | [dreamscape-hotel.vercel.app](https://dreamscape-hotel.vercel.app) |
| **Backend API** | [hotel-management-system-6gng.onrender.com](https://hotel-management-system-6gng.onrender.com) |

---

##  Tech Stack
### Backend
- **Java 17** + **Spring Boot 3.5**
- **Spring Security** + **JWT Authentication**
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL** (Supabase)
- **Spring Mail** (Gmail SMTP)
- **Docker** (Render deployment)

### Frontend
- **React 18** + **Vite**
- **React Router v6**
- **Axios**
- **Recharts**
- **Lucide React**

---

##  User Roles

| Role | Access |
|---|---|
| **Admin** | Full access — rooms, guests, bookings, bills, staff management |
| **Receptionist** | Rooms, guests, bookings only |
| **Housekeeping** | Rooms, guests, bookings only |
| **Customer** | Public site, room browsing, online booking, my bookings |

---

##  Features

### Public Website
-  Hero landing page with hotel info
- Room browsing with filters by type
- Google Maps location
- Photo gallery
- Contact form
- About section with amenities

### Customer Portal
- Register & login
- Browse and book rooms online
- View and manage bookings
- Cancel bookings
- Forgot password / reset password

### Admin Dashboard
- Real-time stats (rooms, guests, revenue)
- Room management (CRUD + status updates)
- Guest management
- Booking management (check-in/check-out)
- Billing & payment tracking
- Staff account creation & management

### Staff Dashboard
- Overview stats
- Room management
- Guest management
- Booking management

---

## Local Development

### Prerequisites
- Java 17
- Maven
- Node.js 18+
- PostgreSQL

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password |

### Rooms
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | Get all rooms |
| GET | `/api/rooms/available` | Get available rooms |
| POST | `/api/rooms` | Create room |
| PATCH | `/api/rooms/{id}` | Update room |
| DELETE | `/api/rooms/{id}` | Delete room |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings/guest/{guestId}/room/{roomId}` | Create booking |
| PATCH | `/api/bookings/{id}/checkin` | Check in |
| PATCH | `/api/bookings/{id}/checkout` | Check out |
| PATCH | `/api/bookings/{id}/cancel` | Cancel booking |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

---
### Backend — Render (Docker)

### Frontend — Vercel

---
### 🧑‍💻 Author

Created with 💙 by Zubenathi Samkile
