import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Wallet, Compass } from 'lucide-react';

export default function DestinationSearch() {
  const [destination, setDestination] = useState('');
  const [attraction, setAttraction] = useState('');
  const [travelType, setTravelType] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    console.log({ destination, attraction, travelType, travelDate, budget });
  };

  return (
    <section className="relative z-20 -mt-20 mx-auto max-w-6xl px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-[var(--cream)] p-8 shadow-2xl border border-[var(--gold)]/20"
      >
        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--warm-gray)]">
              <MapPin className="h-4 w-4 text-[var(--gold)]" />
              Destination
            </label>
            <input
              type="text"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--warm-gray)]">
              <Compass className="h-4 w-4 text-[var(--gold)]" />
              Attraction
            </label>
            <input
              type="text"
              placeholder="What to see?"
              value={attraction}
              onChange={(e) => setAttraction(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--warm-gray)]">
              <Users className="h-4 w-4 text-[var(--gold)]" />
              Travel Type
            </label>
            <select
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            >
              <option value="">Select type</option>
              <option value="luxury">Luxury</option>
              <option value="family">Family</option>
              <option value="romantic">Romantic</option>
              <option value="adventure">Adventure</option>
              <option value="solo">Solo</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--warm-gray)]">
              <Calendar className="h-4 w-4 text-[var(--gold)]" />
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--warm-gray)]">
              <Wallet className="h-4 w-4 text-[var(--gold)]" />
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[var(--cream)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20"
            >
              <option value="">Select budget</option>
              <option value="budget">$500 - $1,000</option>
              <option value="mid">$1,000 - $2,500</option>
              <option value="luxury">$2,500 - $5,000</option>
              <option value="ultra">$5,000+</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleSearch}
            className="btn-primary flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Trips
          </button>
          <button className="rounded-lg border-2 border-[var(--forest-green)] px-8 py-3 font-medium text-[var(--forest-green)] transition-all hover:bg-[var(--forest-green)] hover:text-[var(--cream)]">
            Build Custom Package
          </button>
        </div>
      </motion.div>
    </section>
  );
}
