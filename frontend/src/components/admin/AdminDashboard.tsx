import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Package,
  Star,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  { label: 'Total Bookings', value: '2,847', change: '+12.5%', up: true, icon: Package },
  { label: 'Active Users', value: '12,430', change: '+8.2%', up: true, icon: Users },
  { label: 'Revenue', value: '$1.2M', change: '+15.3%', up: true, icon: DollarSign },
  { label: 'Avg Rating', value: '4.9', change: '+0.2', up: true, icon: Star },
  { label: 'Page Views', value: '89.4K', change: '-2.1%', up: false, icon: Eye },
  { label: 'Conversion', value: '3.8%', change: '+0.5%', up: true, icon: TrendingUp },
];

const recentBookings = [
  { id: 'B-2847', customer: 'Sarah Mitchell', destination: 'Amsterdam', date: 'Dec 20, 2024', amount: '$2,499', status: 'confirmed' },
  { id: 'B-2846', customer: 'James Chen', destination: 'Paris', date: 'Dec 18, 2024', amount: '$1,899', status: 'pending' },
  { id: 'B-2845', customer: 'Emma Rodriguez', destination: 'Switzerland', date: 'Dec 15, 2024', amount: '$3,200', status: 'confirmed' },
  { id: 'B-2844', customer: 'Michael Thompson', destination: 'Venice', date: 'Dec 12, 2024', amount: '$2,199', status: 'confirmed' },
  { id: 'B-2843', customer: 'Lisa Park', destination: 'Barcelona', date: 'Dec 10, 2024', amount: '$1,299', status: 'cancelled' },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--cream)]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your travel business</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-[var(--gold)] text-[var(--charcoal)]'
                  : 'bg-gray-800 text-gray-400 hover:text-[var(--cream)]'
              }`}
            >
              {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl bg-gray-900/50 border border-gray-800 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-[var(--forest-green)]/20 p-3">
                <stat.icon className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-[var(--cream)]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl bg-gray-900/50 border border-gray-800 p-6"
        >
          <h3 className="font-serif text-lg font-bold text-[var(--cream)] mb-6">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Destination</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 text-sm text-[var(--gold)] font-mono">{booking.id}</td>
                    <td className="py-3 text-sm text-[var(--cream)]">{booking.customer}</td>
                    <td className="py-3 text-sm text-gray-400">{booking.destination}</td>
                    <td className="py-3 text-sm text-[var(--cream)] font-medium">{booking.amount}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-400'
                          : booking.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-xl bg-gray-900/50 border border-gray-800 p-6"
        >
          <h3 className="font-serif text-lg font-bold text-[var(--cream)] mb-6">Top Destinations</h3>
          <div className="space-y-4">
            {[
              { city: 'Amsterdam', bookings: 1240, percentage: 85 },
              { city: 'Paris', bookings: 980, percentage: 72 },
              { city: 'Venice', bookings: 760, percentage: 58 },
              { city: 'Switzerland', bookings: 640, percentage: 48 },
              { city: 'Barcelona', bookings: 520, percentage: 38 },
            ].map((dest) => (
              <div key={dest.city}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--cream)]">{dest.city}</span>
                  <span className="text-sm text-gray-500">{dest.bookings} bookings</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dest.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-[var(--gold)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
