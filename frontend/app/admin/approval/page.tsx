'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, FileText, Instagram, Linkedin, Loader2, Mail, Send, XCircle } from 'lucide-react';
import { GeneratedContent, approveContent, fetchContent, rejectContent, schedulePublish } from '@/lib/admin-api';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  newsletter: Mail,
  blog: FileText,
};

function toLocalDatetimeValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
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

  useEffect(() => {
    load();
  }, []);

  async function approve(id: number, publishAfterApproval = false) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    setBusyId(id);
    setError('');
    setMessage('');
    try {
      const scheduled = scheduleAt[id] || toLocalDatetimeValue();
      const isoSchedule = new Date(scheduled).toISOString();
      await approveContent(id, isoSchedule);
      if (publishAfterApproval) {
        await schedulePublish(id, item.platform, isoSchedule);
      }
      setMessage(publishAfterApproval ? 'Content approved and queued for publishing.' : 'Content approved.');
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

  async function queueApproved(item: GeneratedContent) {
    setBusyId(item.id);
    setError('');
    setMessage('');
    try {
      const scheduled = scheduleAt[item.id] || toLocalDatetimeValue();
      await schedulePublish(item.id, item.platform, new Date(scheduled).toISOString());
      setMessage('Approved content queued for publishing.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to queue publishing');
    } finally {
      setBusyId(null);
    }
  }

  const pending = useMemo(() => {
    return items.filter((item) => item.status === 'draft' || item.status === 'pending_review').length;
  }, [items]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Approval Queue</h1>
        <p className="text-sm text-forest-500">{pending} posts awaiting human approval before publishing</p>
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-forest-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading approval queue
          </div>
        ) : items.map((item) => {
          const Icon = platformIcons[item.platform] || FileText;
          const canApprove = item.validation_status === 'passed' || item.validation_status === 'needs_human_attention';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                item.status === 'approved' ? 'border-green-200' : item.status === 'rejected' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="tag-forest text-xs flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {item.platform}
                      </span>
                      <span className={item.status === 'approved' ? 'status-approved' : item.status === 'rejected' ? 'status-rejected' : 'status-pending'}>
                        {item.status}
                      </span>
                      <span className={canApprove ? 'status-approved' : 'status-pending'}>
                        {item.validation_status || 'not_checked'}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800">{item.headline}</h3>
                    <p className="text-xs text-gray-400 mt-1">Feed #{item.feed_id}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'approved' ? (
                      <button onClick={() => queueApproved(item)} disabled={busyId === item.id} className="btn-primary text-xs disabled:opacity-70">
                        {busyId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Queue
                      </button>
                    ) : item.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => approve(item.id, true)}
                          disabled={busyId === item.id || !canApprove}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          title={canApprove ? 'Approve and queue for manual publishing' : 'Run brand check before approval'}
                        >
                          {busyId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Approve & Queue
                        </button>
                        <button
                          onClick={() => reject(item.id)}
                          disabled={busyId === item.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="p-1.5 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded"
                    >
                      {expanded === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {expanded === item.id && (
                <div className="border-t border-gray-100 p-5 grid lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Content Preview</label>
                    <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 border border-gray-100 text-forest-700">
                      {item.content}
                    </div>
                    {item.validation_issues && (
                      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700">
                        {item.validation_issues}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Approval Notes</label>
                    <textarea
                      value={notes[item.id] || ''}
                      onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                      placeholder="Add feedback or rejection reason..."
                      rows={5}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 resize-none"
                    />

                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Schedule Time</label>
                      <input
                        type="datetime-local"
                        value={scheduleAt[item.id] || toLocalDatetimeValue()}
                        onChange={(event) => setScheduleAt((current) => ({ ...current, [item.id]: event.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400"
                      />
                    </div>

                    {!canApprove && item.status !== 'approved' && (
                      <p className="text-xs text-amber-600 mt-3">Run Brand Check in Content Generator before approving this item.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div className="text-center py-16 text-forest-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No content waiting for approval</p>
            <p className="text-sm mt-1">Generate content from approved articles to fill this queue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
