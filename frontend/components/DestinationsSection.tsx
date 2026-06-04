import Link from 'next/link';
import { ArrowRight, Clock, Users } from 'lucide-react';

const destinations = [
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    tagline: 'Canals, Culture & Tulip Gardens',
    description:
      'Pedal through golden-age canal rings, linger in world-class museums, and discover the warm heart of Dutch culture.',
    image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    href: '/destinations/amsterdam',
    badge: 'Most Popular',
    duration: '4–7 days',
    experiences: '28 curated',
    highlights: ['Rijksmuseum', 'Jordaan Quarter', 'Keukenhof', 'Vondelpark'],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tagline: 'Art, Romance & Haute Cuisine',
    description:
      'Wander through Montmartre&apos;s artistic streets, savour bistro lunches, and let the City of Light unfold at your own pace.',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    href: '/destinations/paris',
    badge: 'Featured',
    duration: '5–8 days',
    experiences: '34 curated',
    highlights: ['Le Marais', 'Musée d\'Orsay', 'Montmartre', 'Luxembourg Gardens'],
  },
];

export default function DestinationsSection() {
  return (
    <section className="py-24 bg-cream-100">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-subtitle">Where We Take You</span>
          <h2 className="section-title mt-3 mb-4">Our Destinations</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-forest-600 max-w-xl mx-auto leading-relaxed">
            We don&apos;t chase bucket lists. We curate deeply meaningful experiences in two of Europe&apos;s most culturally rich cities.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {destinations.map((dest) => (
            <Link key={dest.id} href={dest.href} className="group block">
              <div className="relative overflow-hidden rounded-xl shadow-lg card-hover bg-white">
                {/* Image */}
                <div className="relative h-72 lg:h-80 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 overlay-gradient" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="tag bg-gold-500/90 text-forest-900 text-xs font-semibold backdrop-blur-sm">
                      {dest.badge}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-cream-200 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{dest.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gold-400" />
                      <span>{dest.experiences}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gold-600 font-medium uppercase tracking-widest mb-1">{dest.country}</p>
                      <h3 className="font-serif text-2xl text-forest-800">{dest.name}</h3>
                      <p className="text-sm text-forest-500 italic mt-0.5">{dest.tagline}</p>
                    </div>
                    <div className="w-10 h-10 bg-forest-50 group-hover:bg-forest-600 rounded-full flex items-center justify-center transition-colors ml-4 shrink-0">
                      <ArrowRight className="w-4 h-4 text-forest-600 group-hover:text-cream-100 transition-colors" />
                    </div>
                  </div>

                  <p className="text-sm text-forest-600 leading-relaxed mb-4">{dest.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {dest.highlights.map((h) => (
                      <span key={h} className="tag-forest text-xs">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/destinations" className="btn-secondary text-sm">
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
