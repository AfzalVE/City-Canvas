'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileText,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  Send,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { GeneratedContent, approveContent, fetchContent, rejectContent, schedulePublish } from '@/lib/admin-api';

const platformConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  instagram: { icon: Instagram, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', label: 'Instagram' },
  linkedin: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'LinkedIn' },
  newsletter: { icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Newsletter' },
  blog: { icon: FileText, color: 'text-forest-600', bg: 'bg-forest-50 border-forest-200', label: 'Blog' },
};

function toLocalDatetimeValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

/* Workflow mini-banner */
function WorkflowHint() {
  return (
    <div className="bg-gradient-to-r from-forest-50 to-gold-50 border border-gold-200 rounded-xl px-5 py-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-gold-600" />
        <span className="text-sm font-semibold text-forest-800">Step 5 of 6 — AI Post Approval</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap text-xs text-forest-500">
        {['RSS Fetched', 'AI Scored', 'Articles Approved', 'AI Posts Generated', 'Review Posts ← You are here', 'Auto Publish'].map((s, i, arr) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={i === 4 ? 'font-bold text-forest-800 bg-gold-100 px-2 py-0.5 rounded-full' : ''}>{s}</span>
            {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gold-400" />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ApprovalPage() {
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [scheduleAt, setScheduleAt] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const content = await fetchContent();
      setItems(content.filter((item) => item.status !== 'published'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load approval queue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: number, publishAfterApproval = false) {
    const item = items.find((e) => e.id === id);
    if (!item) return;
    setBusyId(id);
    setError('');
    setMessage('');
    try {
      const scheduled = scheduleAt[id] || toLocalDatetimeValue();
      const iso = new Date(scheduled).toISOString();
      await approveContent(id, iso);
      if (publishAfterApproval) await schedulePublish(id, item.platform, iso);
      setMessage(publishAfterApproval
        ? `✅ Content approved and automatically published to ${item.platform}.`
        : '✅ Content approved and queued for scheduled publishing.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to approve content');
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: number) {
    setBusyId(id);
    setError('');
    setMessage('');
    try {
      await rejectContent(id, notes[id]);
      setMessage('Content rejected.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reject content');
    } finally {
      setBusyId(null);
    }
  }

  async function publishApproved(item: GeneratedContent) {
    setBusyId(item.id);
    setError('');
    setMessage('');
    try {
      const scheduled = scheduleAt[item.id] || toLocalDatetimeValue();
      await schedulePublish(item.id, item.platform, new Date(scheduled).toISOString());
      setMessage(`✅ Published to ${item.platform} successfully.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish content');
    } finally {
      setBusyId(null);
    }
  }

  const pending = useMemo(() => items.filter((i) => i.status === 'draft' || i.status === 'pending_review').length, [items]);
  const filtered = platformFilter === 'all' ? items : items.filter(i => i.platform === platformFilter);

  // Platform counts for tabs
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach(i => { counts[i.platform] = (counts[i.platform] || 0) + 1; });
    return counts;
  }, [items]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">AI Post Approval Queue</h1>
        <p className="text-sm text-forest-500">
          {pending} AI-generated posts awaiting your review before automatic social media publishing
        </p>
      </div>

      <WorkflowHint />

      {message && (
        <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(platformConfig).map(([platform, cfg]) => {
          const count = items.filter(i => i.platform === platform).length;
          return (
            <div key={platform} className={`rounded-xl border p-3.5 ${cfg.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                <span className="text-xs font-semibold text-forest-700">{cfg.label}</span>
              </div>
              <div className={`text-xl font-serif font-bold ${cfg.color}`}>{count}</div>
              <div className="text-xs text-forest-400">posts</div>
            </div>
          );
        })}
      </div>

      {/* Platform filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', ...Object.keys(platformConfig)].map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              platformFilter === p
                ? 'bg-forest-700 text-white'
                : 'bg-white text-forest-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {p === 'all' ? 'All' : platformConfig[p]?.label || p}
            {platformCounts[p] !== undefined && (
              <span className="ml-1.5 text-xs opacity-60">({platformCounts[p]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-forest-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading approval queue…
          </div>
        ) : filtered.map((item) => {
          const cfg = platformConfig[item.platform] || { icon: FileText, color: 'text-forest-600', bg: 'bg-white', label: item.platform };
          const canApprove = item.validation_status === 'passed' || item.validation_status === 'needs_human_attention';
          const isExpanded = expanded === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                item.status === 'approved' ? 'border-green-200' : item.status === 'rejected' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {/* Platform badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {/* Status */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                      {/* AI Generated badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-violet-50 text-violet-600 border border-violet-200">
                        <Bot className="w-3 h-3" />
                        AI Generated
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800 leading-snug">{item.headline}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Source article #{item.feed_id}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    {item.status === 'approved' ? (
                      <button
                        onClick={() => publishApproved(item)}
                        disabled={busyId === item.id}
                        className="flex items-center gap-1.5 btn-primary text-xs disabled:opacity-70"
                      >
                        {busyId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Publish Now
                      </button>
                    ) : item.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => approve(item.id, true)}
                          disabled={busyId === item.id || !canApprove}
                          title={!canApprove ? 'Brand validation must pass before approval' : 'Approve & auto-publish'}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {busyId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          Approve & Publish
                        </button>
                        <button
                          onClick={() => reject(item.id)}
                          disabled={busyId === item.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 rounded-lg text-xs transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="p-1.5 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 grid lg:grid-cols-2 gap-6 bg-gray-50/50">
                  <div>
                    <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-2">
                      AI-Generated Content Preview
                    </label>
                    <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap bg-white border border-gray-200 text-forest-700 min-h-[120px]">
                      {item.content}
                    </div>
                    {item.validation_issues && (
                      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700">
                        <strong>Brand validation note:</strong> {item.validation_issues}
                      </div>
                    )}
                    {!canApprove && item.status !== 'approved' && (
                      <p className="text-xs text-amber-600 mt-2">⚠ Brand validation must pass before approval.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-forest-600 uppercase tracking-wider mb-2">
                      Review & Schedule
                    </label>
                    <textarea
                      value={notes[item.id] || ''}
                      onChange={(e) => setNotes((n) => ({ ...n, [item.id]: e.target.value }))}
                      placeholder="Add feedback or rejection reason…"
                      rows={5}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 resize-none bg-white"
                    />
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Scheduled Publish Time</label>
                      <input
                        type="datetime-local"
                        value={scheduleAt[item.id] || toLocalDatetimeValue()}
                        onChange={(e) => setScheduleAt((s) => ({ ...s, [item.id]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 bg-white"
                      />
                    </div>
                    <div className="mt-3 text-xs text-forest-500 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-gold-500 mt-0.5 shrink-0" />
                      Once approved, this post will be automatically published to <strong>{cfg.label}</strong> at the scheduled time.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-forest-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-serif text-lg">Queue is clear</p>
            <p className="text-sm mt-1">Approve RSS articles to trigger AI post generation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
