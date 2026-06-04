'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const slides = [
  {
    title: 'Blank Slide 1',
    description: 'Placeholder content for the first slide.',
  },
  {
    title: 'Blank Slide 2',
    description: 'Placeholder content for the second slide.',
  },
];

export default function ImageSliderSection() {
  return (
    <section className="relative py-16 bg-forest-950">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-gold-400 mb-3">Gallery</p>
          <h2 className="text-3xl md:text-4xl font-serif text-cream-100">
            Visual Preview
          </h2>
          <p className="text-base text-cream-300 mt-4">
            Swipe through the sample slides to see the landing page presentation.
          </p>
        </div>

        <Carousel opts={{ loop: true }} className="relative">
          <CarouselContent className="gap-6">
            {slides.map((slide) => (
              <CarouselItem key={slide.title}>
                <div className="h-[320px] rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 flex flex-col items-center justify-center text-center text-cream-100 shadow-xl shadow-black/20">
                  <div className="mb-4 w-full max-w-[220px] h-[180px] rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <span className="text-sm uppercase tracking-[0.3em] text-cream-300">
                      Image Placeholder
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-cream-100 mb-2">{slide.title}</h3>
                  <p className="text-sm text-cream-300 max-w-xl">{slide.description}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
