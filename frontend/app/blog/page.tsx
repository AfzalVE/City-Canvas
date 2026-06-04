import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'Stories, guides, and inspiration from Amsterdam and Paris. Curated travel writing for the slow traveller.',
};

const posts = [
  {
    id: '1',
    title: 'The Hidden Courtyards of Amsterdam\'s Jordaan District',
    excerpt: 'Tucked behind the narrow canal houses of Jordaan lie some of Amsterdam\'s best-kept secrets — tranquil hofjes that have been here for centuries.',
    category: 'Culture',
    city: 'Amsterdam',
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'hidden-courtyards-amsterdam-jordaan',
    featured: true,
  },
  {
    id: '2',
    title: 'A Morning in Le Marais: Paris\'s Most Vibrant Quarter',
    excerpt: 'Start your Paris morning in Le Marais — fresh croissants at an art deco café, a stroll through the Place des Vosges, then a gallery hop through cutting-edge contemporary art.',
    category: 'Food & Culture',
    city: 'Paris',
    date: 'May 20, 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'morning-in-le-marais-paris',
    featured: false,
  },
  {
    id: '3',
    title: 'Amsterdam\'s Museum Scene Beyond the Rijksmuseum',
    excerpt: 'The Rijksmuseum is magnificent, but Amsterdam\'s smaller, more intimate museums offer experiences that rival any blockbuster exhibition.',
    category: 'Art & Museums',
    city: 'Amsterdam',
    date: 'May 14, 2026',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'amsterdam-museums-beyond-rijksmuseum',
    featured: false,
  },
  {
    id: '4',
    title: 'The Art of the Slow Lunch in Paris',
    excerpt: 'In Paris, lunch is not a meal — it is a ritual. Here is how to find the perfect neighbourhood bistro and make an afternoon of it.',
    category: 'Food',
    city: 'Paris',
    date: 'May 8, 2026',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'art-of-slow-lunch-paris',
    featured: false,
  },
  {
    id: '5',
    title: 'Cycling the Amsterdam Canals at Golden Hour',
    excerpt: 'There is no better way to feel the spirit of Amsterdam than cycling along the canal ring as the light turns amber and the city glows.',
    category: 'Experience',
    city: 'Amsterdam',
    date: 'April 30, 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'cycling-amsterdam-canals-golden-hour',
    featured: false,
  },
  {
    id: '6',
    title: 'Montmartre After Dark: Jazz, Wine & Art',
    excerpt: 'When the tour buses leave and the evening softens, Montmartre becomes the place it was always meant to be — intimate, creative, alive.',
    category: 'Nightlife',
    city: 'Paris',
    date: 'April 22, 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/3073666/pexels-photo-3073666.jpeg?auto=compress&cs=tinysrgb&w=700&h=450&fit=crop',
    slug: 'montmartre-after-dark-jazz-wine-art',
    featured: false,
  },
];

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative pt-32 pb-16 bg-forest-900">
          <div className="absolute inset-0 opacity-10 bg-hero-pattern" />
          <div className="relative container-custom text-center">
            <span className="section-subtitle text-gold-400">Our Journal</span>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mt-3 mb-4">Travel Stories</h1>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
            <p className="mt-6 text-cream-400 max-w-lg mx-auto">
              Curated articles, guides, and personal essays from our travels in Amsterdam and Paris.
            </p>
          </div>
        </section>

        <section className="py-20 bg-cream-50">
          <div className="container-custom">
            {/* Featured Post */}
            {featured && (
              <div className="mb-14">
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg card-hover bg-white">
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="tag bg-gold-500 text-forest-900 text-xs font-semibold">Featured</span>
                        <span className="tag bg-forest-600/90 text-cream-100 backdrop-blur-sm text-xs">{featured.city}</span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs text-forest-400 mb-4">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{featured.date}</span>
                        <span className="text-forest-300">·</span>
                        <span>{featured.readTime}</span>
                        <span className="text-forest-300">·</span>
                        <span className="tag-forest text-xs">{featured.category}</span>
                      </div>
                      <h2 className="font-serif text-3xl text-forest-800 group-hover:text-forest-600 transition-colors mb-4 leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-forest-500 leading-relaxed mb-6">{featured.excerpt}</p>
                      <div className="flex items-center gap-1 text-forest-600 text-sm font-medium">
                        <span>Read the story</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-10">
              {['All', 'Amsterdam', 'Paris', 'Culture', 'Food', 'Art'].map((filter) => (
                <button
                  key={filter}
                  className={`tag text-xs px-4 py-1.5 border transition-colors ${
                    filter === 'All'
                      ? 'bg-forest-600 text-cream-100 border-forest-600'
                      : 'bg-white text-forest-600 border-forest-200 hover:border-forest-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 card-hover h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="tag bg-forest-600/90 text-cream-100 backdrop-blur-sm text-xs">{post.city}</span>
                        <span className="tag bg-white/90 text-forest-700 backdrop-blur-sm text-xs">{post.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-forest-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <span className="text-forest-300">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg text-forest-800 group-hover:text-forest-600 transition-colors leading-snug mb-3 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-forest-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-forest-600 text-xs font-medium">
                        <span>Read more</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
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
