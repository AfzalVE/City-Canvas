'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Leaf } from 'lucide-react';

const navLinks = [
  {
    label: 'Destinations',
    href: '/destinations',
    children: [
      { label: 'Amsterdam', href: '/destinations/amsterdam', desc: 'Canals, culture & tulips' },
      { label: 'Paris', href: '/destinations/paris', desc: 'Art, cuisine & romance' },
    ],
  },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream-50/98 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-forest-600 rounded-sm flex items-center justify-center group-hover:bg-forest-700 transition-colors">
              <Leaf className="w-5 h-5 text-cream-100" />
            </div>
            <div>
              <span
                className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-forest-800' : 'text-cream-100'
                }`}
              >
                Neem Travels
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-sm text-sm font-medium font-sans tracking-wide transition-colors duration-300 ${
                    scrolled
                      ? 'text-forest-700 hover:text-forest-900 hover:bg-forest-50'
                      : 'text-cream-100/90 hover:text-cream-100 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-cream-200 overflow-hidden">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-3 hover:bg-cream-50 transition-colors group"
                      >
                        <div className="text-sm font-medium text-forest-800 group-hover:text-forest-600">
                          {child.label}
                        </div>
                        <div className="text-xs text-forest-500 mt-0.5">{child.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin"
              className={`text-sm font-medium font-sans tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-forest-600 hover:text-forest-800' : 'text-cream-200 hover:text-cream-100'
              }`}
            >
              Admin
            </Link>
            <Link href="/contact" className="btn-gold text-xs">
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-sm transition-colors ${
              scrolled ? 'text-forest-700 hover:bg-forest-50' : 'text-cream-100 hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-cream-200 shadow-lg">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-forest-700 hover:bg-cream-50 hover:text-forest-900 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-forest-500 hover:text-forest-700 hover:bg-cream-50 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-cream-200 flex flex-col gap-2">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="btn-secondary justify-center text-xs">
                Admin Dashboard
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="btn-gold justify-center text-xs">
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
