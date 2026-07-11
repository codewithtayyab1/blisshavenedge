import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { motion, AnimatePresence, useReducedMotion, animate, useInView } from 'framer-motion'
import { FEATURED_SERVICES, DEALS, REVIEWS, WHY_CHOOSE, FACILITIES } from '../data/salonData'
import { SITE } from '../lib/siteConfig'

// ─── Framer Motion variants ───────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const staggerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Stats data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: 14,   suffix: '+', label: 'Years of Experience', decimals: 0 },
  { value: 3,    suffix: '',  label: 'Salons',              decimals: 0 },
  { value: 5000, suffix: '+', label: 'Happy Clients',       decimals: 0 },
  { value: 4.9,  suffix: '★', label: 'Google Rating',       decimals: 1 },
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Do I need an appointment, or can I walk in?',
    a: 'Both work! You\'re welcome to walk in during opening hours, but we recommend booking online to skip the wait and secure your preferred time slot — especially on weekends.',
  },
  {
    q: 'What are your opening hours?',
    a: `We're open every day, ${SITE.hours}. Drop by whenever suits you best — even late evenings.`,
  },
  {
    q: 'Where are you located?',
    a: 'You\'ll find us at CB Shop No 2, Near Super Sweet Bakers, Laiq Ali Chowk, Wah Cantt. Easy to reach and right in the heart of the area.',
  },
  {
    q: 'How do I pay for my booking?',
    a: 'To confirm an online booking, you send an advance via Easypaisa or JazzCash to 0303-9228634 (Ali Hassan), then share the screenshot with us on WhatsApp. The remaining amount is paid at the salon.',
  },
  {
    q: 'What services do you offer?',
    a: 'From haircuts, fades, and beard styling to facials, hair treatments, colour, cleansing, and massage — we cover the full range of men\'s grooming. Check our Services page for the complete menu and prices.',
  },
  {
    q: 'How experienced is your team?',
    a: 'Bliss Haven Edge is led by Ali Hassan, who has been perfecting men\'s grooming since 2012. Our skilled team handles every service with precision, care, and attention to detail.',
  },
  {
    q: 'Can I book a combo deal?',
    a: 'Absolutely. We offer value combo deals (Deal 1 to Deal 5, plus seasonal specials) that bundle popular services together at a better price. You can select these right in the booking form.',
  },
]

