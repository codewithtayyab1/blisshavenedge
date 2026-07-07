import 'dotenv/config'   // must run before process.env is read — safe to call multiple times
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload a Buffer to Cloudinary and return the result object
export function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        'bliss-haven-edge/payments',
        resource_type: 'image',
        quality:       'auto',
        fetch_format:  'auto',
        ...options,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    Readable.from(buffer).pipe(stream)
  })
}

export default cloudinary
