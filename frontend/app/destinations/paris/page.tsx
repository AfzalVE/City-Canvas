import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Star, Utensils, Palette, Music, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Paris',
  description:
    'Experience Paris beyond the Eiffel Tower. Curated slow travel through Montmartre, Le Marais, and the hidden gardens of the City of Light.',
};

const highlights = [
  { icon: Palette, title: 'World-Class Art', desc: 'Louvre, Orsay, Pompidou' },
  { icon: Utensils, title: 'Culinary Excellence', desc: 'Bistros, boulangeries & markets' },
  { icon: Music, title: 'Cultural Life', desc: 'Jazz clubs, cabarets & opera' },
  { icon: BookOpen, title: 'Literary History', desc: 'Shakespeare & Co, cafés des arts' },
];

const experiences = [
  {
    title: 'Montmartre at Dawn',
    duration: '3 hours',
    rating: '5.0',
    image: 'https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Walking Tour',
    description: 'Experience the artistic quarter before the crowds arrive, with coffee and croissant at a local boulangerie.',
  },
  {
    title: 'Le Marais Art & Falafel',
    duration: '4 hours',
    rating: '4.9',
    image: 'https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Food & Art',
    description: 'Wander through gallery-filled streets, discover the Jewish Quarter, and eat the best falafel in the city.',
  },
  {
    title: 'Hidden Gardens of Paris',
    duration: '5 hours',
    rating: '4.8',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Nature & Culture',
    description: 'Secret courtyards, private gardens, and the Luxembourg — a Paris known only to locals.',
  },
  {
    title: 'Seine at Sunset',
    duration: '2 hours',
    rating: '4.9',
    image: 'https://images.pexels.com/photos/1851481/pexels-photo-1851481.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Scenic',
    description: 'A private evening cruise on the Seine with champagne and local charcuterie.',
  },
];

export default function ParisPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-end">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
              alt="Paris"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />
          </div>
          <div className="relative container-custom pb-16">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">France, Europe</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mb-4">Paris</h1>
            <p className="text-cream-300 text-lg max-w-xl leading-relaxed">
              Beyond the postcard landmarks lies a city of intimate neighbourhoods, unparalleled cuisine, and timeless elegance.
            </p>
          </div>
        </section>

        {/* Quick Info */}
        <section className="bg-forest-800 py-5">
          <div className="container-custom flex flex-wrap items-center gap-6 text-sm text-cream-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">Best time:</strong> Apr–Jun, Sep–Nov</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">Duration:</strong> 5–8 days recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">34 curated experiences</strong></span>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-cream-100">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
                    alt="Montmartre"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    alt="Le Marais"
                    className="w-full rounded-xl shadow-md"
                  />
                  <img
                    src="https://images.pexels.com/photos/1851481/pexels-photo-1851481.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    alt="Seine"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="section-subtitle">About Paris</span>
                <h2 className="section-title mt-3 mb-4">The City of Light</h2>
                <div className="gold-divider mb-6" />
                <p className="prose-travel">
                  Paris is many cities within one. There&apos;s the grand Paris of Haussmann boulevards
                  and couture houses. But there&apos;s also the village Paris of tiny squares, corner boulangeries,
                  and conversations that last for hours over a single café crème.
                </p>
                <p className="prose-travel">
                  Our Paris experiences lead you into the city&apos;s quieter chapters: dawn in Montmartre,
                  Sunday at the Marché d&apos;Aligre, an afternoon in the Palais-Royal gardens. Travel that
                  leaves you feeling like a Parisian, not a tourist.
                </p>

                <div className="grid grid-cols-2 gap-5 mt-8">
                  {highlights.map((h) => (
                    <div key={h.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-forest-100 rounded-lg flex items-center justify-center shrink-0">
                        <h.icon className="w-4 h-4 text-forest-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-forest-800">{h.title}</div>
                        <div className="text-xs text-forest-500 mt-0.5">{h.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experiences */}
        <section className="py-20 bg-cream-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="section-subtitle">What We Offer</span>
              <h2 className="section-title mt-3">Paris Experiences</h2>
              <div className="gold-divider mx-auto mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiences.map((exp) => (
                <div key={exp.title} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md card-hover group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="tag bg-forest-600/90 text-cream-100 backdrop-blur-sm text-xs">{exp.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <Star className="w-3 h-3 text-gold-500 fill-current" />
                      <span className="text-xs font-semibold text-forest-800">{exp.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-forest-400 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800 mb-2 leading-snug">{exp.title}</h3>
                    <p className="text-xs text-forest-500 leading-relaxed">{exp.description}</p>
                    <button className="mt-3 text-xs text-forest-600 font-medium hover:text-forest-800 flex items-center gap-1">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/contact" className="btn-primary">
                Plan Your Paris Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
