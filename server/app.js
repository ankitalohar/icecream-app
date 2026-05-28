import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler, notFound } from './middleware/errors.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || true }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Vivelle API is running' }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/ice-creams', productRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
