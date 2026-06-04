'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, ExternalLink, Globe, Loader2, Search, Star, XCircle } from 'lucide-react';
import { Feed, approveFeed, fetchFeeds, rejectFeed, runScoring } from '@/lib/admin-api';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

export default function VerificationPage() {
  const [articles, setArticles] = useState<Feed[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<Filter>('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await fetchFeeds({ status: filter === 'all' ? undefined : filter });
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load verification queue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(feedId: number, status: 'approved' | 'rejected') {
    setBusyId(feedId);
    setError('');
    setMessage('');
    try {
      if (status === 'approved') {
        await approveFeed(feedId, notes[feedId]);
      } else {
        await rejectFeed(feedId, notes[feedId]);
      }
      setMessage(`Article ${status}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${status} article`);
    } finally {
      setBusyId(null);
    }
  }

  async function checkArticles() {
    setChecking(true);
    setError('');
    setMessage('');
    try {
      const result = await runScoring(25);
      setMessage(result.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checking failed');
    } finally {
      setChecking(false);
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase();
    return articles.filter((article) => {
      return (
        !value ||
        article.title.toLowerCase().includes(value) ||
        (article.source_name || '').toLowerCase().includes(value)
      );
    });
  }, [articles, search]);

  const pendingCount = articles.filter((article) => article.approval_status === 'pending').length;

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-forest-800 mb-1">Verification Queue</h1>
          <p className="text-sm text-forest-500">{pendingCount} articles awaiting review</p>
        </div>
        <button onClick={checkArticles} disabled={checking} className="btn-secondary text-xs disabled:opacity-70">
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
          Run Checking
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search articles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-forest-400 w-64"
          />
        </div>
        <div className="flex gap-2">
          {([
            ['all', 'All'],
            ['pending', 'Pending'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === value ? 'bg-forest-600 text-cream-100' : 'bg-white text-forest-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-forest-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading articles
          </div>
        ) : filtered.map((article) => (
          <div
            key={article.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              article.approval_status === 'approved' ? 'border-green-200' : article.approval_status === 'rejected' ? 'border-red-200' : 'border-gray-200'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`tag text-xs ${article.city === 'Amsterdam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'}`}>
                      {article.city || 'Unknown'}
                    </span>
                    <span className="tag-forest text-xs">{article.category || 'General'}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />{article.source_name || 'RSS source'}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-forest-800 mb-1">{article.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-gold-500" />
                    <span>Relevance:</span>
                    <span className={`font-semibold ${(article.relevance_score || 0) >= 70 ? 'text-green-600' : (article.relevance_score || 0) >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {Math.round(article.relevance_score || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {article.approval_status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateStatus(article.id, 'approved')}
                        disabled={busyId === article.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                      >
                        {busyId === article.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(article.id, 'rejected')}
                        disabled={busyId === article.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={article.approval_status === 'approved' ? 'status-approved' : 'status-rejected'}>
                      {article.approval_status}
                    </span>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                    className="p-1.5 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    {expanded === article.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {expanded === article.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                <p className="text-sm text-forest-600 leading-relaxed">{article.summary || 'No summary was provided by this RSS item.'}</p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-800 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View original article
                </a>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Reviewer Notes</label>
                  <textarea
                    value={notes[article.id] || article.editor_notes || ''}
                    onChange={(event) => setNotes((current) => ({ ...current, [article.id]: event.target.value }))}
                    placeholder="Add notes about this article..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-forest-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No articles found</p>
            <p className="text-sm mt-1">Change your filters or run RSS collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
