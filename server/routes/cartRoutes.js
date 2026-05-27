import { Router } from 'express'
import { getCart, saveCart } from '../controllers/cartController.js'
import { authenticate, requireUser } from '../middleware/auth.js'

const router = Router()
router.use(authenticate, requireUser)
router.get('/', getCart)
router.put('/', saveCart)

export default router
