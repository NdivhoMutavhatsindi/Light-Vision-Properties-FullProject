import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PageBanner from '../components/ui/PageBanner';
import AgentCard from '../components/ui/AgentCard';
import { getAgents } from '../services/agent.service.js';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filtered = agents.filter((agent) => {
    const fullName = `${agent.first_name} ${agent.last_name}`.toLowerCase();
    return !search || fullName.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageBanner
        title="Our Agents"
        subtitle="Meet our team of luxury property specialists, each bringing exceptional expertise and dedication."
        breadcrumbs={[{ label: 'Agents' }]}
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-white rounded-2xl p-4 shadow-luxury" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by agent name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-light pl-10 text-sm"
              />
            </div>
            </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-24 text-gray-500">Loading agents...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} index={i} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                  <p className="text-xl font-serif">No agents found</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Join Our Team</span>
              <div className="gold-line" />
            </div>
            <h2 className="text-4xl font-serif font-light text-white mb-4">
              Become a Light Vision Agent
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              Join South Africa's premier luxury property group and elevate your real estate career to new heights.
            </p>
            <Link to="/careers" className="btn-primary">View Career Opportunities</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
