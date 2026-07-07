import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    services: {
      type: [String],
      default: [],
    },
    date: {
      type: String,         // stored as YYYY-MM-DD string for simplicity
      required: [true, 'Date is required'],
    },
    time: {
      type: String,         // stored as "10:00 AM" string
      required: [true, 'Time is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'arrived', 'done', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      default: null,
    },
    paymentScreenshot: {
      type: String,     // Cloudinary URL
      default: null,
    },
  },
  { timestamps: true }     // adds createdAt and updatedAt automatically
)

export default mongoose.model('Booking', bookingSchema)
