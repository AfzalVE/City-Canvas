'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, ThumbsDown, ThumbsUp, Loader2, X } from 'lucide-react';

export interface RSSItem {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  link: string;
  source_name: string;
  published_date: string;
  relevance_score?: number;
}

interface RSSAgentFeedProps {
  items: RSSItem[];
  isLoading?: boolean;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
}

export default function RSSAgentFeed({ items, isLoading = false, onApprove, onReject }: RSSAgentFeedProps) {
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await onApprove?.(id);
      setSuccessMessage('🎉 Generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await onReject?.(id);
      setSuccessMessage('📋 Item rejected');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
          {successMessage}
        </div>
      )}

      {/* Modal for Full Content Preview */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-forest-800">Article Preview</h2>
              <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedItem.image_url && (
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}
              <div className="mb-4">
                <h3 className="font-serif text-2xl text-forest-800 mb-2">{selectedItem.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{selectedItem.source_name}</span>
                  <span>{new Date(selectedItem.published_date).toLocaleDateString()}</span>
                  {selectedItem.relevance_score && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Relevance: {selectedItem.relevance_score}%
                    </span>
                  )}
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                {selectedItem.description}
              </div>
              <a 
                href={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Read Original Article →
              </a>
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
      {!isLoading && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No RSS articles available</p>
        </div>
      )}

      {/* Feed Items */}
      {!isLoading && items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex gap-4 p-4">
            {item.image_url && (
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                <img 
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="font-serif text-lg text-forest-800 line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <span className="font-medium">{item.source_name}</span>
                  <span>•</span>
                  <span>{new Date(item.published_date).toLocaleDateString()}</span>
                  {item.relevance_score && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3" />
                        {item.relevance_score}% match
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                {item.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  See More
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => handleApprove(item.id)}
                  disabled={processingId === item.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {processingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-4 h-4" />
                  )}
                  Approve & Generate
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  disabled={processingId === item.id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {processingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-4 h-4" />
                  )}
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
