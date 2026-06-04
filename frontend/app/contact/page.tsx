'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    destination: '',
    travel_dates: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative pt-32 pb-16 bg-forest-900">
          <div className="absolute inset-0 opacity-10 bg-hero-pattern" />
          <div className="relative container-custom text-center">
            <span className="section-subtitle text-gold-400">Get in Touch</span>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-100 mt-3 mb-4">Plan Your Journey</h1>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
            <p className="mt-6 text-cream-400 max-w-lg mx-auto">
              Tell us about your dream Amsterdam or Paris trip, and our local experts will craft the perfect itinerary.
            </p>
          </div>
        </section>

        <section className="py-20 bg-cream-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl text-forest-800 mb-6">How to Reach Us</h2>
                  {[
                    {
                      icon: MapPin,
                      label: 'Amsterdam Office',
                      value: 'Prinsengracht 263\nAmsterdam, Netherlands',
                    },
                    {
                      icon: MapPin,
                      label: 'Paris Office',
                      value: 'Rue de Bretagne 42\nParis, France',
                    },
                    {
                      icon: Mail,
                      label: 'Email',
                      value: 'hello@neemtravels.com',
                    },
                    {
                      icon: Phone,
                      label: 'Phone',
                      value: '+31 20 123 4567',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 mb-5">
                      <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-forest-600" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-forest-500 uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-sm text-forest-700 whitespace-pre-line">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-forest-900 rounded-2xl p-6 text-cream-100">
                  <h3 className="font-serif text-lg mb-2 text-cream-100">Response Time</h3>
                  <p className="text-sm text-cream-400">
                    We reply to all enquiries within 24 hours, Monday–Friday. For urgent requests, call us directly.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {success ? (
                  <div className="h-full flex items-center justify-center bg-white rounded-2xl shadow-sm p-12">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
                      <h3 className="font-serif text-2xl text-forest-800 mb-2">Message Sent!</h3>
                      <p className="text-forest-500">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="font-serif text-2xl text-forest-800 mb-6">Tell Us About Your Trip</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Emma Thompson"
                            className="w-full border border-cream-300 rounded-lg px-4 py-3 text-sm text-forest-800 placeholder:text-forest-400 focus:outline-none focus:border-forest-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="emma@example.com"
                            className="w-full border border-cream-300 rounded-lg px-4 py-3 text-sm text-forest-800 placeholder:text-forest-400 focus:outline-none focus:border-forest-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
                            Destination
                          </label>
                          <select
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            className="w-full border border-cream-300 rounded-lg px-4 py-3 text-sm text-forest-800 focus:outline-none focus:border-forest-400 transition-colors bg-white"
                          >
                            <option value="">Select a destination</option>
                            <option value="amsterdam">Amsterdam</option>
                            <option value="paris">Paris</option>
                            <option value="both">Both Cities</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
                            Travel Dates
                          </label>
                          <input
                            type="text"
                            name="travel_dates"
                            value={form.travel_dates}
                            onChange={handleChange}
                            placeholder="e.g. September 2026"
                            className="w-full border border-cream-300 rounded-lg px-4 py-3 text-sm text-forest-800 placeholder:text-forest-400 focus:outline-none focus:border-forest-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
                          Tell Us More
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="What are you hoping to experience? Any special interests, dietary requirements, or travel style preferences?"
                          className="w-full border border-cream-300 rounded-lg px-4 py-3 text-sm text-forest-800 placeholder:text-forest-400 focus:outline-none focus:border-forest-400 transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Enquiry
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
