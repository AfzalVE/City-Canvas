'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Calendar,
  CheckCircle,
  ExternalLink,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Rss,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Feed, approveFeed, fetchFeeds, rejectFeed, runRssFetch } from '../../../lib/admin-api';

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'aiRejected' | 'all';
type LocationFilter = 'All' | 'Amsterdam' | 'Paris' | 'Europe' | 'Luxury Travel' | 'Family Travel';

type DisplayArticle = Feed & { aiStatus: 'approved' | 'rejected'; category: string };

const PRIMARY = 'bg-forest-700 text-white shadow-sm';
const SOFT_CARD = 'bg-white border border-gray-200 rounded-2xl shadow-sm';

const rssSources = [
  { name: 'Global Travel Blog Feed', url: 'https://example.com/travel/rss.xml', category: 'Travel Blogs', status: 'Enabled', lastFetched: 'Today, 10:20 AM' },
  { name: 'I Amsterdam Updates', url: 'https://www.iamsterdam.com/rss', category: 'Amsterdam Tourism', status: 'Enabled', lastFetched: 'Today, 10:18 AM' },
  { name: 'Paris Tourism Journal', url: 'https://parisinfo.com/rss', category: 'Paris Tourism', status: 'Enabled', lastFetched: 'Today, 10:15 AM' },
  { name: 'Europe Travel News', url: 'https://example.com/europe-travel/rss', category: 'Europe Travel News', status: 'Disabled', lastFetched: 'Yesterday, 6:45 PM' },
  { name: 'Luxury Travel Insider', url: 'https://example.com/luxury/rss', category: 'Luxury Travel News', status: 'Enabled', lastFetched: 'Today, 9:55 AM' },
];

const sampleRejected: DisplayArticle[] = [
  {
    id: 9001,
    title: 'Budget Hostel Roundup With Low Brand Fit',
    summary: 'A low-cost hostel listing was rejected because it does not match the luxury travel positioning and audience intent.',
    link: '#',
    image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600',
    city: 'Europe',
    source_name: 'Budget Travel Wire',
    published_date: '2026-06-09',
    created_at: '2026-06-09T09:30:00Z',
    approval_status: 'pending',
    relevance_score: 42,
    scoring_reason: 'AI rejected: weak luxury fit and low engagement value for the brand.',
    aiStatus: 'rejected',
    category: 'Family Travel',
  },
  {
    id: 9002,
    title: 'Generic Airport Delay Notice Across Europe',
    summary: 'Operational travel notice without enough destination inspiration or social media storytelling potential.',
    link: '#',
    image_url: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=600',
    city: 'Europe',
    source_name: 'Europe Travel News',
    published_date: '2026-06-08',
    created_at: '2026-06-08T14:30:00Z',
    approval_status: 'pending',
    relevance_score: 38,
    scoring_reason: 'AI rejected: low inspiration score and not useful for campaign content.',
    aiStatus: 'rejected',
    category: 'Europe Travel',
  },
];

function imageFor(feed: Feed) {
  if (feed.image_url) return feed.image_url;
  if (feed.city === 'Amsterdam') return 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=600';
  if (feed.city === 'Paris') return 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=600';
  return 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=600';
}

