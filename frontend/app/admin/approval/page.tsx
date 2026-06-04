'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Edit3, RotateCcw, Instagram, Linkedin, Facebook, FileText, ChevronDown, ChevronUp, Send } from 'lucide-react';

type ApprovalItem = {
  id: string;
  articleTitle: string;
  city: string;
  instagram: string;
  hashtags: string;
  linkedin: string;
  facebook: string;
  blogTitle: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  submittedAt: string;
  approver_notes: string;
};

const mockItems: ApprovalItem[] = [
  {
    id: 'p1',
    articleTitle: 'Amsterdam\'s Hidden Museum Quarter: Beyond the Rijksmuseum',
    city: 'Amsterdam',
    instagram: 'The Stedelijk at night. The FOAM by appointment. The Moco before anyone else gets there.\n\nAmsterdam\'s museum district has more to offer than the Rijksmuseum\'s famous masterpieces — and knowing which doors to knock on makes all the difference.\n\nLink in bio for our full hidden museum guide.',
    hashtags: '#AmsterdamMuseums #Stedelijk #FOAM #Rijksmuseum #AmsterdamArt #SlowTravel #NeemTravels #ArtLovers',
    linkedin: 'Amsterdam is rightly famous for its Rijksmuseum. But for those willing to look beyond the queue, the city\'s museum district offers some of Europe\'s most extraordinary cultural experiences.\n\nThe Stedelijk Museum\'s modern collection rivals MoMA. The FOAM photography museum curates with the taste of a private gallery. The Moco — smaller, faster, more daring — shows work you won\'t find anywhere else in the Netherlands.\n\nAt Neem Travels, we help our clients discover this depth. Not instead of the Rijksmuseum — alongside it.',
    facebook: 'We love the Rijksmuseum. Every first-time visitor should go.\n\nBut if you\'ve been before — or if you want to see the less-crowded, more intimate side of Amsterdam\'s cultural scene — here\'s a secret: the museum quarter has so much more to offer.\n\nRead our guide to Amsterdam\'s hidden museums on the blog. And if you\'re planning a trip, we can help you design a day that takes in the best of all of them.',
    blogTitle: 'Amsterdam\'s Museum Quarter Beyond the Rijksmuseum: The Hidden Cultural Gems',
    status: 'pending_approval',
    submittedAt: '2026-06-04T11:00:00',
    approver_notes: '',
  },
  {
    id: 'p2',
    articleTitle: 'Summer Night Openings at the Louvre',
    city: 'Paris',
    instagram: 'The Louvre after dark. In summer. Until midnight.\n\nThis is not a dream — it\'s the new Friday evening programme that runs through July and August 2026. Fewer crowds. Lower light. The Venus de Milo in almost perfect quiet.\n\nSave this for your Paris trip planning.',
    hashtags: '#Louvre #ParisByNight #ParisSummer #MuseeLlouvre #Paris2026 #SlowTravel #NeemTravels #TravelParis',
    linkedin: 'The Louvre\'s new Friday evening openings (until midnight, July–August 2026) solve one of the world\'s great travel problems: how do you experience the world\'s most visited museum without the world\'s most overwhelming crowds?\n\nFor our Paris clients at Neem Travels, this is now a core recommendation. Book the last entry slot. Wear comfortable shoes. Start in the least-visited rooms. End at the Venus de Milo as the guards begin their final rounds.\n\nSome experiences stay with you for decades.',
    facebook: 'Big news for Paris visitors this summer: The Louvre is opening late on Friday evenings — until midnight — throughout July and August.\n\nThis is genuinely one of the best Paris travel tips we\'ve come across this year. The museum is extraordinary at any hour, but in the evening quiet, with the lighting turned down and the crowds thinned, it becomes something else entirely.\n\nHave you been to the Louvre? Would you want to see it after dark? Tell us in the comments!',
    blogTitle: 'The Louvre After Dark: Everything You Need to Know About the Summer Night Openings',
    status: 'pending_approval',
    submittedAt: '2026-06-04T09:00:00',
    approver_notes: '',
  },
];

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  blog: FileText,
};

