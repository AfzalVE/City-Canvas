'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Facebook,
  FileText,
  Instagram,
  Linkedin,
  Loader2,
  RefreshCw,
  Send,
  Twitter,
  XCircle,
} from 'lucide-react';
import { GeneratedContent, PublishLog, fetchContent, fetchPublishLogs, updatePublishStatus } from '../../../lib/admin-api';

type PublishingItem = {
  id: number;
  contentId: number;
  platform: string;
  title: string;
  preview: string;
  image: string;
  scheduledAt: string | null;
  status: 'Ready to Publish' | 'Scheduled' | 'Published' | 'Failed';
};

const platformIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  blog: FileText,
  newsletter: Facebook,
};

const starterItems: PublishingItem[] = [
  {
    id: 8001,
    contentId: 7103,
    platform: 'instagram',
    title: 'Paris Market Instagram Caption',
    preview: 'Paris evenings, golden lights and market magic ✨ Wander through festive stalls and taste something warm...',
    image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=800',
    scheduledAt: '2026-06-10T18:30:00Z',
    status: 'Scheduled',
  },
  {
    id: 8002,
    contentId: 7101,
    platform: 'blog',
    title: 'Hidden Canals of Amsterdam: A Luxury Slow Travel Guide',
    preview: 'A polished long-form blog post for travellers who want quiet canals, boutique stays and local cultural moments.',
    image: 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=800',
    scheduledAt: null,
    status: 'Ready to Publish',
  },
  {
    id: 8003,
    contentId: 7104,
    platform: 'linkedin',
    title: 'Why seasonal city experiences drive premium travel demand',
    preview: 'Seasonal city experiences continue to drive premium travel demand across Europe...',
    image: 'https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=800',
    scheduledAt: '2026-06-11T10:00:00Z',
    status: 'Ready to Publish',
  },
];

function statusClass(status: PublishingItem['status']) {
  if (status === 'Published') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'Failed') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'Scheduled') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-sky-50 text-sky-700 border-sky-200';
}

function platformBadge(platform: string) {
  if (platform === 'instagram') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (platform === 'linkedin') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (platform === 'facebook' || platform === 'newsletter') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (platform === 'twitter') return 'bg-gray-50 text-gray-700 border-gray-200';
  return 'bg-forest-50 text-forest-700 border-forest-200';
}

function formatDate(value: string | null) {
  if (!value) return 'Immediate / not scheduled';
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function imageFor(platform: string) {
  if (platform === 'instagram') return 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=800';
  if (platform === 'linkedin') return 'https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=800';
  return 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?auto=compress&cs=tinysrgb&w=800';
}

function fromLog(log: PublishLog, content?: GeneratedContent): PublishingItem {
  const status: PublishingItem['status'] = log.status === 'published' ? 'Published' : log.status === 'failed' ? 'Failed' : log.scheduled_publish_time ? 'Scheduled' : 'Ready to Publish';
  return {
    id: log.id,
    contentId: log.content_id,
    platform: log.platform,
    title: content?.headline || `${log.platform} approved post`,
    preview: content?.content?.slice(0, 140) || log.response_message || 'Approved content is ready for publishing.',
    image: imageFor(log.platform),
    scheduledAt: log.scheduled_publish_time,
    status,
  };
}

export default function PublishingPage() {
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<PublishingItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [l, c] = await Promise.all([fetchPublishLogs(), fetchContent()]);
      setLogs(l);
      setContent(c);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    const mapped = logs.map((log) => fromLog(log, content.find((c) => c.id === log.content_id)));
    const ids = new Set(mapped.map((i) => i.id));
    return [...starterItems.filter((i) => !ids.has(i.id)), ...mapped];
  }, [logs, content]);

  async function publishNow(item: PublishingItem) {
    setBusyId(item.id);
    try {
      if (logs.some((l) => l.id === item.id)) await updatePublishStatus(item.id, 'published');
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] p-6 lg:p-8 text-gray-900">
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl animate-scale-in">
            <img src={selected.image} alt="" className="h-56 w-full object-cover" />
            <div className="p-6">
              <div className="mb-3 flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${platformBadge(selected.platform)}`}>{selected.platform}</span><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(selected.status)}`}>{selected.status}</span></div>
              <h3 className="text-2xl font-bold text-forest-900">{selected.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{selected.preview}</p>
              <div className="mt-5 rounded-2xl bg-[#F8FAF7] p-4 text-sm text-gray-600"><CalendarClock className="mr-2 inline h-4 w-4 text-forest-700" />{formatDate(selected.scheduledAt)}</div>
              <button onClick={() => setSelected(null)} className="mt-5 rounded-xl bg-forest-700 px-5 py-3 text-sm font-bold text-white hover:bg-forest-800">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-3 py-1 text-xs font-semibold text-forest-700 shadow-sm">
            <Send className="h-3.5 w-3.5" /> Auto Publishing Queue
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">Auto Publishing</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">Approved and scheduled post content only. RSS fetching and AI generation stay in their own workflow pages.</p>
        </div>
        <button onClick={load} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50"><RefreshCw className="mr-2 inline h-4 w-4" /> Refresh Queue</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Ready to Publish</p><p className="mt-2 text-3xl font-extrabold text-sky-700">{items.filter(i => i.status === 'Ready to Publish').length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Scheduled</p><p className="mt-2 text-3xl font-extrabold text-amber-700">{items.filter(i => i.status === 'Scheduled').length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Published</p><p className="mt-2 text-3xl font-extrabold text-emerald-700">{items.filter(i => i.status === 'Published').length}</p></div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Failed</p><p className="mt-2 text-3xl font-extrabold text-red-700">{items.filter(i => i.status === 'Failed').length}</p></div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-forest-900">Approved / Scheduled Posts</h2>
            <p className="mt-1 text-sm text-gray-500">Publish immediately, edit schedules, cancel schedules, or review full content.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-forest-700"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading publishing queue...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-[#F8FAF7] text-xs uppercase tracking-wide text-gray-500">
                <tr><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Post title</th><th className="px-4 py-3">Post preview</th><th className="px-4 py-3">Image</th><th className="px-4 py-3">Scheduled date/time</th><th className="px-4 py-3">Publishing status</th><th className="px-4 py-3">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {items.map((item) => {
                  const Icon = platformIcon[item.platform] || Send;
                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAF7]">
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${platformBadge(item.platform)}`}><Icon className="h-3.5 w-3.5" />{item.platform === 'newsletter' ? 'facebook' : item.platform}</span></td>
                      <td className="max-w-[220px] px-4 py-4 font-semibold text-gray-900">{item.title}</td>
                      <td className="max-w-[300px] px-4 py-4 text-gray-500"><p className="line-clamp-2">{item.preview}</p></td>
                      <td className="px-4 py-4"><img src={item.image} alt="" className="h-14 w-20 rounded-xl object-cover" /></td>
                      <td className="px-4 py-4 text-gray-600"><Clock className="mr-1 inline h-3.5 w-3.5 text-forest-700" />{formatDate(item.scheduledAt)}</td>
                      <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span></td>
                      <td className="px-4 py-4"><div className="flex flex-wrap gap-2"><button onClick={() => publishNow(item)} disabled={busyId === item.id || item.status === 'Published'} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-700 px-3 py-2 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busyId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Publish Now</button><button className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"><Edit3 className="h-3.5 w-3.5" /> Edit Schedule</button><button className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><XCircle className="h-3.5 w-3.5" /> Cancel</button><button onClick={() => setSelected(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"><Eye className="h-3.5 w-3.5" /> View Full</button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
