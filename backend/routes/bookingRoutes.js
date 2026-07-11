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


// Screenshot upload — warna Cloudinary storage/bandwidth spam ho sakta hai
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload attempts. Please wait a few minutes and try again.' },
})

// GET /:ref lookup — warna koi script BHE-0001 se BHE-9999 tak chala kar
// sab customers ka naam/phone/date/payment-screenshot nikal sakta hai
const refLookupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many lookup attempts. Please wait a few minutes and try again.' },
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

router.post('/upload-screenshot', uploadLimiter, singleImage('screenshot'), uploadScreenshot)

router.get('/:ref', refLookupLimiter, getBookingByRef)
router.get('/:ref', getBookingByRef)

export default router
