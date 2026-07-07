import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { REVIEWS } from '../data/salonData'
import { SITE } from '../lib/siteConfig'
import { useAnims } from '../lib/animations'
import { useSEO } from '../hooks/useSEO'

// ── Social icon SVGs ──────────────────────────────────────────────────────────
function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  )
}

function YouTubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const SOCIAL_LINKS = [
  { href: SITE.social.instagram, Icon: InstagramIcon, label: 'Instagram', color: '#E1306C' },
  { href: SITE.social.tiktok,    Icon: TikTokIcon,   label: 'TikTok',    color: '#010101' },
  { href: SITE.social.youtube,   Icon: YouTubeIcon,  label: 'YouTube',   color: '#FF0000' },
  { href: SITE.social.facebook,  Icon: FacebookIcon, label: 'Facebook',  color: '#1877F2' },
]

// ─── Auto-scrolling reviews carousel ─────────────────────────────────────────
function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const goTo = useCallback((index) => {
    setCurrent((index + REVIEWS.length) % REVIEWS.length)
  }, [])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % REVIEWS.length),
      4000
    )
  }, [])

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [resetTimer])

  return (
    <div className="relative max-w-lg mx-auto select-none">
      {/* Slide window */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {REVIEWS.map((r) => (
            <div key={r.id} className="w-full shrink-0 px-1">
              <div className="bg-white rounded-xl px-5 py-6 border border-transparent hover:border-gold/20 transition-colors duration-300">
                <Stars count={r.stars} />
                <p className="font-inter text-sm text-dark-text/70 leading-relaxed mb-5">
                  "{r.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm font-medium text-dark-text">{r.name}</span>
                  <span className="font-inter text-[9px] tracking-widest uppercase text-gold border border-gold/40 rounded-full px-2.5 py-0.5">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {[
        { label: 'Previous', dir: -1, cls: '-left-3' },
        { label: 'Next',     dir:  1, cls: '-right-3' },
      ].map(({ label, dir, cls }) => (
        <button
          key={label}
          aria-label={label}
          onClick={() => { goTo(current + dir); resetTimer() }}
          className={`absolute top-1/2 -translate-y-1/2 ${cls} z-10 w-8 h-8 rounded-full bg-white shadow-card flex items-center justify-center text-dark-text/50 hover:text-gold transition-all`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {dir === -1
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
          </svg>
        </button>
      ))}

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            aria-label={`Review ${i + 1}`}
            onClick={() => { goTo(i); resetTimer() }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-5 bg-gold' : 'w-1.5 bg-gold/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const CONTACT_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Location',
    value: SITE.address,
    sub:   SITE.city,
    href:  null,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: 'Contact',
    value: SITE.phoneFormatted,
    sub:   SITE.email,
    href:  `tel:${SITE.phone}`,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    label: 'Opening Hours',
    value: SITE.hours,
    sub:   'Refining excellence every day.',
    href:  null,
  },
]

export default function Contact() {
  useSEO({
    title: "Contact & Location — Bliss Haven Edge Wah Cantt",
    description: "Visit us at CB Shop No 2, Near Super Sweet Bakers, Laiq Ali Chowk, Wah Cantt. Open daily 10:30 AM – 1:00 AM. Call 03039228634 or book an appointment online.",
    path: '/contact',
  })
  const { scrollFade, stagger, card } = useAnims()

  return (
    <div className="overflow-x-hidden">

      {/* ── Header ── */}
      <section className="bg-white px-4 pt-14 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-4">
            Get in Touch
          </motion.p>
          <motion.h1 {...scrollFade(0.1)} className="font-playfair text-4xl md:text-5xl text-dark-text mb-4">
            Visit or Message Us
          </motion.h1>
          <motion.p {...scrollFade(0.2)} className="font-inter text-dark-text/55 text-sm leading-relaxed max-w-md">
            Your sanctuary of precision and tranquility awaits. Whether you're seeking a classic cut
            or a modern transformation, we are here to guide your journey.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section className="bg-white px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div {...stagger} className="space-y-6">
            {CONTACT_ITEMS.map((item) => (
              <motion.div key={item.label} {...card} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shrink-0 mt-0.5 hover:scale-110 hover:shadow-soft transition-all duration-200">
                  {item.icon}
                </div>
                <div>
                  <p className="font-inter text-[10px] tracking-widest uppercase text-dark-text/45 mb-0.5">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="font-inter text-sm text-dark-text hover:text-gold transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-inter text-sm text-dark-text">{item.value}</p>
                  )}
                  {item.sub && (
                    <p className="font-inter text-xs text-dark-text/50 mt-0.5">{item.sub}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Connect with Us (Social links) ── */}
      <section className="bg-cream px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-5">
            Connect with Us
          </motion.p>
          <motion.div {...scrollFade(0.1)} className="flex gap-4">
            {SOCIAL_LINKS.map(({ href, Icon, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center hover:shadow-soft hover:scale-110 transition-all duration-200"
                style={{ color }}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Google Map ── */}
      <section className="bg-cream px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <motion.div {...scrollFade()} className="rounded-2xl overflow-hidden shadow-soft">
            <iframe
              title="Bliss Haven Edge — CB Shop No 2, Near Super Sweet Bakers, Laiq Ali Chowk, Wah Cantt"
              src={SITE.mapEmbedUrl}
              width="100%"
              height="260"
              className="border-0 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
          <motion.a
            {...scrollFade(0.1)}
            href={SITE.mapShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-inter text-xs text-dark-text/40 text-center mt-3 hover:text-gold transition-colors"
          >
            CB Shop No 2, Near Super Sweet Bakers, Laiq Ali Chowk, Wah Cantt — tap to open in Google Maps ↗
          </motion.a>
        </div>
      </section>

      {/* ── Book Appointment CTA ── */}
      <section className="bg-[#1a1a1a] px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[10px] tracking-widest uppercase text-gold mb-3">
            Reserve Your Seat
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-white mb-4">
            Ready for your<br />transformation?
          </motion.h2>
          <motion.p {...scrollFade(0.2)} className="font-inter text-sm text-white/50 mb-8 max-w-xs mx-auto leading-relaxed">
            Book your appointment online in seconds and secure your slot.
          </motion.p>
          <motion.div {...scrollFade(0.3)}>
            <Link
              to="/book"
              className="inline-flex items-center gap-2.5 bg-gold hover:bg-gold-dark text-white font-inter text-sm px-7 py-3.5 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-cream px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 text-center mb-3">
            Reviews
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-2">
            Voices of Satisfaction
          </motion.h2>
          <motion.div {...scrollFade(0.15)} className="flex items-center justify-center gap-2 mb-10">
            <span className="font-inter text-sm text-dark-text/60">4.9</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-inter text-sm text-dark-text/45">on Google Maps</span>
          </motion.div>

          <motion.div {...scrollFade(0.2)}>
            <ReviewsCarousel />
          </motion.div>
        </div>
      </section>

    </div>
  )
}
