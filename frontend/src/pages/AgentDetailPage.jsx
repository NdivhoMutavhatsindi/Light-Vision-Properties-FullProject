import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { getAgent } from '../services/agent.service.js';
import SectionHeading from '../components/ui/SectionHeading';

export default function AgentDetailPage() {
  const { id } = useParams({ strict: false });
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await getAgent(id);
        setAgent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500">Loading agent...</div>
    );
  }

  if (!agent) {
    return (
      <div className="pt-20 text-center text-gray-600">Agent not found.</div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy-gradient py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-shrink-0">
              <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-gold-500 shadow-gold">
                <img src={agent.profile_image} alt={`${agent.first_name} ${agent.last_name}`} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="gold-line" />
                <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Luxury Property Specialist</span>
              </div>
              <h1 className="text-4xl font-serif font-light text-white mb-2">{`${agent.first_name} ${agent.last_name}`}</h1>
              <div className="flex flex-wrap gap-3">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="btn-primary gap-2 text-sm py-2.5">
                    <Phone size={15} /> Call Agent
                  </a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="btn-white gap-2 text-sm py-2.5">
                    <Mail size={15} /> Send Email
                  </a>
                )}
                {agent.whatsapp_url && (
                  <a href={agent.whatsapp_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-full transition-colors text-sm">
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Bio */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-navy-900 mb-4">About {`${agent.first_name} ${agent.last_name}`}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{agent.bio}</p>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div>
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-serif font-semibold text-navy-900 mb-5">Contact Info</h3>

              <div className="space-y-4 mb-6">
                {agent.email && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${agent.email}`} className="text-navy-900 font-medium break-all">{agent.email}</a>
                  </div>
                )}
                {agent.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${agent.phone}`} className="text-navy-900 font-medium">{agent.phone}</a>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {agent.facebook_url && (
                  <a href={agent.facebook_url} target="_blank" rel="noreferrer" className="block text-sm text-blue-700 hover:text-blue-900">
                    Facebook
                  </a>
                )}
                {agent.instagram_url && (
                  <a href={agent.instagram_url} target="_blank" rel="noreferrer" className="block text-sm text-pink-600 hover:text-pink-800">
                    Instagram
                  </a>
                )}
                {agent.linkedin_url && (
                  <a href={agent.linkedin_url} target="_blank" rel="noreferrer" className="block text-sm text-sky-700 hover:text-sky-900">
                    LinkedIn
                  </a>
                )}
                {agent.twitter_url && (
                  <a href={agent.twitter_url} target="_blank" rel="noreferrer" className="block text-sm text-slate-700 hover:text-slate-900">
                    X
                  </a>
                )}
                {agent.whatsapp_url && (
                  <a href={agent.whatsapp_url} target="_blank" rel="noreferrer" className="block text-sm text-emerald-700 hover:text-emerald-900">
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
