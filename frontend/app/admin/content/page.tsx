'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Instagram, Linkedin, Facebook, FileText, ChevronDown, ChevronUp, RefreshCw, Copy, Check } from 'lucide-react';

type ContentItem = {
  id: string;
  articleTitle: string;
  articleSource: string;
  city: string;
  instagram: string;
  hashtags: string;
  linkedin: string;
  facebook: string;
  blogTitle: string;
  blogExcerpt: string;
  status: 'draft' | 'pending_approval';
  generatedAt: string;
};

const mockApprovedArticles = [
  { id: 'a1', title: 'Amsterdam\'s Hidden Museum Quarter: Beyond the Rijksmuseum', source: 'iAmsterdam', city: 'Amsterdam' },
  { id: 'a2', title: 'Best Neighbourhood Bistros in the 11th Arrondissement', source: 'Paris Update', city: 'Paris' },
  { id: 'a3', title: 'Summer Night Openings at the Louvre', source: 'Paris Tourist Office', city: 'Paris' },
];

const mockGenerated: ContentItem[] = [
  {
    id: 'c1',
    articleTitle: 'Keukenhof Gardens 2026: Everything You Need to Know',
    articleSource: 'DutchNews.nl',
    city: 'Amsterdam',
    instagram: 'Fields of dreams, quite literally. 🌷\n\nKeukenhof 2026 is open and it\'s more magical than ever — 7 million bulbs in bloom across 32 hectares of pure Dutch springtime joy.\n\nNew this year: evening light shows every Friday in April, and a record-breaking collection of rare black tulips. This is a place that stops time.',
    hashtags: '#Keukenhof #Amsterdam #Tulips #DutchSpring #Netherlands #SlowTravel #NeemTravels #GardenLover #TravelEurope #Amsterdam2026',
    linkedin: 'Every year, Keukenhof Gardens in the Netherlands reminds us why slow travel matters.\n\nWhile 1.5 million visitors come for the tulip fields, the real magic is in how the garden changes hour by hour — morning mist over the lake, midday sun on the parrot tulips, evening gold on the daffodils.\n\nFor our clients at Neem Travels, we always recommend an early opening visit and a picnic lunch in the quieter southern section. No rushing. No bucket lists. Just being present in one of the world\'s most extraordinary natural spectacles.\n\n2026 brings extended Friday evening openings and a new rare tulip exhibition. Worth planning your Amsterdam trip around.',
    facebook: 'Have you been to Keukenhof Gardens? 🌷\n\nEvery spring, the Dutch countryside near Amsterdam becomes one of the most colourful places on Earth. Keukenhof 2026 is open now through mid-May, and if you\'re planning an Amsterdam trip — this is non-negotiable.\n\nOur tip: arrive at opening time (8am) on a weekday. The first hour, before the crowds arrive, is something else entirely.\n\nWe can help you plan your perfect Amsterdam spring itinerary — gardens, museums, canal walks, and the best Dutch pea soup you\'ll ever taste. Drop us a message!',
    blogTitle: 'Keukenhof 2026: The Complete Guide to Amsterdam\'s Tulip Season',
    blogExcerpt: 'Every spring, a small corner of the Netherlands transforms into the most colourful place on Earth. Here\'s everything you need to know to make the most of Keukenhof 2026.',
    status: 'draft',
    generatedAt: '2026-06-04T10:30:00',
  },
];

