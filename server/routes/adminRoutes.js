import { Router } from 'express'
import { dashboard, deleteOrder, listOrders, updateStatus } from '../controllers/adminController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(authenticate, requireAdmin)
router.get('/dashboard', dashboard)
router.get('/orders', listOrders)
router.patch('/orders/:id/status', updateStatus)
router.delete('/orders/:id', deleteOrder)

export default router
