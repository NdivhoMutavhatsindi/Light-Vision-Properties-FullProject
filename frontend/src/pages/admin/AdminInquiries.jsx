import { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../../components/admin/DashboardHeader';
import {
  getContactInquiries,
  updateContactInquiryStatus,
} from '../../services/inquiry.service';

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700',
  responded: 'bg-green-50 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

function InquiryModal({ inquiry, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(inquiry.status || 'pending');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await onStatusUpdate(inquiry.inquiry_id, status);
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
        className="bg-white rounded-3xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif font-semibold text-navy-900">Inquiry Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { label: 'Name', value: inquiry.name },
            { label: 'Email', value: inquiry.email },
            { label: 'Phone', value: inquiry.phone || 'Not provided' },
            { label: 'Subject', value: inquiry.subject },
            {
              label: 'Received',
              value: new Date(inquiry.created_at).toLocaleString('en-ZA'),
            },
            { label: 'Status', value: inquiry.status },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
              <span className="text-sm font-medium text-navy-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message</p>
          <p className="text-sm text-gray-700">{inquiry.message}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-light w-full"
            >
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn-outline py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="btn-primary text-sm py-2.5 gap-2"
            >
              <CheckCircle size={14} /> {saving ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminInquiries() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getContactInquiries();
      setInquiries(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateContactInquiryStatus(id, status);
      await loadInquiries();
      setSelected(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const normalizedSearch = search.toLowerCase();
    const matchSearch =
      !search ||
      inq.name?.toLowerCase().includes(normalizedSearch) ||
      inq.email?.toLowerCase().includes(normalizedSearch) ||
      inq.subject?.toLowerCase().includes(normalizedSearch);
    const matchFilter = !filter || inq.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <DashboardHeader title="Inquiries Management" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search inquiries..."
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
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
          <span className="text-sm text-gray-500">{filtered.length} inquiries</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Client', 'Subject', 'Received', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                      No inquiries found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inq) => (
                    <tr key={inq.inquiry_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-navy-900 text-sm">{inq.name}</p>
                        <p className="text-xs text-gray-400">{inq.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{inq.subject}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(inq.created_at).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[inq.status] || 'bg-gray-100 text-gray-700'}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(inq)}
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
          <InquiryModal
            inquiry={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
