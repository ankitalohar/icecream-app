import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { createFirebaseAuthToken, syncAccount, syncAdminActivity, syncSession } from '../services/firestore.js'
import { publicAccount } from '../utils/publicAccount.js'
import { normalizeIdentifier, signToken, validIdentifier } from '../utils/security.js'

const passwordMinLength = 6

function authConfigured(res) {
  if (!process.env.JWT_SECRET) {
    res.status(503).json({ error: 'Authentication secret is not configured on the server.' })
    return false
  }
  return true
}

function cleanRole(value) {
  return String(value || 'user').toLowerCase() === 'admin' ? 'admin' : 'user'
}

function duplicateAccountQuery(email, phone) {
  return { $or: [{ email }, { phone }] }
}

async function createSession(account, event) {
  account.lastLoginAt = new Date()
  account.loginStatus = true
  await account.save()

  const sessionId = randomUUID()
  const [, firebaseToken] = await Promise.all([syncAccount(account), createFirebaseAuthToken(account)])
  await Promise.all([
    syncSession(sessionId, {
      accountId: String(account._id),
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      event,
      active: true,
      loginTimestamp: account.lastLoginAt,
      createdAt: new Date(),
    }),
    ...(account.role === 'admin' ? [syncAdminActivity(randomUUID(), {
      adminId: String(account._id),
      action: event,
      createdAt: new Date(),
    })] : []),
  ])

  return {
    token: signToken(account, account.role),
    user: publicAccount(account, account.role),
    ...(firebaseToken ? { firebaseToken } : {}),
  }
}

export async function signup(req, res) {
  try {
    if (!authConfigured(res)) return

    const role = cleanRole(req.body.role)
    const name = String(req.body.name || '').trim()
    const email = normalizeIdentifier('email', req.body.email)
    const phone = normalizeIdentifier('phone', req.body.phone)
    const address = String(req.body.address || '').trim()
    const password = String(req.body.password || '')
    const confirmPassword = String(req.body.confirmPassword || '')

    if (!name || !validIdentifier('email', email) || !validIdentifier('phone', phone) || !address) {
      return res.status(400).json({ error: 'Full name, valid email, phone number and address are required.' })
    }
    if (password.length < passwordMinLength) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' })
    }

    const existing = await User.findOne(duplicateAccountQuery(email, phone)).select('+passwordHash')
    if (existing?.passwordHash) return res.status(409).json({ error: 'Account already exists. Please login.' })
    if (existing) {
      existing.set({
        role,
        name,
        email,
        phone,
        address,
        addresses: existing.addresses?.length ? existing.addresses : [{ label: 'Home', address }],
        passwordHash: await bcrypt.hash(password, 12),
        emailVerified: true,
        phoneVerified: true,
      })
      return res.status(201).json(await createSession(existing, 'signup'))
    }

    const account = await User.create({
      role,
      name,
      email,
      phone,
      address,
      addresses: [{ label: 'Home', address }],
      passwordHash: await bcrypt.hash(password, 12),
      emailVerified: true,
      phoneVerified: true,
    })

    return res.status(201).json(await createSession(account, 'signup'))
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Account already exists. Please login.' })
    console.error('[AUTH] Signup failed:', error)
    return res.status(500).json({ error: 'Unable to create account. Please try again.' })
  }
}

export async function login(req, res) {
  try {
    if (!authConfigured(res)) return

    const identifier = String(req.body.identifier || req.body.emailOrPhone || '').trim()
    const password = String(req.body.password || '')
    const normalizedEmail = normalizeIdentifier('email', identifier)
    const normalizedPhone = normalizeIdentifier('phone', identifier)
    const query = identifier.includes('@') ? { email: normalizedEmail } : { phone: normalizedPhone }

    if (!identifier || !password) return res.status(400).json({ error: 'Email or phone and password are required.' })

    const account = await User.findOne(query).select('+passwordHash')
    if (!account) return res.status(401).json({ error: 'Invalid email/phone or password.' })
    if (!account.passwordHash) return res.status(401).json({ error: 'Invalid email/phone or password.' })

    const passwordOk = await bcrypt.compare(password, account.passwordHash)
    if (!passwordOk) return res.status(401).json({ error: 'Invalid email/phone or password.' })

    return res.json(await createSession(account, 'login'))
  } catch (error) {
    console.error('[AUTH] Login failed:', error)
    return res.status(500).json({ error: 'Unable to login. Please try again.' })
  }
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
  const duplicate = await User.exists({ _id: { $ne: account._id }, $or: [{ email }, { phone }] })
  if (duplicate) return res.status(409).json({ error: 'Account already exists. Please login.' })

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
  account.set({ name, email, phone, address, profilePhoto, addresses })
  await account.save()
  await syncAccount(account)
  res.json({ user: publicAccount(account, account.role) })
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
  await syncAccount(req.account)
  res.json({ user: publicAccount(req.account, 'user') })
}

export async function logout(req, res) {
  req.account.loginStatus = false
  req.account.lastLogoutAt = new Date()
  await req.account.save()
  await Promise.all([
    syncAccount(req.account),
    syncSession(randomUUID(), {
      accountId: String(req.account._id),
      name: req.account.name,
      email: req.account.email,
      phone: req.account.phone,
      role: req.account.role,
      event: 'logout',
      active: false,
      createdAt: new Date(),
    }),
  ])
  res.status(204).send()
}
