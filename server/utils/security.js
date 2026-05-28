import jwt from 'jsonwebtoken'

export function normalizeIdentifier(channel, value) {
  const input = String(value || '').trim()
  if (channel === 'email') return input.toLowerCase()

  const phone = input.replace(/[\s()-]/g, '')
  return /^[6-9]\d{9}$/.test(phone) ? `+91${phone}` : phone
}

export function validIdentifier(channel, identifier) {
  return channel === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    : /^\+91[6-9]\d{9}$/.test(identifier)
}

export function signToken(account, role) {
  return jwt.sign({ sub: account._id.toString(), role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
