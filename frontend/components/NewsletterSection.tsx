'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/newsletter_subscribers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ email, name: name || null }),
        }
      );
      if (!res.ok && res.status !== 409) throw new Error('Subscription failed');
      setSuccess(true);
      setEmail('');
      setName('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-forest-600">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs tracking-[0.2em] uppercase font-medium text-gold-400 mb-4">
            Stay Inspired
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mb-4 leading-tight">
            Travel Inspiration
            <br />
            <em className="text-gold-400">In Your Inbox</em>
          </h2>
          <p className="text-cream-300 mb-10 leading-relaxed">
            Curated stories, hidden gems, and seasonal guides from Amsterdam and Paris — delivered
            thoughtfully, never spammy.
          </p>

          {success ? (
            <div className="flex items-center justify-center gap-3 bg-forest-700/50 border border-forest-500 rounded-xl px-8 py-6">
              <CheckCircle className="w-6 h-6 text-gold-400" />
              <div className="text-left">
                <p className="text-cream-100 font-medium">You&apos;re in!</p>
                <p className="text-cream-400 text-sm">Look out for our next edition in your inbox.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-forest-700/50 border border-forest-500 text-cream-100 placeholder:text-cream-500 text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-forest-700/50 border border-forest-500 text-cream-100 placeholder:text-cream-500 text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold shrink-0 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}

          <p className="mt-4 text-xs text-cream-500">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
