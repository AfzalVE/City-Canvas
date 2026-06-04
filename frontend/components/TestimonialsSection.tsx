import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah & James Thornton',
    location: 'London, UK',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Neem Travels completely changed how we experience travel. Our week in Amsterdam was unlike anything we\'ve done before — intimate, unhurried, and full of moments we couldn\'t have found on our own.',
    destination: 'Amsterdam',
  },
  {
    id: 2,
    name: 'Marie Dubois',
    location: 'Montreal, Canada',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I\'ve been to Paris three times, but this was the first time I truly felt I understood the city. The recommendations for neighbourhood cafés, the museum tips, the hidden bookshops — magnifique!',
    destination: 'Paris',
  },
  {
    id: 3,
    name: 'Hiroshi & Yuki Tanaka',
    location: 'Tokyo, Japan',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'We came for the art museums and stayed for the lifestyle. Neem\'s curated itinerary introduced us to the rhythm of Amsterdam in a way that made us feel like locals by day three.',
    destination: 'Amsterdam',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-cream-200/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-forest-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />

      <div className="relative container-custom">
        <div className="text-center mb-16">
          <span className="section-subtitle">Traveller Stories</span>
          <h2 className="section-title mt-3">What Our Guests Say</h2>
          <div className="gold-divider mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-forest-100" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-500 fill-current" />
                ))}
              </div>

              <p className="text-sm text-forest-600 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>

              <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-forest-800">{t.name}</div>
                  <div className="text-xs text-forest-500">{t.location}</div>
                </div>
                <span className="ml-auto tag-forest text-xs">{t.destination}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
