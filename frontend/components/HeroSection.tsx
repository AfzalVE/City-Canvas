'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Amsterdam Canal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/50 via-forest-900/30 to-forest-900/70" />
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="gold-divider" />
            <span className="section-subtitle text-gold-400">Amsterdam &amp; Paris</span>
            <div className="gold-divider" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream-100 leading-tight mb-6">
            Travel Slowly.{' '}
            <em className="text-gold-400 not-italic">Live Deeply.</em>
          </h1>

          <p className="text-base md:text-lg text-cream-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Discover curated cultural experiences in the world&apos;s most enchanting European cities.
            We help you see beyond the guidebook, into the soul of each place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/destinations" className="btn-gold text-sm">
              Explore Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/blog" className="btn-ghost text-sm">
              Read Our Stories
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '2', label: 'Cities' },
              { value: '50+', label: 'Experiences' },
              { value: '1000+', label: 'Happy Travellers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl md:text-3xl text-gold-400 font-semibold">{stat.value}</div>
                <div className="text-xs text-cream-400 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-400">
        <span className="text-xs uppercase tracking-widest">Discover</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>

      {/* City badges */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col gap-3">
        {[
          {
            city: 'Amsterdam',
            img: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop',
            href: '/destinations/amsterdam',
          },
          {
            city: 'Paris',
            img: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=100&h=60&fit=crop',
            href: '/destinations/paris',
          },
        ].map((item) => (
          <Link
            key={item.city}
            href={item.href}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors group"
          >
            <img src={item.img} alt={item.city} className="w-10 h-7 object-cover rounded" />
            <div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-400" />
                <span className="text-xs font-medium text-cream-100">{item.city}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
