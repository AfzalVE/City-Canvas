import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

const posts = [
  {
    id: '1',
    title: 'The Hidden Courtyards of Amsterdam\'s Jordaan District',
    excerpt:
      'Tucked behind the narrow canal houses of Jordaan lie some of Amsterdam\'s best-kept secrets — tranquil hofjes that have been here for centuries.',
    category: 'Culture',
    city: 'Amsterdam',
    date: 'May 28, 2026',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    slug: 'hidden-courtyards-amsterdam-jordaan',
  },
  {
    id: '2',
    title: 'A Morning in Le Marais: Paris\'s Most Vibrant Quarter',
    excerpt:
      'Start your Paris morning in Le Marais — fresh croissants at an art deco café, a stroll through the Place des Vosges, then a gallery hop through cutting-edge contemporary art.',
    category: 'Food & Culture',
    city: 'Paris',
    date: 'May 20, 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/2659269/pexels-photo-2659269.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    slug: 'morning-in-le-marais-paris',
  },
  {
    id: '3',
    title: 'Amsterdam\'s Museum Scene Beyond the Rijksmuseum',
    excerpt:
      'The Rijksmuseum is magnificent, but Amsterdam\'s smaller, more intimate museums offer experiences that rival any blockbuster exhibition.',
    category: 'Art & Museums',
    city: 'Amsterdam',
    date: 'May 14, 2026',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    slug: 'amsterdam-museums-beyond-rijksmuseum',
  },
];

export default function BlogSection() {
  return (
    <section className="py-24 bg-cream-50">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="section-subtitle">Travel Stories</span>
            <h2 className="section-title mt-3">From Our Journal</h2>
            <div className="gold-divider mt-4" />
          </div>
          <Link href="/blog" className="btn-secondary text-xs shrink-0">
            All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`group block ${index === 0 ? 'md:col-span-1' : ''}`}
            >
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 card-hover h-full flex flex-col">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="tag bg-forest-600/90 text-cream-100 backdrop-blur-sm text-xs">
                      {post.city}
                    </span>
                    <span className="tag bg-white/90 text-forest-700 backdrop-blur-sm text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
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
  );
}
