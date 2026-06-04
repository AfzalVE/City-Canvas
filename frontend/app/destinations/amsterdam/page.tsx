import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Star, Bike, Coffee, Palette, Music } from 'lucide-react';
import NewsletterSection from '@/components/NewsletterSection';

export const metadata: Metadata = {
  title: 'Amsterdam',
  description:
    'Discover Amsterdam through curated slow travel experiences. Canal walks, world-class museums, Dutch culture, and authentic local life — all at your own pace.',
};

const highlights = [
  {
    icon: Palette,
    title: 'Museums & Art',
    desc: 'Rijksmuseum, Van Gogh, Stedelijk',
  },
  {
    icon: Bike,
    title: 'Canal Cycling',
    desc: '400km of scenic cycling paths',
  },
  {
    icon: Coffee,
    title: 'Café Culture',
    desc: 'Brown cafés & artisan roasters',
  },
  {
    icon: Music,
    title: 'Live Events',
    desc: 'Concerts, markets & festivals',
  },
];

const experiences = [
  {
    title: 'Jordaan Neighbourhood Walk',
    duration: '3 hours',
    rating: '4.9',
    image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Walking Tour',
    description: 'Explore hidden hofjes, local art galleries, and the best cheese shops in the city.',
  },
  {
    title: 'Museum Quarter Deep Dive',
    duration: 'Full day',
    rating: '4.8',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Cultural',
    description: 'Private access to curated collections at the Rijksmuseum and Van Gogh Museum.',
  },
  {
    title: 'Canal Boat Sunrise',
    duration: '2 hours',
    rating: '5.0',
    image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Scenic',
    description: 'See Amsterdam awaken on an intimate morning canal boat with fresh stroopwafel.',
  },
  {
    title: 'Dutch Food Market Tour',
    duration: '4 hours',
    rating: '4.9',
    image: 'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Food & Drink',
    description: 'Visit Albert Cuyp market, taste local produce, and cook a Dutch lunch with a local chef.',
  },
];

export default function AmsterdamPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-end">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
              alt="Amsterdam"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />
          </div>
          <div className="relative container-custom pb-16">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Netherlands, Europe</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mb-4">Amsterdam</h1>
            <p className="text-cream-300 text-lg max-w-xl leading-relaxed">
              Canals, culture, and a city that rewards the curious traveller willing to slow down and wander.
            </p>
          </div>
        </section>

        {/* Quick Info */}
        <section className="bg-forest-800 py-5">
          <div className="container-custom flex flex-wrap items-center gap-6 text-sm text-cream-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">Best time:</strong> Apr–May, Sep–Oct</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">Duration:</strong> 4–7 days recommended</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span><strong className="text-cream-100">28 curated experiences</strong></span>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-cream-100">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="section-subtitle">About Amsterdam</span>
                <h2 className="section-title mt-3 mb-4">The City of Canals</h2>
                <div className="gold-divider mb-6" />
                <p className="prose-travel">
                  Amsterdam is a city that reveals itself slowly. Its famous canal ring — a UNESCO World Heritage site — is just
                  the beginning. Behind the iconic facades lie centuries of artistic legacy, vibrant neighbourhood culture,
                  and a people known for their warmth and directness.
                </p>
                <p className="prose-travel">
                  Our Amsterdam experiences take you off the main tourist routes, into the Jordaan&apos;s hidden hofjes,
                  through the quiet streets of De Pijp, and into the city&apos;s thriving creative and culinary scene.
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop"
                    alt="Jordaan"
                    className="w-full rounded-xl shadow-md"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    alt="Museum"
                    className="w-full rounded-xl shadow-md"
                  />
                  <img
                    src="https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    alt="Market"
                    className="w-full rounded-xl shadow-md"
                  />
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
              <h2 className="section-title mt-3">Amsterdam Experiences</h2>
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
                Plan Your Amsterdam Trip
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
