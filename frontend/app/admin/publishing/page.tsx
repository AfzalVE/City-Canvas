'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle, Clock, ExternalLink, FileText, Instagram, Linkedin, Loader2, Mail, RefreshCw, XCircle } from 'lucide-react';
import { GeneratedContent, PublishLog, fetchContent, fetchPublishLogs, updatePublishStatus } from '@/lib/admin-api';

const platformConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  instagram: { icon: Instagram, color: 'text-rose-600 bg-rose-50', label: 'Instagram' },
  linkedin: { icon: Linkedin, color: 'text-blue-600 bg-blue-50', label: 'LinkedIn' },
  newsletter: { icon: Mail, color: 'text-amber-700 bg-amber-50', label: 'Newsletter' },
  blog: { icon: FileText, color: 'text-forest-600 bg-forest-50', label: 'Blog' },
};

export default function PublishingPage() {
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const [logData, contentData] = await Promise.all([fetchPublishLogs(), fetchContent()]);
      setLogs(logData);
      setContent(contentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load publishing history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markStatus(id: number, status: 'published' | 'failed') {
    setBusyId(id);
    setMessage('');
    setError('');
    try {
      await updatePublishStatus(id, status);
      setMessage(`Publish log marked ${status}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update publish status');
    } finally {
      setBusyId(null);
    }
  }

  const contentById = useMemo(() => {
    return new Map(content.map((item) => [item.id, item]));
  }, [content]);

  const filtered = logs.filter((log) => filter === 'all' || log.status === filter || log.platform === filter);
  const publishedCount = logs.filter((log) => log.status === 'published').length;
  const queuedCount = logs.filter((log) => log.status === 'queued' || log.status === 'manual_publish_required').length;
  const failedCount = logs.filter((log) => log.status === 'failed').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Publishing</h1>
        <p className="text-sm text-forest-500">
          {publishedCount} published &middot; {queuedCount} queued &middot; {failedCount} failed
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const count = logs.filter((log) => log.platform === platform).length;
          return (
            <div key={platform} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center mb-3`}>
                <config.icon className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-forest-800">{count}</div>
              <div className="text-xs font-medium text-forest-700">{config.label}</div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <BarChart3 className="w-3 h-3" />
                <span>{logs.filter((log) => log.platform === platform && log.status === 'published').length} published</span>
              </div>
            </div>
          );
        })}
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-lg text-forest-800 flex-1">Publishing Queue</h2>
          <button onClick={load} className="p-1.5 text-gray-400 hover:text-forest-600 rounded">
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {[
              ['all', 'All'],
              ['published', 'Published'],
              ['manual_publish_required', 'Queued'],
              ['failed', 'Failed'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === value ? 'bg-forest-600 text-cream-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-forest-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading publishing queue
                  </td>
                </tr>
              ) : filtered.map((log) => {
                const item = contentById.get(log.content_id);
                const config = platformConfig[log.platform] || {
                  icon: FileText,
                  color: 'text-gray-600 bg-gray-50',
                  label: log.platform,
                };

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-forest-800 text-sm">{item?.headline || `Content #${log.content_id}`}</div>
                      {log.response_message && <div className="text-xs text-gray-400 mt-1 line-clamp-1">{log.response_message}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {log.status === 'published' ? (
                        <span className="status-approved">Published</span>
                      ) : log.status === 'failed' ? (
                        <span className="status-rejected">Failed</span>
                      ) : (
                        <span className="status-pending">{log.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.scheduled_publish_time
                          ? new Date(log.scheduled_publish_time).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
                          : 'Not scheduled'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {log.post_url && (
                          <a href={log.post_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-forest-600 rounded transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {log.status !== 'published' && (
                          <button
                            onClick={() => markStatus(log.id, 'published')}
                            disabled={busyId === log.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                          >
                            {busyId === log.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Mark Published
                          </button>
                        )}
                        {log.status !== 'failed' && log.status !== 'published' && (
                          <button
                            onClick={() => markStatus(log.id, 'failed')}
                            disabled={busyId === log.id}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-60"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-forest-400">
                    No publish logs found. Approve and queue content to create publishing records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
