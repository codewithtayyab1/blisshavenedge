import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_IMAGES, GALLERY_VIDEOS } from "../data/salonData";
import { useAnims, fadeUpVariants, staggerVariants } from "../lib/animations";
import Lightbox from "../components/Lightbox";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "haircuts-beard", label: "Haircuts & Beard" },
  { key: "interior", label: "Interior" },
];

// Image card with graceful error fallback and hover zoom
function GalleryImage({ src, alt, onClick }) {
  const [error, setError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-lg bg-cream aspect-[3/4]">
      {error ? (
        <div className="w-full h-full bg-cream" />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          onClick={onClick}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
          style={{ imageOrientation: "from-image" }}
          loading="lazy"
        />
      )}
    </div>
  );
}

// Video card — shows play overlay; clicking reveals native controls
function VideoCard({ src, title, category }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    ref.current?.play();
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-text/90 shadow-soft hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300">
      {error ? (
        <div className="w-full h-52 bg-cream flex items-center justify-center">
          <span className="font-inter text-sm text-dark-text/40">
            Video coming soon
          </span>
        </div>
      ) : (
        <div
          className="aspect-video"
          style={{
            background:
              "radial-gradient(ellipse at center, #2d2d2d 0%, #0a0a0a 100%)",
          }}
        >
          <video
            ref={ref}
            src={src}
            className="w-full h-full object-contain"
            controls={playing}
            playsInline
            preload="none"
            onEnded={() => setPlaying(false)}
            onError={() => setError(true)}
          />
        </div>
      )}

      {!playing && !error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          onClick={handlePlay}
          role="button"
          aria-label={`Play ${title}`}
        >
          {/* dark gradient overlay */}
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white ml-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/65 to-transparent z-10">
            <p className="font-inter text-[10px] text-gold tracking-widest uppercase mb-1">
              {category}
            </p>
            <p className="font-playfair text-white text-lg leading-snug">
              {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  useSEO({
    title: "Gallery — Our Work & Space | Bliss Haven Edge Wah Cantt",
    description:
      "See our haircut transformations, beard styling work, and premium salon interior. Bliss Haven Edge — precision craftsmanship meets luxury in Wah Cantt.",
    path: "/gallery",
  });
  const { scrollFade, stagger, card } = useAnims();
  const [active, setActive] = useState("all");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const filtered =
    active === "all"
      ? GALLERY_IMAGES
      : active === "haircuts-beard"
        ? GALLERY_IMAGES.filter(
            (img) => img.category === "haircuts" || img.category === "beard",
          )
        : GALLERY_IMAGES.filter((img) => img.category === active);

  return (
    <div className="overflow-x-hidden">
      
      {/* ── Header ── */}
      <section className="bg-white px-4 pt-14 pb-10 text-center">
        <motion.p
          {...scrollFade()}
          className="font-inter text-[11px] tracking-[0.22em] uppercase text-dark-text/45 mb-4"
        >
          Portfolio
        </motion.p>
        <motion.h1
          {...scrollFade(0.1)}
          className="font-playfair text-4xl md:text-5xl text-dark-text mb-4"
        >
          Our Work & Space
        </motion.h1>
        <motion.p
          {...scrollFade(0.2)}
          className="font-inter text-dark-text/55 text-sm max-w-md mx-auto leading-relaxed"
        >
          Experience the intersection of precision craftsmanship and
          architectural serenity. Every cut, every detail, every moment is
          designed for the modern gentleman.
        </motion.p>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="bg-white px-4 pb-8">
        <motion.div
          {...scrollFade()}
          className="flex flex-wrap justify-center gap-2 max-w-md mx-auto"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`font-inter text-xs px-4 py-1.5 rounded-full border transition-all duration-200 ${
                active === f.key
                  ? "bg-gold border-gold text-white"
                  : "border-gold/50 text-gold hover:bg-gold/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ── Image Grid ── */}
      <section className="bg-cream px-4 py-4 pb-16">
        <div className="max-w-2xl mx-auto">
          {filtered.length === 0 ? (
            <p className="font-inter text-sm text-dark-text/40 text-center py-16">
              No images in this category yet.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {filtered.map((img) => (
                  <motion.div key={img.id} variants={fadeUpVariants}>
                    <GalleryImage
                      src={img.src}
                      alt={img.alt}
                      onClick={() => setLightboxSrc(img.src)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Transformations (Videos) ── */}
      <section className="bg-[#1a1a1a] px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.p
            {...scrollFade()}
            className="font-inter text-[11px] tracking-[0.22em] uppercase text-white/35 text-center mb-3"
          >
            In Motion
          </motion.p>
          <motion.h2
            {...scrollFade(0.1)}
            className="font-playfair text-3xl md:text-4xl text-white text-center mb-10"
          >
            Transformations
          </motion.h2>

          <motion.div {...stagger} className="space-y-5">
            {GALLERY_VIDEOS.map((v) => (
              <motion.div key={v.id} {...card}>
                <VideoCard {...v} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 px-4 text-center">
        <motion.h2
          {...scrollFade()}
          className="font-playfair text-4xl md:text-5xl text-white mb-4 leading-tight"
        >
          Ready for your own
          <br />
          transformation?
        </motion.h2>
        <motion.div {...scrollFade(0.15)}>
          <Link
            to="/book"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-inter px-10 py-4 rounded-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Book Appointment
          </Link>
        </motion.div>
      </section>

      <Lightbox
        src={lightboxSrc}
        alt="Gallery photo"
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
}
