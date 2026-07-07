import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login } from '../controllers/authController.js'

const router = Router()

// Max 5 login attempts per IP per 15 minutes — prevents brute-force password guessing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please wait 15 minutes before trying again.' },
})

// POST /api/auth/login
router.post('/login', loginLimiter, login)

export default router
