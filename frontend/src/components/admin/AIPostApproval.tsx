'use client';

import { useState } from 'react';
import { Calendar, Eye, Loader2, RotateCcw, Send, ThumbsUp, ThumbsDown, X, Clock, Share2 } from 'lucide-react';

export interface AIPost {
  id: number;
  headline: string;
  content: string;
  platform: string;
  featured_image_url?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'published';
  created_at: string;
  scheduled_publish_time?: string;
  hashtags?: string;
}

interface AIPostApprovalProps {
  posts: AIPost[];
  isLoading?: boolean;
  onRegenerate?: (id: number) => Promise<void>;
  onApprove?: (id: number) => Promise<void>;
  onSchedule?: (id: number, date: string) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onPost?: (id: number) => Promise<void>;
}

export default function AIPostApproval({
  posts,
  isLoading = false,
  onRegenerate,
  onApprove,
  onSchedule,
  onReject,
  onPost,
}: AIPostApprovalProps) {
  const [selectedPost, setSelectedPost] = useState<AIPost | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [schedulePost, setSchedulePost] = useState<AIPost | null>(null);

  const handleAction = async (action: () => Promise<void>, postId: number, message: string) => {
    setProcessingId(postId);
    try {
      await action();
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleDate || !schedulePost) return;
    await handleAction(
      () => onSchedule?.(schedulePost.id, scheduleDate),
      schedulePost.id,
      '📅 Post scheduled successfully!'
    );
    setShowScheduleModal(false);
    setScheduleDate('');
    setSchedulePost(null);
  };

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

  const getPlatformIcon = (platform: string) => {
    return <Share2 className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Full Content Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-forest-800">Post Preview</h2>
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
              <div className="mb-4">
                <h3 className="font-serif text-2xl text-forest-800 mb-2">{selectedPost.headline}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(selectedPost.platform)}`}>
                    {getPlatformIcon(selectedPost.platform)}
                    {selectedPost.platform}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(selectedPost.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                {selectedPost.content}
              </div>
              {selectedPost.hashtags && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">Suggested Hashtags</p>
                  <p className="text-sm text-gray-700">{selectedPost.hashtags}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && schedulePost && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="border-b p-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-forest-800">Schedule Post</h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleDate('');
                  setSchedulePost(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                Headline: <span className="font-medium">{schedulePost.headline}</span>
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setScheduleDate('');
                    setSchedulePost(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  disabled={!scheduleDate}
                  className="flex-1 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No AI posts available</p>
        </div>
      )}

      {/* Post Items */}
      {!isLoading &&
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 p-4">
              {post.featured_image_url && (
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={post.featured_image_url} alt={post.headline} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="font-serif text-lg text-forest-800 line-clamp-2 mb-2">{post.headline}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)}
                      {post.platform}
                    </span>
                    <span className="text-xs text-gray-600">{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.scheduled_publish_time && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        Scheduled
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">{post.content}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    See More
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() =>
                      handleAction(
                        () => onRegenerate?.(post.id),
                        post.id,
                        '🔄 Post regenerated!'
                      )
                    }
                    disabled={processingId === post.id}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {processingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Regenerate
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        () => onApprove?.(post.id),
                        post.id,
                        '✅ Post approved!'
                      )
                    }
                    disabled={processingId === post.id}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {processingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSchedulePost(post);
                      setShowScheduleModal(true);
                    }}
                    disabled={processingId === post.id}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    {processingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                    Schedule
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        () => onPost?.(post.id),
                        post.id,
                        '🎉 Post successful!'
                      )
                    }
                    disabled={processingId === post.id}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {processingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Post Now
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        () => onReject?.(post.id),
                        post.id,
                        '📋 Post rejected'
                      )
                    }
                    disabled={processingId === post.id}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {processingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