export default function ContentPage() {
  const [selected, setSelected] = useState<string>('a1');
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<ContentItem[]>(mockGenerated);
  const [expanded, setExpanded] = useState<string | null>('c1');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  async function generateContent() {
    const article = mockApprovedArticles.find((a) => a.id === selected);
    if (!article) return;
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 3000));

    const newContent: ContentItem = {
      id: `c${Date.now()}`,
      articleTitle: article.title,
      articleSource: article.source,
      city: article.city,
      instagram: `There\'s a Paris that most visitors never find.\n\nIt lives in the ${article.city === 'Paris' ? 'winding streets of the 11th arrondissement' : 'canal rings of Jordaan'}, in the neighbourhood bistros with handwritten menus and the same regulars every Tuesday. This is the ${article.city} we want to show you — unhurried, unfiltered, unforgettable.`,
      hashtags: `#${article.city} #SlowTravel #NeemTravels #TravelEurope #${article.city}Life #HiddenGems #CulturalTravel #TravelInspiration`,
      linkedin: `At Neem Travels, we\'ve always believed that the best travel experiences come from genuine local knowledge.\n\n${article.title}\n\nThis piece from ${article.source} captures exactly what we try to offer our guests — authentic, unhurried insight into the cities we love. Read the full story on our blog.`,
      facebook: `Did you know? ${article.title.split(':')[0]}!\n\nThis is the kind of story that makes us love ${article.city} so much. The city rewards the curious — those willing to look past the famous sights and discover what makes this place truly special.\n\nIf you\'re planning a trip to ${article.city}, we\'d love to help you find these hidden gems. Message us or visit our website.`,
      blogTitle: `${article.title}: A Neem Travels Guide`,
      blogExcerpt: `Discover what makes ${article.city} so endlessly fascinating — through the lens of slow, intentional travel. Our guide to ${article.title.split(':')[0].toLowerCase()}.`,
      status: 'draft',
      generatedAt: new Date().toISOString(),
    };

    setContent((c) => [newContent, ...c]);
    setExpanded(newContent.id);
    setGenerating(false);
  }

  function sendForApproval(id: string) {
    setContent((cs) => cs.map((c) => (c.id === id ? { ...c, status: 'pending_approval' } : c)));
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Content Generator</h1>
        <p className="text-sm text-forest-500">Generate branded social content and blog posts from approved articles</p>
      </div>

      {/* Generator Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="font-serif text-lg text-forest-800 mb-4">Generate New Content</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">Approved Article</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 bg-white"
            >
              {mockApprovedArticles.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={generateContent}
            disabled={generating}
            className="btn-primary text-xs shrink-0 disabled:opacity-70 min-w-[180px] justify-center"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating with Claude...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>
        </div>

        {generating && (
          <div className="mt-4 bg-forest-50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm text-forest-600">
              <Loader2 className="w-4 h-4 animate-spin text-forest-500" />
              <div>
                <p className="font-medium">Claude is writing your content...</p>
                <p className="text-xs text-forest-400 mt-0.5">Crafting Instagram, LinkedIn, Facebook posts and a blog article with Neem Travels brand voice.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Content List */}
      <div className="space-y-4">
        {content.map((item) => {
          const tab = activeTab[item.id] || 'instagram';
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`tag text-xs ${item.city === 'Amsterdam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'}`}>{item.city}</span>
                      <span className={item.status === 'pending_approval' ? 'status-pending' : 'status-draft'}>
                        {item.status === 'pending_approval' ? 'Pending Approval' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800">{item.articleTitle}</h3>
                    <p className="text-xs text-gray-400 mt-1">Source: {item.articleSource} · Generated {new Date(item.generatedAt).toLocaleString('en-GB')}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {item.status === 'draft' && (
                      <button onClick={() => sendForApproval(item.id)} className="btn-primary text-xs">
                        Send for Approval
                      </button>
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

              {/* Content Tabs */}
              {expanded === item.id && (
                <div className="border-t border-gray-100">
                  {/* Tab Nav */}
                  <div className="flex border-b border-gray-100 bg-gray-50">
                    {[
                      { key: 'instagram', label: 'Instagram', icon: Instagram },
                      { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                      { key: 'facebook', label: 'Facebook', icon: Facebook },
                      { key: 'blog', label: 'Blog', icon: FileText },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab((t) => ({ ...t, [item.id]: key }))}
                        className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                          tab === key ? 'border-forest-600 text-forest-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {tab === 'instagram' && (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Caption</label>
                          <button onClick={() => copyText(item.instagram, `${item.id}-ig`)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-forest-600">
                            {copied === `${item.id}-ig` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                        <pre className="text-sm text-forest-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4 mb-4">{item.instagram}</pre>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Hashtags</label>
                          <button onClick={() => copyText(item.hashtags, `${item.id}-ht`)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-forest-600">
                            {copied === `${item.id}-ht` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3">{item.hashtags}</p>
                      </div>
                    )}
                    {tab === 'linkedin' && (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">LinkedIn Post</label>
                          <button onClick={() => copyText(item.linkedin, `${item.id}-li`)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-forest-600">
                            {copied === `${item.id}-li` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                        <pre className="text-sm text-forest-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">{item.linkedin}</pre>
                      </div>
                    )}
                    {tab === 'facebook' && (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Facebook Post</label>
                          <button onClick={() => copyText(item.facebook, `${item.id}-fb`)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-forest-600">
                            {copied === `${item.id}-fb` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                        <pre className="text-sm text-forest-700 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">{item.facebook}</pre>
                      </div>
                    )}
                    {tab === 'blog' && (
                      <div>
                        <div className="mb-4">
                          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Blog Title</label>
                          <p className="font-serif text-lg text-forest-800 bg-gray-50 rounded-lg p-3">{item.blogTitle}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Excerpt / Meta Description</label>
                          <p className="text-sm text-forest-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{item.blogExcerpt}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Full blog content will be generated when content is approved.</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button className="btn-secondary text-xs">
                        <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
