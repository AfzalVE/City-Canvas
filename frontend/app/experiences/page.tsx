import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Star, MapPin, Users, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Experiences',
  description: 'Curated slow travel experiences in Amsterdam and Paris. Walking tours, food markets, museum visits, and more.',
};

const experiences = [
  { id: '1', title: 'Jordaan Neighbourhood Walk', city: 'Amsterdam', category: 'Walking Tour', duration: '3 hours', rating: '4.9', guests: '2-8', image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Explore hidden hofjes, local art galleries, and the best cheese shops in the city.', price: '€65' },
  { id: '2', title: 'Canal Boat Sunrise', city: 'Amsterdam', category: 'Scenic', duration: '2 hours', rating: '5.0', guests: '2-6', image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'See Amsterdam awaken on an intimate morning canal boat with fresh stroopwafel and coffee.', price: '€95' },
  { id: '3', title: 'Dutch Food Market Tour', city: 'Amsterdam', category: 'Food & Drink', duration: '4 hours', rating: '4.9', guests: '2-10', image: 'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Visit Albert Cuyp market, taste local produce, and cook a Dutch lunch with a chef.', price: '€85' },
  { id: '4', title: 'Museum Quarter Deep Dive', city: 'Amsterdam', category: 'Cultural', duration: 'Full day', rating: '4.8', guests: '2-6', image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Private-access tours of the Rijksmuseum and Van Gogh Museum with a local art historian.', price: '€149' },
  { id: '5', title: 'Montmartre at Dawn', city: 'Paris', category: 'Walking Tour', duration: '3 hours', rating: '5.0', guests: '2-8', image: 'https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Experience the artistic quarter before the crowds arrive, with coffee at a local boulangerie.', price: '€70' },
  { id: '6', title: 'Le Marais Art & Falafel', city: 'Paris', category: 'Food & Art', duration: '4 hours', rating: '4.9', guests: '2-8', image: 'https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Gallery-filled streets, the Jewish Quarter, and the best falafel in the city.', price: '€75' },
  { id: '7', title: 'Hidden Gardens of Paris', city: 'Paris', category: 'Nature & Culture', duration: '5 hours', rating: '4.8', guests: '2-6', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'Secret courtyards, private gardens, and the Luxembourg — a Paris known only to locals.', price: '€80' },
  { id: '8', title: 'Seine at Sunset', city: 'Paris', category: 'Scenic', duration: '2 hours', rating: '4.9', guests: '2-6', image: 'https://images.pexels.com/photos/1851481/pexels-photo-1851481.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop', description: 'A private evening cruise on the Seine with champagne and local charcuterie.', price: '€115' },
];

export default function ExperiencesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative pt-32 pb-16 bg-forest-900">
          <div className="absolute inset-0 opacity-10 bg-hero-pattern" />
          <div className="relative container-custom text-center">
            <span className="section-subtitle text-gold-400">What We Offer</span>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mt-3 mb-4">Curated Experiences</h1>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
            <p className="mt-6 text-cream-400 max-w-lg mx-auto">
              Every experience is designed for small groups, guided by local experts, and crafted to reveal the soul of each city.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-20 z-20 bg-cream-100 border-b border-cream-300 py-4">
          <div className="container-custom flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-forest-600 font-medium">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            {['All', 'Amsterdam', 'Paris', 'Walking Tour', 'Food & Drink', 'Cultural', 'Scenic'].map((f) => (
              <button
                key={f}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  f === 'All' ? 'bg-forest-600 text-cream-100' : 'bg-white text-forest-600 border border-cream-300 hover:border-forest-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="py-16 bg-cream-50">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg card-hover group border border-cream-200">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`tag text-xs ${exp.city === 'Amsterdam' ? 'bg-blue-600/90 text-white' : 'bg-rose-600/90 text-white'} backdrop-blur-sm`}>
                        {exp.city}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-gold-500 fill-current" />
                      <span className="text-xs font-semibold text-forest-800">{exp.rating}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-forest-900/80 text-cream-100 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {exp.price} / person
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="tag-forest text-xs mb-2 inline-block">{exp.category}</span>
                    <h3 className="font-serif text-base text-forest-800 mb-2 leading-snug">{exp.title}</h3>
                    <p className="text-xs text-forest-500 leading-relaxed mb-4">{exp.description}</p>

                    <div className="flex items-center gap-4 text-xs text-forest-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{exp.guests}</span>
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="block w-full text-center btn-primary text-xs justify-center"
                    >
                      Book This Experience
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