// ─── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gold/15">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between py-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-inter text-dark-text font-medium leading-snug">{q}</span>
        <span
          className={`text-gold text-xl leading-none shrink-0 mt-0.5 transition-transform duration-200 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-inter text-dark-text/65 pb-5 leading-relaxed pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Count-up number (GPU-friendly: animates via JS value, not layout) ────────
function CountUp({ to, suffix = '', decimals = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val,  setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setVal(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v)),
    })
    return ctrl.stop
  }, [inView, to, decimals])

  return (
    <span ref={ref}>
      {decimals > 0 ? val.toFixed(decimals) : val.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  )
}
function ScissorsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path strokeLinecap="round" d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </svg>
  )
}
function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}
function DropletIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-6.75 6.75-6.75 11.25a6.75 6.75 0 0013.5 0C18.75 9.75 12 3 12 3z" />
    </svg>
  )
}
function WhyIcon({ icon, className }) {
  const p = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 }
  if (icon === 'clock') return <svg {...p}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" /></svg>
  if (icon === 'gem')   return (
    <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
  )
  if (icon === 'shield') return (
    <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a23.25 23.25 0 01-8.384 18.424l-.042.034a23.241 23.241 0 01-8.576-18.458V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
  )
  return (
    <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
  )
}
function ServiceIcon({ category, className }) {
  if (category === 'SKIN')      return <SparkleIcon className={className} />
  if (category === 'TREATMENT') return <DropletIcon className={className} />
  return <ScissorsIcon className={className} />
}
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  useSEO({
    title: "Bliss Haven Edge — Premium Men's Salon in Wah Cantt | Haircuts, Beard & Grooming",
    description: "Wah Cantt's finest men's grooming salon. Expert haircuts, beard styling, facials, hair treatments & more. Open daily 10:30 AM – 1:00 AM. Walk in or book online.",
    path: '/',
  })
  const reduced = useReducedMotion()

  const heroItem = (delay = 0) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay },
    }

  const scrollFade = (delay = 0) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: 0.55, ease: 'easeOut', delay },
    }

  const stagger = reduced ? {} : {
    variants: staggerVariants, initial: 'hidden',
    whileInView: 'visible', viewport: { once: true, margin: '-60px' },
  }

  const card = reduced ? {} : { variants: cardVariants }

  return (
    <>
      {/*
        ════════════════ HERO ════════════════
        Placed OUTSIDE the overflow-x-hidden wrapper.
        width:100vw + margin-left:calc(-50vw+50%) breaks out of any
        constrained parent. App.jsx's <main overflow-x-hidden> prevents
        a horizontal scrollbar. Single sharp background-size:cover — no blur layers.
      */}
      <section
        className="flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/interior-1.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '85vh',
          /* Full-bleed breakout — works now that <main> has no overflow-x:hidden */
          width: '100vw',
          position: 'relative',
          left: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
        }}
        role="img"
        aria-label="Bliss Haven Edge premium men's salon interior, Wah Cantt"
      >
        {/* Dark gradient overlay — top-to-bottom + radial vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/38 to-black/65" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />

        {/* Hero content — sits above the image */}
        <div className="relative z-10 max-w-lg mx-auto px-6 py-24">

          <motion.div
            {...heroItem(0)}
            className="inline-flex items-center gap-1.5 font-inter text-[11px] text-white/65 tracking-[0.2em] uppercase mb-7"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/30 backdrop-blur-sm">
              <ClockIcon className="w-3 h-3 text-gold" />
            </span>
            14+ Years of Trust
          </motion.div>

          <motion.h1
            {...heroItem(0.15)}
            className="font-playfair text-5xl md:text-7xl text-white leading-tight mb-4 drop-shadow-lg"
          >
            Bliss Haven Edge
          </motion.h1>

          <motion.p
            {...heroItem(0.3)}
            className="font-inter text-white/80 text-base md:text-xl mb-10"
          >
            Your style, our passion.
          </motion.p>

          <motion.div {...heroItem(0.45)} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/book"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white font-inter text-sm px-8 py-3.5 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto border border-white/40 hover:border-white/70 text-white font-inter text-sm px-8 py-3.5 rounded-md transition-all duration-200 hover:bg-white/10"
            >
              View Services
            </Link>
          </motion.div>
        </div>

        {/* Subtle bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* Rest of page — animations need overflow-x-hidden to prevent horizontal scroll */}
      <div className="overflow-x-hidden">

      {/* ════════════════ STATS STRIP ════════════════ */}
      <section className="bg-cream border-y border-gold/10 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div {...scrollFade()} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gold/15">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center py-2 md:px-6">
                <div className="w-6 h-px bg-gold mb-3" />
                <p className="font-playfair text-4xl text-gold leading-none tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="font-inter text-[10px] text-dark-text/50 tracking-[0.15em] uppercase mt-2 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ INTRO ════════════════ */}
      <section className="bg-white py-12 px-4">
        <motion.p
          {...scrollFade()}
          className="font-inter text-dark-text/65 leading-relaxed text-center max-w-2xl mx-auto"
        >
          Welcome to Bliss Haven Edge — Wah Cantt's premium destination for men's grooming. Built on 14 years of experience, we bring together skilled barbers, premium products, and a clean, relaxed space to give every man a sharp, confident look. Whether it's a quick cut or a full grooming session, your style is our passion.
        </motion.p>
      </section>

      {/* ════════════════ FEATURED SERVICES ════════════════ */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-dark-text/45 tracking-[0.22em] uppercase text-center mb-8">
            Featured Services
          </motion.p>

          <motion.div {...stagger} className="space-y-4">
            {FEATURED_SERVICES.map((svc) => (
              <motion.div
                key={svc.id}
                {...card}
                className="bg-white rounded-xl px-5 py-4 flex items-start justify-between shadow-card border border-transparent hover:border-gold/25 hover:-translate-y-1 hover:shadow-soft transition-all duration-300 cursor-default"
              >
                <div>
                  <h3 className="font-playfair text-xl text-dark-text">{svc.name}</h3>
                  <span className="inline-block mt-1.5 font-inter text-[9px] tracking-[0.18em] uppercase text-dark-text/45 border border-dark-text/15 rounded-full px-2.5 py-0.5">
                    {svc.category}
                  </span>
                </div>
               <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
  <ServiceIcon category={svc.category} className="w-5 h-5 text-gold" />
</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ WHY CHOOSE US ════════════════ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-dark-text/45 tracking-[0.22em] uppercase text-center mb-8">
            Why Choose Us
          </motion.p>

          <motion.div {...stagger} className="grid grid-cols-2 gap-x-8 gap-y-10">
            {WHY_CHOOSE.map((item) => (
              <motion.div key={item.id} {...card} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
                  <WhyIcon icon={item.icon} className="w-6 h-6 text-gold" />
                </div>
                <p className="font-inter text-sm text-dark-text/70 leading-snug whitespace-pre-line">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PREMIUM FACILITIES ════════════════ */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-dark-text/45 tracking-[0.22em] uppercase text-center mb-3">
            The Space
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-10">
            Premium Facilities
          </motion.h2>

          <motion.div {...stagger} className="space-y-4">
            {FACILITIES.map((f) => (
              <motion.div
                key={f.id}
                {...card}
                className="bg-white rounded-xl px-5 py-4 flex items-start gap-4 shadow-card border border-transparent hover:border-gold/25 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden border border-gold/20 shrink-0 mt-0.5 bg-cream flex items-center justify-center">
                  {f.image ? (
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover object-center" loading="lazy" />
                  ) : (
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M3 12H1m4.22-6.364L3.808 4.222M19.778 4.222 18.364 5.636M21 12h-2m-1.636 6.364 1.414 1.414M5.636 18.364 4.222 19.778M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-playfair text-lg text-dark-text mb-1 leading-snug">{f.name}</h3>
                  <p className="font-inter text-sm text-dark-text/60 leading-relaxed">{f.short}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...scrollFade(0.2)} className="mt-8 text-center">
            <Link to="/services#facilities" className="font-inter text-sm text-gold hover:text-gold-dark transition-colors">
              Explore Premium Facilities →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ COMBO DEALS — dark charcoal ════════════════ */}
      <section className="bg-[#1a1a1a] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-white/35 tracking-[0.22em] uppercase text-center mb-8">
            Combo Deals
          </motion.p>

          <motion.div {...stagger} className="space-y-4">
            {DEALS.map((deal) => (
              <motion.div
                key={deal.id}
                {...card}
                className="relative bg-white/5 border border-white/8 rounded-xl px-5 py-5 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-gold/30 transition-all duration-300"
              >
                {deal.popular && (
                  <span className="absolute top-4 right-4 bg-gold text-white font-inter text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full">
                    Popular
                  </span>
                )}

                <h3 className="font-playfair text-xl text-white mb-1 pr-20">{deal.name}</h3>
                <p className="font-inter text-sm text-white/45 mb-4">{deal.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="font-playfair text-2xl text-gold">
                    Rs. {deal.price.toLocaleString()}
                  </span>
                  <Link
                    to="/book"
                    state={{ service: deal.name }}
                    className="font-inter text-sm border border-gold/60 text-gold px-4 py-2 rounded hover:bg-gold hover:text-white hover:border-gold transition-all duration-200"
                  >
                    Book
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-dark-text/45 tracking-[0.22em] uppercase text-center mb-8">
            What Our Clients Say
          </motion.p>

          <motion.div {...stagger} className="space-y-4">
            {REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                {...card}
                className="bg-cream rounded-xl px-5 py-5 border border-transparent hover:border-gold/20 transition-colors duration-300"
              >
                <Stars count={review.stars} />
                <p className="font-inter text-sm text-dark-text/70 leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm font-medium text-dark-text">{review.name}</span>
                  <span className="font-inter text-[9px] tracking-widest uppercase text-gold border border-gold/40 rounded-full px-2.5 py-0.5">
                    Verified Customer
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] text-dark-text/45 tracking-[0.22em] uppercase text-center mb-3">
            Support
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-10">
            Frequently Asked Questions
          </motion.h2>
          <motion.div {...scrollFade(0.15)}>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="bg-cream py-20 px-4 text-center">
        <motion.h2 {...scrollFade()} className="font-playfair text-4xl md:text-5xl text-dark-text mb-8 leading-tight">
          Ready for a fresh look?
        </motion.h2>
        <motion.div {...scrollFade(0.15)}>
          <Link
            to="/book"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-inter px-10 py-4 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Book Now
          </Link>
        </motion.div>
      </section>

      </div>{/* end overflow-x-hidden */}
    </>
  )
}
