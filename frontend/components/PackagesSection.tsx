'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Star, Users, Check, Sparkles, Plane, Hotel, Camera } from 'lucide-react';

const packages = {
  paris: [
    {
      id: 'paris-romantic',
      name: 'Paris Romance Escape',
      tagline: 'Art, Love & Haute Cuisine',
      duration: '5 nights',
      groupSize: '2 people',
      price: '€2,490',
      priceNote: 'per person',
      rating: '4.9',
      reviews: 142,
      badge: 'Most Popular',
      badgeColor: 'bg-rose-500',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Louvre private morning tour', 'Seine sunset cruise', 'Michelin bistro dinner', 'Montmartre dawn walk', 'Champagne at Sacré-Cœur'],
      includes: ['4★ boutique hotel in Le Marais', 'Daily breakfast', 'All guided experiences', 'Airport transfers'],
      category: 'Romance',
    },
    {
      id: 'paris-culture',
      name: 'Parisian Cultural Immersion',
      tagline: 'Museums, History & Hidden Gems',
      duration: '7 nights',
      groupSize: 'Up to 8',
      price: '€3,190',
      priceNote: 'per person',
      rating: '4.8',
      reviews: 98,
      badge: 'Featured',
      badgeColor: 'bg-gold-500',
      image: 'https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Musée d\'Orsay expert tour', 'Le Marais art & falafel', 'Luxembourg Gardens picnic', 'Palais Royal stroll', 'Hidden courtyard hunt'],
      includes: ['5★ Haussmann-era hotel', 'Full board', 'Museum fast-track passes', 'Local guide throughout'],
      category: 'Culture',
    },
    {
      id: 'paris-solo',
      name: 'Solo Paris Explorer',
      tagline: 'Freedom with Curated Guidance',
      duration: '4 nights',
      groupSize: '1 person',
      price: '€1,290',
      priceNote: 'per person',
      rating: '5.0',
      reviews: 61,
      badge: 'Solo Friendly',
      badgeColor: 'bg-violet-500',
      image: 'https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Curated self-guided maps', 'Small-group walking tour', 'Café literaire experience', 'Montmartre art studio visit'],
      includes: ['Design boutique hotel', 'Daily breakfast', 'City card (metro + museums)', 'Concierge support 24/7'],
      category: 'Solo',
    },
  ],
  amsterdam: [
    {
      id: 'amsterdam-canals',
      name: 'Golden Age Canal Package',
      tagline: 'Cycles, Canals & Dutch Culture',
      duration: '4 nights',
      groupSize: '2–4 people',
      price: '€1,890',
      priceNote: 'per person',
      rating: '4.9',
      reviews: 176,
      badge: 'Best Seller',
      badgeColor: 'bg-teal-500',
      image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Sunrise canal boat ride', 'Jordaan neighbourhood walk', 'Rijksmuseum private tour', 'Dutch cheese & jenever tasting', 'Bicycle day rental'],
      includes: ['Canal-view boutique hotel', 'Daily Dutch breakfast', 'All guided experiences', 'City cycling map'],
      category: 'Culture',
    },
    {
      id: 'amsterdam-art',
      name: 'Amsterdam Museum Deep Dive',
      tagline: 'Van Gogh, Rembrandt & Beyond',
      duration: '5 nights',
      groupSize: 'Up to 6',
      price: '€2,290',
      priceNote: 'per person',
      rating: '4.8',
      reviews: 89,
      badge: 'Art Lovers',
      badgeColor: 'bg-amber-500',
      image: 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Van Gogh Museum curator tour', 'Stedelijk contemporary art', 'Hidden street art walk', 'Anne Frank House visit', 'Artists\' studio experience'],
      includes: ['Design hotel in Museum Quarter', 'Breakfast + museum day pass', 'Expert art historian guide', 'Exclusive evening opening'],
      category: 'Art',
    },
    {
      id: 'amsterdam-family',
      name: 'Amsterdam Family Adventure',
      tagline: 'Windmills, Tulips & Canals',
      duration: '6 nights',
      groupSize: 'Families',
      price: '€1,490',
      priceNote: 'per person',
      rating: '4.9',
      reviews: 54,
      badge: 'Family Pick',
      badgeColor: 'bg-green-500',
      image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      highlights: ['Keukenhof tulip gardens', 'Zaanse Schans windmills', 'NEMO Science Museum', 'Canal pedal-boat tour', 'Dutch pancake making class'],
      includes: ['Family apartment in Jordaan', 'Daily breakfast basket', 'Family activity pass', 'Kids\' culture guidebook'],
      category: 'Family',
    },
  ],
};

