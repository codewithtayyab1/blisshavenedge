import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Resolve __dirname for ES modules, then point dotenv at backend/.env
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

import mongoose from 'mongoose'
import Admin from '../models/Admin.js'

async function seed() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is undefined — check that backend/.env exists and contains MONGO_URI')
  }

  await mongoose.connect(uri, { family: 4 })
  console.log('✅ Connected to MongoDB')

  const username = process.env.ADMIN_USERNAME || 'alihassan13'
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD is undefined — check backend/.env')
  }

  const existing = await Admin.findOne({ username })
  if (existing) {
    existing.password = password   // pre-save hook re-hashes automatically
    await existing.save()
    console.log(`✅ Admin "${username}" password updated.`)
  } else {
    await Admin.create({ username, password })
    console.log(`✅ Admin created → username: ${username}`)
  }

  await mongoose.disconnect()
  console.log('🔌 Disconnected')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
