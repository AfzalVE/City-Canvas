'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Calendar,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  BlogPost,
  RssFeed,
  fetchRssFeeds,
  createRssFeed,
  deleteRssFeed,
  updateRssFeed,
  fetchBlogPosts,
  approveBlogPost,
  rejectBlogPost,
  runRssFetch,
} from '../../../lib/admin-api';

const WORKFLOW_STEPS = [
  { icon: Globe, label: 'RSS Fetch', desc: 'Fetch from travel feeds', step: 1 },
  { icon: Bot, label: 'AI Scoring', desc: 'Auto-score & rank articles', step: 2 },
  { icon: CheckCircle, label: 'Admin Approve', desc: 'Review articles', step: 3 },
  { icon: Sparkles, label: 'AI Generate', desc: 'Create social posts', step: 4 },
  { icon: CheckCircle, label: 'Post Review', desc: 'Approve content', step: 5 },
  { icon: Send, label: 'Auto Publish', desc: 'Post to social', step: 6 },
];

function WorkflowBanner() {
  return (
    <div
      className="mb-8 rounded-2xl px-7 py-7 shadow-sm"
      style={{ background: '#123f1d', color: '#faf8f5' }}
    >
      <div className="mb-5 flex items-center gap-2">
        <Zap className="h-5 w-5" style={{ color: '#f0c443' }} />
        <h2 className="font-serif text-xl font-semibold" style={{ color: '#fff8db' }}>
          RSS to Social Media Workflow
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {WORKFLOW_STEPS.map((step, index) => (
          <div key={step.step} className="relative flex min-h-[84px] flex-col items-center text-center">
            {index < WORKFLOW_STEPS.length - 1 && (
              <ChevronRight
                className="absolute -right-5 top-[21px] hidden h-5 w-5 lg:block"
                style={{ color: 'rgba(201, 168, 76, 0.7)' }}
              />
            )}
            <div
              className="mb-2 flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'rgba(201, 168, 76, 0.12)',
                border: '1px solid rgba(201, 168, 76, 0.48)',
              }}
            >
              <step.icon className="h-5 w-5" style={{ color: '#c9a84c' }} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#ffffff' }}>{step.label}</span>
            <span className="mt-1 max-w-[150px] text-[11px]" style={{ color: '#fff2a8' }}>{step.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type PreviewModalProps = {
  post: BlogPost | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
};

function PreviewModal({ post, onClose, onApprove, onReject, loading }: PreviewModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in">
        <div className="relative">
          <img
            src={post.image_url || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900'}
            alt={post.title}
            className="h-64 w-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-600 hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
              {post.status}
            </span>
            <span className="text-xs text-gray-400">
              <Calendar className="mr-1 inline h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <h2 className="mb-4 font-serif text-2xl font-bold text-forest-900">{post.title}</h2>
          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">
              {post.content || post.description || 'No content available.'}
            </p>
          </div>
          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800"
            >
              <ExternalLink className="h-4 w-4" />
              View Original Article
            </a>
          )}
          <div className="flex gap-3">
            <button
              onClick={onApprove}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve & Generate
            </button>
            <button
              onClick={onReject}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SuccessModalProps = {
  message: string;
  onClose: () => void;
};

function SuccessModal({ message, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl animate-scale-in">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-forest-900">🎉 Success!</h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="rounded-xl bg-forest-700 px-6 py-3 text-sm font-bold text-white hover:bg-forest-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function RSSPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [showManagement, setShowManagement] = useState(false);

  // Form state for new RSS source
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Travel');

  async function loadData() {
    setError('');
    setLoading(true);
    try {
      const [postsData, feedsData] = await Promise.all([
        fetchBlogPosts(statusFilter === 'all' ? undefined : statusFilter),
        fetchRssFeeds(),
      ]);
      setPosts(postsData);
      setFeeds(feedsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  async function handleFetchRss() {
    setFetching(true);
    setError('');
    try {
      const result = await runRssFetch();
      setMessage(`Fetched RSS: ${result.result.inserted} inserted, ${result.result.skipped} skipped`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSS');
    } finally {
      setFetching(false);
    }
  }

  async function handleApprove(post: BlogPost) {
    setBusyId(post.id);
    setError('');
    try {
      await approveBlogPost(post.id);
      setSuccessMessage('Content generated successfully! ');
      setPreviewPost(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(post: BlogPost) {
    setBusyId(post.id);
    setError('');
    try {
      await rejectBlogPost(post.id);
      setMessage('Article rejected and removed from queue.');
      setPreviewPost(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddFeed(e: React.FormEvent) {
    e.preventDefault();
    if (!formName || !formUrl) return;
    setError('');
    try {
      await createRssFeed({ name: formName, url: formUrl, category: formCategory, is_active: true });
      setFormName('');
      setFormUrl('');
      const feedsData = await fetchRssFeeds();
      setFeeds(feedsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed');
    }
  }

  async function handleDeleteFeed(id: number) {
    try {
      await deleteRssFeed(id);
      const feedsData = await fetchRssFeeds();
      setFeeds(feedsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feed');
    }
  }

  async function handleToggleFeed(feed: RssFeed) {
    try {
      await updateRssFeed(feed.id, { is_active: !feed.is_active });
      const feedsData = await fetchRssFeeds();
      setFeeds(feedsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feed');
    }
  }

  const stats = useMemo(() => ({
    total: posts.length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length,
  }), [posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-gray-100 p-6 lg:p-8">
      {/* Preview Modal */}
      <PreviewModal
        post={previewPost}
        onClose={() => setPreviewPost(null)}
        onApprove={() => previewPost && handleApprove(previewPost)}
        onReject={() => previewPost && handleReject(previewPost)}
        loading={busyId === previewPost?.id}
      />

      {/* Success Modal */}
      {successMessage && (
        <SuccessModal message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-serif text-3xl font-bold text-forest-800">RSS Intelligence Agent</h1>
          <p className="text-sm text-forest-500">Fetch and review articles from RSS feeds</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowManagement(!showManagement)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-forest-700 hover:bg-gray-50"
          >
            RSS Management
          </button>
          <button
            onClick={handleFetchRss}
            disabled={fetching}
            className="flex items-center gap-2 rounded-lg bg-forest-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-forest-800 disabled:opacity-70"
          >
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {fetching ? 'Fetching...' : 'Fetch RSS'}
          </button>
        </div>
      </div>

      <WorkflowBanner />

      {/* RSS Management Panel */}
      {showManagement && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-serif text-xl text-forest-900">RSS Source Management</h2>
          <form onSubmit={handleAddFeed} className="mb-4 grid gap-3 lg:grid-cols-4">
            <input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Feed name"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-400"
            />
            <input
              type="url"
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              placeholder="https://example.com/rss"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-400"
            />
            <input
              value={formCategory}
              onChange={e => setFormCategory(e.target.value)}
              placeholder="Category"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-forest-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800"
            >
              Add Source
            </button>
          </form>

          {feeds.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">URL</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeds.map(feed => (
                    <tr key={feed.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{feed.name}</td>
                      <td className="max-w-[300px] truncate px-4 py-3 text-gray-500">{feed.url}</td>
                      <td className="px-4 py-3">{feed.category || 'General'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${feed.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {feed.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleFeed(feed)}
                            className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                          >
                            {feed.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDeleteFeed(feed.id)}
                            className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Articles', value: stats.total, color: 'text-forest-700' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Approved', value: stats.approved, color: 'text-green-600' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-500' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <div className={`font-serif text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-0.5 text-xs text-forest-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Status Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              statusFilter === status
                ? 'bg-forest-700 text-white'
                : 'border border-gray-200 bg-white text-forest-700 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-forest-400">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading articles...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-forest-400">
          <Star className="mx-auto mb-3 h-10 w-10 opacity-20" />
          <p className="font-serif text-lg">No articles found</p>
          <p className="mt-1 text-sm">Click "Fetch RSS" to collect articles</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/2]">
                <img
                  src={post.image_url || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=900'}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                    post.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : post.status === 'rejected'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-forest-500">
                  <Globe className="h-3 w-3" />
                  <span className="font-medium">{post.link ? new URL(post.link).hostname : 'RSS Feed'}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="mb-2 line-clamp-2 font-serif text-lg leading-snug text-forest-900">
                  {post.title}
                </h2>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {post.description || 'No description available.'}
                </p>

                <button
                  onClick={() => setPreviewPost(post)}
                  className="mb-4 text-left text-sm font-bold text-forest-600 hover:text-forest-800"
                >
                  See more
                </button>

                <div className="mt-auto">
                  {post.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(post)}
                        disabled={busyId === post.id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                      >
                        {busyId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Approve & Generate
                      </button>
                      <button
                        onClick={() => handleReject(post)}
                        disabled={busyId === post.id}
                        className="rounded-lg bg-gray-100 px-3 py-2.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg py-2 text-center text-xs font-semibold ${
                        post.status === 'approved'
                          ? 'border border-green-200 bg-green-50 text-green-700'
                          : 'border border-red-200 bg-red-50 text-red-600'
                      }`}
                    >
                      {post.status === 'approved' ? 'Approved - AI content generated' : 'Rejected'}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/approval"
          className="rounded-xl border-2 border-amber-300 bg-white p-5 transition-colors hover:bg-amber-50"
        >
          <Sparkles className="mb-3 h-5 w-5 text-amber-600" />
          <div className="text-sm font-semibold text-forest-800">AI Post Approval</div>
          <div className="mt-1 text-xs text-forest-500">Review generated content</div>
        </Link>
        <Link
          to="/admin/publishing"
          className="rounded-xl border-2 border-blue-300 bg-white p-5 transition-colors hover:bg-blue-50"
        >
          <Send className="mb-3 h-5 w-5 text-blue-600" />
          <div className="text-sm font-semibold text-forest-800">Auto Publishing</div>
          <div className="mt-1 text-xs text-forest-500">View published posts</div>
        </Link>
      </div>
    </div>
  );
}
