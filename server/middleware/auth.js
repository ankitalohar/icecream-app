import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  try {
    const authorization = req.get('authorization') || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Authentication required.' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!['user', 'admin'].includes(payload.role)) return res.status(401).json({ error: 'Invalid account role.' })
    const account = await User.findOne({ _id: payload.sub, role: payload.role })
    if (!account) return res.status(401).json({ error: 'Account not found.' })
    req.account = account
    req.role = account.role
    next()
  } catch {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' })
  }
}

export function requireUser(req, res, next) {
  if (req.role !== 'user') return res.status(403).json({ error: 'Customer access required.' })
  next()
}

export function requireAdmin(req, res, next) {
  if (req.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' })
  next()
}
