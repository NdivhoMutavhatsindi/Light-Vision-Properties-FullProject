import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardHeader from '../../components/admin/DashboardHeader';
import StatsCards from '../../components/admin/StatsCards';
import { getDashboard } from '../../services/admin.service.js';
import { Building2, Users, CheckCircle, MessageSquare, Gavel, ShieldCheck, Briefcase, Star, Clock } from 'lucide-react';

const COLORS = ['#c8a96b', '#0f1b3d', '#f59e0b', '#22c55e', '#60a5fa'];

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} sec${seconds === 1 ? '' : 's'} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const initialStats = {
  properties: 0,
  agents: 0,
  careers: 0,
  valuations: 0,
  compliance: 0,
  legal: 0,
  offers: 0,
  applications: 0,
  totalRequests: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(initialStats);
  const [topAgents, setTopAgents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();
        setStats({
          properties: data.properties ?? 0,
          agents: data.agents ?? 0,
          careers: data.careers ?? 0,
          valuations: data.requests?.valuations ?? 0,
          compliance: data.requests?.compliance ?? 0,
          legal: data.requests?.legal ?? 0,
          offers: data.requests?.offers ?? 0,
          applications: data.requests?.applications ?? 0,
          totalRequests: data.totalRequests ?? 0,
        });
        setTopAgents(data.topAgents ?? []);
        setRecentActivity(data.recentActivity ?? []);
      } catch (error) {
        console.error('Unable to load dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const summaryCards = [
    { title: 'Total Properties', value: stats.properties, icon: 'Building2' },
    { title: 'Total Agents', value: stats.agents, icon: 'Users' },
    { title: 'Active Careers', value: stats.careers, icon: 'CheckCircle' },
    { title: 'Total Requests', value: stats.totalRequests, icon: 'MessageSquare' },
  ];

  const requestCards = [
    { title: 'Valuation Requests', value: stats.valuations, icon: 'Gavel' },
    { title: 'Compliance Requests', value: stats.compliance, icon: 'ShieldCheck' },
    { title: 'Legal Requests', value: stats.legal, icon: 'Briefcase' },
    { title: 'Offer Requests', value: stats.offers, icon: 'CheckCircle' },
    { title: 'Job Applications', value: stats.applications, icon: 'Star' },
  ];

  const requestData = [
    { name: 'Valuations', value: stats.valuations },
    { name: 'Compliance', value: stats.compliance },
    { name: 'Legal', value: stats.legal },
    { name: 'Offers', value: stats.offers },
    { name: 'Applications', value: stats.applications },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <DashboardHeader title="Dashboard Overview" />
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Dashboard Overview" />
      <div className="p-6 space-y-6">
        <StatsCards stats={summaryCards} />
        <StatsCards stats={requestCards} />

        <section className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif font-semibold text-navy-900">Request Distribution</h2>
              <p className="text-xs text-gray-400">See activity by request category</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  label
                >
                  {requestData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Requests']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
          <div className="xl:col-span-4 bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif font-semibold text-navy-900">Top Agents</h2>
                <p className="text-xs text-gray-400">Agents ordered by most recent activity</p>
              </div>
            </div>
            <div className="space-y-4">
              {topAgents.length === 0 ? (
                <p className="text-sm text-gray-500">No agents available yet.</p>
              ) : (
                topAgents.map((agent, index) => (
                  <div key={agent.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{agent.name}</p>
                      <p className="text-xs text-gray-400">Top agent slot #{index + 1}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={16} className="text-gold-500" />
                      <span>{agent.rating !== null && agent.rating !== undefined ? agent.rating : 'No rating'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif font-semibold text-navy-900">Recent Activity</h2>
                <p className="text-xs text-gray-400">Latest CRM events from incoming requests</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity found.</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4 bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Clock size={16} className="text-navy-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-navy-900">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
