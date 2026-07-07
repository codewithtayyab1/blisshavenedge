import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import { DEALS } from '../data/salonData'

// ─── Constants ─────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0]

const STATUS_BADGE = {
  pending:   'bg-amber-100   text-amber-700',
  paid:      'bg-blue-100    text-blue-700',
  arrived:   'bg-emerald-100 text-emerald-700',
  done:      'bg-gray-100    text-gray-500',
  cancelled: 'bg-red-100     text-red-500',
}
const STATUS_DOT = {
  pending:   'bg-amber-400',
  paid:      'bg-blue-400',
  arrived:   'bg-emerald-400',
  done:      'bg-gray-400',
  cancelled: 'bg-red-400',
}

const ACTIONS = {
  pending:   [
    { label: 'Paid',    value: 'paid',      cls: 'bg-blue-50    text-blue-600    hover:bg-blue-100'    },
    { label: 'Arrived', value: 'arrived',   cls: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { label: 'Cancel',  value: 'cancelled', cls: 'bg-red-50     text-red-500     hover:bg-red-100'     },
  ],
  paid:      [
    { label: 'Arrived', value: 'arrived',   cls: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { label: 'Done',    value: 'done',      cls: 'bg-gray-100   text-gray-600    hover:bg-gray-200'    },
    { label: 'Cancel',  value: 'cancelled', cls: 'bg-red-50     text-red-500     hover:bg-red-100'     },
  ],
  arrived:   [
    { label: 'Done',    value: 'done',      cls: 'bg-gray-100   text-gray-600    hover:bg-gray-200'    },
    { label: 'Cancel',  value: 'cancelled', cls: 'bg-red-50     text-red-500     hover:bg-red-100'     },
  ],
  done:      [],
  cancelled: [],
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(str) {
  if (!str) return '—'
  const [y, m, d] = str.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
}

function fmtRs(n) {
  if (!n) return '—'
  return `Rs. ${Number(n).toLocaleString()}`
}

// Convert "10:30 AM" to minutes so times sort correctly across AM/PM
function timeToMinutes(t) {
  if (!t) return 0
  const [time, period] = t.split(' ')
  const [h, m] = time.split(':').map(Number)
  let hours = h
  if (period === 'PM' && h !== 12) hours += 12
  if (period === 'AM' && h === 12) hours = 0
  return hours * 60 + (m || 0)
}

// Find deal includes by service name (for deal detail tooltip)
function getDealIncludes(serviceName) {
  const deal = DEALS.find((d) => d.name === serviceName)
  return deal ? deal.includes : null
}

// ─── Copyable reference number ────────────────────────────────────────────────
function CopyRef({ refNum }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(refNum).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title="Click to copy reference number"
      className="font-inter text-[10px] text-gold tracking-[0.15em] font-medium hover:text-gold-dark transition-colors flex items-center gap-1"
    >
      {refNum}
      <svg className={`w-3 h-3 transition-opacity ${copied ? 'opacity-100 text-emerald-500' : 'opacity-40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {copied
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />}
      </svg>
    </button>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-inter text-[10px] tracking-widest uppercase rounded-full px-2.5 py-1 ${STATUS_BADGE[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
      {status}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, iconBg, icon, sub }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-inter text-[10px] tracking-wider uppercase text-dark-text/45 mb-0.5 truncate">{label}</p>
        <p className="font-playfair text-2xl text-dark-text leading-none">{value}</p>
        {sub && <p className="font-inter text-[10px] text-dark-text/35 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Delete confirmation modal ────────────────────────────────────────────────
function ConfirmDelete({ booking, onConfirm, onCancel, deleting }) {
  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onCancel}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{    opacity: 0, scale: 0.93, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm pointer-events-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-dark-text">Delete Booking?</h3>
                  <p className="font-inter text-xs text-dark-text/50 mt-0.5">{booking.referenceNumber} · {booking.name}</p>
                </div>
              </div>
              <p className="font-inter text-sm text-dark-text/65 leading-relaxed mb-5">
                This will <span className="font-semibold text-dark-text">permanently remove</span> the booking record.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={deleting}
                  className="flex-1 border border-dark-text/15 text-dark-text font-inter text-sm py-2.5 rounded-xl hover:border-dark-text/30 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-inter text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…</>
                  ) : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Booking card / table row ─────────────────────────────────────────────────
function BookingRow({ booking, onStatusChange, onDeleteRequest, updating }) {
  const isBusy    = updating === booking._id
  const actions   = ACTIONS[booking.status] || []
  const isToday   = booking.date === TODAY
  const includes  = getDealIncludes(booking.service)
  const isPaid    = ['paid', 'arrived', 'done'].includes(booking.status)

  return (
    <>
      {/* ── Mobile card ── */}
      <div className={`md:hidden bg-white rounded-2xl shadow-card px-4 py-4 space-y-3 ${isToday ? 'border-l-4 border-gold' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CopyRef refNum={booking.referenceNumber} />
            <p className="font-playfair text-lg text-dark-text leading-tight mt-0.5">{booking.name}</p>
            <p className="font-inter text-xs text-dark-text/45">{booking.phone}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={booking.status} />
            {booking.price && (
              <span className={`font-inter text-xs font-semibold ${isPaid ? 'text-emerald-600' : 'text-dark-text/60'}`}>
                {fmtRs(booking.price)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-cream rounded-xl px-3 py-2.5 font-inter text-sm text-dark-text/65 space-y-1.5">
          <div>
            <span className="text-dark-text font-medium">
              {booking.services?.length > 1
                ? booking.services.join(', ')
                : booking.service}
            </span>
            <span className="text-dark-text/30 mx-1.5">·</span>
            {fmtDate(booking.date)}
            {isToday && <span className="ml-1.5 text-[10px] font-semibold text-gold uppercase tracking-wider">TODAY</span>}
            <span className="text-dark-text/30 mx-1.5">·</span>
            {booking.time}
          </div>
          {includes && (
            <p className="text-xs text-dark-text/45">{includes.join(' · ')}</p>
          )}
          {/* Payment screenshot — prominent so owner can verify before marking Paid */}
          {booking.paymentScreenshot ? (
            <a href={booking.paymentScreenshot} target="_blank" rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 hover:bg-emerald-100 transition-colors">
              <img src={booking.paymentScreenshot} alt="Receipt" className="w-8 h-8 rounded object-cover shrink-0" />
              <span className="font-inter text-[11px] font-semibold text-emerald-700">📸 View Payment Screenshot ↗</span>
            </a>
          ) : (
            <p className="mt-1 font-inter text-[11px] text-dark-text/30 italic">No screenshot uploaded yet</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {actions.map((a) => (
            <button key={a.value} disabled={isBusy} onClick={() => onStatusChange(booking._id, a.value)}
              className={`font-inter text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 disabled:opacity-40 ${a.cls}`}>
              {isBusy ? '…' : a.label}
            </button>
          ))}
          <button
            onClick={() => onDeleteRequest(booking)}
            disabled={isBusy}
            className="font-inter text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-150 disabled:opacity-40 ml-auto"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ── Desktop table row ── */}
      <tr className={`hidden md:table-row border-b border-cream hover:bg-cream/50 transition-colors ${isToday ? 'border-l-4 border-l-gold' : ''}`}>
        <td className="px-5 py-3.5">
          <CopyRef refNum={booking.referenceNumber} />
          {isToday && <span className="block text-[9px] font-semibold text-gold uppercase tracking-wider mt-0.5">Today</span>}
        </td>
        <td className="px-5 py-3.5">
          <p className="font-inter text-sm text-dark-text font-medium">{booking.name}</p>
          <p className="font-inter text-xs text-dark-text/40 mt-0.5">{booking.phone}</p>
        </td>
        <td className="px-5 py-3.5 max-w-[200px]">
          {booking.services?.length > 1 ? (
            <ul className="space-y-0.5">
              {booking.services.map((s) => (
                <li key={s} className="font-inter text-xs text-dark-text/70 line-clamp-1">{s}</li>
              ))}
            </ul>
          ) : (
            <p className="font-inter text-sm text-dark-text/70 line-clamp-1">{booking.service}</p>
          )}
          {!booking.services?.length && includes && (
            <p className="font-inter text-[10px] text-dark-text/40 mt-0.5 line-clamp-1">{includes.join(' · ')}</p>
          )}
          {/* Screenshot thumbnail — click opens full image in new tab */}
          {booking.paymentScreenshot ? (
            <a href={booking.paymentScreenshot} target="_blank" rel="noopener noreferrer"
              title="View payment screenshot"
              className="mt-1 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1 hover:bg-emerald-100 transition-colors">
              <img src={booking.paymentScreenshot} alt="Receipt" className="w-5 h-5 rounded object-cover shrink-0" />
              <span className="font-inter text-[10px] font-semibold text-emerald-700">View receipt ↗</span>
            </a>
          ) : (
            <span className="font-inter text-[10px] text-dark-text/25 mt-0.5 block italic">No receipt yet</span>
          )}
        </td>
        <td className="px-5 py-3.5 whitespace-nowrap">
          <p className="font-inter text-sm text-dark-text/70">{fmtDate(booking.date)}</p>
          <p className="font-inter text-xs text-dark-text/35 mt-0.5">{booking.time}</p>
        </td>
        <td className="px-5 py-3.5">
          <StatusBadge status={booking.status} />
        </td>
        <td className="px-5 py-3.5 whitespace-nowrap">
          {booking.price ? (
            <div>
              <p className={`font-inter text-sm font-semibold ${isPaid ? 'text-emerald-600' : 'text-dark-text/70'}`}>
                {fmtRs(booking.price)}
              </p>
              <p className={`font-inter text-[10px] mt-0.5 ${isPaid ? 'text-emerald-500' : 'text-dark-text/35'}`}>
                {isPaid ? '✓ received' : 'pending'}
              </p>
            </div>
          ) : (
            <span className="font-inter text-xs text-dark-text/30">—</span>
          )}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex gap-1.5 flex-wrap items-center">
            {actions.map((a) => (
              <button key={a.value} disabled={isBusy} onClick={() => onStatusChange(booking._id, a.value)}
                className={`font-inter text-xs px-2.5 py-1 rounded-lg transition-colors duration-150 disabled:opacity-40 ${a.cls}`}>
                {isBusy ? '…' : a.label}
              </button>
            ))}
            <button
              onClick={() => onDeleteRequest(booking)}
              disabled={isBusy}
              className="font-inter text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-150 disabled:opacity-40 border border-red-200"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  )
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const icons = {
  list:  <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
  cal:   <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  clock: <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" /></svg>,
  check: <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  rs:    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
  recv:  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>,
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout }  = useAuth()
  const navigate    = useNavigate()

  const [bookings,      setBookings]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [fetchError,    setFetchError]    = useState('')
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [updating,      setUpdating]      = useState(null)
  const [actionError,   setActionError]   = useState('')
  const [deleteTarget,  setDeleteTarget]  = useState(null)   // booking object pending confirmation
  const [deleting,      setDeleting]      = useState(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true); setFetchError('')
    try {
      const { data } = await api.get('/api/admin/bookings')
      setBookings(data.bookings)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login', { replace: true }) }
      else setFetchError('Failed to load bookings. Check the server is running.')
    } finally { setLoading(false) }
  }, [logout, navigate])

  // Fetch on mount; also auto-refresh every 30s so new screenshots appear without manual refresh
  useEffect(() => { fetchBookings() }, [fetchBookings])
  useEffect(() => {
    const interval = setInterval(fetchBookings, 30000)
    return () => clearInterval(interval)
  }, [fetchBookings])

  const handleStatusChange = async (id, status) => {
    setUpdating(id)
    try {
      await api.patch(`/api/admin/bookings/${id}/status`, { status })
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b))
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login', { replace: true }) }
      else {
        setActionError(err.response?.data?.message || 'Status update failed. Please try again.')
        setTimeout(() => setActionError(''), 5000)
      }
    } finally { setUpdating(null) }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/api/admin/bookings/${deleteTarget._id}`)
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/admin/login', { replace: true }) }
      else {
        setActionError(err.response?.data?.message || 'Delete failed. Please try again.')
        setTimeout(() => setActionError(''), 5000)
        setDeleteTarget(null)
      }
    } finally { setDeleting(false) }
  }

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }) }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total     = bookings.length
  const todayAll  = bookings.filter((b) => b.date === TODAY)
  const todayCount = todayAll.length
  const pending   = bookings.filter((b) => b.status === 'pending').length
  const paid      = bookings.filter((b) => b.status === 'paid').length

  // Revenue: only count bookings with a price field
  const receivedStatuses = ['paid', 'arrived', 'done']
  const todayExpected  = todayAll.filter(b => b.status !== 'cancelled' && b.price)
    .reduce((s, b) => s + b.price, 0)
  const todayReceived  = todayAll.filter(b => receivedStatuses.includes(b.status) && b.price)
    .reduce((s, b) => s + b.price, 0)
  const totalReceived  = bookings.filter(b => receivedStatuses.includes(b.status) && b.price)
    .reduce((s, b) => s + b.price, 0)

  // ── Sort: upcoming first (date ASC, time ASC) ─────────────────────────────
  const sorted = [...bookings].sort((a, b) => {
    if (a.date !== b.date) return a.date > b.date ? 1 : -1
    return timeToMinutes(a.time) - timeToMinutes(b.time)
  })

  // ── Client-side filter ─────────────────────────────────────────────────────
  const filtered = sorted.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.referenceNumber?.toLowerCase().includes(q) ||
      b.name?.toLowerCase().includes(q) ||
      b.phone?.includes(q)
    )
  })

  return (
    <>
    <ConfirmDelete
      booking={deleteTarget}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setDeleteTarget(null)}
      deleting={deleting}
    />
    <div className="min-h-screen bg-cream">

      {/* ── Header ── */}
      <header className="bg-[#1a1a1a] border-b border-white/[0.07] px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold/50 shrink-0">
              <img src="/images/logo.jpeg" alt="BHE" width="40" height="40" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <h1 className="font-playfair text-lg text-white leading-tight">Bliss Haven Edge</h1>
              <p className="font-inter text-[9px] tracking-[0.2em] uppercase text-white/35">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchBookings}
              className="font-inter text-xs text-white/55 hover:text-gold border border-white/15 hover:border-gold/40 rounded-lg px-3 py-1.5 transition-all duration-200">
              Refresh
            </button>
            <button onClick={handleLogout}
              className="font-inter text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded-lg px-3 py-1.5 transition-all duration-200">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* ── Action error ── */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="font-inter text-sm text-red-600">{actionError}</p>
            <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none">×</button>
          </div>
        )}

        {/* ── Booking stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={total}      iconBg="bg-gold/10"    icon={icons.list}  />
          <StatCard label="Today"          value={todayCount} iconBg="bg-blue-50"    icon={icons.cal}   />
          <StatCard label="Pending"        value={pending}    iconBg="bg-amber-50"   icon={icons.clock} />
          <StatCard label="Paid"           value={paid}       iconBg="bg-emerald-50" icon={icons.check} />
        </div>

        {/* ── Revenue stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Today's Expected"
            value={todayExpected ? `Rs. ${todayExpected.toLocaleString()}` : '—'}
            iconBg="bg-gold/10" icon={icons.rs}
            sub={`${todayAll.filter(b => b.status !== 'cancelled').length} booking(s)`}
          />
          <StatCard
            label="Today Received"
            value={todayReceived ? `Rs. ${todayReceived.toLocaleString()}` : '—'}
            iconBg="bg-emerald-50" icon={icons.recv}
            sub={`${todayAll.filter(b => receivedStatuses.includes(b.status)).length} confirmed`}
          />
          <StatCard
            label="All-Time Received"
            value={totalReceived ? `Rs. ${totalReceived.toLocaleString()}` : '—'}
            iconBg="bg-emerald-50" icon={icons.recv}
            sub="paid + arrived + done"
          />
        </div>

        {/* ── Search + filter ── */}
        <div className="bg-white rounded-2xl shadow-card px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, or reference..."
                className="w-full pl-10 pr-4 py-2.5 border border-dark-text/12 rounded-xl font-inter text-sm text-dark-text bg-cream/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-dark-text/12 rounded-xl px-4 py-2.5 font-inter text-sm text-dark-text bg-cream/40 focus:outline-none focus:border-gold min-w-[160px]">
              <option value="">All Statuses</option>
              {['pending','paid','arrived','done','cancelled'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Bookings ── */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-inter text-sm text-dark-text/35">Loading bookings...</p>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-2xl shadow-card px-5 py-8 text-center">
            <p className="font-inter text-sm text-red-500 mb-3">{fetchError}</p>
            <button onClick={fetchBookings} className="font-inter text-sm text-gold hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-inter text-sm text-dark-text/35">
              {search || statusFilter ? 'No bookings match your filters.' : 'No bookings yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {filtered.map((b) => (
                <BookingRow key={b._id} booking={b} onStatusChange={handleStatusChange} onDeleteRequest={setDeleteTarget} updating={updating} />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-cream">
                  <tr>
                    {['Ref #', 'Customer', 'Service', 'Date / Time', 'Status', 'Amount', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 font-inter text-[10px] tracking-widest uppercase text-dark-text/40 border-b border-dark-text/8">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream">
                  {filtered.map((b) => (
                    <BookingRow key={b._id} booking={b} onStatusChange={handleStatusChange} onDeleteRequest={setDeleteTarget} updating={updating} />
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-cream bg-cream/40">
                <p className="font-inter text-xs text-dark-text/35">
                  Showing {filtered.length} of {total} bookings · sorted by date (upcoming first)
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}
