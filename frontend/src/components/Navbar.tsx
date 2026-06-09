import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plane, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAdmin
    ? [
        { label: 'Dashboard', href: '/admin' },
        { label: 'AI Content Agent', href: '/admin/rss' },
        { label: 'Back to Site', href: '/' },
      ]
    : [
        { label: 'Destinations', href: '#destinations' },
        { label: 'Attractions', href: '#attractions' },
        { label: 'Packages', href: '#packages' },
        { label: 'Stories', href: '#stories' },
      ];

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--charcoal)]/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Plane className="h-8 w-8 text-[var(--gold)]" />
          <span className="font-serif text-xl font-bold text-[var(--gold)]">
            Virtual Holidays
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-base font-semibold text-[var(--gold)] hover:text-[var(--cream)] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="text-base font-semibold text-[var(--gold)] hover:text-[var(--cream)] transition-colors whitespace-nowrap"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        {/* Right side CTA buttons (desktop) */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-base font-bold text-[var(--gold)] hover:text-[var(--cream)] transition-colors border-2 border-[var(--gold)] hover:border-[var(--gold)] px-4 py-2 rounded-lg"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
            <button
              onClick={() => handleClick('#packages')}
              className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--charcoal)] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-[var(--gold)]/30 hover:shadow-xl"
            >
              <Plane className="h-4 w-4" />
              Plan Your Trip
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[var(--cream)]"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--charcoal)]/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) =>
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-base font-semibold text-[var(--gold)] hover:text-[var(--cream)] py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleClick(link.href)}
                    className="block text-base font-semibold text-[var(--gold)] hover:text-[var(--cream)] py-2 w-full text-left"
                  >
                    {link.label}
                  </button>
                )
              )}
              {!isAdmin && (
                <div className="pt-3 space-y-2 border-t border-gray-800">
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-base font-bold text-[var(--gold)] hover:text-[var(--cream)] py-2"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                  <button
                    onClick={() => handleClick('#packages')}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--gold)] text-[var(--charcoal)] font-semibold text-sm px-5 py-3 rounded-lg"
                  >
                    <Plane className="h-4 w-4" />
                    Plan Your Trip
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
