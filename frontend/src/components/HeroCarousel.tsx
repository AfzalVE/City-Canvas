import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { heroSlides } from '../data/siteData';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const slide = heroSlides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      zIndex: 1,
    }),
    center: {
      x: 0,
      zIndex: 2,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      zIndex: 1,
    }),
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* Optional subtle overlay for readability */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/20 px-4 py-1.5 backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--gold)]">
                  {slide.location}
                </span>
              </div>

              <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
                {slide.title}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-white md:text-xl">
                {slide.subtitle}
              </p>

              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  <span className="text-sm font-medium text-white">
                    {slide.rating}
                  </span>
                  <span className="text-sm text-white/80">
                    rating
                  </span>
                </div>

                <div className="h-3 w-px bg-white/40" />

                <span className="text-sm text-white/80">
                  {slide.reviews} reviews
                </span>

                <div className="h-3 w-px bg-white/40" />

                <span className="text-sm font-medium text-[var(--gold)]">
                  From ${slide.price}
                </span>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="btn-primary px-8 py-3.5 text-base shadow-lg transition-all hover:shadow-xl">
                  {slide.primaryCta}
                </button>

                <button className="rounded-lg border-2 border-white/70 px-8 py-3.5 font-medium text-white transition-all duration-300 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--charcoal)]">
                  {slide.secondaryCta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-[var(--gold)] backdrop-blur-sm transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-[var(--gold)] backdrop-blur-sm transition-all hover:bg-[var(--gold)] hover:text-[var(--charcoal)]"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
        <div className="flex gap-3">
          {heroSlides.map((slideItem, i) => (
            <button
              key={slideItem.id}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-[var(--gold)]'
                  : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-medium tracking-widest text-white">
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(heroSlides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}