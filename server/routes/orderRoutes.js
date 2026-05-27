import { Router } from 'express'
import { myOrders, placeOrder, trackOrder } from '../controllers/orderController.js'
import { authenticate, requireUser } from '../middleware/auth.js'

const router = Router()
router.use(authenticate, requireUser)
router.get('/', myOrders)
router.post('/', placeOrder)
router.get('/track/:orderId', trackOrder)

export default router
