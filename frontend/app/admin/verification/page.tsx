'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, Star, Clock, Globe, Search } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  source: string;
  url: string;
  description: string;
  city: string;
  category: string;
  relevance_score: number;
  published_at: string;
  fetched_at: string;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewer_notes: string;
};

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Amsterdam\'s Hidden Museum Quarter: Beyond the Rijksmuseum',
    source: 'iAmsterdam',
    url: 'https://www.iamsterdam.com/hidden-museum-quarter',
    description: 'Discover lesser-known museums in Amsterdam\'s prestigious museum district, from the Stedelijk\'s modern art to the intriguing Moco Museum just steps away.',
    city: 'Amsterdam',
    category: 'Museums',
    relevance_score: 92,
    published_at: '2026-06-03T14:00:00',
    fetched_at: '2026-06-04T06:00:00',
    status: 'pending_review',
    reviewer_notes: '',
  },
  {
    id: '2',
    title: 'Best Neighbourhood Bistros in the 11th Arrondissement',
    source: 'Paris Update',
    url: 'https://parisupdate.com/bistros-11th',
    description: 'The 11th arrondissement has quietly become Paris\'s most exciting dining neighbourhood. Here are seven bistros that locals actually love, without tourist markups.',
    city: 'Paris',
    category: 'Food',
    relevance_score: 88,
    published_at: '2026-06-02T10:00:00',
    fetched_at: '2026-06-04T06:00:00',
    status: 'pending_review',
    reviewer_notes: '',
  },
  {
    id: '3',
    title: 'Summer Night Openings at the Louvre',
    source: 'Paris Tourist Office',
    url: 'https://en.parisinfo.com/louvre-nights',
    description: 'The Louvre is opening its doors on Friday evenings until midnight throughout July and August, offering a quieter, more intimate experience of the world\'s most visited museum.',
    city: 'Paris',
    category: 'Events',
    relevance_score: 95,
    published_at: '2026-06-01T09:00:00',
    fetched_at: '2026-06-04T06:00:00',
    status: 'pending_review',
    reviewer_notes: '',
  },
  {
    id: '4',
    title: 'Keukenhof Gardens 2026: Everything You Need to Know',
    source: 'DutchNews.nl',
    url: 'https://dutchnews.nl/keukenhof-2026',
    description: 'The world\'s most beautiful spring garden opens for its 77th season with new tulip varieties, extended hours, and a special night-lighting event in April.',
    city: 'Amsterdam',
    category: 'Culture',
    relevance_score: 85,
    published_at: '2026-05-30T11:00:00',
    fetched_at: '2026-06-04T08:00:00',
    status: 'pending_review',
    reviewer_notes: '',
  },
  {
    id: '5',
    title: 'New Budget Airline Route: London to Paris',
    source: 'Travel News Daily',
    url: '#',
    description: 'A new low-cost carrier is launching a daily London–Paris route from August 2026, with fares starting at £19 one way.',
    city: 'Paris',
    category: 'Travel',
    relevance_score: 34,
    published_at: '2026-06-01T08:00:00',
    fetched_at: '2026-06-04T08:00:00',
    status: 'pending_review',
    reviewer_notes: '',
  },
];

export default function VerificationPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('pending_review');
  const [search, setSearch] = useState('');

  function setStatus(id: string, status: 'approved' | 'rejected') {
    setArticles((as) =>
      as.map((a) => (a.id === id ? { ...a, status, reviewer_notes: notes[id] || '' } : a))
    );
  }

  const filtered = articles.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.source.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pendingCount = articles.filter((a) => a.status === 'pending_review').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Verification Queue</h1>
        <p className="text-sm text-forest-500">{pendingCount} articles awaiting your review</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-forest-400 w-64"
          />
        </div>
        <div className="flex gap-2">
          {([['all', 'All'], ['pending_review', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === val ? 'bg-forest-600 text-cream-100' : 'bg-white text-forest-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map((article) => (
          <div
            key={article.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              article.status === 'approved' ? 'border-green-200' : article.status === 'rejected' ? 'border-red-200' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`tag text-xs ${article.city === 'Amsterdam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'}`}>
                      {article.city}
                    </span>
                    <span className="tag-forest text-xs">{article.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />{article.source}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-forest-800 mb-1">{article.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.published_at).toLocaleDateString('en-GB')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold-500" />
                      <span>Relevance: </span>
                      <span className={`font-semibold ${article.relevance_score >= 70 ? 'text-green-600' : article.relevance_score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                        {article.relevance_score}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {article.status === 'pending_review' ? (
                    <>
                      <button
                        onClick={() => setStatus(article.id, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setStatus(article.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={article.status === 'approved' ? 'status-approved' : 'status-rejected'}>
                      {article.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                    className="p-1.5 text-gray-400 hover:text-forest-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    {expanded === article.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded */}
            {expanded === article.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                <p className="text-sm text-forest-600 leading-relaxed">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-800 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View original article
                </a>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Reviewer Notes</label>
                  <textarea
                    value={notes[article.id] || ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [article.id]: e.target.value }))}
                    placeholder="Add notes about this article..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-forest-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No articles found</p>
            <p className="text-sm mt-1">Change your filters or check back after the next RSS fetch.</p>
          </div>
        )}
      </div>
    </div>
  );
}
