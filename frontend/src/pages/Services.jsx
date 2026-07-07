import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SERVICE_CATEGORIES, DEALS, FACILITIES } from "../data/salonData";
import { useAnims } from "../lib/animations";
import { useSEO } from "../hooks/useSEO";

// ─── Menu Card Carousel ───────────────────────────────────────────────────────
const MENU_CARDS = [
  { src: "/images/price-card-1.jpeg", alt: "Menu card 1" },
  { src: "/images/price-card-2.jpeg", alt: "Menu card 2" },
  { src: "/images/price-card-3.jpeg", alt: "Menu card 3" },
  { src: "/images/price-card-4.jpeg", alt: "Menu card 4" },
  { src: "/images/price-card-5.jpeg", alt: "Menu card 5" },
];

function MenuCarousel() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setCurrent((index + MENU_CARDS.length) % MENU_CARDS.length);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % MENU_CARDS.length),
      3500,
    );
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const handlePrev = () => {
    goTo(current - 1);
    resetTimer();
  };
  const handleNext = () => {
    goTo(current + 1);
    resetTimer();
  };
  const handleImgError = (i) => setImgErrors((e) => ({ ...e, [i]: true }));

  return (
    <div className="relative w-full max-w-xs md:max-w-sm mx-auto select-none">
      {/* Slide window */}
      <div className="overflow-hidden rounded-2xl shadow-soft bg-cream">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {MENU_CARDS.map((card, i) => (
            <div
              key={i}
              className="w-full shrink-0 h-[320px] md:h-[350px] bg-cream"
            >
              {imgErrors[i] ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-inter text-xs text-dark-text/30">
                    {card.alt}
                  </span>
                </div>
              ) : (
                <img
                  src={card.src}
                  alt={card.alt}
                  onError={() => handleImgError(i)}
                  className="w-full h-full object-contain"
                  style={{ imageOrientation: "from-image" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {[
        { label: "Previous", dir: -1, side: "left-2" },
        { label: "Next", dir: 1, side: "right-2" },
      ].map(({ label, dir, side }) => (
        <button
          key={label}
          aria-label={label}
          onClick={dir === -1 ? handlePrev : handleNext}
          className={`absolute top-1/2 -translate-y-1/2 ${side} z-10 w-9 h-9 rounded-full bg-white/90 shadow-card flex items-center justify-center text-dark-text/60 hover:text-gold hover:shadow-soft transition-all duration-200`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {dir === -1 ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
        </button>
      ))}

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {MENU_CARDS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              goTo(i);
              resetTimer();
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-gold" : "w-1.5 bg-gold/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const fmt = (price) =>
  typeof price === "number" ? `Rs. ${price.toLocaleString()}` : `Rs. ${price}`;

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-gold shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Services() {
  useSEO({
    title: "Services & Prices — Bliss Haven Edge Men's Salon, Wah Cantt",
    description:
      "Full grooming menu with prices: haircuts from Rs. 800, beard styling, facials, hair treatments, colour, cleansing, massage & combo deals. Expert barbers in Wah Cantt.",
    path: "/services",
  });
  const { scrollFade, stagger, card } = useAnims();

  return (
    <div className="overflow-x-hidden">
      {/* ── Header ── */}
      <section className="bg-white px-4 pt-14 pb-12 text-center">
        <motion.p
          {...scrollFade()}
          className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-4"
        >
          Our Menu
        </motion.p>
        <motion.h1
          {...scrollFade(0.1)}
          className="font-playfair text-4xl md:text-5xl text-dark-text mb-4"
        >
          Services & Pricing
        </motion.h1>
        <motion.p
          {...scrollFade(0.2)}
          className="font-inter text-dark-text/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
        >
          Indulge in our curated range of premium grooming services tailored for
          the modern man. Precision, tranquility, and high-end hospitality
          await.
        </motion.p>
      </section>

      {/* ── Menu Cards Carousel ── */}
      <section className="bg-white px-4 pb-14">
        <div className="max-w-2xl mx-auto">
          <motion.p
            {...scrollFade()}
            className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 text-center mb-6"
          >
            Price Cards
          </motion.p>
          <motion.div {...scrollFade(0.1)}>
            <MenuCarousel />
          </motion.div>
        </div>
      </section>

      {/* ── Service Categories — alternating two-column layout ── */}
      <section className="bg-cream px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {SERVICE_CATEGORIES.map((cat, ci) => {
            const isEven = ci % 2 === 0;
            return (
              <motion.div
                key={cat.id}
                {...scrollFade(ci * 0.05)}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 py-12 ${
                  ci < SERVICE_CATEGORIES.length - 1
                    ? "border-b border-gold/15"
                    : ""
                }`}
              >
                {/* ── Text column (category name + description) ── */}
                <div className={isEven ? "md:order-1" : "md:order-2"}>
                  <div className="w-8 h-px bg-gold mb-4" />
                  <h2 className="font-playfair text-2xl md:text-3xl text-dark-text mb-3 leading-snug">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="font-inter text-dark-text/55 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* ── Prices column ── */}
                <div className={isEven ? "md:order-2" : "md:order-1"}>
                  <div className="bg-white rounded-xl shadow-card px-4 py-2">
                    <div className="divide-y divide-dark-text/6">
                      {cat.services.map((svc) => (
                        <div
                          key={svc.name}
                          className="flex items-center justify-between py-3 gap-4 hover:bg-gold/[0.04] -mx-1 px-1 rounded transition-colors duration-150"
                        >
                          <span className="font-inter text-dark-text">
                            {svc.name}
                          </span>
                          <span className="font-inter text-dark-text/60 shrink-0 tabular-nums">
                            {fmt(svc.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Premium Facilities ── */}
      <section className="bg-white px-4 py-16" id="facilities">
        <div className="max-w-4xl mx-auto">
          <motion.p
            {...scrollFade()}
            className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 text-center mb-3"
          >
            The Space
          </motion.p>
          <motion.h2
            {...scrollFade(0.1)}
            className="font-playfair text-3xl md:text-4xl text-dark-text text-center mb-3"
          >
            Premium Facilities
          </motion.h2>
          <motion.p
            {...scrollFade(0.15)}
            className="font-inter text-sm text-dark-text/55 text-center max-w-lg mx-auto mb-12"
          >
            Beyond great service, we've crafted a space built for comfort,
            privacy, and relaxation.
          </motion.p>

          <motion.div
            {...stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {FACILITIES.map((f) => (
              <motion.div
                key={f.id}
                {...card}
                className="bg-white rounded-2xl shadow-card border border-transparent hover:border-gold/25 hover:-translate-y-1 hover:shadow-soft transition-all duration-300 overflow-hidden"
              >
                {/* Image zone — same aspect ratio for all cards */}
                <div className="aspect-[4/3] overflow-hidden bg-cream flex items-center justify-center">
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  ) : (
                    /* Icon fallback for facilities without a photo */
                    <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
                      {f.icon === "ac" && (
                        <svg
                          className="w-9 h-9 text-gold"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.4}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v2m0 14v2M3 12H1m4.22-6.364L3.808 4.222M19.778 4.222 18.364 5.636M21 12h-2m-1.636 6.364 1.414 1.414M5.636 18.364 4.222 19.778M12 8a4 4 0 100 8 4 4 0 000-8z"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-5 py-5">
                  <div className="w-6 h-px bg-gold mb-3" />
                  <h3 className="font-playfair text-xl text-dark-text mb-2 leading-snug">
                    {f.name}
                  </h3>
                  <p className="font-inter text-sm text-dark-text/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Combo Deals — charcoal to match Home page ── */}
      <section className="bg-[#1a1a1a] px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.p
            {...scrollFade()}
            className="font-inter text-[11px] tracking-[0.22em] uppercase text-white/35 text-center mb-2"
          >
            Combo Deals
          </motion.p>
          <motion.p
            {...scrollFade(0.1)}
            className="font-inter text-sm text-white/40 text-center mb-10"
          >
            Expertly curated packages for the ultimate grooming experience.
          </motion.p>

          <motion.div {...stagger} className="space-y-5">
            {DEALS.map((deal) => (
              <motion.div
                key={deal.id}
                {...card}
                className="bg-white/5 border border-white/8 rounded-2xl px-5 py-6 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-gold/30 transition-all duration-300"
              >
                {/* Title row: name + Popular badge inline, price below — no overlap */}
                <div className="mb-4">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="font-playfair text-xl text-white">
                      {deal.name}
                    </h3>
                    {deal.popular && (
                      <span className="shrink-0 bg-gold text-white font-inter text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="font-playfair text-2xl text-gold">
                    {fmt(deal.price)}
                  </span>
                </div>

                <ul className="space-y-1.5 mb-5">
                  {deal.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon />
                      <span className="font-inter text-sm text-white/55">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/book"
                  state={{ service: deal.name }}
                  className="inline-block font-inter text-sm border border-gold/60 text-gold px-5 py-2.5 rounded-md hover:bg-gold hover:text-white hover:border-gold transition-all duration-200 hover:scale-[1.02]"
                >
                  Choose Package
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 px-4 text-center">
        <motion.h2
          {...scrollFade()}
          className="font-playfair text-4xl md:text-5xl text-white mb-4"
        >
          Ready for a fresh look?
        </motion.h2>
        <motion.p
          {...scrollFade(0.1)}
          className="font-inter text-white/50 text-sm mb-8"
        >
          Your seat is waiting.
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
  );
}
