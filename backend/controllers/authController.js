import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export async function login(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      token,
      admin: { id: admin._id, username: admin.username },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
