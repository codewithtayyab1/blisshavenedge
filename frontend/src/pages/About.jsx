import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WHY_CHOOSE } from '../data/salonData'
import { useAnims } from '../lib/animations'
import { useSEO } from '../hooks/useSEO'

function WhyIcon({ icon, className }) {
  const p = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 }
  if (icon === 'clock') return (
    <svg {...p}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" /></svg>
  )
  if (icon === 'gem') return (
    <svg {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
  if (icon === 'shield') return (
    <svg {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
  return (
    <svg {...p}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a23.25 23.25 0 01-8.384 18.424l-.042.034a23.241 23.241 0 01-8.576-18.458V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
  )
}

function OwnerImage() {
  const [error, setError] = useState(false)
  return error ? (
    <div className="w-full h-full bg-cream flex items-center justify-center rounded-2xl">
      <span className="font-inter text-xs text-dark-text/30">Owner photo</span>
    </div>
  ) : (
    <img
      src="/images/hero.jpeg"
      alt="Ali Hassan — Founder, Bliss Haven Edge"
      onError={() => setError(true)}
      className="w-full h-full object-cover object-center rounded-2xl"
      loading="lazy"
    />
  )
}

function StoryImage() {
  const [error, setError] = useState(false)
  return (
    <div className="flex justify-center">
      <div className="group w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-soft shrink-0 bg-cream">
        {error ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-inter text-xs text-dark-text/30">Owner photo</span>
          </div>
        ) : (
          <img
            src="/images/owner1.jpeg"
            alt="Ali Hassan — Founder, Bliss Haven Edge"
            onError={() => setError(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            style={{ imageOrientation: 'from-image' }}
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}

export default function About() {
  useSEO({
    title: "About Us — Bliss Haven Edge | 14 Years of Men's Grooming in Wah Cantt",
    description: "Founded by Ali Hassan in 2012, Bliss Haven Edge is Wah Cantt's most trusted men's salon with 3 branches, expert barbers, and premium products including L'Oréal and Keune.",
    path: '/about',
  })
  const { scrollFade, stagger, card } = useAnims()

  return (
    <div className="overflow-x-hidden">

      {/* ── Story Header ── */}
      <section className="bg-white px-4 pt-14 pb-10 text-center">
        <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-4">
          Who We Are
        </motion.p>
        <motion.h1 {...scrollFade(0.1)} className="font-playfair text-4xl md:text-5xl text-dark-text mb-4">
          Our Story
        </motion.h1>
        <motion.p {...scrollFade(0.2)} className="font-inter text-dark-text/55 text-sm max-w-lg mx-auto leading-relaxed">
          Crafting timeless looks through precision, serenity, and a commitment
          to the modern gentleman's excellence — built on 14 years of craft.
        </motion.p>
      </section>

      {/* ── Salon Photo + Story ── */}
      <section className="bg-white px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <motion.div {...scrollFade()}>
            <StoryImage />
          </motion.div>

          <motion.div {...scrollFade(0.1)} className="mt-8 space-y-4">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-playfair text-2xl md:text-3xl text-dark-text">
              A Vision of Excellence
            </h2>
            <p className="font-inter text-sm text-dark-text/65 leading-relaxed">
              Ali Hassan began his grooming career in 2012, opening his first salon — Ali Ideal Hair
              Saloon — at Laiq Ali Chowk, Wah Cantt. Over the years he grew to a second branch,
              New Ideal Hair Saloon, refining his craft with every client.
            </p>
            <p className="font-inter text-sm text-dark-text/65 leading-relaxed">
              Bliss Haven Edge at CB Shop No 2, Near Super Sweet Bakers, Laiq Ali Chowk is his
              third and latest salon — the most premium expression of 14 years of grooming mastery.
              From a classic haircut to advanced facials and hair treatments, every service carries
              the precision and care that Ali Hassan has built his reputation on.
            </p>
            <p className="font-inter text-sm text-dark-text/65 leading-relaxed">
              We believe grooming is not just about appearance — it is about confidence, self-care,
              and starting your day with intention. Our promise is simple: you leave looking and
              feeling your best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-cream px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 text-center mb-3">
            The Standard
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-12">
            Why Choose Us
          </motion.h2>
          <motion.p {...scrollFade(0.15)} className="font-inter text-sm text-dark-text/55 text-center mb-10 -mt-6">
            "The pillars of our premium service"
          </motion.p>

          <motion.div {...stagger} className="grid grid-cols-2 gap-x-8 gap-y-10">
            {WHY_CHOOSE.map((item) => (
              <motion.div key={item.id} {...card} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-card hover:scale-110 hover:shadow-soft transition-all duration-200">
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

      {/* ── Meet the Team ── */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.p {...scrollFade()} className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 text-center mb-3">
            The People
          </motion.p>
          <motion.h2 {...scrollFade(0.1)} className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-10">
            Meet the Team
          </motion.h2>

          <motion.div {...stagger} className="space-y-5">

            {/* Owner card */}
            <motion.div
              {...card}
              className="bg-cream rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 border border-transparent hover:border-gold/20 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300"
            >
              <div className="sm:w-40 h-52 sm:h-auto shrink-0">
                <OwnerImage />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <p className="font-inter text-[10px] tracking-widest uppercase text-gold mb-1">Founder & Owner</p>
                <h3 className="font-playfair text-2xl text-dark-text mb-2">Ali Hassan</h3>
                <p className="font-inter text-sm text-dark-text/60 leading-relaxed">
                  Since 2012, Ali Hassan has been perfecting the art of men's grooming across three
                  salons in Wah Cantt. Bliss Haven Edge is his latest and most premium venture —
                  every service here reflects 14 years of hands-on craft, precision, and dedication
                  to the modern gentleman.
                </p>
              </div>
            </motion.div>

            {/* Collective team card */}
            <motion.div
              {...card}
              className="bg-cream rounded-2xl p-6 border border-transparent hover:border-gold/20 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-inter text-[10px] tracking-widest uppercase text-gold mb-0.5">The Crew</p>
                  <h3 className="font-playfair text-xl text-dark-text">Our Skilled Team</h3>
                </div>
              </div>
              <p className="font-inter text-sm text-dark-text/60 leading-relaxed">
                Our team of four dedicated groomers brings deep expertise across the full range of
                services — haircuts, beard styling, facials, hair treatments, and more. Trained
                personally by Ali Hassan, every team member upholds the same standard: precision,
                cleanliness, and care for every client who walks through the door.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 px-4 text-center">
        <motion.h2 {...scrollFade()} className="font-playfair text-4xl md:text-5xl text-white mb-4">
          Experience Excellence
        </motion.h2>
        <motion.p {...scrollFade(0.1)} className="font-inter text-white/50 text-sm mb-8 max-w-sm mx-auto">
          Sit back and let our artisans do what they do best. Your seat awaits.
        </motion.p>
        <motion.div {...scrollFade(0.2)}>
          <Link
            to="/book"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-inter px-10 py-4 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Book Appointment
          </Link>
        </motion.div>
      </section>

    </div>
  )
}
