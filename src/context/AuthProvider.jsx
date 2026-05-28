import { useCallback, useEffect, useRef, useState } from 'react'
import AuthContext from './auth-context'
import { api, clearSession, getStoredUser, getToken, storeSession } from '../services/api'
import { endFirebaseSession, startFirebaseSession } from '../services/firebaseAuth'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null))
  const [loading, setLoading] = useState(() => Boolean(getToken()))
  const authInFlight = useRef(null)

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

  async function authenticate(path, form) {
    if (authInFlight.current) throw new Error('Authentication is already in progress.')

    const request = (async () => {
      const data = await api(path, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      await startFirebaseSession(data.firebaseToken).catch(() => {
        // The API JWT remains authoritative if the optional Firebase session is unavailable.
      })
      storeSession(data.token, data.user)
      setUser(data.user)
      return data.user
    })()
    authInFlight.current = request

    try {
      return await request
    } finally {
      if (authInFlight.current === request) authInFlight.current = null
    }
  }

  const login = (form) => authenticate('/auth/login', form)
  const signup = (form) => authenticate('/auth/signup', form)

  async function logout() {
    try {
      if (getToken()) await api('/auth/logout', { method: 'POST' })
    } catch {
      // Clearing a local JWT is sufficient if it is already expired.
    } finally {
      await endFirebaseSession().catch(() => {
        // Always clear the API session even if Firebase is temporarily unreachable.
      })
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
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  )
}
