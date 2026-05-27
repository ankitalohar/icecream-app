import Product from '../models/Product.js'
import User from '../models/User.js'
import { popularPicks } from '../data/iceCreams.js'

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
  if (!email) return
  await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        role: 'admin',
        name: process.env.ADMIN_NAME || 'Vivelle Admin',
        phone: process.env.ADMIN_PHONE || '',
      },
      $set: { role: 'admin' },
    },
    { upsert: true, new: true },
  )
}
