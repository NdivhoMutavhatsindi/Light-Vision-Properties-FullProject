import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, Download, Eye } from 'lucide-react';
import DashboardHeader from '../../components/admin/DashboardHeader';
import { getCareers, createCareer, updateCareer, deleteCareer } from '../../services/career.service';
import { getJobApplications, updateJobApplicationStatus } from '../../services/jobApplication.service';

const statusColors = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  REVIEWED: 'bg-blue-50 text-blue-700',
  ACCEPTED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
};

function CareerModal({ career, onClose, onSaved }) {
  const isEdit = Boolean(career);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: career?.title || '',
    location: career?.location || '',
    employment_type: career?.employment_type || 'fulltime',
    description: career?.description || '',
    is_active: career?.is_active === undefined ? true : Boolean(career.is_active),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        is_active: Boolean(formData.is_active),
      };

      const savedCareer = isEdit
        ? await updateCareer(career.career_id, payload)
        : await createCareer(payload);

      setSaved(true);
      onSaved(savedCareer);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      alert('Unable to save career');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">{isEdit ? 'Edit Career' : 'Add Career'}</h2>
            <p className="text-sm text-gray-500">Use the form below to save this career listing.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle size={40} className="text-green-500" />
            <p className="font-semibold text-navy-900">Career saved successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Job Title *</label>
                <input
                  type="text"
                  className="input-light"
                  value={formData.title}
                  required
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Senior Luxury Property Agent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location *</label>
                <input
                  type="text"
                  className="input-light"
                  value={formData.location}
                  required
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cape Town"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employment Type *</label>
              <select
                className="input-light"
                value={formData.employment_type}
                required
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
              >
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="temporary">Temporary</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Job Description *</label>
              <textarea
                rows={6}
                className="input-light resize-none"
                value={formData.description}
                required
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and responsibilities..."
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <span className="text-sm text-gray-600">Active Listing</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary text-sm py-2.5">
                {submitting ? 'Saving…' : isEdit ? 'Update Career' : 'Create Career'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminCareers() {
  const [tab, setTab] = useState('jobs');
  const [search, setSearch] = useState('');
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCareers = async () => {
    setLoading(true);
    try {
      const data = await getCareers();
      setCareers(data || []);
    } catch (error) {
      console.error(error);
      alert('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const data = await getJobApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications', err);
      alert('Failed to load applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleSaved = (career) => {
    setCareers((current) => {
      const existingIndex = current.findIndex((item) => item.career_id === career.career_id);
      if (existingIndex >= 0) {
        return current.map((item) => (item.career_id === career.career_id ? career : item));
      }
      return [career, ...current];
    });
  };

  const handleDelete = async (career) => {
    const confirmed = window.confirm('Delete this career listing?');
    if (!confirmed) return;

    try {
      await deleteCareer(career.career_id);
      setCareers((current) => current.filter((item) => item.career_id !== career.career_id));
    } catch (error) {
      console.error(error);
      alert('Unable to delete career');
    }
  };

  const handleApplicationStatusUpdated = (applicationId, status) => {
    setApplications((current) =>
      current.map((app) => (app.application_id === applicationId ? { ...app, status } : app))
    );
    if (selectedApplication && selectedApplication.application_id === applicationId) {
      setSelectedApplication((s) => ({ ...s, status }));
    }
  };

  const filteredCareers = careers.filter((career) => {
    const value = `${career.title} ${career.location} ${career.employment_type}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <div>
      <DashboardHeader title="Careers Management" />
      <div className="p-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['jobs', 'applications'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-gold-500 text-gold-600' : 'border-transparent text-gray-400 hover:text-navy-900'}`}
            >
              {t === 'jobs' ? 'Job Listings' : 'Applications'} {t === 'jobs' ? `(${careers.length})` : `(${applications.length})`}
            </button>
          ))}
        </div>

        {tab === 'jobs' && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-light pl-9 text-sm w-full"
                />
              </div>
              <button onClick={() => setModal('create')} className="btn-primary text-sm py-2.5 gap-2 inline-flex items-center">
                <Plus size={15} /> Add Job
              </button>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">Loading career listings…</div>
            ) : (
              <div className="space-y-4">
                {filteredCareers.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">No career listings found.</div>
                ) : (
                  filteredCareers.map((career, index) => (
                    <motion.div
                      key={career.career_id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                      style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}
                    >
                      <div>
                        <h3 className="font-semibold text-navy-900">{career.title}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                          <span>{career.location}</span>
                          <span>{career.employment_type}</span>
                          <span>{career.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setModal(career)}
                          className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gold-600 hover:bg-gold-50 transition-colors"
                          aria-label="Edit career"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(career)}
                          className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Delete career"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {tab === 'applications' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    {['Applicant', 'Position', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loadingApplications ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">Loading applications…</td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">No applications found.</td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-navy-900 text-sm">{app.first_name} {app.last_name}</p>
                          <p className="text-xs text-gray-400">{app.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{app.career_title || app.career_id}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{new Date(app.created_at).toLocaleDateString('en-ZA')}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-gray-50 text-gray-600'}`}>{app.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <Eye size={13} />
                            </button>
                            <a
                              href={app.cv_url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                              title="Download CV"
                            >
                              <Download size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <CareerModal
            career={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

          {/* Application Modal */}
          <AnimatePresence>
            {selectedApplication && (
              <ApplicationModal
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
                onStatusUpdated={handleApplicationStatusUpdated}
              />
            )}
          </AnimatePresence>
    </div>
  );
}

    function ApplicationModal({ application, onClose, onStatusUpdated }) {
      const [status, setStatus] = useState(application.status);
      const [saving, setSaving] = useState(false);

      const handleUpdate = async () => {
        try {
          setSaving(true);
          await updateJobApplicationStatus(application.application_id, status);
          onStatusUpdated(application.application_id, status);
          onClose();
        } catch (err) {
          console.error(err);
          alert('Unable to update status');
        } finally {
          setSaving(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-navy-900">Job Application</h2>
                <p className="text-sm text-gray-500">View and update application status</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Applicant</p>
                <p className="font-medium text-navy-900">{application.first_name} {application.last_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Position</p>
                <p className="font-medium text-navy-900">{application.career_title || application.career_id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-navy-900">{application.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-navy-900">{application.phone}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Cover Letter</p>
                <p className="text-sm text-gray-700">{application.cover_letter || 'No cover letter submitted'}</p>
              </div>

              <div className="flex items-center gap-3">
                <a href={application.cv_url} target="_blank" rel="noreferrer" className="btn-outline">Download CV</a>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-light">
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button onClick={handleUpdate} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Update'}</button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
