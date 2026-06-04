'use client';

import { useState } from 'react';
import { Instagram, Linkedin, Facebook, FileText, CheckCircle, XCircle, Clock, BarChart3, ExternalLink, RefreshCw } from 'lucide-react';

type PublishedPost = {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'blog';
  status: 'published' | 'failed' | 'scheduled';
  publishedAt: string;
  platformUrl?: string;
  city: string;
  likes?: number;
  comments?: number;
  reach?: number;
};

const mockPosts: PublishedPost[] = [
  { id: 'pub1', title: 'Keukenhof Gardens 2026 Guide', platform: 'instagram', status: 'published', publishedAt: '2026-06-04T09:00:00', platformUrl: '#', city: 'Amsterdam', likes: 234, comments: 18, reach: 4200 },
  { id: 'pub2', title: 'Keukenhof Gardens 2026 Guide', platform: 'linkedin', status: 'published', publishedAt: '2026-06-04T09:30:00', platformUrl: '#', city: 'Amsterdam', likes: 47, comments: 8, reach: 1100 },
  { id: 'pub3', title: 'Keukenhof Gardens 2026 Guide', platform: 'facebook', status: 'published', publishedAt: '2026-06-04T10:00:00', platformUrl: '#', city: 'Amsterdam', likes: 89, comments: 24, reach: 2300 },
  { id: 'pub4', title: 'Morning in Le Marais', platform: 'instagram', status: 'published', publishedAt: '2026-06-03T11:00:00', city: 'Paris', likes: 312, comments: 29, reach: 5800 },
  { id: 'pub5', title: 'Morning in Le Marais', platform: 'blog', status: 'published', publishedAt: '2026-06-03T11:30:00', city: 'Paris', reach: 890 },
  { id: 'pub6', title: 'Amsterdam Hidden Museums', platform: 'instagram', status: 'scheduled', publishedAt: '2026-06-05T10:00:00', city: 'Amsterdam' },
  { id: 'pub7', title: 'Louvre Night Openings', platform: 'facebook', status: 'failed', publishedAt: '2026-06-04T08:00:00', city: 'Paris' },
];

const platformConfig = {
  instagram: { icon: Instagram, color: 'text-rose-600 bg-rose-50', label: 'Instagram' },
  linkedin: { icon: Linkedin, color: 'text-blue-600 bg-blue-50', label: 'LinkedIn' },
  facebook: { icon: Facebook, color: 'text-blue-700 bg-blue-50', label: 'Facebook' },
  blog: { icon: FileText, color: 'text-forest-600 bg-forest-50', label: 'Blog' },
};

const platformStats = [
  { platform: 'Instagram', followers: '4.2K', engagement: '5.8%', posts: 47, icon: Instagram, color: 'from-rose-400 to-amber-400' },
  { platform: 'LinkedIn', followers: '1.1K', engagement: '3.2%', posts: 28, icon: Linkedin, color: 'from-blue-500 to-blue-700' },
  { platform: 'Facebook', followers: '2.8K', engagement: '4.1%', posts: 35, icon: Facebook, color: 'from-blue-600 to-blue-800' },
  { platform: 'Blog', followers: '—', engagement: '—', posts: 22, icon: FileText, color: 'from-forest-500 to-forest-700' },
];

export default function PublishingPage() {
  const [posts, setPosts] = useState<PublishedPost[]>(mockPosts);
  const [filter, setFilter] = useState<string>('all');
  const [retrying, setRetrying] = useState<string | null>(null);

  async function retryPost(id: string) {
    setRetrying(id);
    await new Promise((r) => setTimeout(r, 1500));
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, status: 'published' } : p)));
    setRetrying(null);
  }

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.platform === filter || p.status === filter);
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const failedCount = posts.filter((p) => p.status === 'failed').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Publishing</h1>
        <p className="text-sm text-forest-500">{publishedCount} published · {scheduledCount} scheduled · {failedCount} failed</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {platformStats.map((s) => (
          <div key={s.platform} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-lg font-bold text-forest-800">{s.followers}</div>
            <div className="text-xs font-medium text-forest-700">{s.platform}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{s.posts} posts</span>
              {s.engagement !== '—' && (
                <>
                  <span>·</span>
                  <span className="text-green-600 font-medium">{s.engagement} engagement</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Publishing Queue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-lg text-forest-800 flex-1">Publishing History</h2>
          <div className="flex gap-2">
            {[
              ['all', 'All'],
              ['published', 'Published'],
              ['scheduled', 'Scheduled'],
              ['failed', 'Failed'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === val ? 'bg-forest-600 text-cream-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((post) => {
                const config = platformConfig[post.platform];
                return (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-medium text-forest-800 text-sm">{post.title}</div>
                        <span className={`tag text-xs mt-1 ${post.city === 'Amsterdam' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>{post.city}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {post.status === 'published' ? (
                        <span className="status-approved">Published</span>
                      ) : post.status === 'scheduled' ? (
                        <span className="status-pending">Scheduled</span>
                      ) : (
                        <span className="status-rejected">Failed</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {post.status === 'published' && post.likes !== undefined ? (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>❤️ {post.likes}</span>
                          {post.comments !== undefined && <span>💬 {post.comments}</span>}
                          {post.reach !== undefined && (
                            <div className="flex items-center gap-0.5">
                              <BarChart3 className="w-3 h-3" />
                              {post.reach.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ) : post.status === 'published' && post.reach ? (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <BarChart3 className="w-3 h-3" />
                          {post.reach} views
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' && post.platformUrl && (
                          <a href={post.platformUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-forest-600 rounded transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {post.status === 'failed' && (
                          <button
                            onClick={() => retryPost(post.id)}
                            disabled={retrying === post.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${retrying === post.id ? 'animate-spin' : ''}`} />
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending approvals notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">2 posts approved and ready to publish</p>
          <p className="text-xs text-amber-600 mt-0.5">Go to the Approval Queue to review and publish approved content.</p>
        </div>
      </div>
    </div>
  );
}
