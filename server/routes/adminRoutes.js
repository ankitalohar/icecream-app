import { Router } from 'express'
import {
  dashboard,
  deleteContact,
  deleteOrder,
  listContacts,
  listOrders,
  updateContactReadStatus,
  updateStatus,
} from '../controllers/adminController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(authenticate, requireAdmin)
router.get('/dashboard', dashboard)
router.get('/orders', listOrders)
router.get('/contacts', listContacts)
router.patch('/orders/:id/status', updateStatus)
router.patch('/contacts/:id/read', updateContactReadStatus)
router.delete('/orders/:id', deleteOrder)
router.delete('/contacts/:id', deleteContact)

export default router
