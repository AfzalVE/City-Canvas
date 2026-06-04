import Link from 'next/link';
import { Leaf, Instagram, Linkedin, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-cream-200">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-9 h-9 bg-gold-500 rounded-sm flex items-center justify-center">
                <Leaf className="w-5 h-5 text-forest-900" />
              </div>
              <span className="font-serif text-xl font-semibold text-cream-100">Neem Travels</span>
            </Link>
            <p className="text-sm text-cream-400 leading-relaxed mb-6">
              Curating slow travel experiences in Amsterdam and Paris for those who seek depth over distance.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-forest-800 hover:bg-gold-500 rounded-sm flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-cream-300 group-hover:text-forest-900" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-forest-800 hover:bg-gold-500 rounded-sm flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-cream-300 group-hover:text-forest-900" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-forest-800 hover:bg-gold-500 rounded-sm flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-cream-300 group-hover:text-forest-900" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-serif text-cream-100 text-base mb-5">Destinations</h4>
            <ul className="space-y-3">
              {[
                { label: 'Amsterdam', href: '/destinations/amsterdam' },
                { label: 'Paris', href: '/destinations/paris' },
                { label: 'All Destinations', href: '/destinations' },
                { label: 'Experiences', href: '/experiences' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-400 hover:text-gold-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-cream-100 text-base mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'Our Story', href: '/about' },
                { label: 'Travel Blog', href: '/blog' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream-400 hover:text-gold-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-cream-100 text-base mb-5">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-cream-400">Prinsengracht 263, Amsterdam, Netherlands</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:hello@neemtravels.com" className="text-sm text-cream-400 hover:text-gold-400 transition-colors">
                  hello@neemtravels.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+31201234567" className="text-sm text-cream-400 hover:text-gold-400 transition-colors">
                  +31 20 123 4567
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-cream-400 mb-3 uppercase tracking-wider">Travel Inspiration</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-forest-800 border border-forest-700 text-cream-200 placeholder:text-cream-600 text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm font-medium px-4 py-2 rounded-sm transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-600">
            &copy; {year} Neem Travels. All rights reserved.
          </p>
          <p className="text-xs text-cream-600">
            Crafted with care for slow travellers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
