'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Twitter,
  XCircle,
} from 'lucide-react';
import { GeneratedContent, approveContent, fetchContent, rejectContent, schedulePublish } from '../../../lib/admin-api';

type PreviewItem = GeneratedContent & {
  title: string;
  preview: string;
  image: string;
  seoTitle?: string;
  metaDescription?: string;
};

const platformMeta: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; badge: string }> = {
  blog: { label: 'Blog Post', icon: FileText, badge: 'bg-forest-50 text-forest-700 border-forest-200' },
  facebook: { label: 'Facebook Post', icon: Send, badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  instagram: { label: 'Instagram Caption', icon: Instagram, badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  linkedin: { label: 'LinkedIn Post', icon: Linkedin, badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  twitter: { label: 'X / Twitter Post', icon: Twitter, badge: 'bg-gray-50 text-gray-700 border-gray-200' },
  newsletter: { label: 'Facebook Post', icon: Send, badge: 'bg-blue-50 text-blue-700 border-blue-200' },
};

const sampleGenerated: PreviewItem[] = [
  {
    id: 7101,
    feed_id: 1,
    platform: 'blog',
    headline: 'Hidden Canals of Amsterdam: A Luxury Slow Travel Guide',
    title: 'Hidden Canals of Amsterdam: A Luxury Slow Travel Guide',
    preview: 'A polished long-form blog post for travellers who want quiet canals, boutique stays and local cultural moments.',
    content: 'Amsterdam rewards travellers who move slowly. Beyond the crowded postcards, the city opens into peaceful canal corners, elegant bridges, independent galleries and waterside cafés that feel designed for lingering. This blog post introduces a refined 2-day route through the Jordaan, the Grachtengordel and lesser-known canal streets with suggested photo stops, boutique hotel notes and premium guided experiences.',
    hashtags: '["#AmsterdamTravel","#LuxuryEurope","#VirtualHolidays"]',
    status: 'pending_review',
    validation_status: 'passed',
    validation_issues: null,
    scheduled_publish_time: null,
    created_at: '2026-06-09T10:00:00Z',
    image: 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=900',
    seoTitle: 'Hidden Canals of Amsterdam: Luxury Travel Guide',
    metaDescription: 'Discover Amsterdam’s peaceful canals, boutique stays and refined local experiences with this luxury slow travel guide.',
  },
  {
    id: 7102,
    feed_id: 1,
    platform: 'facebook',
    headline: 'Amsterdam feels different when you leave the main streets behind',
    title: 'Amsterdam Hidden Canal Facebook Post',
    preview: 'Warm social copy for Facebook with a soft travel storytelling angle and CTA.',
    content: 'Amsterdam feels different when you leave the main streets behind. Think quiet canal reflections, elegant bridges, flower-lined windows and cafés where the best plan is to stay a little longer. Save this idea for your next Europe escape with Virtual Holidays.',
    hashtags: '["#Amsterdam","#EuropeTravel","#VirtualHolidays"]',
    status: 'draft',
    validation_status: 'passed',
    validation_issues: null,
    scheduled_publish_time: null,
    created_at: '2026-06-09T10:03:00Z',
    image: 'https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 7103,
    feed_id: 2,
    platform: 'instagram',
    headline: 'Paris evenings, golden lights and market magic ✨',
    title: 'Paris Market Instagram Caption',
    preview: 'Short caption with emoji-led structure, hashtags and aspirational travel hook.',
    content: 'Paris evenings, golden lights and market magic ✨ Wander through festive stalls, taste something warm, and end the night with the Eiffel Tower sparkling in the distance. This is your sign to plan a Paris winter escape.',
    hashtags: '["#ParisTravel","#ParisInWinter","#LuxuryTravel","#VirtualHolidays"]',
    status: 'pending_review',
    validation_status: 'passed',
    validation_issues: null,
    scheduled_publish_time: null,
    created_at: '2026-06-09T10:04:00Z',
    image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 7104,
    feed_id: 2,
    platform: 'linkedin',
    headline: 'Why seasonal city experiences drive premium travel demand',
    title: 'Paris Tourism LinkedIn Post',
    preview: 'Professional LinkedIn post focused on seasonal demand and curated travel packages.',
    content: 'Seasonal city experiences continue to drive premium travel demand across Europe. Paris winter markets, cultural evenings and curated food walks create a clear opportunity for travel brands to package emotion, convenience and local access into one memorable itinerary.',
    hashtags: '["#TravelIndustry","#ParisTourism","#ExperienceTravel"]',
    status: 'draft',
    validation_status: 'needs_human_attention',
    validation_issues: 'Review tone before posting to ensure it remains warm and travel-brand aligned.',
    scheduled_publish_time: null,
    created_at: '2026-06-09T10:06:00Z',
    image: 'https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 7105,
    feed_id: 2,
    platform: 'twitter',
    headline: 'Paris winter idea: markets + cafés + golden hour walks.',
    title: 'X / Twitter Paris Post',
    preview: 'Concise X copy with a compact travel hook.',
    content: 'Paris winter idea: festive markets, quiet cafés, golden-hour walks and one sparkling Eiffel Tower view. Simple, elegant, unforgettable. #ParisTravel #EuropeTrip',
    hashtags: '["#ParisTravel","#EuropeTrip"]',
    status: 'draft',
    validation_status: 'passed',
    validation_issues: null,
    scheduled_publish_time: null,
    created_at: '2026-06-09T10:08:00Z',
    image: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

function toLocalDatetimeValue(date = new Date(Date.now() + 24 * 60 * 60 * 1000)) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function hashtags(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return value.split(/[ ,]+/).filter(Boolean);
  }
}

function statusStyle(status: string) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'pending_review') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

function decorate(item: GeneratedContent): PreviewItem {
  const cityImage = item.platform === 'instagram'
    ? 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=900'
    : 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=900';
  return {
    ...item,
    title: item.headline,
    preview: item.content.slice(0, 120),
    image: cityImage,
    seoTitle: item.platform === 'blog' ? item.headline : undefined,
    metaDescription: item.platform === 'blog' ? item.content.slice(0, 140) : undefined,
  };
}

export default function ApprovalPage() {
  const [apiItems, setApiItems] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [scheduleFor, setScheduleFor] = useState<PreviewItem | null>(null);
  const [scheduleAt, setScheduleAt] = useState(toLocalDatetimeValue());

  async function load() {
    setLoading(true);
    try {
      setApiItems(await fetchContent());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const items = useMemo<PreviewItem[]>(() => {
    const existing = apiItems.map(decorate);
    const ids = new Set(existing.map((i) => i.id));
    return [...sampleGenerated.filter((i) => !ids.has(i.id)), ...existing];
  }, [apiItems]);

  async function approveNow(item: PreviewItem) {
    setBusyId(item.id);
    try {
      await approveContent(item.id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function reject(item: PreviewItem) {
    setBusyId(item.id);
    try {
      await rejectContent(item.id, 'Rejected by admin');
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function saveSchedule() {
    if (!scheduleFor) return;
    setBusyId(scheduleFor.id);
    try {
      const iso = new Date(scheduleAt).toISOString();
      await approveContent(scheduleFor.id, iso);
      await schedulePublish(scheduleFor.id, scheduleFor.platform, iso);
      setScheduleFor(null);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] p-6 lg:p-8 text-gray-900">
      {scheduleFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl animate-scale-in">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-forest-900">Approve & Schedule</h3>
                <p className="mt-1 text-sm text-gray-500">Choose calendar date and time for this post.</p>
              </div>
              <button onClick={() => setScheduleFor(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 rounded-2xl bg-[#F8FAF7] p-4">
              <div className="text-sm font-semibold text-gray-900">{scheduleFor.title}</div>
              <div className="mt-1 text-xs text-gray-500">{platformMeta[scheduleFor.platform]?.label || scheduleFor.platform}</div>
            </div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Schedule date & time</label>
            <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-100" />
            <button onClick={saveSchedule} disabled={busyId === scheduleFor.id} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 px-5 py-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-60">
              {busyId === scheduleFor.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
              Save Scheduled Post
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1 text-xs font-semibold text-forest-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Generated Content Preview
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">AI Post Approval</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">Review generated blog, social copy, AI images, SEO metadata and hashtags before approving for immediate publishing or scheduling.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"><Clock className="mr-2 inline h-4 w-4" /> {items.filter((i) => i.status !== 'approved' && i.status !== 'rejected').length} waiting review</div>
          <button onClick={load} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50"><RefreshCw className="mr-2 inline h-4 w-4" /> Refresh</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Content types</p><p className="mt-2 text-2xl font-extrabold text-forest-900">5</p><p className="text-xs text-gray-500">Blog, Facebook, Instagram, LinkedIn, X</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">AI Images</p><p className="mt-2 text-2xl font-extrabold text-forest-900">Ready</p><p className="text-xs text-gray-500">One image preview per card</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">SEO Metadata</p><p className="mt-2 text-2xl font-extrabold text-emerald-700">Included</p><p className="text-xs text-gray-500">SEO title and meta description</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Validation</p><p className="mt-2 text-2xl font-extrabold text-amber-700">Human</p><p className="text-xs text-gray-500">Admin decides before publishing</p></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-forest-700 shadow-sm"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading generated content...</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const meta = platformMeta[item.platform] || platformMeta.blog;
            const Icon = meta.icon;
            const isOpen = expanded[item.id];
            return (
              <article key={item.id} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.badge}`}><Icon className="h-3.5 w-3.5" /> {meta.label}</span>
                  <span className={`absolute bottom-4 left-4 rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(item.status)}`}>{item.status.replace('_', ' ')}</span>
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><ImageIcon className="h-5 w-5" /></div>
                    <div>
                      <h3 className="line-clamp-2 text-lg font-bold text-forest-900">{item.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{item.preview}</p>
                    </div>
                  </div>

                  <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] group-hover:grid-rows-[1fr]'}`}>
                    <div className="min-h-0">
                      <div className="mt-4 rounded-2xl bg-[#F8FAF7] p-4 text-sm leading-6 text-gray-700 whitespace-pre-line">{item.content}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {hashtags(item.hashtags).map((tag) => <span key={tag} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">{tag}</span>)}
                      </div>
                      {(item.seoTitle || item.metaDescription) && (
                        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">SEO Title</p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{item.seoTitle}</p>
                          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gray-400">Meta Description</p>
                          <p className="mt-1 text-sm text-gray-600">{item.metaDescription}</p>
                        </div>
                      )}
                      {item.validation_issues && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">{item.validation_issues}</div>}
                    </div>
                  </div>

                  <button onClick={() => setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))} className="mt-4 text-sm font-bold text-forest-700 hover:text-forest-900">
                    {isOpen ? 'See Less' : 'See More'}
                  </button>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"><RefreshCw className="h-3.5 w-3.5" /> Regenerate</button>
                    <button onClick={() => approveNow(item)} disabled={busyId === item.id} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-forest-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-60">{busyId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Approve & Post</button>
                    <button onClick={() => { setScheduleFor(item); setScheduleAt(toLocalDatetimeValue()); }} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100"><CalendarClock className="h-3.5 w-3.5" /> Approve & Schedule</button>
                    <button onClick={() => reject(item)} disabled={busyId === item.id} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"><XCircle className="h-3.5 w-3.5" /> Reject</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-forest-900"><Search className="h-4 w-4" /> Approval workflow</div>
        <p className="mt-2 text-sm text-gray-500">Approve & Post marks content as ready for immediate publishing. Approve & Schedule saves date/time and sends the item to Auto Publishing.</p>
      </div>
    </div>
  );
}
