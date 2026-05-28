import { Router } from 'express'
import { login, logout, me, signup, toggleWishlist, updateProfile } from '../controllers/authController.js'
import { authenticate, requireUser } from '../middleware/auth.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', authenticate, me)
router.put('/profile', authenticate, requireUser, updateProfile)
router.put('/wishlist/:productId', authenticate, requireUser, toggleWishlist)
router.post('/logout', authenticate, logout)

export default router
