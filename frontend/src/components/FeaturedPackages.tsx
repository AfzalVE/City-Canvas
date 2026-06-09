import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
} from 'lucide-react';
import { travelPackages, packageCategories } from '../data/siteData';

export default function FeaturedPackages() {
  const [activeCategory, setActiveCategory] = useState('Luxury Packages');
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryPackages = travelPackages.filter(
    (p) => p.category === activeCategory
  );

  const filtered =
    categoryPackages.length > 0
      ? Array.from({ length: 3 }, (_, index) => ({
          ...categoryPackages[index % categoryPackages.length],
          id: `${categoryPackages[index % categoryPackages.length].id}-${index}`,
        }))
      : [];

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 bg-[var(--charcoal)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--cream)] mb-4">
            Featured Travel Packages
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Curated experiences designed for discerning travelers.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {packageCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[var(--gold)] text-[var(--charcoal)] shadow-lg'
                  : 'border border-gray-600 text-gray-300 hover:border-[var(--gold)] hover:text-[var(--gold)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--cream)] p-3 shadow-lg text-[var(--forest-green)] transition-all hover:bg-[var(--gold)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--cream)] p-3 shadow-lg text-[var(--forest-green)] transition-all hover:bg-[var(--gold)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            <AnimatePresence mode="wait">
              {filtered.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="min-w-full md:min-w-[48%] lg:min-w-[31.5%] flex-shrink-0 group"
                >
                  <div className="card-hover rounded-2xl overflow-hidden bg-[var(--cream)] border border-gray-800">
                    <div className="image-zoom relative h-60 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />

                      <div className="absolute top-4 right-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-[var(--charcoal)]">
                        {pkg.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-[var(--charcoal)]">
                        {pkg.name}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--warm-gray)]">
                        {pkg.duration}
                      </p>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                          <span className="text-sm font-medium">
                            {pkg.rating}
                          </span>
                        </div>

                        <span className="text-sm text-[var(--warm-gray)]">
                          {pkg.reviews} reviews
                        </span>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {pkg.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-center gap-2 text-sm text-[var(--warm-gray)]"
                          >
                            <Check className="h-3.5 w-3.5 text-[var(--forest-green)]" />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[var(--warm-gray)]">
                            From
                          </span>

                          <p className="text-xl font-bold text-[var(--forest-green)]">
                            ${pkg.startingPrice}
                          </p>
                        </div>

                        <button className="flex items-center gap-2 rounded-lg bg-[var(--forest-green)] px-6 py-2.5 text-sm font-medium text-[var(--cream)] transition-all hover:bg-[var(--forest-green-light)]">
                          Book Now
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}