export default function ApprovalPage() {
  const [items, setItems] = useState<ApprovalItem[]>(mockItems);
  const [expanded, setExpanded] = useState<string | null>('p1');
  const [tab, setTab] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  function setStatus(id: string, status: 'approved' | 'rejected') {
    setItems((is) => is.map((i) => (i.id === id ? { ...i, status, approver_notes: notes[id] || '' } : i)));
  }

  const pending = items.filter((i) => i.status === 'pending_approval').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Approval Queue</h1>
        <p className="text-sm text-forest-500">{pending} posts awaiting final approval before publishing</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const currentTab = tab[item.id] || 'instagram';
          const PlatformIcon = PLATFORM_ICONS[currentTab];

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                item.status === 'approved' ? 'border-green-200' : item.status === 'rejected' ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`tag text-xs ${item.city === 'Amsterdam' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'}`}>{item.city}</span>
                      <span className={item.status === 'approved' ? 'status-approved' : item.status === 'rejected' ? 'status-rejected' : 'status-pending'}>
                        {item.status === 'pending_approval' ? 'Pending Approval' : item.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-forest-800">{item.articleTitle}</h3>
                    <p className="text-xs text-gray-400 mt-1">Submitted {new Date(item.submittedAt).toLocaleString('en-GB')}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'pending_approval' && (
                      <>
                        <button onClick={() => setStatus(item.id, 'approved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve & Schedule
                        </button>
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setStatus(item.id, 'rejected')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded transition-colors" title="Regenerate">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Ready to publish</span>
                        <button className="btn-primary text-xs">
                          <Send className="w-3.5 h-3.5" /> Publish Now
                        </button>
                      </div>
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

              {/* Preview */}
              {expanded === item.id && (
                <div className="border-t border-gray-100">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 bg-gray-50">
                    {[
                      { key: 'instagram', label: 'Instagram' },
                      { key: 'linkedin', label: 'LinkedIn' },
                      { key: 'facebook', label: 'Facebook' },
                      { key: 'blog', label: 'Blog' },
                    ].map(({ key, label }) => {
                      const Icon = PLATFORM_ICONS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => setTab((t) => ({ ...t, [item.id]: key }))}
                          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                            currentTab === key ? 'border-forest-600 text-forest-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />{label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-5 grid lg:grid-cols-2 gap-6">
                    {/* Content Preview */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Content Preview</label>
                      {currentTab !== 'blog' ? (
                        <div className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                          currentTab === 'instagram' ? 'bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100' :
                          currentTab === 'linkedin' ? 'bg-blue-50 border border-blue-100' :
                          'bg-blue-50 border border-blue-100'
                        } text-forest-700`}>
                          {currentTab === 'instagram' ? item.instagram :
                           currentTab === 'linkedin' ? item.linkedin :
                           item.facebook}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-serif text-lg text-forest-800 mb-2">{item.blogTitle}</h4>
                          <p className="text-sm text-gray-500">Full blog post will be generated on publish.</p>
                        </div>
                      )}

                      {currentTab === 'instagram' && (
                        <p className="text-xs text-gray-400 mt-2">{item.hashtags}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Approver Notes</label>
                      <textarea
                        value={notes[item.id] || item.approver_notes}
                        onChange={(e) => setNotes((n) => ({ ...n, [item.id]: e.target.value }))}
                        placeholder="Add feedback, suggestions, or approval notes..."
                        rows={6}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-forest-400 resize-none"
                      />

                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Schedule</label>
                        <div className="flex gap-2">
                          <button className="flex-1 btn-secondary text-xs justify-center">Schedule for Later</button>
                          <button className="flex-1 btn-primary text-xs justify-center">Publish Immediately</button>
                        </div>
                      </div>
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
