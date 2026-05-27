const TOKEN_KEY = 'vivelleAuthToken'
const USER_KEY = 'vivelleAuthUser'
const ROLE_KEY = 'vivelleAuthRole'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function storeToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function storeSession(token, user) {
  storeToken(token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(ROLE_KEY, user.role)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export async function api(path, options = {}) {
  const token = getToken()
  let response
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Cannot reach the API server. Start the API and try again.')
  }
  const result = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || 'Request failed.')
  return result
}
