import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star,CheckCircle, MapPin, Phone, Mail, Wifi, Car, Coffee, Waves, Dumbbell, Shield, ChevronDown, Menu, X } from 'lucide-react'
import { getAvailableRooms } from '../../api'
import './Landing.css'

const AMENITIES = [
  { icon: Wifi, title: 'Free High-Speed WiFi', desc: 'Stay connected throughout your stay with complimentary WiFi in all rooms and common areas.' },
  { icon: Car, title: 'Valet Parking', desc: 'Secure, 24-hour valet parking available for all guests at DreamScape Hotel.' },
  { icon: Coffee, title: 'Fine Dining', desc: 'Experience world-class cuisine at our award-winning restaurant and rooftop bar.' },
  { icon: Waves, title: 'Infinity Pool', desc: 'Relax in our stunning infinity pool overlooking the Johannesburg skyline.' },
  { icon: Dumbbell, title: 'Fitness Center', desc: 'State-of-the-art gym open 24/7, featuring the latest equipment.' },
  { icon: Shield, title: '24/7 Security', desc: 'Your safety is our priority with round-the-clock security and concierge service.' },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
]

export default function Landing() {
  const [rooms, setRooms] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    getAvailableRooms().then(r => setRooms(r.slice(0, 6))).catch(() => {})
  }, [])

  const handleContact = e => {
    e.preventDefault()
    setContactSent(true)
    setContactForm({ name: '', email: '', message: '' })
  }

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!token) return '/login'
    if (user.role === 'ADMIN') return '/admin'
    if (user.role === 'CUSTOMER') return '/my'
    return '/staff'
  }

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">
            <span className="logo-ds">DS</span>
            <span>DreamScape Hotel</span>
          </div>
          <div className={`land-nav-links ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => scrollTo('about')}>About</button>
            <button onClick={() => scrollTo('rooms')}>Rooms</button>
            <button onClick={() => scrollTo('amenities')}>Amenities</button>
            <button onClick={() => scrollTo('gallery')}>Gallery</button>
            <button onClick={() => scrollTo('contact')}>Contact</button>
          </div>
          <div className="land-nav-actions">
            {token ? (
              <Link to={getDashboardLink()} className="btn btn-gold">My Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Sign In</Link>
                <Link to="/register" className="btn btn-gold">Book Now</Link>
              </>
            )}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-overlay" />
        <div className="hero-content fade-up">
          <div className="hero-tag">⭐ 5-Star Luxury Experience</div>
          <h1>Welcome to<br /><span className="hero-accent">DreamScape Hotel</span></h1>
          <p>Where luxury meets comfort in the heart of Johannesburg. Experience world-class hospitality like never before.</p>
          <div className="hero-actions">
            <button onClick={() => scrollTo('rooms')} className="btn btn-gold">Explore Rooms</button>
            <button onClick={() => scrollTo('about')} className="btn btn-outline" style={{ color: '#ccbcbc', borderColor: 'rgba(255,255,255,0.4)' }}>Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Rooms</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><strong>4.9★</strong><span>Rating</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><strong>20yr</strong><span>Experience</span></div>
          </div>
        </div>
        <button className="scroll-down" onClick={() => scrollTo('about')}>
          <ChevronDown size={24} />
        </button>
      </section>

      {/* About */}
      <section className="land-section" id="about">
        <div className="land-container">
          <div className="about-grid">
            <div className="about-img-grid">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80" alt="Hotel lobby" />
              <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80" alt="Hotel room" />
            </div>
            <div className="about-content fade-up">
              <div className="section-tag">About Us</div>
              <h2 className="section-title">A Legacy of Luxury<br />Since 2004</h2>
              <p>DreamScape Hotel is Johannesburg's premier luxury destination, offering an unparalleled experience of sophistication, comfort, and world-class service.</p>
              <p style={{ marginTop: 16 }}>Nestled in the heart of the city, our hotel combines modern elegance with warm South African hospitality. Every detail — from our meticulously designed rooms to our award-winning cuisine — has been crafted to exceed your expectations.</p>
              <div className="about-highlights">
                {[
                  { num: '500+', label: 'Luxury Rooms' },
                  { num: '15+', label: 'Restaurants & Bars' },
                  { num: '50k+', label: 'Happy Guests' },
                  { num: '20+', label: 'Awards Won' },
                ].map(h => (
                  <div className="about-highlight" key={h.label}>
                    <strong>{h.num}</strong>
                    <span>{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="land-section bg-light" id="rooms">
        <div className="land-container">
          <div className="section-header">
            <div className="section-tag">Our Rooms</div>
            <h2 className="section-title">Rooms & Suites</h2>
            <p className="section-sub">Choose from our selection of beautifully designed rooms and suites, each crafted for your ultimate comfort.</p>
          </div>
          {rooms.length === 0 ? (
            <div className="no-rooms">
              <p>Rooms coming soon. <Link to="/register">Register</Link> to get notified.</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map(r => (
                <div className="room-card fade-up" key={r.id}>
                  <div className="room-img">
                    <img src={getRoomImage(r.type)} alt={r.type} />
                    <span className="room-badge">{r.type}</span>
                  </div>
                  <div className="room-body">
                    <h3>Room {r.roomNumber}</h3>
                    <div className="room-meta">
                      <span>Floor {r.floor || 1}</span>
                      <span>Capacity: {r.capacity || 2}</span>
                    </div>
                    <p className="room-desc">{r.description || 'A beautifully appointed room with premium amenities and stunning city views.'}</p>
                    <div className="room-footer">
                      <div className="room-price">
                        <span className="price-amt">R{Number(r.pricePerNight).toLocaleString()}</span>
                        <span className="price-night">/ night</span>
                      </div>
                      <Link to={token ? `/book/${r.id}` : '/register'} className="btn btn-gold btn-sm">
                        {token ? 'Book Now' : 'Sign Up to Book'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/rooms" className="btn btn-dark">View All Rooms</Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="land-section" id="amenities">
        <div className="land-container">
          <div className="section-header">
            <div className="section-tag">Amenities</div>
            <h2 className="section-title">World-Class Facilities</h2>
            <p className="section-sub">Everything you need for a perfect stay, all under one roof.</p>
          </div>
          <div className="amenities-grid">
            {AMENITIES.map(a => (
              <div className="amenity-card fade-up" key={a.title}>
                <div className="amenity-icon"><a.icon size={24} /></div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="land-section bg-dark" id="gallery">
        <div className="land-container">
          <div className="section-header" style={{ color: '#fff' }}>
            <div className="section-tag" style={{ color: '#d4a017' }}>Gallery</div>
            <h2 className="section-title" style={{ color: '#fff' }}>A Glimpse of Luxury</h2>
          </div>
          <div className="gallery-grid">
            {GALLERY.map((src, i) => (
              <div className="gallery-item" key={i}>
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Contact */}
      <section className="land-section" id="contact">
        <div className="land-container">
          <div className="contact-grid">
            {/* Map */}
            <div className="map-block fade-up">
              <div className="section-tag">Location</div>
              <h2 className="section-title">Find Us</h2>
              <div className="map-info">
                <div className="map-detail"><MapPin size={18} color="#b8860b" /><span>123 Nelson Mandela Square, Sandton, Johannesburg, 2196</span></div>
                <div className="map-detail"><Phone size={18} color="#b8860b" /><span>+27 11 234 5678</span></div>
                <div className="map-detail"><Mail size={18} color="#b8860b" /><span>info@dreamscapehotel.co.za</span></div>
              </div>
              <div className="map-embed">
                <iframe
                  title="DreamScape Hotel Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.4!2d28.0567!3d-26.1076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e957398e7d0c08d%3A0x4a9b6e9b3f8d5b0!2sSandton%2C+Johannesburg!5e0!3m2!1sen!2sza!4v1"
                  width="100%" height="280" style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-block fade-up">
              <div className="section-tag">Contact</div>
              <h2 className="section-title">Get In Touch</h2>
              {contactSent ? (
                <div className="contact-success">
                  <div style={{ fontSize: 40 }}><CheckCircle size={40} /></div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-gold" onClick={() => setContactSent(false)}>Send Another</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContact}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} placeholder="john@gmail.com" required />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea rows={5} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="How can we help you?" required style={{ resize: 'none' }} />
                  </div>
                  <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        <div className="land-container">
          <div className="footer-grid">
            <div>
              <div className="land-logo" style={{ marginBottom: 12 }}>
                <span className="logo-ds">DS</span>
                <span style={{ color: '#fff' }}>DreamScape Hotel</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.7 }}>Johannesburg's premier luxury hotel experience. Your dream stay awaits.</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 12 }}>Quick Links</h4>
              {['About', 'Rooms', 'Amenities', 'Gallery', 'Contact'].map(l => (
                <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ display: 'block', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 0' }}>{l}</button>
              ))}
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: 12 }}>Contact</h4>
              <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 2 }}>
                123 Nelson Mandela Square<br />
                Sandton, Johannesburg<br />
                +27 11 234 5678<br />
                info@dreamscapehotel.co.za
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} DreamScape Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function getRoomImage(type) {
  const imgs = {
    SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    DOUBLE: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80",
    SUITE: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
    DELUXE: "https://plus.unsplash.com/premium_photo-1671269705768-cad27668134c?w=600&q=80",
    PENTHOUSE: 'https://images.unsplash.com/photo-1611755489400-3c53602ab783?w=600&q=80',
    
    
  }
  return imgs[type] || imgs.SINGLE
}