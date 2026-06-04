import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore our curated destinations in Amsterdam and Paris. Slow travel experiences designed for curious, discerning travellers.',
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative pt-32 pb-16 bg-forest-900">
          <div className="absolute inset-0 opacity-10 bg-hero-pattern" />
          <div className="relative container-custom text-center">
            <span className="section-subtitle text-gold-400">Where We Go</span>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mt-3 mb-4">Our Destinations</h1>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
            <p className="mt-6 text-cream-400 max-w-xl mx-auto">
              We focus deeply on two of Europe&apos;s most culturally rich cities, rather than spreading thin across the continent.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-20 bg-cream-100">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  name: 'Amsterdam',
                  country: 'Netherlands',
                  image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
                  tagline: 'Canals, Culture & Tulip Gardens',
                  desc: 'A city of golden-age heritage, world-class museums, and neighbourhoods that reward the wanderer.',
                  href: '/destinations/amsterdam',
                  experiences: '28 experiences',
                },
                {
                  name: 'Paris',
                  country: 'France',
                  image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
                  tagline: 'Art, Romance & Haute Cuisine',
                  desc: 'A city that reveals itself slowly — through art, bistros, and streets that tell centuries of stories.',
                  href: '/destinations/paris',
                  experiences: '34 experiences',
                },
              ].map((dest) => (
                <Link key={dest.name} href={dest.href} className="group block">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg card-hover">
                    <div className="relative h-96 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 overlay-gradient" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-xs text-gold-400 font-medium uppercase tracking-widest mb-1">{dest.country}</p>
                        <h2 className="font-serif text-3xl text-cream-100 mb-1">{dest.name}</h2>
                        <p className="text-sm text-cream-300 italic mb-3">{dest.tagline}</p>
                        <p className="text-xs text-cream-400 mb-4 max-w-sm">{dest.desc}</p>
                        <div className="flex items-center gap-3">
                          <span className="tag bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs">
                            {dest.experiences}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-cream-300 group-hover:text-gold-400 transition-colors">
                            Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Coming Soon */}
            <div className="mt-16 text-center">
              <h3 className="font-serif text-2xl text-forest-700 mb-3">More Coming Soon</h3>
              <p className="text-forest-500 mb-6 text-sm">
                We&apos;re carefully curating experiences in Copenhagen, Lisbon, and Florence.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Copenhagen', 'Lisbon', 'Florence', 'Prague'].map((city) => (
                  <span key={city} className="tag bg-cream-200 text-forest-500 text-sm">
                    {city} — Coming Soon
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
