import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

export default function NotFound() {
  useSEO({
    title: '404 — Page Not Found | Bliss Haven Edge',
    description: 'The page you were looking for does not exist. Return to Bliss Haven Edge.',
  })

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md"
      >
        {/* Large ghost 404 */}
        <p className="font-playfair text-[120px] md:text-[160px] text-gold/15 leading-none select-none mb-0">
          404
        </p>

        <div className="w-10 h-px bg-gold mx-auto mb-6 -mt-4" />

        <h1 className="font-playfair text-3xl md:text-4xl text-dark-text mb-3">
          Page Not Found
        </h1>
        <p className="font-inter text-dark-text/55 leading-relaxed mb-10">
          The page you're looking for doesn't exist or has moved.
          Head back home and find what you need.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white font-inter px-8 py-3.5 rounded-md transition-all duration-200 hover:scale-[1.02]"
          >
            Back to Home
          </Link>
          <Link
            to="/book"
            className="w-full sm:w-auto border border-dark-text/20 hover:border-gold text-dark-text hover:text-gold font-inter px-8 py-3.5 rounded-md transition-colors duration-200 text-center"
          >
            Book Appointment
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
