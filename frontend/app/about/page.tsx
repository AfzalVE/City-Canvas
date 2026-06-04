import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSection from '@/components/NewsletterSection';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, Leaf, Globe, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Virtual Holidays was born from a love of slow, meaningful travel in Amsterdam and Paris. Meet our team and learn our philosophy.',
};

const team = [
  {
    name: 'Emma van der Berg',
    role: 'Founder & Amsterdam Expert',
    bio: 'Born and raised in Amsterdam, Emma has spent 15 years guiding travellers through the city\'s most intimate corners. She cycles 40km a week and knows every hofje by name.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&crop=face',
  },
  {
    name: 'Pierre Beaumont',
    role: 'Co-Founder & Paris Curator',
    bio: 'A Parisian by birth and a wanderer by nature, Pierre left a career in architecture to share his city with travellers who want to see it the way locals do.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&crop=face',
  },
  {
    name: 'Sophie Chen',
    role: 'Content & Community',
    bio: 'Sophie writes the words that bring our destinations to life. She speaks four languages and has eaten in more bistros than she can count.',
    image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&crop=face',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Depth Over Distance',
    desc: 'We believe two weeks in one city is more enriching than two weeks in five. Slow down. Stay longer. Go deeper.',
  },
  {
    icon: Leaf,
    title: 'Sustainable by Nature',
    desc: 'We champion local businesses, minimal-impact travel, and experiences that give back to the communities we visit.',
  },
  {
    icon: Globe,
    title: 'Locally Rooted',
    desc: 'Our team lives in the cities we curate. We don\'t outsource our expertise — we live it, breathe it, and share it.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'We connect travellers with genuine local culture, not tourist simulations. Our partners are neighbours, not vendors.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-forest-900">
          <div className="absolute inset-0 opacity-10 bg-hero-pattern" />
          <div className="relative container-custom">
            <div className="max-w-2xl">
              <span className="section-subtitle text-gold-400">Our Story</span>
              <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mt-3 mb-4 leading-tight">
                Travel as it was
                <br />
                <em className="text-gold-400">meant to be.</em>
              </h1>
              <div className="w-16 h-0.5 bg-gold-500 mb-6" />
              <p className="text-cream-400 text-lg leading-relaxed">
                Virtual Holidays was founded on one conviction: that meaningful travel requires time, intention,
                and local guidance — not rushed itineraries and over-booked attractions.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-cream-100">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <span className="section-subtitle">Our Beginning</span>
                <h2 className="section-title mt-3 mb-4">Born from a Love of Place</h2>
                <div className="gold-divider mb-6" />
                <p className="prose-travel mb-4">
                  In 2019, Emma van der Berg — Amsterdam native and lifelong advocate for her city — began taking
                  small groups of travellers on what she called &ldquo;neighbourhood days&rdquo;: unhurried walks through
                  the Jordaan, long lunches at brown cafés, evenings at jazz venues the guidebooks don&apos;t mention.
                </p>
                <p className="prose-travel mb-4">
                  The response was overwhelming. &ldquo;People kept saying they finally felt like they understood the city,&rdquo;
                  she recalls. &ldquo;Not just seen it — understood it.&rdquo;
                </p>
                <p className="prose-travel">
                  Pierre Beaumont joined from Paris in 2021, bringing the same philosophy to the French capital.
                  Together, they built Virtual Holidays into the platform it is today: a deeply curated, community-rooted
                  guide to slow travel in two of Europe&apos;s greatest cities.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop"
                  alt="Amsterdam"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-forest-600 text-cream-100 rounded-xl p-6 shadow-xl max-w-xs">
                  <div className="font-serif text-2xl text-gold-400 font-bold mb-1">2019</div>
                  <div className="text-sm text-cream-300">The year Virtual Holidays took its first guests through the Jordaan.</div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <span className="section-subtitle">What We Stand For</span>
                <h2 className="section-title mt-3">Our Values</h2>
                <div className="gold-divider mx-auto mt-4" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((v) => (
                  <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                    <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <v.icon className="w-5 h-5 text-forest-600" />
                    </div>
                    <h3 className="font-serif text-lg text-forest-800 mb-2">{v.title}</h3>
                    <p className="text-sm text-forest-500 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <div className="text-center mb-12">
                <span className="section-subtitle">The People Behind Neem</span>
                <h2 className="section-title mt-3">Meet Our Team</h2>
                <div className="gold-divider mx-auto mt-4" />
              </div>
              <div className="grid sm:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div key={member.name} className="text-center group">
                    <div className="relative w-40 h-40 mx-auto mb-5 overflow-hidden rounded-full shadow-md">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-xl text-forest-800 mb-1">{member.name}</h3>
                    <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-3">{member.role}</p>
                    <p className="text-sm text-forest-500 leading-relaxed max-w-xs mx-auto">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-800">
          <div className="container-custom text-center">
            <h2 className="font-serif text-4xl text-cream-100 mb-4">Ready to Travel Slowly?</h2>
            <p className="text-cream-400 mb-8 max-w-md mx-auto">
              Tell us where you want to go, and we&apos;ll design an experience that stays with you for years.
            </p>
            <Link href="/contact" className="btn-gold">
              Start Planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
