import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getBookings,
  getBookingById,
  updateStatus,
  deleteBooking,
  getDashboardStats,
} from '../controllers/adminController.js'

const router = Router()

// All admin routes require a valid JWT
router.use(protect)

// GET  /api/admin/stats                  — dashboard summary counts
router.get('/stats', getDashboardStats)

// GET  /api/admin/bookings               — all bookings (filter via ?search=&status=&date=)
router.get('/bookings', getBookings)

// GET  /api/admin/bookings/:id           — single booking detail
router.get('/bookings/:id', getBookingById)

// PATCH  /api/admin/bookings/:id/status  — update status (paid/arrived/done/cancelled)
router.patch('/bookings/:id/status', updateStatus)

// DELETE /api/admin/bookings/:id         — permanently remove a booking
router.delete('/bookings/:id', deleteBooking)

export default router
