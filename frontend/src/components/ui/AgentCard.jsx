import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Star, Phone, Mail } from 'lucide-react';

export default function AgentCard({ agent, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-luxury group text-center"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-64 object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          <a
            href={`tel:${agent.phone}`}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-navy-900 hover:bg-gold-500 hover:text-white transition-all"
          >
            <Phone size={14} />
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-navy-900 hover:bg-gold-500 hover:text-white transition-all"
          >
            <Mail size={14} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-serif font-semibold text-navy-900 mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{agent.bio}</p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <a href={`mailto:${agent.email}`} className="text-xs text-gray-500">{agent.email}</a>
          <span className="text-xs text-gray-300">•</span>
          <a href={`tel:${agent.phone}`} className="text-xs text-gray-500">{agent.phone}</a>
        </div>

        <Link
          to={`/agents/${agent.id}`}
          className="w-full flex items-center justify-center py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-gold-500 transition-colors duration-300"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
