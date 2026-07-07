import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { createBooking, getBookingByRef, uploadScreenshot } from '../controllers/bookingController.js'
import { singleImage } from '../middleware/upload.js'

// Max 5 bookings per IP per 10 minutes — stops spam bots, never affects real users
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many booking requests from this device. Please wait a few minutes and try again.' },
})

const router = Router()

const bookingValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s]{10,15}$/).withMessage('Enter a valid phone number'),
  body('service').trim().notEmpty().withMessage('Service is required'),
  body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Invalid date format'),
  body('time').trim().notEmpty().withMessage('Time is required'),
]

function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

// POST /api/bookings                     — public, creates new booking (rate limited)
router.post('/', bookingLimiter, bookingValidation, validate, createBooking)

// POST /api/bookings/upload-screenshot   — public, customer attaches payment proof
// Must be BEFORE /:ref so Express doesn't swallow "upload-screenshot" as a ref param
router.post('/upload-screenshot', singleImage('screenshot'), uploadScreenshot)

// GET  /api/bookings/:ref                — public, fetch booking by reference number
router.get('/:ref', getBookingByRef)

export default router