function formatDate(value?: string | null) {
  if (!value) return 'No date';
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function aiCategory(feed: Feed) {
  if ((feed.source_name || '').toLowerCase().includes('luxury')) return 'Luxury Travel';
  if (feed.city === 'Amsterdam') return 'Amsterdam';
  if (feed.city === 'Paris') return 'Paris';
  return 'Europe';
}

function statClass(kind: 'green' | 'red' | 'gold') {
  if (kind === 'green') return 'text-emerald-700 bg-emerald-50';
  if (kind === 'red') return 'text-red-700 bg-red-50';
  return 'text-amber-700 bg-amber-50';
}

export default function RSSPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('All');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [popup, setPopup] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setFeeds(await fetchFeeds());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const aiApproved = useMemo<DisplayArticle[]>(() => feeds
    .filter((f) => (f.relevance_score || 0) >= 60)
    .map((f) => ({ ...f, aiStatus: 'approved', category: aiCategory(f) })), [feeds]);

  const aiRejected = useMemo<DisplayArticle[]>(() => [
    ...feeds.filter((f) => (f.relevance_score || 0) < 60).map((f) => ({ ...f, aiStatus: 'rejected' as const, category: aiCategory(f) })),
    ...sampleRejected,
  ], [feeds]);

  const visibleArticles = useMemo(() => {
    const source = statusFilter === 'aiRejected' ? aiRejected : aiApproved;
    return source.filter((item) => {
      if (statusFilter === 'pending' && item.approval_status !== 'pending') return false;
      if (statusFilter === 'approved' && item.approval_status !== 'approved') return false;
      if (statusFilter === 'rejected' && item.approval_status !== 'rejected') return false;
      if (locationFilter !== 'All') {
        if (locationFilter === 'Europe' && item.city === 'Amsterdam') return false;
        if (locationFilter === 'Europe' && item.city === 'Paris') return false;
        if (locationFilter !== 'Europe' && locationFilter !== item.category && locationFilter !== item.city) return false;
      }
      return true;
    });
  }, [aiApproved, aiRejected, locationFilter, statusFilter]);

  const stats = [
    { label: 'Total fetched', value: 46, kind: 'green' as const },
    { label: 'AI approved', value: 15, kind: 'green' as const },
    { label: 'AI rejected', value: 31, kind: 'red' as const },
    { label: 'Human approval pending', value: 15, kind: 'gold' as const },
    { label: 'Admin approved', value: aiApproved.filter((f) => f.approval_status === 'approved').length, kind: 'green' as const },
    { label: 'Admin rejected', value: aiApproved.filter((f) => f.approval_status === 'rejected').length, kind: 'red' as const },
  ];

  async function handleFetch() {
    setRunning(true);
    try {
      await runRssFetch();
      await load();
    } finally {
      setRunning(false);
    }
  }

  async function handleApprove(feedId: number) {
    await approveFeed(feedId);
    setPopup(true);
    await load();
    window.setTimeout(() => setPopup(false), 3000);
  }

  async function handleReject(feedId: number) {
    await rejectFeed(feedId);
    await load();
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] p-6 lg:p-8 text-gray-900">
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative w-[340px] animate-scale-in rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl">
            <div className="absolute inset-x-0 -top-8 flex justify-center gap-2 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="h-2 w-2 animate-confetti rounded-full bg-gold-400" style={{ animationDelay: `${i * 0.04}s` }} />
              ))}
            </div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">🎉</div>
            <h3 className="text-xl font-bold text-forest-800">Generated Successfully</h3>
            <p className="mt-2 text-sm text-gray-500">The approved article was sent to AI Post Approval.</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1 text-xs font-semibold text-forest-700 shadow-sm">
            <Rss className="h-3.5 w-3.5" /> RSS Agent · AI Scoring Enabled
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">RSS Management</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">Automatically fetch travel articles, score and filter them with AI, then send only AI-approved articles into the admin review queue.</p>
        </div>
        <button onClick={handleFetch} disabled={running} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-800 disabled:opacity-60">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Fetch RSS Now
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm">
        <CheckCircle className="mr-2 inline h-4 w-4" />
        RSS fetch complete — Total fetched 46. AI approved 15 and AI rejected 31. Review AI-approved articles below and approve for AI post generation.
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className={`${SOFT_CARD} p-4`}>
            <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${statClass(s.kind)}`}>{s.label}</div>
            <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      <section className={`${SOFT_CARD} mb-8 p-5`}>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-forest-900">RSS Source Management</h2>
            <p className="text-sm text-gray-500">Manage travel feeds by category, status and refresh behavior.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setAutoRefresh((v) => !v)} className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${autoRefresh ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-600'}`}>Auto Refresh {autoRefresh ? 'On' : 'Off'}</button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-forest-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-forest-800"><Plus className="h-4 w-4" /> Add RSS Feed</button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-[#F8FAF7] text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">Feed Name</th><th className="px-4 py-3">Feed URL</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last Fetched</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rssSources.map((src) => (
                <tr key={src.name} className="hover:bg-[#F8FAF7]">
                  <td className="px-4 py-4 font-semibold text-gray-900">{src.name}</td>
                  <td className="max-w-[260px] truncate px-4 py-4 text-gray-500">{src.url}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">{src.category}</span></td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${src.status === 'Enabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{src.status}</span></td>
                  <td className="px-4 py-4 text-gray-500">{src.lastFetched}</td>
                  <td className="px-4 py-4"><div className="flex gap-2"><button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">Toggle</button><button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${SOFT_CARD} p-5`}>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-forest-900">{statusFilter === 'aiRejected' ? `AI Rejected Articles (${visibleArticles.length} found)` : `Top Scored Articles (15 found)`}</h2>
            <p className="mt-1 text-sm text-gray-500">Only AI-approved feeds appear here by default. Use the AI Rejected filter to audit rejected articles.</p>
          </div>
          <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">15 pending review</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['pending', 'approved', 'rejected', 'aiRejected', 'all'] as StatusFilter[]).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === f ? PRIMARY : 'border border-gray-200 bg-white text-gray-600 hover:border-forest-200 hover:text-forest-700'}`}>{f === 'aiRejected' ? 'AI Rejected' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {(['All', 'Amsterdam', 'Paris', 'Europe', 'Luxury Travel', 'Family Travel'] as LocationFilter[]).map((f) => (
            <button key={f} onClick={() => setLocationFilter(f)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${locationFilter === f ? PRIMARY : 'border border-gray-200 bg-white text-gray-600 hover:border-forest-200 hover:text-forest-700'}`}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-forest-700"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading RSS articles...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-[#F8FAF7] text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Image</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Published Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {visibleArticles.map((feed) => (
                  <tr key={feed.id} className="hover:bg-[#F8FAF7]">
                    <td className="px-4 py-4"><img src={imageFor(feed)} alt="" className="h-14 w-20 rounded-xl object-cover" /></td>
                    <td className="px-4 py-4"><div className="max-w-md"><div className="font-semibold text-gray-900">{feed.title}</div><div className="mt-1 line-clamp-1 text-xs text-gray-500">{feed.summary}</div><div className="mt-2 flex items-center gap-2 text-xs text-gray-400"><Sparkles className="h-3.5 w-3.5 text-gold-500" /> AI score {feed.relevance_score || 0}</div></div></td>
                    <td className="px-4 py-4 text-gray-600">{feed.source_name || 'Travel Source'}</td>
                    <td className="px-4 py-4"><span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">{feed.category}</span></td>
                    <td className="px-4 py-4 text-gray-500"><Calendar className="mr-1 inline h-3.5 w-3.5" />{formatDate(feed.published_date || feed.created_at)}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${feed.aiStatus === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{feed.aiStatus === 'approved' ? 'AI Approved' : 'AI Rejected'}</span></td>
                    <td className="px-4 py-4"><div className="flex flex-wrap gap-2">{feed.aiStatus === 'approved' && feed.approval_status === 'pending' && <><button onClick={() => handleApprove(feed.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-700 px-3 py-2 text-xs font-bold text-white hover:bg-forest-800"><Bot className="h-3.5 w-3.5" /> Approve & Generate</button><button onClick={() => handleReject(feed.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><XCircle className="h-3.5 w-3.5" /> Reject</button></>}{feed.aiStatus === 'rejected' && <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"><Eye className="h-3.5 w-3.5" /> View Reason</button>}<a href={feed.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50"><ExternalLink className="h-3.5 w-3.5" /></a></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
