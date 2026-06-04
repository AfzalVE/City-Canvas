'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  RefreshCw,
  Star,
  XCircle,
} from 'lucide-react';
import { Feed, approveFeed, fetchFeeds, rejectFeed, runRssFetch } from '@/lib/admin-api';

const fallbackImages = {
  Amsterdam: 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=900',
  Paris: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=900',
  default: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900',
};

function imageFor(feed: Feed) {
  if (feed.image_url) return feed.image_url;
  if (feed.city === 'Amsterdam') return fallbackImages.Amsterdam;
  if (feed.city === 'Paris') return fallbackImages.Paris;
  return fallbackImages.default;
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
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US');
}

function scoreClass(score: number) {
  if (score >= 75) return 'bg-green-50 text-green-700';
  if (score >= 50) return 'bg-amber-50 text-amber-700';
  return 'bg-purple-50 text-purple-700';
}

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all';
type ViewMode = 'top' | 'others';

export default function RSSPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [cityFilter, setCityFilter] = useState('all');
  const [view, setView] = useState<ViewMode>('top');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await fetchFeeds({
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setFeeds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RSS articles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  async function fetchNow() {
    setRunning(true);
    setMessage('');
    setError('');
    try {
      const result = await runRssFetch();
      const summary = result.result;
      const scoring = summary.scoring as { scored?: number } | undefined;
      setMessage(
        `RSS fetch complete. Inserted ${summary.inserted ?? 0}, skipped ${summary.skipped ?? 0}. ` +
        `Scored ${scoring?.scored ?? 0} new articles automatically.`
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'RSS fetch failed');
    } finally {
      setRunning(false);
      setView('top');
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
        setMessage(`Article approved. Generated ${created} drafts and validated ${validated} for Approval Queue.`);
      } else {
        await rejectFeed(feedId);
        setMessage('Article rejected.');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${status} article`);
    } finally {
      setBusyId(null);
    }
  }

  const filteredFeeds = useMemo(() => {
    return feeds
      .filter((feed) => cityMatches(feed, cityFilter))
      .sort((a, b) => {
        const scoreDiff = (b.relevance_score || 0) - (a.relevance_score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [feeds, cityFilter]);

  const topFeeds = filteredFeeds.slice(0, 10);
  const otherFeeds = filteredFeeds.slice(10);
  const displayedFeeds = view === 'top' ? topFeeds : otherFeeds;

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-forest-700 text-white'
                  : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={fetchNow} disabled={running} className="btn-primary text-xs disabled:opacity-70">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Fetch RSS & Auto Score
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'Amsterdam', 'Paris', 'Global'].map((city) => (
          <button
            key={city}
            onClick={() => setCityFilter(city)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              cityFilter === city
                ? 'bg-forest-700 text-white'
                : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-forest-800">
            {view === 'top' ? 'Top 10 Scored Articles' : 'Other Fetched Articles'}
          </h1>
          <p className="text-sm text-forest-500">
            Showing {displayedFeeds.length} of {filteredFeeds.length} fetched articles
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('top')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'top'
                ? 'bg-forest-100 text-forest-800'
                : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setView('others')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'others'
                ? 'bg-forest-100 text-forest-800'
                : 'bg-white text-forest-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Other ({otherFeeds.length})
          </button>
        </div>
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-forest-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
          Loading RSS articles
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedFeeds.map((feed) => {
            const score = Math.round(feed.relevance_score || 0);
            const pending = feed.approval_status === 'pending';

            return (
              <article key={feed.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative aspect-[3/2] bg-gray-200">
                  <img
                    src={imageFor(feed)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = fallbackImages.default;
                    }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {feed.city || 'Global'}
                    </span>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {feed.source_name || 'RSS source'}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${scoreClass(score)}`}>
                      Score {score}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl leading-snug text-forest-900 line-clamp-2">
                    {feed.title}
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-slate-700 line-clamp-3">
                    {feed.summary || feed.scoring_reason || 'Run the scoring agent to add editorial reasoning for this article.'}
                  </p>

                  {feed.scoring_reason && (
                    <p className="mt-3 rounded-lg bg-cream-50 px-3 py-2 text-xs leading-relaxed text-forest-700 line-clamp-3">
                      {feed.scoring_reason}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {feed.city || 'Global'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(feed)}
                    </div>
                  </div>

                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900"
                  >
                    <Globe className="w-4 h-4" />
                    View Original Article
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="mt-6 flex gap-3">
                    {pending ? (
                      <>
                        <button
                          onClick={() => setArticleStatus(feed.id, 'approved')}
                          disabled={busyId === feed.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          {busyId === feed.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => setArticleStatus(feed.id, 'rejected')}
                          disabled={busyId === feed.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={
                        feed.approval_status === 'approved'
                          ? 'status-approved'
                          : feed.approval_status === 'rejected'
                          ? 'status-rejected'
                          : 'status-pending'
                      }>
                        {feed.approval_status}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {displayedFeeds.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 text-center py-16 text-forest-400">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-serif text-lg">No articles found</p>
              <p className="text-sm mt-1">Change filters or fetch RSS. Scoring runs automatically after fetch.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
