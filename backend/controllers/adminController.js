import Booking from '../models/Booking.js'

const VALID_STATUSES = ['pending', 'paid', 'arrived', 'done', 'cancelled']

export async function getBookings(req, res) {
  try {
    const { search, status, date } = req.query
    const filter = {}

    if (status && VALID_STATUSES.includes(status)) {
      filter.status = status
    }

    if (date) {
      filter.date = date   // exact YYYY-MM-DD match
    }

    if (search) {
      // Escape special regex chars so user input like "." or "+" doesn't crash the query
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escaped, 'i')
      filter.$or = [
        { name: regex },
        { phone: regex },
        { referenceNumber: regex },
      ]
    }

    // Sort by date ascending (upcoming first), then by time, then by creation date
    const bookings = await Booking.find(filter).sort({ date: 1, createdAt: 1 })

    res.json({ count: bookings.length, bookings })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ booking })
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid booking ID' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    res.json({ message: 'Status updated', booking })
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid booking ID' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ message: 'Booking deleted', referenceNumber: booking.referenceNumber })
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid booking ID' })
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function getDashboardStats(req, res) {
  try {
    const total = await Booking.countDocuments()
    const byStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const stats = { total }
    byStatus.forEach(({ _id, count }) => { stats[_id] = count })

    res.json({ stats })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
