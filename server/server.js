import dotenv from 'dotenv'
import app from './app.js'
import { connectDatabase } from './config/database.js'
import { ensureAdminAccount, seedProducts } from './utils/seed.js'

dotenv.config()

const PORT = process.env.PORT || 3001

async function start() {
  await connectDatabase()
  await Promise.all([seedProducts(), ensureAdminAccount()])
  app.listen(PORT, () => console.log(`Vivelle API running at http://localhost:${PORT}`))
}

start().catch((error) => {
  console.error('API startup failed:', error.message)
  process.exitCode = 1
})
