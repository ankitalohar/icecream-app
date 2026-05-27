import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../context/useAuth'

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p className="page-state">Restoring your session...</p>
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (admin && user.role !== 'admin') return <Navigate to="/login" replace />
  if (!admin && user.role === 'admin') return <Navigate to="/dashboard" replace />
  return children
}
