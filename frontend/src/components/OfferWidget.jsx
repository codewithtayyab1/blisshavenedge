import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfferWidget() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  const handleBookNow = () => {
    close()
    setTimeout(() => navigate('/book'), 150)
  }

  return (
    <>
      {/* Floating button — z-[55] sits above navbar (z-50) */}
      <div className="fixed left-4 sm:left-6 bottom-6 z-[55]">
        <div className="relative">
          {/* CSS pulse ring — no Framer infinite animation to avoid pointer-event quirks */}
          <span className="absolute inset-0 rounded-full animate-ping bg-gold/35 pointer-events-none" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="View special offer"
            className="relative flex items-center gap-2 bg-gold text-[#1a1a1a] font-inter text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg hover:bg-gold-dark hover:text-white transition-colors duration-200 select-none cursor-pointer"
          >
            <span aria-hidden="true">🎁</span>
            <span>Special Offer</span>
          </button>
        </div>
      </div>

      {/*
        Each motion child is a direct child of AnimatePresence — no Fragment wrapper.
        Fragment inside AnimatePresence breaks exit-animation tracking and can cause
        the modal to silently fail to re-open after being closed.
        The overlay also gets pointer-events:none while exiting so it can't swallow
        clicks on the floating button during the 0.2s fade-out.
      */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: open ? 'auto' : 'none' }}
            className="fixed inset-0 bg-black/55 z-[60]"
            onClick={close}
          />
        )}
        {open && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* × close */}
              <button
                type="button"
                onClick={close}
                aria-label="Close offer"
                className="absolute top-4 right-4 text-dark-text/35 hover:text-dark-text text-xl leading-none transition-colors"
              >
                ×
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center text-xl shrink-0">🎁</div>
                <div>
                  <p className="font-inter text-[10px] tracking-widest uppercase text-gold mb-0.5">Limited Time</p>
                  <h2 className="font-playfair text-2xl text-dark-text leading-tight">Special Offer</h2>
                </div>
              </div>

              <div className="w-full h-px bg-gold/20 mb-4" />

              <p className="font-inter text-dark-text/65 leading-relaxed mb-6">
                Get a <span className="font-semibold text-dark-text">FREE Cleansing</span> with every{' '}
                <span className="font-semibold text-dark-text">Haircut + Beard</span> combo!
                Book now to claim this offer at the salon.
              </p>

              <button
                type="button"
                onClick={handleBookNow}
                className="block w-full text-center bg-gold hover:bg-gold-dark text-white font-inter font-medium py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Now & Claim Offer
              </button>

              <button
                type="button"
                onClick={close}
                className="block w-full text-center font-inter text-xs text-dark-text/30 hover:text-dark-text/55 transition-colors mt-3 py-1"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
