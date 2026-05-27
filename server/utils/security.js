import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import jwt from 'jsonwebtoken'

export const OTP_EXPIRY_MINUTES = 10

export function normalizeIdentifier(channel, value) {
  const input = String(value || '').trim()
  return channel === 'email' ? input.toLowerCase() : input.replace(/[\s()-]/g, '')
}

export function validIdentifier(channel, identifier) {
  return channel === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    : /^\+[1-9]\d{7,14}$/.test(identifier)
}

export function newOtp() {
  return String(randomInt(100000, 1000000))
}

export function hashOtp(identifier, code) {
  return createHmac('sha256', process.env.OTP_SECRET).update(`${identifier}:${code}`).digest('hex')
}

export function otpMatches(identifier, code, storedHash) {
  const candidate = Buffer.from(hashOtp(identifier, code), 'hex')
  const expected = Buffer.from(storedHash, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

export function signToken(account, role) {
  return jwt.sign({ sub: account._id.toString(), role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
