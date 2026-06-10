'use client';

import { useState } from 'react';
import { Eye, ExternalLink, Loader2, X, Calendar, Share2 } from 'lucide-react';

export interface PublishedPost {
  id: number;
  headline: string;
  platform: string;
  published_date: string;
  featured_image_url?: string;
  post_url?: string;
  status: 'published' | 'failed' | 'queued';
}

interface AutoPublishProps {
  posts: PublishedPost[];
  isLoading?: boolean;
}

export default function AutoPublish({ posts, isLoading = false }: AutoPublishProps) {
  const [selectedPost, setSelectedPost] = useState<PublishedPost | null>(null);

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-pink-100 text-pink-800',
      facebook: 'bg-blue-100 text-blue-800',
      twitter: 'bg-sky-100 text-sky-800',
      linkedin: 'bg-blue-600 text-white',
      blog: 'bg-green-100 text-green-800',
    };
    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      queued: 'bg-amber-100 text-amber-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      published: <Share2 className="w-3 h-3" />,
      queued: <Calendar className="w-3 h-3" />,
      failed: <X className="w-3 h-3" />,
    };
    return icons[status] || <Share2 className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Full Content Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-forest-800">Published Post</h2>
              <button onClick={() => setSelectedPost(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedPost.featured_image_url && (
                <img
                  src={selectedPost.featured_image_url}
                  alt={selectedPost.headline}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}
              <div className="mb-6">
                <h3 className="font-serif text-2xl text-forest-800 mb-3">{selectedPost.headline}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(selectedPost.platform)}`}>
                    <Share2 className="w-3 h-3" />
                    {selectedPost.platform}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPost.status)}`}>
                    {getStatusIcon(selectedPost.status)}
                    {selectedPost.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(selectedPost.published_date).toLocaleString()}
                  </span>
                </div>
              </div>
              {selectedPost.post_url && (
                <a
                  href={selectedPost.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Post
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-forest-800">Auto Published Posts</h2>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-forest-800">{posts.length}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No published posts yet</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && posts.length > 0 && (
        <div className="grid gap-4">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-xs font-bold text-gray-700 uppercase">
            <div className="md:col-span-4">Post</div>
            <div className="md:col-span-2">Platform</div>
            <div className="md:col-span-2">Status</div>
            <div className="md:col-span-3">Date & Time</div>
            <div className="md:col-span-1">Action</div>
          </div>

          {/* Post Rows */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="grid md:grid-cols-12 gap-4 items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="md:col-span-4">
                <div className="flex gap-3">
                  {post.featured_image_url && (
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={post.featured_image_url} alt={post.headline} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm text-forest-800 line-clamp-2">{post.headline}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.platform)}`}>
                  <Share2 className="w-3 h-3" />
                  {post.platform}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                  {getStatusIcon(post.status)}
                  {post.status}
                </span>
              </div>

              <div className="md:col-span-3">
                <p className="text-sm text-gray-600">{new Date(post.published_date).toLocaleString()}</p>
              </div>

              <div className="md:col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View full post"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {post.post_url && (
                  <a
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open original post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
