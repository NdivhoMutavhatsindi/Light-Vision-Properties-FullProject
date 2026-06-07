import { useEffect, useState } from 'react';
import { Search, Eye, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../../components/admin/DashboardHeader';
import {
  getLegalRequests,
  updateLegalRequestStatus,
} from '../../services/legal.service';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700',
  in_progress: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
};

function LegalModal({ request, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(request.status || 'pending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(request.status || 'pending');
  }, [request]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await onStatusUpdate(request.legal_request_id, status);
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
        className="bg-white rounded-3xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif font-semibold text-navy-900">Legal Request</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-6 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-1">
              <p className="font-medium text-navy-900">Name</p>
              <p>{request.first_name} {request.last_name}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-navy-900">Email</p>
              <p>{request.email}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-navy-900">Phone</p>
              <p>{request.phone || 'Not provided'}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-navy-900">Received</p>
              <p>{new Date(request.created_at).toLocaleString('en-ZA')}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{request.message || 'No message provided'}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-light w-full"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
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

export default function AgentLegal() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getLegalRequests();
      setRequests(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLegalRequestStatus(id, status);
      await loadRequests();
      setSelected(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = requests.filter((req) => {
    const normalizedSearch = search.toLowerCase();
    const matchesSearch =
      !search ||
      `${req.first_name} ${req.last_name}`.toLowerCase().includes(normalizedSearch) ||
      req.email?.toLowerCase().includes(normalizedSearch) ||
      req.phone?.toLowerCase().includes(normalizedSearch) ||
      req.message?.toLowerCase().includes(normalizedSearch);
    const matchesFilter = !filter || req.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <DashboardHeader title="Legal Requests" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search legal requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-light pl-9 text-sm w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-light text-sm w-48"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-sm text-gray-500">{filtered.length} requests</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Client', 'Email', 'Phone', 'Received', 'Status', 'Actions'].map((heading) => (
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
                      Loading legal requests...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                      No legal requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr key={req.legal_request_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-navy-900 text-sm">{req.first_name} {req.last_name}</p>
                        <p className="text-xs text-gray-400">{req.phone || 'No phone'}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{req.email}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{req.phone || '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString('en-ZA')}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(req)}
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
          <LegalModal
            request={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
