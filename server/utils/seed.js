import Product from '../models/Product.js'
import User from '../models/User.js'
import { popularPicks } from '../data/iceCreams.js'
import { syncAccount } from '../services/firestore.js'
import { normalizeIdentifier } from './security.js'
import bcrypt from 'bcryptjs'

export async function seedProducts() {
  if (await Product.exists({})) return
  await Product.insertMany(
    popularPicks.map((product) => ({
      name: product.name,
      description: product.description,
      price: Number(product.price.replace(/[^0-9.]/g, '')),
      rating: product.rating,
      image: product.image,
      tag: product.tag,
      category: 'ice-cream',
    })),
  )
}

export async function ensureAdminAccount() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const phone = normalizeIdentifier('phone', process.env.ADMIN_PHONE)
  const password = String(process.env.ADMIN_PASSWORD || 'admin123')
  if (!email || !phone) return
  const passwordHash = await bcrypt.hash(password, 12)
  const admin = await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        role: 'admin',
        name: process.env.ADMIN_NAME || 'Vivelle Admin',
        phone,
        address: process.env.ADMIN_ADDRESS || 'Admin office',
        addresses: [{ label: 'Office', address: process.env.ADMIN_ADDRESS || 'Admin office' }],
      },
      $set: { role: 'admin', passwordHash },
    },
    { upsert: true, new: true },
  )
  await syncAccount(admin)
}
