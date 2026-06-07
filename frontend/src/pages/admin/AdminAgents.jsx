import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Star, Upload, X, CheckCircle } from 'lucide-react';
import DashboardHeader from '../../components/admin/DashboardHeader';
import { getAgents, createAgent, updateAgent } from '../../services/agent.service';
import { cloudinaryIMG } from '../../services/cloudinary.service';

function AgentModal({ agent, onClose }) {
  const isEdit = !!agent;
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: agent?.first_name || '',
    last_name: agent?.last_name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    facebook_url: agent?.facebook_url || '',
    instagram_url: agent?.instagram_url || '',
    whatsapp_url: agent?.whatsapp_url || '',
    twitter_url: agent?.twitter_url || '',
    linkedin_url: agent?.linkedin_url || '',
    profile_image: agent?.profile_image || '',
    bio: agent?.bio || '',
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await cloudinaryIMG(file);
      setFormData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateAgent(agent.agent_id, formData);
      } else {
        await createAgent(formData);
      }

      setSaved(true);
      setTimeout(onClose, 1200);
    } catch (error) {
      console.error(error);
      alert('Failed to save agent');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-semibold text-navy-900">{isEdit ? 'Edit Agent' : 'Add New Agent'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={15} />
          </button>
        </div>
        {saved ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle size={40} className="text-green-500" />
            <p className="font-semibold text-navy-900">Agent {isEdit ? 'Updated' : 'Created'}!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Photo Upload */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                {formData.profile_image ? (
                  <img src={formData.profile_image} alt="Agent" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={18} />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gold-600 cursor-pointer hover:text-gold-700 transition-colors">
                <Upload size={15} />
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            {uploading && (
              <p className="text-xs text-gray-500">Uploading image...</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                <input
                  type="text"
                  className="input-light"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                <input
                  type="text"
                  className="input-light"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                <input
                  type="email"
                  className="input-light"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Agent email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone *</label>
                <input
                  type="tel"
                  className="input-light"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+27 xx xxx xxxx"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Facebook URL</label>
                <input
                  type="url"
                  className="input-light"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/agent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Instagram URL</label>
                <input
                  type="url"
                  className="input-light"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/agent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">WhatsApp URL</label>
                <input
                  type="url"
                  className="input-light"
                  value={formData.whatsapp_url}
                  onChange={(e) => setFormData({ ...formData, whatsapp_url: e.target.value })}
                  placeholder="https://wa.me/27821234567"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Twitter URL</label>
                <input
                  type="url"
                  className="input-light"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://x.com/agent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">LinkedIn URL</label>
                <input
                  type="url"
                  className="input-light"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/agent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
              <textarea
                rows={4}
                className="input-light resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Agent biography..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline py-2.5 text-sm">Cancel</button>
              <button type="submit" className="btn-primary text-sm py-2.5">{isEdit ? 'Update Agent' : 'Create Agent'}</button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminAgents() {
  const [search, setSearch] = useState('');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAgents()
      .then((data) => {
        setAgents(data.map((agent) => ({
          ...agent,
          id: agent.agent_id,
          name: `${agent.first_name} ${agent.last_name}`,
          title: agent.title || agent.email || agent.phone || '',
          image: agent.profile_image || 'https://via.placeholder.com/150',
          listings: agent.listings || 0,
          sold: agent.sold || 0,
          rating: agent.rating || 4.9,
          reviews: agent.reviews || 0,
        })));
      })
      .catch((err) => setError(err?.message || 'Unable to load agents'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = agents.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <DashboardHeader title="Agents Management" />
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} className="input-light pl-9 text-sm w-64" />
          </div>
          <button onClick={() => setModal('create')} className="btn-primary text-sm py-2.5 gap-2">
            <Plus size={15} /> Add Agent
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-luxury transition-all"
              style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}
            >
              <div className="flex items-start gap-4 p-5">
                <img src={agent.image} alt={agent.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900 truncate">{agent.name}</p>
                  <p className="text-xs text-gold-600 mb-1 truncate">{agent.title}</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-gold-500 fill-gold-500" />
                    <span className="text-xs text-gray-600">{agent.rating} ({agent.reviews})</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setModal(agent)} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gold-600 hover:bg-gold-50 transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-50 grid grid-cols-2 divide-x divide-gray-50">
                <div className="py-3 text-center">
                  <p className="text-xl font-serif font-semibold text-navy-900">{agent.listings}</p>
                  <p className="text-xs text-gray-400">Listings</p>
                </div>
                <div className="py-3 text-center">
                  <p className="text-xl font-serif font-semibold text-navy-900">{agent.sold}</p>
                  <p className="text-xs text-gray-400">Sold</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && <AgentModal agent={modal === 'create' ? null : modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
