import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { destinations } from '../data/siteData';

export default function ExploreDestinations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const goToPackages = () => {
    const packagesSection = document.getElementById('packages');
    packagesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Explore Destinations</h2>
          <p className="section-subtitle">
            Discover Europe's most iconic cities and unforgettable experiences.
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--cream)] p-3 shadow-lg border border-[var(--gold)]/20 text-[var(--forest-green)] transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--cream)] p-3 shadow-lg border border-[var(--gold)]/20 text-[var(--forest-green)] transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="min-w-[340px] flex-shrink-0 group"
              >
                <div className="card-hover rounded-2xl overflow-hidden bg-[var(--cream)] border border-gray-100 shadow-lg">
                  <div className="image-zoom relative h-56">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-[var(--charcoal)]">
                      {dest.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--warm-gray)] line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                        <span className="text-sm font-medium">{dest.rating}</span>
                      </div>
                      <span className="text-sm text-[var(--warm-gray)]">
                        {dest.reviews.toLocaleString()} reviews
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[var(--warm-gray)]">From</span>
                        <p className="text-lg font-bold text-[var(--forest-green)]">
                          ${dest.startingPrice}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={goToPackages}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--gold)] transition-all hover:gap-2"
                      >
                        Explore <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
