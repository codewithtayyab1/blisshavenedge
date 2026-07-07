import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import api from '../lib/axios'
import { SERVICE_CATEGORIES, DEALS } from '../data/salonData'

// Special offers shown in the dropdown but NOT in the deals sections — no price
const SPECIAL_OFFERS = [
  { name: 'Haircut + Beard Combo (FREE Cleansing)', includes: 'Hair Cut + Beard Shave + Free Cleansing' },
]

// Sum prices of all selected services; special offers have no price
function sumPrices(serviceNames) {
  if (!serviceNames || serviceNames.length === 0) return null
  let total = 0
  let hasPrice = false
  for (const name of serviceNames) {
    if (SPECIAL_OFFERS.some((o) => o.name === name)) continue
    const deal = DEALS.find((d) => d.name === name)
    if (deal) { total += deal.price; hasPrice = true; continue }
    for (const cat of SERVICE_CATEGORIES) {
      const svc = cat.services.find((s) => s.name === name)
      if (svc && typeof svc.price === 'number') { total += svc.price; hasPrice = true; break }
    }
  }
  return hasPrice ? total : null
}

const fmtPrice = (p) =>
  typeof p === 'number' ? `Rs. ${p.toLocaleString()}` : `Rs. ${p}`
import { SITE } from '../lib/siteConfig'
import { useSEO } from '../hooks/useSEO'

// ─── Time slots ───────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
  '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM',
]

const TODAY = new Date().toISOString().split('T')[0]
const EMPTY = { name: '', phone: '', services: [], date: '', time: '', notes: '' }

// Returns only the time slots that are still in the future for a given date string
function getAvailableSlots(dateStr) {
  if (dateStr !== TODAY) return TIME_SLOTS   // future date → all slots open
  const now = new Date()
  return TIME_SLOTS.filter((slot) => {
    const [timePart, period] = slot.split(' ')
    const [h, m] = timePart.split(':').map(Number)
    let hour = h
    if (period === 'PM' && h !== 12) hour += 12
    if (period === 'AM' && h === 12) hour = 0
    const slotDate = new Date()
    slotDate.setHours(hour, m, 0, 0)
    return slotDate > now
  })
}

// ─── Validation (logic unchanged) ────────────────────────────────────────────
function validate(f) {
  const e = {}
  if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Enter your full name'
  const ph = f.phone.replace(/[\s\-()]/g, '')
  if (!ph || ph.length < 10 || ph.length > 15 || !/^[0-9+]+$/.test(ph))
    e.phone = 'Enter a valid phone number (e.g. 03039228634)'
  if (!f.services || f.services.length === 0) e.services = 'Please select at least one service'
  if (!f.date)    e.date    = 'Please select a date'
  if (!f.time)    e.time    = 'Please select a time'
  return e
}

// ─── Styled input class ───────────────────────────────────────────────────────
const inputCls = (err) =>
  `w-full border rounded-xl px-4 py-3 font-inter text-sm text-dark-text bg-white focus:outline-none transition-all duration-200 ${
    err
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-dark-text/15 focus:border-gold focus:ring-2 focus:ring-gold/10'
  }`

function FieldLabel({ text }) {
  return (
    <label className="block font-inter text-[10px] tracking-[0.18em] uppercase text-dark-text/55 mb-1.5">
      {text}
    </label>
  )
}

