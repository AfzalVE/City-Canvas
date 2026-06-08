'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Calendar,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  XCircle,
  Zap,
} from 'lucide-react';
import { Feed, approveFeed, fetchFeeds, rejectFeed, runRssFetch } from '@/lib/admin-api';

/* ─── helpers ─────────────────────────────────────────────── */
const CITY_IMAGES: Record<string, string> = {
  Amsterdam:
    'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=900',
  Paris:
    'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=900',
  default:
    'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900',
};

function imageFor(feed: Feed) {
  if (feed.image_url) return feed.image_url;
  return CITY_IMAGES[feed.city ?? ''] ?? CITY_IMAGES.default;
}

function cityMatches(feed: Feed, city: string) {
  if (city === 'all') return true;
  if (city === 'Global') return feed.city !== 'Amsterdam' && feed.city !== 'Paris';
  return feed.city === city;
}

function formatDate(feed: Feed) {
  const value = feed.published_date || feed.created_at;
  if (!value) return 'No date';
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US');
}

function scoreClass(score: number) {
  if (score >= 75) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (score >= 50) return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-purple-50 text-purple-700 border border-purple-200';
}

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

/* ─── Workflow Steps Banner ─────────────────────────────────── */
const WORKFLOW_STEPS = [
  { icon: Globe, label: 'RSS Fetch', desc: 'Fetch from Paris & Amsterdam feeds', step: 1 },
  { icon: Bot, label: 'AI Scoring', desc: 'Auto-score & rank articles by relevance', step: 2 },
  { icon: CheckCircle, label: 'Admin Approve', desc: 'Review and approve top articles', step: 3 },
  { icon: Sparkles, label: 'AI Post Gen', desc: 'Generate social posts from articles', step: 4 },
  { icon: CheckCircle, label: 'Post Approve', desc: 'Admin reviews AI-generated posts', step: 5 },
  { icon: Send, label: 'Auto Publish', desc: 'Publish to all social channels', step: 6 },
];

