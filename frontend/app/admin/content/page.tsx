'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, FileText, Instagram, Linkedin, Loader2, Mail, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { Feed, GeneratedContent, fetchContent, fetchFeeds, generateContent, runBrandValidation } from '@/lib/admin-api';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  newsletter: Mail,
  blog: FileText,
};

function parseList(value: string | null) {
  if (!value) return '';
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join(' ') : String(parsed);
  } catch {
    return value;
  }
}

export default function ContentPage() {
  const [approvedFeeds, setApprovedFeeds] = useState<Feed[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<'generate' | 'validate' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const [feeds, content] = await Promise.all([
        fetchFeeds({ status: 'approved' }),
        fetchContent(),
      ]);
      setApprovedFeeds(feeds);
      setItems(content);
      if (!selected && feeds.length > 0) {
        setSelected(String(feeds[0].id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load content');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function runGenerate() {
    setRunning('generate');
    setMessage('');
    setError('');
    try {
      const feedId = selected ? Number(selected) : undefined;
      const result = await generateContent(feedId ? [feedId] : undefined);
      const created = result.result.created;
      setMessage(`Content generation completed. Created ${Array.isArray(created) ? created.length : 0} new drafts.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Content generation failed');
    } finally {
      setRunning(null);
    }
  }

  async function runValidation(ids?: number[]) {
    setRunning('validate');
    setMessage('');
    setError('');
    try {
      const result = await runBrandValidation(ids);
      setMessage(result.message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Brand validation failed');
    } finally {
      setRunning(null);
    }
  }

  async function copyText(text: string, id: number) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const draftCount = useMemo(() => items.filter((item) => item.status === 'draft').length, [items]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Content Generator</h1>
        <p className="text-sm text-forest-500">Generate branded posts from approved RSS articles, then run brand checking</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="font-serif text-lg text-forest-800 mb-4">Generate New Content</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">Approved Article</label>
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 bg-white"
            >
              {approvedFeeds.length === 0 ? (
                <option value="">No approved articles yet</option>
              ) : approvedFeeds.map((feed) => (
                <option key={feed.id} value={feed.id}>{feed.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={runGenerate}
            disabled={running === 'generate' || approvedFeeds.length === 0}
            className="btn-primary text-xs shrink-0 disabled:opacity-70 min-w-[170px] justify-center"
          >
            {running === 'generate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Content
          </button>
          <button
            onClick={() => runValidation()}
            disabled={running === 'validate' || items.length === 0}
            className="btn-secondary text-xs shrink-0 disabled:opacity-70 min-w-[160px] justify-center"
          >
            {running === 'validate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Run Brand Check
          </button>
        </div>
        <p className="text-xs text-forest-400 mt-3">{draftCount} drafts currently need validation or approval.</p>
      </div>

      {message && <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">{message}</div>}
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-forest-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading generated content
          </div>
        ) : items.map((item) => {
          const Icon = platformIcons[item.platform] || FileText;
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="tag-forest text-xs flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {item.platform}
                      </span>
                      <span className={item.status === 'approved' ? 'status-approved' : item.status === 'rejected' ? 'status-rejected' : 'status-draft'}>
                        {item.status}
                      </span>
                      <span className={item.validation_status === 'passed' ? 'status-approved' : item.validation_status === 'failed' ? 'status-rejected' : 'status-pending'}>
                        {item.validation_status || 'not_checked'}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800">{item.headline}</h3>
                    <p className="text-xs text-gray-400 mt-1">Feed #{item.feed_id}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => runValidation([item.id])}
                      disabled={running === 'validate'}
                      className="btn-secondary text-xs disabled:opacity-70"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Check
                    </button>
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
                <div className="border-t border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Generated Copy</label>
                    <button onClick={() => copyText(item.content, item.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-forest-600">
                      {copied === item.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <pre className="text-sm text-forest-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">{item.content}</pre>
                  {item.hashtags && <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3 mt-3">{parseList(item.hashtags)}</p>}
                  {item.validation_issues && (
                    <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700">
                      {item.validation_issues}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div className="text-center py-16 text-forest-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No generated content yet</p>
            <p className="text-sm mt-1">Approve an RSS article, then run content generation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
