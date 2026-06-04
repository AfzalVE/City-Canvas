import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Blog Post — ${params.slug.replace(/-/g, ' ')}`,
    description: 'Read this travel story from Neem Travels.',
  };
}

const samplePost = {
  title: 'The Hidden Courtyards of Amsterdam\'s Jordaan District',
  excerpt: 'Tucked behind the narrow canal houses of Jordaan lie some of Amsterdam\'s best-kept secrets — tranquil hofjes that have been here for centuries.',
  content: `
<p>There is a particular kind of magic that lives behind the ordinary-looking doors of Amsterdam's Jordaan. On a street lined with 17th-century canal houses, you might pass a wooden gate set into a white-washed wall without giving it a second thought. But push it open — if you know to look — and you find yourself transported.</p>

<p>These are the hofjes: private almshouses and their enclosed garden courts that have provided quiet refuge to the city's residents since the Dutch Golden Age. Today, more than 40 still exist in Amsterdam, and visiting them feels like stepping into a secret chapter of the city's story.</p>

<h2>The Begijnhof</h2>

<p>The most famous is the Begijnhof, a hidden courtyard just off the Spui that has been home to a community of Catholic women since the 14th century. Two timber-framed houses — among the oldest in Amsterdam — still stand here, and the English Reformed Church at its heart dates to 1419. On a weekday morning, when tour groups have not yet arrived, it is breathtakingly quiet for somewhere so central.</p>

<p>But it is the lesser-known hofjes of the Jordaan that I find most captivating. The Suyckerhofje on Lindengracht, established in 1670 by a sugar merchant; the Raepenhofje on Palmgracht, with its whitewashed walls and resident cats; the Claes Claeszhofje near the Anne Frank House, its garden fragrant with lavender in summer.</p>

<h2>How to Find Them</h2>

<p>The hofjes are not always open to visitors, and many are private residences. The key is respect and timing. Early mornings on weekdays offer the best chance of quiet admission. Look for gates rather than doors; most hofjes have a modest plaque or sign identifying them. And always, always enter quietly — these are places of genuine community life, not tourist attractions.</p>

<blockquote>The hofjes remind you that Amsterdam has always been a city of small communities within the larger city. Each hofje is its own world — its own social contract, its own gardening standards, its own unwritten rules.</blockquote>

<p>I spent an entire afternoon moving between six of the Jordaan's hofjes last September. In each one, I found the same quality: a profound stillness at odds with the city just meters away. Pigeons cooed. Geraniums blazed in window boxes. Somewhere, a radio played softly.</p>

<h2>Practical Information</h2>

<p>The Jordaan hofjes are typically open to visitors during daylight hours, though many close to the public after 5pm or on weekends. The Begijnhof is the most reliably accessible. For the others, it is worth consulting a current map of open hofjes — the Amsterdam Museum maintains a useful guide, and several local walking tour companies offer hofje-focused routes.</p>

<p>Wear quiet shoes. Speak softly. And remember: you are a guest in someone's home.</p>
  `,
  category: 'Culture',
  city: 'Amsterdam',
  date: 'May 28, 2026',
  readTime: '6 min read',
  author: 'Emma van der Berg',
  authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
  image: 'https://images.pexels.com/photos/2563351/pexels-photo-2563351.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
  tags: ['Amsterdam', 'Jordaan', 'Hidden Gems', 'Culture', 'Walking'],
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[400px] flex items-end">
          <div className="absolute inset-0">
            <img
              src={samplePost.image}
              alt={samplePost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />
          </div>
          <div className="relative container-custom pb-12 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="tag bg-gold-500 text-forest-900 text-xs">{samplePost.city}</span>
              <span className="tag bg-forest-600/80 text-cream-100 text-xs">{samplePost.category}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-cream-100 leading-tight">
              {samplePost.title}
            </h1>
          </div>
        </section>

        {/* Meta */}
        <section className="bg-cream-100 border-b border-cream-300">
          <div className="container-custom max-w-4xl py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={samplePost.authorAvatar}
                  alt={samplePost.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-forest-800">{samplePost.author}</div>
                  <div className="flex items-center gap-3 text-xs text-forest-500 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{samplePost.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{samplePost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/blog" className="flex items-center gap-1 text-sm text-forest-500 hover:text-forest-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to journal
              </Link>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream-50">
          <div className="container-custom max-w-3xl">
            <p className="font-serif text-xl text-forest-600 italic mb-10 leading-relaxed">
              {samplePost.excerpt}
            </p>

            <div
              className="prose-travel"
              dangerouslySetInnerHTML={{ __html: samplePost.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-cream-300">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-forest-500" />
                {samplePost.tags.map((tag) => (
                  <span key={tag} className="tag-forest text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
