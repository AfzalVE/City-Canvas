import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, ArrowRight, Calendar, Users, Wallet, Compass, MapPin, X, Sparkles } from 'lucide-react';
import { TravelPackage } from '../types';
import { travelPackages } from '../data/siteData';

export default function SearchHolidaysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<TravelPackage | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    date: '',
    guests: '2',
    requests: '',
  });

  // Filters derived directly from searchParams (single source of truth for initial/back-button values)
  const destinationParam = searchParams.get('destination') || '';
  const attractionParam = searchParams.get('attraction') || '';
  const travelTypeParam = searchParams.get('travelType') || '';
  const budgetParam = searchParams.get('budget') || '';

  // Local state for instant filtering and responsive typing
  const [destInput, setDestInput] = useState(destinationParam);
  const [typeInput, setTypeInput] = useState(travelTypeParam);
  const [budgetInput, setBudgetInput] = useState(budgetParam);

  // Sync inputs with URL changes (e.g. back navigation or initial load)
  useEffect(() => {
    setDestInput(destinationParam);
    setTypeInput(travelTypeParam);
    setBudgetInput(budgetParam);
  }, [destinationParam, travelTypeParam, budgetParam]);

  // Load and filter packages instantly based on local state (to avoid URL query delay)
  useEffect(() => {
    const local = localStorage.getItem('vh_custom_packages');
    let allPkgs = [...travelPackages];
    if (local) {
      try {
        const custom = JSON.parse(local);
        allPkgs = [...custom, ...allPkgs];
      } catch (e) {
        console.error(e);
      }
    }

    // Apply filters based on local input state instantly
    let filtered = allPkgs;
    if (destInput) {
      const query = destInput.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.highlights.some(h => h.toLowerCase().includes(query))
      );
    }
    if (typeInput) {
      const typeQuery = typeInput.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.category.toLowerCase().includes(typeQuery) ||
        p.highlights.some(h => h.toLowerCase().includes(typeQuery))
      );
    }
    if (budgetInput) {
      // Simple price logic
      filtered = filtered.filter(p => {
        if (budgetInput === 'budget') return p.startingPrice <= 1200;
        if (budgetInput === 'mid') return p.startingPrice > 1200 && p.startingPrice <= 2500;
        if (budgetInput === 'luxury') return p.startingPrice > 2500 && p.startingPrice <= 5000;
        return p.startingPrice > 5000;
      });
    }

    setPackages(filtered);
  }, [destInput, typeInput, budgetInput]);

  // Debounce updating URL query parameters so typing is perfectly smooth
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (destInput) params.set('destination', destInput);
      if (attractionParam) params.set('attraction', attractionParam);
      if (typeInput) params.set('travelType', typeInput);
      if (budgetInput) params.set('budget', budgetInput);
      setSearchParams(params, { replace: true });
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [destInput, typeInput, budgetInput, setSearchParams]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedPkg(null);
      setBookingForm({ name: '', email: '', date: '', guests: '2', requests: '' });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[var(--cream)] pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--charcoal)] mb-4">
            Search Holidays & Packages
          </h1>
          <p className="text-[var(--warm-gray)] text-lg max-w-3xl">
            Explore curated packages matching your criteria. Modify the filters below to refine your matching destinations.
          </p>
        </div>

        {/* Search/Filter Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            if (destInput) params.set('destination', destInput);
            if (attractionParam) params.set('attraction', attractionParam);
            if (typeInput) params.set('travelType', typeInput);
            if (budgetInput) params.set('budget', budgetInput);
            setSearchParams(params);
          }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-[var(--gold)]/10 mb-12"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--warm-gray)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Where to? (e.g. Paris, Amsterdam)"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--warm-gray)]">
                <Users className="h-3.5 w-3.5 text-[var(--gold)]" />
                Travel Type
              </label>
              <select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)]"
              >
                <option value="">All Categories</option>
                <option value="luxury">Luxury Packages</option>
                <option value="family">Family Tours</option>
                <option value="romantic">Romantic Getaways</option>
                <option value="cultural">Cultural Tours</option>
                <option value="food">Food Tours</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--warm-gray)]">
                <Wallet className="h-3.5 w-3.5 text-[var(--gold)]" />
                Budget range
              </label>
              <select
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)]"
              >
                <option value="">All budgets</option>
                <option value="budget">Budget (Under $1,200)</option>
                <option value="mid">Mid-range ($1,200 - $2,500)</option>
                <option value="luxury">Luxury ($2,500 - $5,000)</option>
                <option value="ultra">Ultra ($5,000+)</option>
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="flex-1 bg-[var(--forest-green)] hover:bg-[var(--forest-green-light)] text-[var(--cream)] font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestInput('');
                  setTypeInput('');
                  setBudgetInput('');
                  setSearchParams(new URLSearchParams());
                }}
                className="bg-gray-500 hover:bg-gray-600 text-[var(--cream)] font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* Results grid */}
        {packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <Compass className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="font-serif text-2xl text-[var(--charcoal)] mb-2">No matching packages found</h3>
            <p className="text-[var(--warm-gray)] text-sm max-w-md mx-auto mb-6">
              Try adjusting your filters or destination keywords. Alternatively, explore all our available experiences below.
            </p>
            <button
              type="button"
              onClick={() => {
                setDestInput('');
                setTypeInput('');
                setBudgetInput('');
                setSearchParams(new URLSearchParams());
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <motion.div
                key={`${pkg.id}-${idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-[var(--charcoal)]">
                    {pkg.category}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-semibold text-[var(--gold)] tracking-widest uppercase">{pkg.duration}</span>
                  <h3 className="font-serif text-xl font-bold text-[var(--charcoal)] mt-1">
                    {pkg.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-xs text-[var(--warm-gray)]">({pkg.reviews} reviews)</span>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                    {pkg.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-[var(--warm-gray)]">
                        <Check className="h-3.5 w-3.5 text-[var(--forest-green)] shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--warm-gray)]">From</span>
                      <p className="text-xl font-bold text-[var(--forest-green)]">${pkg.startingPrice}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPkg(pkg)}
                      className="flex items-center gap-2 rounded-lg bg-[var(--forest-green)] hover:bg-[var(--forest-green-light)] px-5 py-2.5 text-sm font-semibold text-[var(--cream)] transition-all shadow-md"
                    >
                      Book Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking and Details Modal */}
      <AnimatePresence>
        {selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              {/* Left Column: Image and Details */}
              <div className="w-full md:w-1/2 relative bg-gray-100 flex flex-col">
                <img
                  src={selectedPkg.image}
                  alt={selectedPkg.name}
                  className="h-64 md:h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-[var(--charcoal)] inline-block mb-2">
                    {selectedPkg.category}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                    {selectedPkg.name}
                  </h2>
                  <p className="mt-1 text-sm opacity-90">{selectedPkg.duration}</p>
                </div>
              </div>

              {/* Right Column: Details & Booking Form */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto scrollbar-hide flex flex-col justify-between" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[var(--forest-green)] font-bold text-xl">${selectedPkg.startingPrice}</span>
                    <span className="text-xs text-[var(--warm-gray)] ml-1">per guest</span>
                  </div>
                  <button
                    onClick={() => setSelectedPkg(null)}
                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {bookingSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="h-16 w-16 bg-[var(--forest-green)] text-[var(--cream)] rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--forest-green)] mb-2">Booking Confirmed!</h3>
                    <p className="text-sm text-[var(--warm-gray)]">
                      Your premium itinerary builder is locked in. We've sent a reservation link to <span className="font-semibold">{bookingForm.email}</span>. Enjoy your stay!
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--charcoal)] uppercase tracking-wider mb-3">Package Highlights</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {selectedPkg.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 text-xs text-[var(--warm-gray)]">
                            <Check className="h-3.5 w-3.5 text-[var(--forest-green)] shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <form onSubmit={handleBookSubmit} className="space-y-4 border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-bold text-[var(--charcoal)] uppercase tracking-wider mb-2">Secure Your Spot</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[var(--warm-gray)] uppercase">Full Name</label>
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[var(--gold)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[var(--warm-gray)] uppercase">Email</label>
                          <input
                            required
                            type="email"
                            placeholder="your@email.com"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[var(--gold)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[var(--warm-gray)] uppercase">Preferred Date</label>
                          <input
                            required
                            type="date"
                            value={bookingForm.date}
                            onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[var(--gold)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[var(--warm-gray)] uppercase">Guests</label>
                          <select
                            value={bookingForm.guests}
                            onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs bg-white outline-none focus:border-[var(--gold)]"
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4+">4+ Guests</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--warm-gray)] uppercase">Special Requests (Optional)</label>
                        <textarea
                          placeholder="Dietary requests, accessibility needs, room upgrades..."
                          rows={2}
                          value={bookingForm.requests}
                          onChange={(e) => setBookingForm({ ...bookingForm, requests: e.target.value })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[var(--gold)] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[var(--forest-green)] hover:bg-[var(--forest-green-light)] text-[var(--cream)] font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Complete Booking Confirmation
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
