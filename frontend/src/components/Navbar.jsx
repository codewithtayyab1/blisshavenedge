import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { to: '/',         label: 'Home',     end: true  },
  { to: '/services', label: 'Services', end: false },
  { to: '/gallery',  label: 'Gallery',  end: false },
  { to: '/about',    label: 'About',    end: false },
  { to: '/contact',  label: 'Contact',  end: false },
]

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setIsOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-white/[0.07] transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.5)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3" onClick={close}>
            {/* Circle slightly larger: w-12 = 48 px (was 36 px ≈ +33%) */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/60 shrink-0 bg-[#111]">
              <img
                src="/images/logo.jpeg"
                alt="BHE"
                width="48"
                height="48"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-playfair text-xl font-semibold text-white tracking-wide truncate">
                Bliss Haven Edge
              </span>
              {/* hidden on screens < 480 px to prevent overflow */}
              <span className="hidden min-[480px]:block font-inter text-[10px] text-gold tracking-[0.2em] uppercase">
                Premium Men's Salon
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `font-inter text-sm transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-white/75 hover:text-gold'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── CTA + hamburger ── */}
          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="hidden md:inline-flex items-center bg-gold hover:bg-gold-dark text-white font-inter text-sm px-5 py-2.5 rounded transition-colors duration-200"
            >
              Book Appointment
            </Link>

            <button
              onClick={() => setIsOpen((o) => !o)}
              className="md:hidden p-2 text-white/80 rounded hover:bg-white/10 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile slide-down menu — dark to match navbar ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[#1a1a1a] border-t border-white/10"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={close}
                  className={({ isActive }) =>
                    `font-inter text-sm py-2.5 border-b border-white/[0.07] transition-colors ${
                      isActive ? 'text-gold' : 'text-white/75'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/book"
                onClick={close}
                className="mt-3 bg-gold hover:bg-gold-dark text-white font-inter text-sm px-5 py-3 rounded text-center transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
