import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, PartyPopper } from 'lucide-react';

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 bg-[var(--forest-green)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-[var(--gold)]" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-[var(--gold)]" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--cream)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="mx-auto h-12 w-12 text-[var(--gold)] mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--cream)] mb-4">
            Get Travel Inspiration
          </h2>
          <p className="text-lg text-[var(--cream)]/80 mb-10">
            Subscribe for exclusive deals, destination guides, and travel tips delivered to your inbox.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 sm:flex-row sm:gap-3"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 rounded-xl bg-[var(--cream)]/10 border border-[var(--cream)]/20 px-5 py-4 text-[var(--cream)] placeholder:text-[var(--cream)]/50 outline-none transition-all focus:bg-[var(--cream)]/20 focus:border-[var(--gold)]"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl bg-[var(--cream)]/10 border border-[var(--cream)]/20 px-5 py-4 text-[var(--cream)] placeholder:text-[var(--cream)]/50 outline-none transition-all focus:bg-[var(--cream)]/20 focus:border-[var(--gold)]"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-8 py-4 font-medium text-[var(--charcoal)] transition-all hover:bg-[var(--gold-light)] hover:shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="rounded-2xl bg-[var(--cream)]/10 border border-[var(--gold)]/30 p-8"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gold)]">
                  <PartyPopper className="h-8 w-8 text-[var(--charcoal)]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--cream)]">
                  Thank You For Subscribing!
                </h3>
                <p className="mt-2 text-[var(--cream)]/80">
                  Welcome to the Virtual Holidays family, {name}! Check your inbox for a special welcome gift.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{
                        opacity: [1, 0],
                        y: [0, -80 - Math.random() * 60],
                        x: [0, (Math.random() - 0.5) * 100],
                        rotate: [0, Math.random() * 720],
                      }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: ['#c9a84c', '#e0c56e', '#faf8f5', '#2d6a4f'][i % 4],
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
