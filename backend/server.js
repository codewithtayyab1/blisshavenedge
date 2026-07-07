import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// --- Middleware ---
// Allow requests from the React dev server
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
// Parse incoming JSON request bodies
app.use(express.json())
// Log every request: method, path, status, response time
app.use(morgan('dev'))

// --- Health check (useful for testing the server is up) ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Bliss Haven Edge API is running' })
})

// --- Routes ---
app.use('/api/auth',     authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin',    adminRoutes)

// --- Global 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// --- Global error handler ---
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// --- Connect to MongoDB, then start server ---
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Server running → http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
