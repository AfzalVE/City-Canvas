'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle, CheckSquare, Clock, FileText, Loader2, Rss, Send, ThumbsUp, TrendingUp } from 'lucide-react';
import { AgentRun, Feed, GeneratedContent, PublishLog, fetchAgentRuns, fetchContent, fetchFeeds, fetchPublishLogs } from '../../lib/admin-api';

export default function AdminDashboard() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      setLoading(true);
      try {
        const [feedData, contentData, logData, runData] = await Promise.all([
          fetchFeeds(),
          fetchContent(),
          fetchPublishLogs(),
          fetchAgentRuns(),
        ]);
        setFeeds(feedData);
        setContent(contentData);
        setLogs(logData);
        setRuns(runData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'Articles Collected', value: feeds.length, delta: 'RSS items', icon: Rss, color: 'bg-blue-50 text-blue-600' },
      { label: 'Pending Verification', value: feeds.filter((feed) => feed.approval_status === 'pending').length, delta: 'Awaiting review', icon: Clock, color: 'bg-amber-50 text-amber-600' },
      { label: 'Content Generated', value: content.length, delta: 'All platforms', icon: FileText, color: 'bg-forest-50 text-forest-600' },
      { label: 'Pending Approval', value: content.filter((item) => item.status === 'draft' || item.status === 'pending_review').length, delta: 'Needs approval', icon: ThumbsUp, color: 'bg-gold-50 text-gold-700' },
      { label: 'Published Posts', value: logs.filter((log) => log.status === 'published').length, delta: 'Marked published', icon: Send, color: 'bg-green-50 text-green-600' },
      { label: 'Queued Posts', value: logs.filter((log) => log.status === 'queued' || log.status === 'manual_publish_required').length, delta: 'Manual publishing', icon: TrendingUp, color: 'bg-slate-50 text-slate-600' },
    ];
  }, [feeds, content, logs]);

  const workflow = [
    { step: 1, label: 'RSS Collection', desc: `${feeds.length} articles collected`, status: 'active', href: '/admin/rss' },
    { step: 2, label: 'Human Verification', desc: `${stats[1].value} articles pending review`, status: stats[1].value ? 'attention' : 'active', href: '/admin/verification' },
    { step: 3, label: 'Content Generation', desc: `${content.length} generated items`, status: 'active', href: '/admin/content' },
    { step: 4, label: 'Human Approval', desc: `${stats[3].value} posts pending approval`, status: stats[3].value ? 'attention' : 'active', href: '/admin/approval' },
    { step: 5, label: 'Publishing', desc: `${stats[5].value} posts queued`, status: stats[5].value ? 'attention' : 'active', href: '/admin/publishing' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Dashboard</h1>
        <p className="text-sm text-forest-500">Travel Content Automation Platform</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-forest-800 font-serif">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stat.value}
            </div>
            <div className="text-xs font-medium text-forest-700 mt-0.5">{stat.label}</div>
            <div className="text-xs text-forest-400 mt-0.5">{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-forest-800 mb-5">Content Pipeline</h2>
          <div className="space-y-3">
            {workflow.map((step, idx) => (
              <Link key={step.step} to={step.href} className="group block">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-cream-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      step.status === 'attention' ? 'bg-amber-100 text-amber-700' : 'bg-forest-100 text-forest-700'
                    }`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-forest-800 flex items-center gap-2">
                        {step.label}
                        {step.status === 'attention' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-forest-500">{loading ? 'Loading...' : step.desc}</div>
                    </div>
                  </div>
                  {idx < workflow.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-forest-300 group-hover:text-forest-500 transition-colors" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-forest-800 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-forest-400" />
            ) : runs.slice(0, 8).map((run) => (
              <div key={run.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${run.status === 'completed' ? 'bg-green-400' : run.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest-700 leading-relaxed line-clamp-2">
                    {run.agent_name}: {run.message || run.action || 'Agent run'}
                  </p>
                  <p className="text-xs text-forest-400 mt-0.5">
                    {run.created_at ? new Date(run.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : 'No timestamp'}
                  </p>
                </div>
              </div>
            ))}
            {!loading && runs.length === 0 && (
              <p className="text-xs text-forest-400">No agent activity yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/verification', label: 'Review Queue', desc: `${stats[1].value} articles waiting`, color: 'border-amber-300 hover:bg-amber-50', icon: CheckSquare },
          { href: '/admin/content', label: 'Generate Content', desc: 'Run content agent', color: 'border-forest-300 hover:bg-forest-50', icon: FileText },
          { href: '/admin/approval', label: 'Approve Posts', desc: `${stats[3].value} posts ready`, color: 'border-blue-300 hover:bg-blue-50', icon: ThumbsUp },
          { href: '/admin/rss', label: 'Collect RSS', desc: 'Fetch configured feeds', color: 'border-gray-300 hover:bg-gray-50', icon: Rss },
        ].map((action) => (
          <Link key={action.href} to={action.href} className={`bg-white border-2 ${action.color} rounded-xl p-5 transition-colors group`}>
            <action.icon className="w-5 h-5 text-forest-600 mb-3" />
            <div className="text-sm font-semibold text-forest-800">{action.label}</div>
            <div className="text-xs text-forest-500 mt-1">{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
