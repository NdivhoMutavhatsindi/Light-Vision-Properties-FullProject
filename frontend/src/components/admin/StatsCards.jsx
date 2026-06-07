import { motion } from 'framer-motion';
import { Building2, Key, MessageSquare, Users, CheckCircle, Gavel, ShieldCheck, Briefcase, Star } from 'lucide-react';

const iconMap = { Building2, Key, MessageSquare, Users, CheckCircle, Gavel, ShieldCheck, Briefcase, Star };

export default function StatsCards({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon] || Building2;
        return (
          <motion.div
            key={`${stat.title}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon size={18} className="text-gray-600" />
              </div>
            </div>
            <p className="text-3xl font-serif font-semibold text-navy-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.title}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
