import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, BadgeCheck, Quote } from 'lucide-react';
import { reviews } from '../data/siteData';

export default function GuestReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    if (isAnimating) return;
    const clamped = ((index % reviews.length) + reviews.length) % reviews.length;
    setDirection(dir);
    setActiveIndex(clamped);
  }, [isAnimating]);

  const next = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(next, 5000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [next]);

  const pauseAutoPlay = () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  const resumeAutoPlay = () => { autoPlayRef.current = setInterval(next, 5000); };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const review = reviews[activeIndex];

  return (
    <section className="py-24 bg-[var(--charcoal)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-3">
            Traveler Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--cream)] mb-4">
            Guest Reviews
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hear from travelers who experienced Europe with us.
          </p>
        </motion.div>

        {/* Main carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          {/* Big quote icon */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-[var(--gold)]/10 p-4">
              <Quote className="h-8 w-8 text-[var(--gold)]" />
            </div>
          </div>

          {/* Review card */}
          <div className="relative min-h-[260px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={review.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                className="text-center px-4"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? 'fill-[var(--gold)] text-[var(--gold)]'
                          : 'text-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xl text-gray-200 leading-relaxed italic font-light mb-8">
                  "{review.content}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--gold)]"
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--cream)]">{review.name}</span>
                      {review.verified && (
                        <BadgeCheck className="h-4 w-4 text-[var(--gold)]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Traveled to <span className="text-[var(--gold)]">{review.destination}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-[var(--cream)]/10 border border-[var(--cream)]/20 p-3 text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)] hover:border-[var(--gold)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-6 top-1/2 -translate-y-1/2 rounded-full bg-[var(--cream)]/10 border border-[var(--cream)]/20 p-3 text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)] hover:border-[var(--gold)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 h-2.5 bg-[var(--gold)]'
                  : 'w-2.5 h-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { city: 'Amsterdam', rating: 4.9, reviews: '12,500+' },
            { city: 'Paris', rating: 4.8, reviews: '18,700+' },
            { city: 'Venice', rating: 4.8, reviews: '11,200+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl bg-[var(--cream)]/5 p-6 text-center border border-[var(--cream)]/10 hover:border-[var(--gold)]/30 transition-colors"
            >
              <h4 className="font-serif text-lg font-bold text-[var(--cream)]">{stat.city}</h4>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]" />
                <span className="text-2xl font-bold text-[var(--gold)]">{stat.rating}</span>
                <span className="text-sm text-gray-400">/5</span>
              </div>
              <p className="mt-1 text-sm text-gray-400">{stat.reviews} Reviews</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
