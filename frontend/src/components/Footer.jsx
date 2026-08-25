import { Link } from 'react-router-dom'
import { SITE } from '../lib/siteConfig'

const QUICK_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
  { to: '/book',     label: 'Book Appointment' },
]

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Brand ── */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/50 shrink-0">
                <img
                  src="/images/logo.jpeg"
                  alt="Bliss Haven Edge"
                  width="56"
                  height="56"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-playfair text-2xl text-dark-text">Bliss Haven Edge</h3>
            </div>
            <p className="font-inter text-xs text-gold tracking-[0.18em] uppercase mb-4">
              Your style, our passion
            </p>
            <p className="font-inter text-sm text-dark-text/60 leading-relaxed">
              Premium men's grooming in the heart of Wah Cantt. Walk in, transform, walk out.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="font-playfair text-base text-dark-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-inter text-sm text-dark-text/60 hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="font-playfair text-base text-dark-text mb-4">Get in Touch</h4>
            <ul className="space-y-3 font-inter text-sm text-dark-text/60">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>{SITE.address}</span>
              </li>
              <li>
                <a
                  href="tel:+923039228634"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <span>📞</span>
                  <span>+92 303 922 8634</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923039228634"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li className="flex items-center gap-2 pt-1 text-dark-text/40">
                <span>🕐</span>
                <span>Daily: {SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-gold/10 space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-inter text-xs text-dark-text/40">
            <span>© {new Date().getFullYear()} Bliss Haven Edge. All rights reserved.</span>
          </div>
          {/* Developer credit */}
          <p className="font-inter text-[11px] text-dark-text/30 text-center">
            Website designed &amp; developed by{' '}
            <a
              href="https://wa.me/923220592909"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-dark transition-colors font-medium"
            >
              M. Tayyab
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
