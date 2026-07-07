import Counter from '../models/Counter.js'

export async function generateRef() {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'booking' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  const padded = String(counter.seq).padStart(4, '0')
  return `BHE-${padded}`
}
