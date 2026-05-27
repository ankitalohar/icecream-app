import { useCallback, useEffect, useState } from 'react'
import AuthContext from './auth-context'
import { api, clearSession, getStoredUser, getToken, storeSession } from '../services/api'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null))
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      clearSession()
      return
    }
    let cancelled = false
    api('/auth/me')
      .then((data) => {
        if (!cancelled) {
          storeSession(getToken(), data.user)
          setUser(data.user)
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession()
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function requestOtp(form) {
    return api('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify(form),
    })
  }

  async function verifyOtp(form) {
    const data = await api('/auth/otp/verify', { method: 'POST', body: JSON.stringify(form) })
    storeSession(data.token, data.user)
    setUser(data.user)
    return data.user
  }

  async function logout() {
    try {
      if (getToken()) await api('/auth/logout', { method: 'POST' })
    } catch {
      // Clearing a local JWT is sufficient if it is already expired.
    } finally {
      clearSession()
      setUser(null)
    }
  }

  async function updateProfile(profile) {
    const data = await api('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) })
    storeSession(getToken(), data.user)
    setUser(data.user)
    return data.user
  }

  const toggleWishlist = useCallback(async (productId) => {
    const data = await api(`/auth/wishlist/${productId}`, { method: 'PUT' })
    storeSession(getToken(), data.user)
    setUser(data.user)
    return data.user
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, requestOtp, verifyOtp, logout, updateProfile, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  )
}
