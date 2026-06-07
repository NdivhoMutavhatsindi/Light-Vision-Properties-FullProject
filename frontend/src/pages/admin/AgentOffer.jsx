import { useEffect, useState } from 'react';
import { Search, Eye, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../../components/admin/DashboardHeader';
import {
  getOffers,
  updateOfferStatus,
} from '../../services/offer.service';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700',
  accepted: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

function OfferModal({ offer, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(offer.status || 'pending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(offer.status || 'pending');
  }, [offer]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await onStatusUpdate(offer.offer_id, status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif font-semibold text-navy-900">Offer Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-6 mb-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Buyer Details</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium text-navy-900">Name:</span> {offer.first_name} {offer.last_name}</p>
                <p><span className="font-medium text-navy-900">Email:</span> {offer.email}</p>
                <p><span className="font-medium text-navy-900">Phone:</span> {offer.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Property Details</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium text-navy-900">Property:</span> {offer.property?.title || 'Unknown Property'}</p>
                <p><span className="font-medium text-navy-900">Location:</span> {offer.property?.location || 'Unknown'}</p>
                <p><span className="font-medium text-navy-900">Price:</span> R {Number(offer.property?.price || 0).toLocaleString()}</p>
                <p><span className="font-medium text-navy-900">Type:</span> {offer.property?.property_type || 'N/A'}</p>
                <p><span className="font-medium text-navy-900">Property Status:</span> {offer.property?.status || 'N/A'}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Offer Information</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium text-navy-900">Offer Amount:</span> R {Number(offer.offer_amount).toLocaleString()}</p>
                <p><span className="font-medium text-navy-900">Status:</span> {offer.status}</p>
                <p><span className="font-medium text-navy-900">Date Submitted:</span> {new Date(offer.created_at).toLocaleString('en-ZA')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Offer Document</h3>
              <div className="text-sm text-gray-700 space-y-2">
                {offer.offer_document_url ? (
                  <a
                    href={offer.offer_document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <CheckCircle size={16} /> Download Offer To Purchase
                  </a>
                ) : (
                  <p className="text-gray-500">No document available.</p>
                )}
              </div>
            </div>
          </section>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{offer.message || 'No message provided'}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-light w-full"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline py-2.5 text-sm">Cancel</button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="btn-primary text-sm py-2.5 gap-2"
          >
            <CheckCircle size={14} /> {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AgentOffer() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await getOffers();
      setOffers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOfferStatus(id, status);
      await loadOffers();
      setSelected(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = offers.filter((offer) => {
    const normalizedSearch = search.toLowerCase();
    return (
      !search ||
      `${offer.first_name} ${offer.last_name}`.toLowerCase().includes(normalizedSearch) ||
      offer.email?.toLowerCase().includes(normalizedSearch) ||
      offer.property?.title?.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div>
      <DashboardHeader title="Offer Management" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search offers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-light pl-9 text-sm w-64"
            />
          </div>
          <span className="text-sm text-gray-500">{filtered.length} offers</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Buyer', 'Property', 'Offer Amount', 'Date', 'Status', 'Action'].map((heading) => (
                    <th key={heading} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      Loading offers...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      No offers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((offer) => (
                    <tr key={offer.offer_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-navy-900 text-sm">{offer.first_name} {offer.last_name}</p>
                        <p className="text-xs text-gray-400">{offer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-[220px] truncate">{offer.property?.title || 'Unknown Property'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">R {Number(offer.offer_amount).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{new Date(offer.created_at).toLocaleDateString('en-ZA')}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[offer.status] || 'bg-gray-100 text-gray-700'}`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(offer)}
                          className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <OfferModal
            offer={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
