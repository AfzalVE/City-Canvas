import { Compass, Heart, Leaf, Star, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Curated Itineraries',
    description: 'Every experience is handpicked by our local experts who live and breathe Amsterdam and Paris.',
  },
  {
    icon: Heart,
    title: 'Slow Travel Philosophy',
    description: 'We believe in depth over breadth — savouring each neighbourhood, each meal, each moment.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Tourism',
    description: 'We partner only with local, sustainable businesses that respect their communities and environment.',
  },
  {
    icon: Star,
    title: 'Hidden Gems',
    description: 'Skip the tourist traps. We reveal the places where locals actually eat, gather, and celebrate.',
  },
  {
    icon: Clock,
    title: 'Flexible Pacing',
    description: 'No rigid schedules. Our experiences adapt to your rhythm, whether you\'re a morning person or night owl.',
  },
  {
    icon: Shield,
    title: 'Trusted Locally',
    description: 'Our network of vetted local partners ensures every experience is safe, authentic, and memorable.',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-forest-900 text-cream-100">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="section-subtitle text-gold-400">Why Virtual Holidays</span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mt-3 mb-4 leading-tight">
              Travel That Leaves
              <br />
              <em className="text-gold-400">An Impression</em>
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mb-6" />
            <p className="text-cream-400 leading-relaxed mb-8 text-base">
              We founded Virtual Holidays on a simple belief: the best journeys aren&apos;t measured in
              distance, but in depth. We curate experiences that connect you to the living culture,
              history, and people of Amsterdam and Paris.
            </p>
            <p className="text-cream-400 leading-relaxed text-base">
              Our team of passionate locals and travel experts craft each experience with the care of
              a trusted friend who happens to know every hidden courtyard, every award-winning baker,
              and every sunset spot that guidebooks miss.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                { value: '4.9', label: 'Average Rating', sub: 'from 500+ reviews' },
                { value: '95%', label: 'Return Visitors', sub: 'come back for more' },
              ].map((s) => (
                <div key={s.label} className="bg-forest-800/60 rounded-xl p-5 border border-forest-700">
                  <div className="font-serif text-3xl text-gold-400 font-bold">{s.value}</div>
                  <div className="text-sm font-medium text-cream-200 mt-1">{s.label}</div>
                  <div className="text-xs text-cream-500 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-forest-800/40 hover:bg-forest-800/70 border border-forest-700 hover:border-gold-600/30 rounded-xl p-5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gold-500/10 group-hover:bg-gold-500/20 rounded-lg flex items-center justify-center mb-4 transition-colors">
                  <feature.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-serif text-base text-cream-100 mb-2">{feature.title}</h3>
                <p className="text-xs text-cream-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