function FieldError({ msg }) {
  return msg ? (
    <p className="font-inter text-xs text-red-500 mt-1.5 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  ) : null
}

// ─── Form entrance stagger variants ──────────────────────────────────────────
const staggerForm = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const fieldIn = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// ─── Multi-service collapsible dropdown ──────────────────────────────────────
function ServiceDropdown({ selected, onToggle, error }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const total = sumPrices(selected)

  // Trigger label — compact summary of what's selected
  const triggerText =
    selected.length === 0   ? null
    : selected.length === 1  ? selected[0]
    : selected.length === 2  ? selected.join(', ')
    : `${selected[0]} +${selected.length - 1} more`

  return (
    <div ref={wrapRef} className="relative">

      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 bg-white text-left focus:outline-none transition-all duration-200 ${
          error
            ? 'border-red-300'
            : open
              ? 'border-gold ring-2 ring-gold/10'
              : 'border-dark-text/15 hover:border-dark-text/30'
        }`}
      >
        <span className={`font-inter text-sm truncate ${triggerText ? 'text-dark-text' : 'text-dark-text/35'}`}>
          {triggerText ?? 'Select services'}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {selected.length > 0 && total != null && (
            <span className="font-playfair text-sm text-gold whitespace-nowrap">
              Rs. {total.toLocaleString()}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-dark-text/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1.5 bg-white border border-dark-text/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]">

          {/* Scrollable checkbox list */}
          <div className="max-h-64 overflow-y-auto">

            {/* Individual services grouped by category */}
            {SERVICE_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <div className="sticky top-0 z-[1] px-4 py-1.5 bg-cream/95 border-b border-dark-text/8">
                  <span className="font-inter text-[9px] tracking-[0.2em] uppercase text-dark-text/45 font-semibold">{cat.name}</span>
                </div>
                {cat.services.map((svc) => {
                  const checked = selected.includes(svc.name)
                  return (
                    <label
                      key={svc.name}
                      className={`flex items-center gap-3 px-4 py-2.5 border-b border-dark-text/5 cursor-pointer transition-colors ${checked ? 'bg-gold/8' : 'hover:bg-gold/4'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(svc.name)}
                        className="w-4 h-4 accent-gold shrink-0 cursor-pointer"
                      />
                      <span className="font-inter text-sm text-dark-text flex-1">{svc.name}</span>
                      <span className="font-inter text-xs text-dark-text/45 shrink-0 tabular-nums">{fmtPrice(svc.price)}</span>
                    </label>
                  )
                })}
              </div>
            ))}

            {/* Combo deals */}
            <div className="sticky top-0 z-[1] px-4 py-1.5 bg-cream/95 border-b border-dark-text/8">
              <span className="font-inter text-[9px] tracking-[0.2em] uppercase text-dark-text/45 font-semibold">Combo Deals</span>
            </div>
            {DEALS.map((deal) => {
              const checked = selected.includes(deal.name)
              return (
                <label
                  key={deal.id}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-dark-text/5 cursor-pointer transition-colors ${checked ? 'bg-gold/8' : 'hover:bg-gold/4'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(deal.name)}
                    className="w-4 h-4 accent-gold shrink-0 cursor-pointer"
                  />
                  <span className="font-inter text-sm text-dark-text flex-1">
                    {deal.name}
                    <span className="text-dark-text/40 text-xs ml-1.5">({deal.includes.join(' + ')})</span>
                  </span>
                  <span className="font-inter text-xs text-dark-text/45 shrink-0 tabular-nums">Rs. {deal.price.toLocaleString()}</span>
                </label>
              )
            })}

            {/* Special offer */}
            <div className="sticky top-0 z-[1] px-4 py-1.5 bg-cream/95 border-b border-dark-text/8">
              <span className="font-inter text-[9px] tracking-[0.2em] uppercase text-dark-text/45 font-semibold">Special Offer</span>
            </div>
            {SPECIAL_OFFERS.map((offer) => {
              const checked = selected.includes(offer.name)
              return (
                <label
                  key={offer.name}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${checked ? 'bg-gold/8' : 'hover:bg-gold/4'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(offer.name)}
                    className="w-4 h-4 accent-gold shrink-0 cursor-pointer"
                  />
                  <span className="font-inter text-sm text-dark-text flex-1">{offer.name}</span>
                  <span className="font-inter text-[11px] text-gold font-medium shrink-0">FREE offer</span>
                </label>
              )
            })}
          </div>

          {/* Footer: running total + Done button */}
          <div className="px-4 py-2.5 border-t border-dark-text/8 bg-cream/80 flex items-center justify-between gap-3 rounded-b-xl">
            <span className="font-inter text-xs text-dark-text/50">
              {selected.length === 0
                ? 'Select one or more services'
                : `${selected.length} selected${total != null ? ` · Rs. ${total.toLocaleString()}` : ''}`}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-inter text-xs font-semibold text-white bg-gold hover:bg-gold-dark px-4 py-1.5 rounded-lg transition-colors shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Payment screenshot uploader ─────────────────────────────────────────────