function WorkflowBanner() {
  return (
    <div className="bg-gradient-to-r from-forest-800 to-forest-900 rounded-2xl p-6 mb-8 text-cream-100">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-gold-400" />
        <h2 className="font-serif text-lg text-cream-100">RSS → AI → Social Media Workflow</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {WORKFLOW_STEPS.map((s, i) => (
          <div key={s.step} className="flex flex-col items-center text-center gap-1.5 relative">
            {i < WORKFLOW_STEPS.length - 1 && (
              <ChevronRight className="absolute -right-2 top-3 w-4 h-4 text-gold-400/50 hidden lg:block" />
            )}
            <div className="w-9 h-9 rounded-full bg-forest-700 border border-gold-400/30 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-gold-400" />
            </div>
            <span className="text-xs font-semibold text-cream-100">{s.label}</span>
            <span className="text-[10px] text-cream-400 leading-tight hidden sm:block">{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── City Source Cards ────────────────────────────────────── */
function CitySources() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      {[
        {
          city: 'Paris',
          flag: '🇫🇷',
          bg: 'from-rose-900/80 to-stone-900/80',
          img: CITY_IMAGES.Paris,
          feeds: ['Le Monde Travel', 'Paris Secret', 'Sortiraparis RSS', 'Time Out Paris'],
        },
        {
          city: 'Amsterdam',
          flag: '🇳🇱',
          bg: 'from-teal-900/80 to-slate-900/80',
          img: CITY_IMAGES.Amsterdam,
          feeds: ['DutchNews.nl', 'I Amsterdam', 'AT5 RSS', 'Lonely Planet Amsterdam'],
        },
      ].map((c) => (
        <div key={c.city} className="relative rounded-xl overflow-hidden shadow-md">
          <img src={c.img} alt={c.city} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${c.bg}`} />
          <div className="relative p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{c.flag}</span>
              <h3 className="font-serif text-xl text-cream-100">{c.city}</h3>
              <span className="ml-auto text-xs bg-white/20 text-white rounded-full px-2 py-0.5 backdrop-blur-sm">
                {c.feeds.length} sources
              </span>
            </div>
            <div className="space-y-1">
              {c.feeds.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-cream-300">
                  <Globe className="w-3 h-3 text-gold-400/70" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function RSSPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [cityFilter, setCityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSources, setShowSources] = useState(false);

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await fetchFeeds({ status: statusFilter === 'all' ? undefined : statusFilter });
      setFeeds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RSS articles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function fetchNow() {
    setRunning(true);
    setMessage('');
    setError('');
    try {
      const result = await runRssFetch();
      const summary = result.result;
      const scoring = summary.scoring as { scored?: number } | undefined;
      setMessage(
        `✅ RSS fetch complete — Inserted ${summary.inserted ?? 0}, skipped ${summary.skipped ?? 0}. ` +
        `AI auto-scored ${scoring?.scored ?? 0} new articles. Review below and approve for AI post generation.`
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'RSS fetch failed');
    } finally {
      setRunning(false);
    }
  }

  async function setArticleStatus(feedId: number, status: 'approved' | 'rejected') {
    setBusyId(feedId);
    setMessage('');
    setError('');
    try {
      if (status === 'approved') {
        const result = await approveFeed(feedId);
        const created = result.content_generation?.created?.length ?? 0;
        const validated = result.brand_validation?.validated ?? 0;
        setMessage(
          `✅ Article approved → AI generated ${created} social posts → ${validated} posts sent to Approval Queue.`
        );
      } else {
        await rejectFeed(feedId);
        setMessage('Article rejected and removed from queue.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${status} article`);
    } finally {
      setBusyId(null);
    }
  }

  const filteredFeeds = useMemo(() =>
    feeds
      .filter((f) => cityMatches(f, cityFilter))
      .sort((a, b) => {
        const d = (b.relevance_score || 0) - (a.relevance_score || 0);
        return d !== 0 ? d : new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }),
    [feeds, cityFilter]
  );

  const topFeeds = filteredFeeds.slice(0, 10);
  const pendingCount = feeds.filter(f => f.approval_status === 'pending').length;

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-forest-800 mb-1">RSS Intelligence Agent</h1>
          <p className="text-sm text-forest-500">
            Auto-fetch, AI-score, and approve articles from Paris & Amsterdam feeds
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowSources(!showSources)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-forest-700 hover:bg-gray-50 transition-colors"
          >
            {showSources ? 'Hide' : 'Show'} RSS Sources
          </button>
          <button
            onClick={fetchNow}
            disabled={running}
            className="flex items-center gap-2 btn-primary text-xs disabled:opacity-70"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {running ? 'Fetching & Scoring…' : 'Fetch RSS + AI Score'}
          </button>
        </div>
      </div>

      {/* Workflow Banner */}
      <WorkflowBanner />

      {/* RSS Sources */}
      {showSources && <CitySources />}

      {/* Status messages */}
      {message && (
        <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 leading-relaxed">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Fetched', value: feeds.length, color: 'text-forest-700' },
          { label: 'Pending Review', value: pendingCount, color: 'text-amber-600' },
          { label: 'Approved', value: feeds.filter(f => f.approval_status === 'approved').length, color: 'text-green-600' },
          { label: 'Rejected', value: feeds.filter(f => f.approval_status === 'rejected').length, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className={`text-2xl font-serif font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-forest-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-forest-700 text-white'
                  : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap ml-auto">
          {['all', 'Paris', 'Amsterdam', 'Global'].map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                cityFilter === city
                  ? 'bg-forest-700 text-white'
                  : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {city === 'Paris' ? '🇫🇷 ' : city === 'Amsterdam' ? '🇳🇱 ' : ''}{city}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-forest-800">
          Top Scored Articles
          <span className="text-sm font-sans text-forest-400 ml-2">({filteredFeeds.length} found)</span>
        </h2>
        {pendingCount > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-medium">
            {pendingCount} pending review
          </span>
        )}
      </div>

      {/* Feed Cards */}
      {loading ? (
        <div className="text-center py-20 text-forest-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
          Loading articles…
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topFeeds.map((feed) => {
            const score = Math.round(feed.relevance_score || 0);
            const pending = feed.approval_status === 'pending';
            const isAmsterdam = feed.city === 'Amsterdam';

            return (
              <article key={feed.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/2] bg-gray-100">
                  <img
                    src={imageFor(feed)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.src = CITY_IMAGES.default; }}
                  />
                  {/* City pill */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                      isAmsterdam
                        ? 'bg-teal-600/90 text-white'
                        : feed.city === 'Paris'
                        ? 'bg-rose-600/90 text-white'
                        : 'bg-forest-700/90 text-white'
                    }`}>
                      {feed.city === 'Paris' ? '🇫🇷' : feed.city === 'Amsterdam' ? '🇳🇱' : '🌍'} {feed.city || 'Global'}
                    </span>
                  </div>
                  {/* Score badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreClass(score)}`}>
                      Score {score}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-forest-500 mb-2">
                    <Globe className="w-3 h-3" />
                    <span className="font-medium">{feed.source_name || 'RSS Source'}</span>
                    <span className="ml-auto flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(feed)}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg leading-snug text-forest-900 mb-2 line-clamp-2">
                    {feed.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                    {feed.summary || 'No summary available.'}
                  </p>

                  {feed.scoring_reason && (
                    <div className="flex gap-2 rounded-lg bg-gold-50 border border-gold-200 px-3 py-2 mb-3">
                      <Bot className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-forest-700 leading-relaxed line-clamp-2">
                        {feed.scoring_reason}
                      </p>
                    </div>
                  )}

                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-800 mb-4"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Original Article
                  </a>

                  {/* Actions */}
                  <div className="mt-auto">
                    {pending ? (
                      <div>
                        <p className="text-xs text-forest-500 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-gold-500" />
                          Approve to trigger AI post generation
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setArticleStatus(feed.id, 'approved')}
                            disabled={busyId === feed.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                          >
                            {busyId === feed.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Approve & Generate
                          </button>
                          <button
                            onClick={() => setArticleStatus(feed.id, 'rejected')}
                            disabled={busyId === feed.id}
                            className="px-3 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`text-center text-xs font-semibold py-2 rounded-lg ${
                        feed.approval_status === 'approved'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {feed.approval_status === 'approved' ? '✅ Approved — posts in AI queue' : '✗ Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {topFeeds.length === 0 && !loading && (
            <div className="md:col-span-3 text-center py-20 text-forest-400">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-serif text-lg">No articles found</p>
              <p className="text-sm mt-1 mb-6">Change filters or run a fresh RSS fetch.</p>
              <button onClick={fetchNow} disabled={running} className="btn-primary text-sm">
                <RefreshCw className="w-4 h-4" />
                Fetch RSS Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
