import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, PinIcon, ArrowRight, Plane } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 font-serif text-2xl font-bold text-[var(--gold)]">
              <Plane className="h-6 w-6 text-[var(--gold)]" />
              Virtual Holidays
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting unforgettable European experiences since 2010. 
              Your journey to the extraordinary begins here.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-full bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2.5 text-gray-400 transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]">
                <PinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[var(--cream)] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Services', 'Travel Blog', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[var(--gold)] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[var(--cream)] mb-6">Destinations</h4>
            <ul className="space-y-3">
              {['Amsterdam', 'Paris', 'Rome', 'Venice', 'Switzerland', 'Barcelona'].map((dest) => (
                <li key={dest}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[var(--gold)] transition-colors">
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[var(--cream)] mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--gold)] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Canal Street, Amsterdam, Netherlands
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--gold)] flex-shrink-0" />
                <span className="text-sm text-gray-400">+31 20 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--gold)] flex-shrink-0" />
                <span className="text-sm text-gray-400">hello@virtualholidays.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="text-sm font-medium text-[var(--cream)] mb-3">Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-[var(--cream)] placeholder:text-gray-500 outline-none focus:border-[var(--gold)]"
                />
                <button className="rounded-lg bg-[var(--gold)] px-4 py-2.5 text-[var(--charcoal)] transition-all hover:bg-[var(--gold-light)]">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Virtual Holidays. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[var(--gold)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
