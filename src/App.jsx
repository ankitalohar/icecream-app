import { useEffect } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuCategory from './pages/MenuCategory'
import About from './pages/About'
import Contact from './pages/Contact'
import Order from './pages/Order'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import TrackOrder from './pages/TrackOrder'
import AdminDashboard from './pages/AdminDashboard'
import CursorFlowBackground from './components/CursorFlowBackground'
import { scrollToSection } from './utils/navigation'
import './App.css'
import './system.css'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => scrollToSection(id), 50)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <CursorFlowBackground />
      <Header />
      <main className="main">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:category" element={<MenuCategory />} />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/track/:orderId" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
