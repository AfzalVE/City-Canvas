import { Metadata } from 'next';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';

export const metadata: Metadata = { title: 'Analytics | Admin' };

const platformMetrics = [
  { platform: 'Instagram', followers: '4,231', growth: '+124', posts: 47, engagement: '5.8%', reach: '48,200', trend: 'up' },
  { platform: 'LinkedIn', followers: '1,089', growth: '+67', posts: 28, engagement: '3.2%', reach: '12,400', trend: 'up' },
  { platform: 'Facebook', followers: '2,847', growth: '+43', posts: 35, engagement: '4.1%', reach: '31,600', trend: 'up' },
  { platform: 'Blog', followers: '—', growth: '—', posts: 22, engagement: '—', reach: '8,900', trend: 'up' },
];

const topPosts = [
  { title: 'Keukenhof Gardens 2026 Guide', platform: 'Instagram', reach: 5800, engagement: 252, date: 'May 29' },
  { title: 'Morning in Le Marais', platform: 'Instagram', reach: 5200, engagement: 341, date: 'May 22' },
  { title: 'Amsterdam Hidden Museums', platform: 'Facebook', reach: 4100, engagement: 213, date: 'May 18' },
  { title: 'Louvre Night Openings', platform: 'LinkedIn', reach: 2300, engagement: 87, date: 'May 14' },
  { title: 'Cycling the Amsterdam Canals', platform: 'Instagram', reach: 4800, engagement: 298, date: 'May 10' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-forest-800 mb-1">Analytics</h1>
        <p className="text-sm text-forest-500">Performance overview across all platforms · Last 30 days</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reach', value: '101.1K', delta: '+18%', icon: Eye, trend: 'up' },
          { label: 'Total Followers', value: '8,167', delta: '+234', icon: Users, trend: 'up' },
          { label: 'Total Engagements', value: '4,892', delta: '+12%', icon: Heart, trend: 'up' },
          { label: 'Posts Published', value: '156', delta: '+28', icon: MessageSquare, trend: 'up' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center">
                <card.icon className="w-4 h-4 text-forest-600" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {card.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {card.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-forest-800 font-serif">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg text-forest-800">Platform Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {platformMetrics.map((row) => (
                <tr key={row.platform} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-forest-800">{row.platform}</td>
                  <td className="px-5 py-4 text-forest-700">{row.followers}</td>
                  <td className="px-5 py-4">
                    {row.growth !== '—' ? (
                      <span className="flex items-center gap-0.5 text-green-600 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />{row.growth} this month
                      </span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-4 text-forest-700">{row.posts}</td>
                  <td className="px-5 py-4">
                    {row.engagement !== '—' ? (
                      <span className="font-semibold text-forest-700">{row.engagement}</span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-4 text-forest-700">{row.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg text-forest-800">Top Performing Posts</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {topPosts.map((post, idx) => (
            <div key={post.title} className="px-5 py-4 flex items-center gap-4">
              <div className="w-6 text-center text-xs font-bold text-gray-400">#{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-forest-800">{post.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{post.platform}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-forest-700">{post.reach.toLocaleString()} reach</div>
                <div className="text-xs text-gray-400">{post.engagement} engagements</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
