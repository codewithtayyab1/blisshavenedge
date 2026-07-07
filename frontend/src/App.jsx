import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import ErrorBoundary     from './components/ErrorBoundary'
import ProtectedRoute    from './components/ProtectedRoute'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'
import WhatsAppButton    from './components/WhatsAppButton'
import OfferWidget       from './components/OfferWidget'
import ScrollToTop       from './components/ScrollToTop'

// ── Lazy-loaded pages: each page's JS loads only when first visited ──────────
const Home           = lazy(() => import('./pages/Home'))
const Services       = lazy(() => import('./pages/Services'))
const Gallery        = lazy(() => import('./pages/Gallery'))
const About          = lazy(() => import('./pages/About'))
const Contact        = lazy(() => import('./pages/Contact'))
const Book           = lazy(() => import('./pages/Book'))
const AdminLogin     = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound       = lazy(() => import('./pages/NotFound'))

// Minimal branded loading fallback shown while a page chunk is downloading
function PageLoader() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  )
}

// Shared shell for all public-facing pages
function PublicLayout() {
  return (
    <>
      <Navbar />
      {/* overflow-x-hidden removed — it was clipping the hero's 100vw breakout.
          Each page wraps its animated content in its own overflow-x-hidden div. */}
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <OfferWidget />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ── Public pages (with Navbar + Footer) ── */}
              <Route element={<PublicLayout />}>
                <Route index            element={<Home />}     />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery"  element={<Gallery />}  />
                <Route path="/about"    element={<About />}    />
                <Route path="/contact"  element={<Contact />}  />
                <Route path="/book"     element={<Book />}     />
                {/* 404 for any unknown public path */}
                <Route path="*"         element={<NotFound />} />
              </Route>

              {/* ── Admin login (no shared layout) ── */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ── Protected admin routes ── */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}