const cityConfig = {
  paris: {
    label: 'Paris',
    flag: '🇫🇷',
    accent: 'from-rose-900/80 to-stone-900/80',
    tagBg: 'bg-rose-50 text-rose-700',
    btnActive: 'bg-rose-700 text-white shadow-lg',
    btnInactive: 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50',
  },
  amsterdam: {
    label: 'Amsterdam',
    flag: '🇳🇱',
    accent: 'from-teal-900/80 to-slate-900/80',
    tagBg: 'bg-teal-50 text-teal-700',
    btnActive: 'bg-teal-700 text-white shadow-lg',
    btnInactive: 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50',
  },
};

export default function PackagesSection() {
  const [activeCity, setActiveCity] = useState<'paris' | 'amsterdam'>('paris');
  const city = cityConfig[activeCity];
  const cityPackages = packages[activeCity];

  return (
    <section className="py-24 bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-subtitle">Curated Journeys</span>
          <h2 className="section-title mt-3 mb-4">Travel Packages</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-forest-600 max-w-xl mx-auto leading-relaxed">
            Each package is thoughtfully assembled — combining the finest stays, experiences, and local wisdom so every moment counts.
          </p>
        </div>

        {/* City Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {(['paris', 'amsterdam'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCity(c)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCity === c ? cityConfig[c].btnActive : cityConfig[c].btnInactive
              }`}
            >
              <span className="text-base">{cityConfig[c].flag}</span>
              {cityConfig[c].label}
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cityPackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                idx === 1 ? 'lg:scale-[1.03] shadow-xl ring-2 ring-gold-400/30' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${city.accent}`} />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`${pkg.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                    {pkg.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-2xl font-serif font-bold text-white">{pkg.price}</div>
                  <div className="text-xs text-white/70">{pkg.priceNote}</div>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  <span className="text-white text-xs font-semibold">{pkg.rating}</span>
                  <span className="text-white/60 text-xs">({pkg.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 text-xs text-forest-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{pkg.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />{pkg.groupSize}
                  </span>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${city.tagBg}`}>
                    {pkg.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-forest-800 leading-snug mb-1">{pkg.name}</h3>
                <p className="text-sm text-gold-600 italic mb-4">{pkg.tagline}</p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-5">
                  {pkg.highlights.slice(0, 4).map((h) => (
                    <div key={h} className="flex items-start gap-2 text-sm text-forest-700">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>

                {/* Includes */}
                <div className="border-t border-cream-200 pt-4 mb-5">
                  <p className="text-xs font-semibold text-forest-500 uppercase tracking-wider mb-2">Includes</p>
                  <div className="space-y-1">
                    {pkg.includes.map((inc) => (
                      <div key={inc} className="flex items-start gap-2 text-xs text-forest-600">
                        <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {inc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto flex gap-3">
                  <Link
                    href={`/destinations/${activeCity}`}
                    className="flex-1 text-center btn-gold text-xs py-2.5 justify-center"
                  >
                    Book This Package
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-forest-500 text-sm mb-4">Need something bespoke? We craft fully custom itineraries.</p>
          <Link href="/contact" className="btn-secondary text-sm">
            Request Custom Package
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
