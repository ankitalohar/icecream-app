import mongoose from 'mongoose'
import OtpVerification from '../models/OtpVerification.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { deliverOtp } from '../utils/otpDelivery.js'
import { publicAccount } from '../utils/publicAccount.js'
import {
  hashOtp,
  newOtp,
  normalizeIdentifier,
  otpMatches,
  OTP_EXPIRY_MINUTES,
  signToken,
  validIdentifier,
} from '../utils/security.js'

const resendWindowMs = 60 * 1000
const maxAttempts = 5

function identifierQuery(channel, identifier, role) {
  return {
    ...(channel === 'email' ? { email: identifier } : { phone: identifier }),
    role,
  }
}

function validConfiguration(res) {
  if (!process.env.OTP_SECRET || !process.env.JWT_SECRET) {
    res.status(503).json({ error: 'Authentication secrets are not configured on the server.' })
    return false
  }
  return true
}

export async function requestOtp(req, res) {
  if (!validConfiguration(res)) return
  const purpose = String(req.body.purpose || req.body.mode || 'login')
  const role = String(req.body.role || 'user')
  const channel = String(req.body.channel || 'email')
  const identifier = normalizeIdentifier(channel, req.body.identifier)

  if (!['login', 'signup', 'forgot-password'].includes(purpose) || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Choose a valid account action and role.' })
  }
  if (role === 'admin' && purpose === 'signup') {
    return res.status(403).json({ error: 'Admin accounts cannot be created publicly.' })
  }
  if (!['email', 'phone'].includes(channel) || !validIdentifier(channel, identifier)) {
    return res.status(400).json({ error: channel === 'phone' ? 'Use international format, for example +919876543210.' : 'Enter a valid email address.' })
  }

  const account = await User.findOne(identifierQuery(channel, identifier, role))
  if (purpose === 'signup' && account) return res.status(409).json({ error: 'An account already exists. Log in instead.' })
  if (purpose !== 'signup' && !account) return res.status(404).json({ error: 'No account exists with that contact.' })

  const recent = await OtpVerification.exists({
    identifier,
    purpose,
    role,
    createdAt: { $gte: new Date(Date.now() - resendWindowMs) },
  })
  if (recent) return res.status(429).json({ error: 'Wait one minute before requesting another code.' })

  const code = newOtp()
  const challenge = await OtpVerification.create({
    identifier,
    channel,
    purpose,
    role,
    codeHash: hashOtp(identifier, code),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  })

  try {
    await deliverOtp(channel, identifier, code)
  } catch (error) {
    await challenge.deleteOne()
    return res.status(503).json({ error: error.message })
  }

  const response = { message: 'Verification code sent. It expires in 10 minutes.' }
  if (process.env.OTP_DEV_MODE === 'true') response.devCode = code
  return res.status(201).json(response)
}

export async function verifyOtp(req, res) {
  if (!validConfiguration(res)) return
  const purpose = String(req.body.purpose || req.body.mode || 'login')
  const role = String(req.body.role || 'user')
  const channel = String(req.body.channel || 'email')
  const identifier = normalizeIdentifier(channel, req.body.identifier)
  const code = String(req.body.code || '').trim()

  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Enter the 6-digit code.' })
  const challenge = await OtpVerification.findOne({ identifier, purpose, role, channel }).sort({ createdAt: -1 })
  if (!challenge || challenge.expiresAt < new Date()) return res.status(401).json({ error: 'Code expired. Request another OTP.' })
  if (challenge.attempts >= maxAttempts) return res.status(429).json({ error: 'Too many failed attempts. Request another OTP.' })
  if (!otpMatches(identifier, code, challenge.codeHash)) {
    challenge.attempts += 1
    await challenge.save()
    return res.status(401).json({ error: 'Incorrect verification code.' })
  }

  let account
  if (purpose === 'signup') {
    if (role !== 'user') return res.status(403).json({ error: 'Admin signup is unavailable.' })
    const name = String(req.body.name || '').trim()
    const email = normalizeIdentifier('email', req.body.email)
    const phone = normalizeIdentifier('phone', req.body.phone)
    const address = String(req.body.address || '').trim()
    if (!name || !validIdentifier('email', email) || !validIdentifier('phone', phone) || !address) {
      return res.status(400).json({ error: 'Name, email, international mobile number and address are required.' })
    }
    if ((channel === 'email' && email !== identifier) || (channel === 'phone' && phone !== identifier)) {
      return res.status(400).json({ error: 'Verified contact must match your signup details.' })
    }
    account = await User.create({
      role: 'user',
      name,
      email,
      phone,
      address,
      addresses: [{ label: 'Home', address }],
      emailVerified: channel === 'email',
      phoneVerified: channel === 'phone',
      lastLoginAt: new Date(),
    })
  } else {
    account = await User.findOne(identifierQuery(channel, identifier, role))
    if (!account) return res.status(401).json({ error: 'Account not found.' })
    account[channel === 'email' ? 'emailVerified' : 'phoneVerified'] = true
    account.lastLoginAt = new Date()
    await account.save()
  }
  await challenge.deleteOne()
  return res.json({ token: signToken(account, account.role), user: publicAccount(account, account.role) })
}

export function me(req, res) {
  res.json({ user: publicAccount(req.account, req.account.role) })
}

export async function updateProfile(req, res) {
  const { account } = req
  const name = String(req.body.name || '').trim()
  const email = normalizeIdentifier('email', req.body.email)
  const phone = normalizeIdentifier('phone', req.body.phone)
  const address = String(req.body.address || '').trim()
  if (!name || !validIdentifier('email', email) || !validIdentifier('phone', phone) || !address) {
    return res.status(400).json({ error: 'Name, valid email, mobile and address are required.' })
  }
  const profilePhoto = String(req.body.profilePhoto || account.profilePhoto || '')
  if (profilePhoto && (!profilePhoto.startsWith('data:image/') || profilePhoto.length > 1500000)) {
    return res.status(400).json({ error: 'Profile photo must be a valid image under 1 MB.' })
  }
  const addresses = (Array.isArray(req.body.addresses) ? req.body.addresses : account.addresses)
    .slice(0, 5)
    .map((entry) => ({
      label: String(entry.label || 'Address').trim().slice(0, 30),
      address: String(entry.address || '').trim().slice(0, 300),
    }))
    .filter((entry) => entry.address)
  if (!addresses.some((entry) => entry.address === address)) addresses.unshift({ label: 'Primary', address })
  account.set({
    name,
    email,
    phone,
    address,
    profilePhoto,
    addresses,
    emailVerified: email === account.email && account.emailVerified,
    phoneVerified: phone === account.phone && account.phoneVerified,
  })
  await account.save()
  res.json({ user: publicAccount(account, 'user') })
}

export async function toggleWishlist(req, res) {
  const productId = req.params.productId
  if (!mongoose.isValidObjectId(productId) || !(await Product.exists({ _id: productId, active: true }))) {
    return res.status(404).json({ error: 'Product not found.' })
  }
  const present = req.account.wishlist.some((item) => item.toString() === productId)
  req.account.wishlist = present
    ? req.account.wishlist.filter((item) => item.toString() !== productId)
    : [...req.account.wishlist, productId]
  await req.account.save()
  res.json({ user: publicAccount(req.account, 'user') })
}
