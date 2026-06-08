'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bot,
  ChevronRight,
  Leaf,
  LayoutDashboard,
  LogOut,
  Rss,
  Send,
  Settings,
  Sparkles,
  ThumbsUp,
} from 'lucide-react';
import { clearAdminSession, getAdminToken, getAdminUser, verifyAdminSession } from '@/lib/admin-api';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, group: 'main' },
  {
    href: '/admin/rss', label: 'RSS Agent', icon: Rss, group: 'workflow',
    badge: '1', badgeTitle: 'Step 1–2: Fetch & AI Score',
  },
  {
    href: '/admin/approval', label: 'AI Post Approval', icon: ThumbsUp, group: 'workflow',
    badge: '2', badgeTitle: 'Step 3–5: Review AI Posts',
  },
  {
    href: '/admin/publishing', label: 'Auto Publishing', icon: Send, group: 'workflow',
    badge: '3', badgeTitle: 'Step 6: Social Media',
  },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'main' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, group: 'main' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) { setChecking(false); setAuthorized(false); return; }
    let mounted = true;
    setChecking(true);
    setAuthorized(false);
    if (!getAdminToken()) { clearAdminSession(); router.replace('/admin/login'); setChecking(false); return; }
    verifyAdminSession()
      .then((admin) => { if (!mounted) return; setUsername(admin.username || getAdminUser()); setAuthorized(true); setChecking(false); })
      .catch(() => { if (!mounted) return; setAuthorized(false); setChecking(false); router.replace('/admin/login'); });
    return () => { mounted = false; };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (checking || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-forest-500">{checking ? 'Checking admin access…' : 'Redirecting…'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-600 rounded-md flex items-center justify-center">
              <Leaf className="w-4 h-4 text-cream-100" />
            </div>
            <div>
              <div className="text-sm font-semibold text-forest-800 font-serif">Virtual Holidays</div>
              <div className="text-xs text-forest-500">Admin Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Workflow Section */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
              <Bot className="w-3 h-3 text-gold-500" />
              <span className="text-[10px] font-bold text-forest-400 uppercase tracking-widest">AI Workflow</span>
            </div>
            {navItems.filter(i => i.group === 'workflow').map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.badgeTitle}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                    active
                      ? 'bg-forest-700 text-cream-100 shadow-sm'
                      : 'text-forest-600 hover:bg-gray-50 hover:text-forest-800'
                  }`}
                >
                  {item.badge && (
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      active ? 'bg-gold-400 text-forest-900' : 'bg-forest-100 text-forest-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                </Link>
              );
            })}

          </div>

          {/* Other nav items */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
              <span className="text-[10px] font-bold text-forest-400 uppercase tracking-widest">Platform</span>
            </div>
            {navItems.filter(i => i.group === 'main').map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                    active ? 'bg-forest-700 text-cream-100 shadow-sm' : 'text-forest-600 hover:bg-gray-50 hover:text-forest-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="text-xs text-forest-500">
            Signed in as <span className="font-medium text-forest-700">{username || 'admin'}</span>
          </div>
          <button
            onClick={() => { clearAdminSession(); window.location.href = '/admin/login'; }}
            className="flex w-full items-center gap-2 text-xs text-forest-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
          <Link href="/" className="flex items-center gap-2 text-xs text-forest-500 hover:text-forest-700 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
