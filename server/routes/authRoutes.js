import { Router } from 'express'
import { me, requestOtp, toggleWishlist, updateProfile, verifyOtp } from '../controllers/authController.js'
import { authenticate, requireUser } from '../middleware/auth.js'

const router = Router()

router.post('/otp/request', requestOtp)
router.post('/otp/verify', verifyOtp)
router.post('/forgot-password/request', (req, res, next) => {
  req.body.purpose = 'forgot-password'
  return requestOtp(req, res, next)
})
router.post('/forgot-password/verify', (req, res, next) => {
  req.body.purpose = 'forgot-password'
  return verifyOtp(req, res, next)
})
router.get('/me', authenticate, me)
router.put('/profile', authenticate, requireUser, updateProfile)
router.put('/wishlist/:productId', authenticate, requireUser, toggleWishlist)
router.post('/logout', authenticate, (_req, res) => res.status(204).send())

export default router
