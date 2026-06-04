'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  LayoutDashboard,
  Rss,
  CheckSquare,
  FileText,
  ThumbsUp,
  Send,
  Settings,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/rss', label: 'RSS Feeds', icon: Rss },
  { href: '/admin/verification', label: 'Verification Queue', icon: CheckSquare },
  { href: '/admin/content', label: 'Content Generator', icon: FileText },
  { href: '/admin/approval', label: 'Approval Queue', icon: ThumbsUp },
  { href: '/admin/publishing', label: 'Publishing', icon: Send },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
              <div className="text-sm font-semibold text-forest-800 font-serif">Neem Travels</div>
              <div className="text-xs text-forest-500">Admin Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 admin-scroll overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-item ${active ? 'admin-sidebar-item-active' : 'admin-sidebar-item-inactive'}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-forest-500 hover:text-forest-700 transition-colors"
          >
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
