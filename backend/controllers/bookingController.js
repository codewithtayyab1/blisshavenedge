import Booking from '../models/Booking.js'
import { generateRef } from '../utils/generateRef.js'
import { uploadBuffer } from '../lib/cloudinary.js'

export async function createBooking(req, res) {
  try {
    const { name, phone, service, services, date, time, notes, price } = req.body

    // Derive display service string — prefer the joined "services" array sent by frontend
    const servicesArr = Array.isArray(services) && services.length > 0 ? services : []
    const serviceStr  = service?.trim() || servicesArr.join(', ')

    if (!name || !phone || !serviceStr || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Reject bookings in the past — convert "HH:MM AM/PM" to 24h for comparison
    const [timePart, period] = time.split(' ')
    const [rawHour, rawMin] = timePart.split(':').map(Number)
    let hour = rawHour
    if (period === 'PM' && rawHour !== 12) hour += 12
    if (period === 'AM' && rawHour === 12) hour = 0
    const bookingMs = new Date(`${date}T${String(hour).padStart(2,'0')}:${String(rawMin).padStart(2,'0')}:00`).getTime()
    if (bookingMs < Date.now()) {
      return res.status(400).json({ message: 'This time slot has already passed. Please select a future date and time.' })
    }

    const referenceNumber = await generateRef()

    const booking = await Booking.create({
      referenceNumber,
      name:     name.trim(),
      phone:    phone.trim(),
      service:  serviceStr,
      services: servicesArr,
      date,
      time,
      notes: notes?.trim() || '',
      price: typeof price === 'number' && price > 0 ? price : null,
    })

    res.status(201).json({
      message: 'Booking confirmed',
      referenceNumber: booking.referenceNumber,
      booking: {
        _id:             booking._id,
        referenceNumber: booking.referenceNumber,
        name:            booking.name,
        phone:           booking.phone,
        service:         booking.service,
        services:        booking.services,
        date:            booking.date,
        time:            booking.time,
        status:          booking.status,
        price:           booking.price,
        createdAt:       booking.createdAt,
      },
      // Payment instructions returned with every new booking
      payment: {
        easypaisa: {
          number: '03039228634',
          name: 'Ali Hassan',
        },
        jazzcash: {
          number: '03039228634',
          name: 'Ali Hassan',
        },
        instructions:
          'Send advance payment to 03039228634 (Ali Hassan) via Easypaisa or JazzCash, then share the screenshot on WhatsApp with your reference number.',
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message })
  }
}

export async function getBookingByRef(req, res) {
  try {
    const booking = await Booking.findOne({
      referenceNumber: req.params.ref.toUpperCase(),
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ booking })
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid reference format' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function uploadScreenshot(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' })
    }

    const { bookingId } = req.body
    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required.' })
    }

    const result = await uploadBuffer(req.file.buffer)

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentScreenshot: result.secure_url },
      { new: true }
    )

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    res.json({ url: result.secure_url, message: 'Screenshot uploaded.' })
  } catch (err) {
    console.error('uploadScreenshot error:', err.message)
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid booking ID.' })
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
}
