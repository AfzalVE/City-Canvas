import Link from 'next/link';
import { Metadata } from 'next';
import {
  Rss,
  CheckSquare,
  FileText,
  ThumbsUp,
  Send,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Admin Dashboard | Neem Travels' };

const stats = [
  { label: 'Articles Collected', value: '247', delta: '+18 today', icon: Rss, color: 'bg-blue-50 text-blue-600' },
  { label: 'Pending Verification', value: '34', delta: 'Awaiting review', icon: Clock, color: 'bg-amber-50 text-amber-600' },
  { label: 'Content Generated', value: '89', delta: '+5 today', icon: FileText, color: 'bg-forest-50 text-forest-600' },
  { label: 'Pending Approval', value: '12', delta: 'Ready to publish', icon: ThumbsUp, color: 'bg-gold-50 text-gold-700' },
  { label: 'Published Posts', value: '156', delta: '+8 this week', icon: Send, color: 'bg-green-50 text-green-600' },
  { label: 'Active Feeds', value: '18', delta: '2 paused', icon: TrendingUp, color: 'bg-slate-50 text-slate-600' },
];

const recentActivity = [
  { type: 'article', message: 'New article from iAmsterdam: "Summer canal events 2026"', time: '2 min ago', status: 'new' },
  { type: 'verify', message: 'Article verified: "Paris food market guide" by Sophie', time: '15 min ago', status: 'approved' },
  { type: 'content', message: 'Blog post generated for "Rijksmuseum night openings"', time: '32 min ago', status: 'draft' },
  { type: 'publish', message: 'Instagram post published: Amsterdam canal sunset', time: '1 hour ago', status: 'published' },
  { type: 'article', message: '5 new articles collected from Paris Tourist Office feed', time: '2 hours ago', status: 'new' },
  { type: 'reject', message: 'Article rejected: Off-topic tourism ad content', time: '3 hours ago', status: 'rejected' },
];

const workflow = [
  { step: 1, label: 'RSS Collection', desc: 'Feeds fetched every 4 hours', status: 'active', href: '/admin/rss' },
  { step: 2, label: 'Human Verification', desc: '34 articles pending review', status: 'attention', href: '/admin/verification' },
  { step: 3, label: 'Content Generation', desc: 'Claude AI creates posts', status: 'active', href: '/admin/content' },
  { step: 4, label: 'Human Approval', desc: '12 posts pending approval', status: 'attention', href: '/admin/approval' },
  { step: 5, label: 'Publishing', desc: 'Auto-publish to all platforms', status: 'active', href: '/admin/publishing' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Dashboard</h1>
        <p className="text-sm text-forest-500">Travel Content Automation Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-forest-800 font-serif">{stat.value}</div>
            <div className="text-xs font-medium text-forest-700 mt-0.5">{stat.label}</div>
            <div className="text-xs text-forest-400 mt-0.5">{stat.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Workflow */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-forest-800 mb-5">Content Pipeline</h2>
          <div className="space-y-3">
            {workflow.map((step, idx) => (
              <Link key={step.step} href={step.href} className="group block">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-cream-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        step.status === 'attention' ? 'bg-amber-100 text-amber-700' : 'bg-forest-100 text-forest-700'
                      }`}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-forest-800 flex items-center gap-2">
                        {step.label}
                        {step.status === 'attention' && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {step.status === 'active' && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-forest-500">{step.desc}</div>
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

        {/* Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-forest-800 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.status === 'approved' || activity.status === 'published'
                      ? 'bg-green-400'
                      : activity.status === 'rejected'
                      ? 'bg-red-400'
                      : activity.status === 'draft'
                      ? 'bg-blue-400'
                      : 'bg-amber-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest-700 leading-relaxed line-clamp-2">{activity.message}</p>
                  <p className="text-xs text-forest-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/verification', label: 'Review Queue', desc: '34 articles waiting', color: 'border-amber-300 hover:bg-amber-50', icon: CheckSquare },
          { href: '/admin/content', label: 'Generate Content', desc: 'Run content agent', color: 'border-forest-300 hover:bg-forest-50', icon: FileText },
          { href: '/admin/approval', label: 'Approve Posts', desc: '12 posts ready', color: 'border-blue-300 hover:bg-blue-50', icon: ThumbsUp },
          { href: '/admin/rss', label: 'Manage Feeds', desc: 'Add or edit RSS', color: 'border-gray-300 hover:bg-gray-50', icon: Rss },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`bg-white border-2 ${action.color} rounded-xl p-5 transition-colors group`}
          >
            <action.icon className="w-5 h-5 text-forest-600 mb-3" />
            <div className="text-sm font-semibold text-forest-800">{action.label}</div>
            <div className="text-xs text-forest-500 mt-1">{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
