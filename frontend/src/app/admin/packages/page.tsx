import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Save,
  X,
  Star,
  Check,
  Luggage,
} from 'lucide-react';
import { TravelPackage } from '../../../types';
import { travelPackages } from '../../../data/siteData';

export default function HolidayPackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<TravelPackage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('');
  const [startingPrice, setStartingPrice] = useState(1000);
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(120);
  const [category, setCategory] = useState('Luxury Packages');
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  // Load Packages
  useEffect(() => {
    const local = localStorage.getItem('vh_custom_packages');
    if (local) {
      try {
        setPackages(JSON.parse(local));
      } catch (e) {
        console.error(e);
        setPackages([]);
      }
    } else {
      // Initialize with default travelPackages if empty
      localStorage.setItem('vh_custom_packages', JSON.stringify(travelPackages));
      setPackages(travelPackages);
    }
  }, []);

  const saveToStorage = (updatedList: TravelPackage[]) => {
    localStorage.setItem('vh_custom_packages', JSON.stringify(updatedList));
    setPackages(updatedList);
  };

  const openAddModal = () => {
    setEditingPkg(null);
    setName('');
    setImage('https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=800');
    setDuration('5 Days / 4 Nights');
    setStartingPrice(1500);
    setRating(4.9);
    setReviews(100);
    setCategory('Luxury Packages');
    setHighlightInput('');
    setHighlights(['Luxury Hotel Stay', 'Private Guided Tour', 'Gourmet Dining Pass']);
    setShowModal(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setImage(pkg.image);
    setDuration(pkg.duration);
    setStartingPrice(pkg.startingPrice);
    setRating(pkg.rating);
    setReviews(pkg.reviews);
    setCategory(pkg.category);
    setHighlightInput('');
    setHighlights(pkg.highlights);
    setShowModal(true);
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, idx) => idx !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image || !duration) return;

    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
              name,
              image,
              duration,
              startingPrice,
              rating,
              reviews,
              category,
              highlights,
            }
          : p
      );
      saveToStorage(updated);
    } else {
      const newPkg: TravelPackage = {
        id: `custom-${Date.now()}`,
        name,
        image,
        duration,
        startingPrice,
        rating,
        reviews,
        category,
        highlights,
      };
      saveToStorage([newPkg, ...packages]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this holiday package?')) {
      const updated = packages.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1 text-xs font-semibold text-forest-700 shadow-sm">
            <Luggage className="h-3.5 w-3.5 text-[var(--gold)]" /> Platform Management
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-800">Holiday Packages</h1>
          <p className="mt-1 text-sm text-forest-500">Create, edit, and delete travel packages showing up on search results</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-forest-800 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      {/* Package Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-48 bg-gray-100">
              <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
              <div className="absolute top-3 right-3 rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--charcoal)]">
                {pkg.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[var(--gold)] uppercase">{pkg.duration}</span>
                <h3 className="text-base font-bold text-forest-900 mt-1 leading-snug line-clamp-2">{pkg.name}</h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                  <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  <span className="font-medium text-gray-700">{pkg.rating}</span>
                  <span>({pkg.reviews} reviews)</span>
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                  {pkg.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <Check className="h-3 w-3 text-[var(--forest-green)]" />
                      <span className="truncate">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400">Starting Price</span>
                  <p className="text-base font-extrabold text-[var(--forest-green)]">${pkg.startingPrice}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-forest-900">
                  {editingPkg ? 'Edit Holiday Package' : 'Create Holiday Package'}
                </h2>
                <button onClick={() => setShowModal(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 overflow-y-auto scrollbar-hide space-y-4" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Package Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Premium Romance in Paris"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white outline-none focus:border-forest-500"
                    >
                      <option value="Luxury Packages">Luxury Packages</option>
                      <option value="Family Tours">Family Tours</option>
                      <option value="Romantic Getaways">Romantic Getaways</option>
                      <option value="Cultural Tours">Cultural Tours</option>
                      <option value="Food Tours">Food Tours</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 5 Days / 4 Nights"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Starting Price ($)</label>
                    <input
                      required
                      type="number"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Rating (0-5)</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                  />
                </div>

                {/* Highlights List Management */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Highlights / Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add highlight (e.g. Private wine tasting)"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {highlights.map((h, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full"
                      >
                        {h}
                        <button type="button" onClick={() => handleRemoveHighlight(index)} className="text-red-500 hover:text-red-700">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800 shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    Save Package Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