// Flow: pick file → preview + Submit button → upload → success
function ScreenshotUpload({ bookingId, onSuccess }) {
  const [status,       setStatus]       = useState('idle')   // idle | ready | uploading | success | error
  const [preview,      setPreview]      = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [progress,     setProgress]     = useState(0)
  const [errMsg,       setErrMsg]       = useState('')
  const inputRef = useRef(null)

  // Step 1 — customer picks a file: show preview + Submit button
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    setStatus('ready')
  }

  // Step 2 — customer clicks Submit: upload to Cloudinary
  const doUpload = async () => {
    if (!selectedFile) return
    setStatus('uploading')
    setProgress(0)
    setErrMsg('')

    const form = new FormData()
    form.append('screenshot', selectedFile)
    form.append('bookingId',  bookingId)

    try {
      await api.post('/api/bookings/upload-screenshot', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) =>
          setProgress(Math.round((ev.loaded * 100) / (ev.total || 1))),
      })
      setStatus('success')
      onSuccess?.()   // notify ConfirmationScreen so the banner updates
    } catch (err) {
      setStatus('error')
      setErrMsg(
        err.response?.data?.message ||
        'Upload failed. Please check your connection and try again.'
      )
    }
  }

  const reset = () => {
    setStatus('idle')
    setPreview(null)
    setSelectedFile(null)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-5 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-inter text-sm font-semibold text-emerald-700 mb-1">
          ✅ Payment proof submitted!
        </p>
        <p className="font-inter text-xs text-emerald-600/80">
          We'll confirm your booking shortly.
        </p>
        {preview && (
          <img src={preview} alt="Payment screenshot" className="mt-3 mx-auto max-h-28 rounded-lg object-cover shadow-sm" />
        )}
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-5">
        {preview && (
          <img src={preview} alt="Preview" className="mx-auto max-h-24 rounded-lg mb-3 object-cover" />
        )}
        <p className="font-inter text-sm text-red-600 mb-3">{errMsg}</p>
        <button onClick={reset} className="w-full bg-red-500 hover:bg-red-600 text-white font-inter text-sm py-2.5 rounded-xl transition-colors">
          Try Again
        </button>
      </div>
    )
  }

  // ── Uploading ─────────────────────────────────────────────────────────────
  if (status === 'uploading') {
    return (
      <div className="bg-cream rounded-xl px-5 py-5">
        {preview && (
          <img src={preview} alt="Preview" className="mx-auto max-h-28 rounded-lg mb-4 object-cover shadow-sm" />
        )}
        <div className="w-full bg-dark-text/10 rounded-full h-2 mb-2">
          <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="font-inter text-xs text-dark-text/55 text-center">Uploading… {progress}%</p>
      </div>
    )
  }

  // ── Preview ready — show image + Remove + Submit ─────────────────────────────
  if (status === 'ready') {
    return (
      <div className="space-y-3">
        {/* Preview with clear Remove button */}
        <div className="rounded-xl overflow-hidden shadow-card relative">
          <img src={preview} alt="Selected screenshot" className="w-full max-h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            onClick={reset}
            aria-label="Remove photo"
            className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-dark-text/80 hover:bg-dark-text text-white font-inter text-[11px] font-medium px-2.5 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove
          </button>
        </div>
        <p className="font-inter text-[11px] text-dark-text/45 text-center">
          Happy with this photo? Click submit to send it.
        </p>
        <button
          onClick={doUpload}
          className="w-full bg-gold hover:bg-gold-dark text-white font-inter text-sm py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium"
        >
          Submit Payment Proof
        </button>
      </div>
    )
  }

  // ── Idle — file picker ────────────────────────────────────────────────────
  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold/10 rounded-xl px-5 py-5 flex flex-col items-center gap-2 transition-all duration-200 group"
      >
        <svg className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span className="font-inter text-sm font-medium text-dark-text">Upload Payment Screenshot</span>
        <span className="font-inter text-[11px] text-dark-text/45">Tap to choose a photo · max 5 MB</span>
      </button>
    </div>
  )
}

