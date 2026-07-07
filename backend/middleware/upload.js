import multer from 'multer'

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(Object.assign(new Error('Only image files are allowed'), { status: 400 }), false)
    }
  },
})

// Express middleware that wraps multer and converts its errors to JSON responses
export function singleImage(fieldName) {
  return (req, res, next) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (!err) return next()
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large — maximum 5 MB.' })
      }
      return res.status(400).json({ message: err.message || 'File upload error.' })
    })
  }
}