// ─── Printable slip (opens in new window, no external libraries) ─────────────
function downloadSlip({ referenceNumber, booking }) {
  const servicesList = (booking.services?.length ? booking.services : [booking.service])
    .map(s => `<li style="padding:2px 0">${s}</li>`).join('')
  const servicesRow = `<div class="row" style="align-items:flex-start"><span class="lbl">Service${booking.services?.length > 1 ? 's' : ''}</span><ul style="list-style:none;text-align:right;font-size:13px;font-weight:500;color:#1e1e1e;padding:0;margin:0">${servicesList}</ul></div>`
  const priceRow = booking.price
    ? `<div class="row"><span class="lbl">Total</span><span class="val gold">Rs. ${Number(booking.price).toLocaleString()}</span></div>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Booking Slip — ${referenceNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:#F8F4EE;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
    .slip{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:380px;box-shadow:0 4px 32px rgba(0,0,0,.08)}
    .header{text-align:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid rgba(212,175,55,.2)}
    .brand{font-family:'Playfair Display',serif;font-size:22px;color:#1e1e1e;font-weight:600}
    .sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;margin-top:4px}
    .ref-box{background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.25);border-radius:10px;padding:16px;text-align:center;margin-bottom:20px}
    .ref-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(212,175,55,.7);margin-bottom:4px}
    .ref-num{font-family:'Playfair Display',serif;font-size:36px;color:#D4AF37;letter-spacing:6px;font-weight:700}
    .row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F8F4EE}
    .row:last-child{border-bottom:none}
    .lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(30,30,30,.4)}
    .val{font-size:13px;font-weight:500;color:#1e1e1e;text-align:right}
    .val.gold{color:#D4AF37;font-size:17px;font-weight:600;font-family:'Playfair Display',serif}
    .footer{text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid rgba(212,175,55,.15);font-size:10px;color:rgba(30,30,30,.35);line-height:1.7}
    .btn{display:block;width:100%;padding:12px;background:#D4AF37;color:#fff;border:none;border-radius:10px;font-size:13px;font-family:'Inter',sans-serif;font-weight:600;cursor:pointer;margin-top:20px;letter-spacing:.5px}
    .btn:hover{background:#B8962E}
    @media print{.btn{display:none!important}body{background:#fff;padding:0;min-height:auto}}
  </style>
</head>
<body>
  <div class="slip">
    <div class="header"><div class="brand">Bliss Haven Edge</div><div class="sub">Your style, our passion</div></div>
    <div class="ref-box"><div class="ref-lbl">Reference Number</div><div class="ref-num">${referenceNumber}</div></div>
    <div>
      <div class="row"><span class="lbl">Name</span><span class="val">${booking.name}</span></div>
      ${servicesRow}
      ${priceRow}
      <div class="row"><span class="lbl">Date</span><span class="val">${booking.date}</span></div>
      <div class="row"><span class="lbl">Time</span><span class="val">${booking.time}</span></div>
    </div>
    <div class="footer">CB Shop No 2, Near Super Sweet Bakers<br>Laiq Ali Chowk, Wah Cantt &nbsp;·&nbsp; 03039228634</div>
    <button class="btn" onclick="window.print()">⬇ Download / Print Slip</button>
  </div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=480,height=720')
  win.document.write(html)
  win.document.close()
  win.focus()
}

// ─── Confirmation screen ──────────────────────────────────────────────────────
function ConfirmationScreen({ referenceNumber, booking, payment }) {
  const [uploaded, setUploaded] = useState(false)   // mirrors ScreenshotUpload's status==='success'

  return (
    <div>
      {/* ── Dark celebratory header ── */}
      <section className="bg-[#1a1a1a] px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 border border-gold/40 mb-6"
        >
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="font-playfair text-3xl text-white mb-2"
        >
          {uploaded ? 'Booking Confirmed — Payment Proof Received!' : 'Booking Confirmed!'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="font-inter text-white/50 text-sm mb-8"
        >
          {uploaded
            ? 'Thank you! Our team will verify and confirm your booking shortly.'
            : 'We look forward to seeing you.'}
        </motion.p>

        {/* Reference number — large gold */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="inline-block bg-gold/15 border border-gold/30 rounded-2xl px-8 py-5"
        >
          <p className="font-inter text-[10px] tracking-[0.22em] uppercase text-gold/65 mb-1">Reference Number</p>
          <p className="font-playfair text-5xl text-gold tracking-widest">{referenceNumber}</p>
          <p className="font-inter text-[10px] text-white/30 mt-1">Save this for your records</p>
        </motion.div>
      </section>

      {/* ── Details on cream ── */}
      <section className="bg-cream px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">

          {/* Booking summary */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-dark-text/6 bg-cream/50">
              <p className="font-inter text-[10px] tracking-widest uppercase text-dark-text/40">Appointment Details</p>
            </div>
            <div className="divide-y divide-dark-text/6">
              {[
                ['Name', booking.name],
                ['Date', booking.date],
                ['Time', booking.time],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center px-5 py-3">
                  <span className="font-inter text-[10px] tracking-widest uppercase text-dark-text/40">{k}</span>
                  <span className="font-inter text-sm text-dark-text font-medium">{v}</span>
                </div>
              ))}
              {/* Services — list if multiple, single row if one */}
              {booking.services?.length > 1 ? (
                <div className="px-5 py-3">
                  <span className="font-inter text-[10px] tracking-widest uppercase text-dark-text/40 block mb-2">Services</span>
                  <ul className="space-y-1">
                    {booking.services.map((s) => (
                      <li key={s} className="font-inter text-sm text-dark-text font-medium text-right">{s}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-between items-center px-5 py-3">
                  <span className="font-inter text-[10px] tracking-widest uppercase text-dark-text/40">Service</span>
                  <span className="font-inter text-sm text-dark-text font-medium">{booking.service}</span>
                </div>
              )}
              {/* Price row highlighted */}
              {booking.price && (
                <div className="flex justify-between items-center px-5 py-3 bg-gold/5 rounded-b-2xl">
                  <span className="font-inter text-[10px] tracking-widest uppercase text-gold">Total Due</span>
                  <span className="font-playfair text-xl text-gold font-semibold">
                    Rs. {booking.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Download Slip */}
          <button
            onClick={() => downloadSlip({ referenceNumber, booking })}
            className="w-full flex items-center justify-center gap-2.5 bg-[#1a1a1a] hover:bg-dark-text text-white font-inter text-sm py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Booking Slip
          </button>

          {/* Payment instructions */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-gold/15 bg-gold/5">
              <p className="font-inter text-[10px] tracking-widest uppercase text-gold">Payment Instructions</p>
            </div>
            <div className="px-5 py-5">
              <p className="font-inter text-sm text-dark-text/65 leading-relaxed mb-2">
                To confirm your booking faster, you can send an advance payment via Easypaisa or JazzCash to{' '}
                <span className="font-medium text-dark-text">0303-9228634 (Ali Hassan)</span> and upload the screenshot below.
              </p>
              <p className="font-inter text-sm text-dark-text/50 leading-relaxed mb-4">
                <span className="font-medium text-dark-text">This is optional</span> — you can also simply arrive at your appointment time and pay at the salon.
                {booking.price && (
                  <span className="block mt-2 font-medium text-dark-text">
                    Total: <span className="text-gold">Rs. {booking.price.toLocaleString()}</span>
                  </span>
                )}
              </p>
              <div className="bg-cream rounded-xl px-4 py-3.5 space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-inter text-xs text-dark-text/45">Easypaisa / JazzCash</span>
                  <span className="font-inter text-sm font-semibold text-dark-text">{payment.easypaisa.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-inter text-xs text-dark-text/45">Account Name</span>
                  <span className="font-inter text-sm text-dark-text">{payment.easypaisa.name}</span>
                </div>
              </div>
              <ScreenshotUpload bookingId={booking._id || booking.referenceNumber} onSuccess={() => setUploaded(true)} />
            </div>
          </div>

          <Link to="/" className="block text-center font-inter text-sm text-dark-text/40 hover:text-gold transition-colors py-2">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}

// ─── Main booking page ────────────────────────────────────────────────────────
export default function Book() {
  useSEO({
    title: "Book Appointment — Bliss Haven Edge Men's Salon Wah Cantt",
    description: "Book your grooming appointment online at Bliss Haven Edge, Wah Cantt. Choose your service, pick a time, and confirm with a quick advance payment via Easypaisa or JazzCash.",
    path: '/book',
  })
  const reduced    = useReducedMotion()
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [apiError, setApiError] = useState('')

  const set = (k) => (e) => setForm((f) => {
    const updated = { ...f, [k]: e.target.value }
    if (k === 'date') {
      const available = getAvailableSlots(e.target.value)
      if (f.time && !available.includes(f.time)) updated.time = ''
    }
    return updated
  })

  const toggleService = (name) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(name)
        ? f.services.filter((s) => s !== name)
        : [...f.services, name],
    }))

  // ── Submit logic (unchanged) ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setApiError('')
    try {
      const price   = sumPrices(form.services)
      const service = form.services.join(', ')
      const { data } = await api.post('/api/bookings', { ...form, services: form.services, service, price })
      setResult(data)
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Something went wrong. Please try again or book via WhatsApp.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-cream">
        <ConfirmationScreen
          referenceNumber={result.referenceNumber}
          booking={result.booking}
          payment={result.payment}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page header (cream bg) ── */}
      <section className="px-4 pt-16 pb-8 text-center">
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-3"
        >
          Reserve Your Seat
        </motion.p>
        <motion.h1
          initial={reduced ? {} : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-playfair text-4xl md:text-5xl text-dark-text mb-3"
        >
          Book Appointment
        </motion.h1>
        <motion.p
          initial={reduced ? {} : { opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="font-inter text-sm text-dark-text/55"
        >
          Fill in your details and we'll confirm your slot.
        </motion.p>
      </section>

      {/* ── Form in elevated white card ── */}
      <section className="px-4 pb-16">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-lg mx-auto bg-white rounded-2xl shadow-soft p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} noValidate>
            <motion.div
              variants={reduced ? {} : staggerForm}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >

              <motion.div variants={reduced ? {} : fieldIn}>
                <FieldLabel text="Full Name" />
                <input
                  type="text" value={form.name} onChange={set('name')}
                  placeholder="e.g. Ali Hassan"
                  className={inputCls(errors.name)}
                />
                <FieldError msg={errors.name} />
              </motion.div>

              <motion.div variants={reduced ? {} : fieldIn}>
                <FieldLabel text="Phone Number" />
                <input
                  type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="e.g. 03039228634"
                  className={inputCls(errors.phone)}
                />
                <FieldError msg={errors.phone} />
              </motion.div>

              <motion.div variants={reduced ? {} : fieldIn}>
                <FieldLabel text="Services (select one or more)" />
                <ServiceDropdown
                  selected={form.services}
                  onToggle={toggleService}
                  error={errors.services}
                />
                <FieldError msg={errors.services} />
              </motion.div>

              <motion.div variants={reduced ? {} : fieldIn} className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel text="Date" />
                  <input
                    type="date" value={form.date} onChange={set('date')}
                    min={TODAY}
                    className={inputCls(errors.date)}
                  />
                  <FieldError msg={errors.date} />
                </div>
                <div>
                  <FieldLabel text="Time" />
                  <select value={form.time} onChange={set('time')} className={inputCls(errors.time)}>
                    <option value="">— Time —</option>
                    {getAvailableSlots(form.date).map((t) => <option key={t} value={t}>{t}</option>)}
                    {form.date === TODAY && getAvailableSlots(form.date).length === 0 && (
                      <option disabled value="">No slots available today — please pick another date</option>
                    )}
                  </select>
                  <FieldError msg={errors.time} />
                </div>
              </motion.div>

              <motion.div variants={reduced ? {} : fieldIn}>
                <FieldLabel text="Notes (optional)" />
                <textarea
                  value={form.notes} onChange={set('notes')}
                  placeholder="Any special requests..."
                  rows={3}
                  className={`${inputCls(false)} resize-none`}
                />
              </motion.div>

              {apiError && (
                <motion.div variants={reduced ? {} : fieldIn} className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="font-inter text-sm text-red-600 mb-2">{apiError}</p>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi, I'd like to book an appointment at Bliss Haven Edge.")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-inter text-sm text-[#25D366] hover:underline"
                  >
                    Book directly on WhatsApp instead →
                  </a>
                </motion.div>
              )}

              <div className="w-full h-px bg-gold/10" />

              <motion.div variants={reduced ? {} : fieldIn}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-inter py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 font-medium tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Confirming...
                    </span>
                  ) : 'Confirm Booking'}
                </button>
              </motion.div>

            </motion.div>
          </form>
        </motion.div>

        <p className="font-inter text-xs text-dark-text/35 text-center mt-6">
          Prefer to call?{' '}
          <a href={`tel:${SITE.phone}`} className="text-gold hover:underline">{SITE.phoneFormatted}</a>
        </p>
      </section>

    </div>
  )
}
