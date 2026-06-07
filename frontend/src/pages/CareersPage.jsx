import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ChevronDown, Upload, Send, Users, TrendingUp, Award } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { getCareers } from '../services/career.service.js';
import { submitJobApplication } from '../services/jobApplication.service.js';

function JobCard({ job, index }) {
  const [open, setOpen] = useState(false);

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === 'string'
    ? job.requirements.split(/\r?\n/).filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(15,27,61,0.07)' }}
    >
      <button
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-semibold text-navy-900 mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-gold-500" />{job.department}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gold-500" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-gold-500" />{job.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-medium text-gold-600 hidden sm:block">{job.salary}</span>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
              <div>
                <h4 className="font-semibold text-navy-900 mb-2 text-sm uppercase tracking-wide">Requirements</h4>
                <ul className="space-y-2">
                  {requirements.map((requirement) => (
                    <li key={requirement} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-400">Posted: {new Date(job.created_at || job.posted).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <button
                onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-sm py-2.5"
              >
                Apply for This Position
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CareersPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', career_id: '', cover_letter: '' });
  const [fileName, setFileName] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError('Please attach your CV.');
      return;
    }

    if (!form.first_name || !form.last_name || !form.email || !form.career_id) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const applicationData = new FormData();
    applicationData.append('career_id', form.career_id);
    applicationData.append('first_name', form.first_name);
    applicationData.append('last_name', form.last_name);
    applicationData.append('email', form.email);
    applicationData.append('phone', form.phone);
    applicationData.append('cover_letter', form.cover_letter);
    applicationData.append('cv', resumeFile);

    try {
      await submitJobApplication(applicationData);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const data = await getCareers();
        setCareers(data);
        if (data?.length) {
          setForm((prev) => ({ ...prev, career_id: data[0].career_id }));
        }
      } catch (err) {
        setError('Unable to load career opportunities.');
      }
    };

    loadCareers();
  }, []);

  return (
    <div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {loading && <p className="text-sm text-gray-500 mt-2">Submitting your application...</p>}
      <PageBanner
        title="Careers"
        subtitle="Join South Africa's most prestigious luxury property group."
        breadcrumbs={[{ label: 'Careers' }]}
        image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gold-line" />
                <span className="text-gold-600 text-xs font-semibold tracking-widest uppercase">Our Culture</span>
              </div>
              <h2 className="text-4xl font-serif font-light text-navy-900 mb-6">Why Work With Us?</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                At Light Vision Property, we believe our people are our greatest asset. We invest in talent, celebrate success, and create an environment where exceptional professionals can thrive.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                For recruitment enquiries, please email <a href="mailto:careers@lightvisionproperties.co.za" className="text-gold-600 hover:text-gold-500">careers@lightvisionproperties.co.za</a>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: TrendingUp, label: 'Growth Opportunities', desc: 'Structured career paths with clear progression' },
                  { icon: Award, label: 'Top Compensation', desc: 'Industry-leading commission structures' },
                  { icon: Users, label: 'Expert Team', desc: 'Work alongside South Africa\'s best' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4">
                    <Icon size={20} className="text-gold-500 mb-2" />
                    <p className="font-semibold text-navy-900 text-sm mb-1">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our team"
                className="rounded-3xl shadow-luxury w-full"
              />
            </motion.div>
          </div>

          <SectionHeading eyebrow="Open Positions" title="Current Opportunities" />
          <div className="space-y-4 mb-20">
            {careers.map((job, i) => (
              <JobCard key={job.career_id} job={job} index={i} />
            ))}
          </div>

          <div id="apply-form">
            <SectionHeading eyebrow="Apply Now" title="Submit Your Application" subtitle="Ready to join the team? Complete the form below and we'll be in touch." />
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">Application Received!</h3>
                    <p className="text-gray-600">Thank you for your interest. Our HR team will review your application and contact you within 5 business days.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                        <input
                          type="text"
                          className="input-light"
                          placeholder="First name"
                          required
                          value={form.first_name}
                          onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                        <input
                          type="text"
                          className="input-light"
                          placeholder="Last name"
                          required
                          value={form.last_name}
                          onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                        <input
                          type="email"
                          className="input-light"
                          placeholder="your@email.com"
                          required
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                        <input
                          type="tel"
                          className="input-light"
                          placeholder="+27 xx xxx xxxx"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Position *</label>
                      <select
                        className="input-light"
                        required
                        value={form.career_id}
                        onChange={e => setForm(f => ({ ...f, career_id: e.target.value }))}
                      >
                        <option value="">Select a position</option>
                        {careers.map((career) => (
                          <option key={career.career_id} value={career.career_id}>
                            {career.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cover Letter / Message</label>
                      <textarea
                        rows={4}
                        className="input-light resize-none"
                        placeholder="Tell us about yourself and why you'd like to join Light Vision Property..."
                        value={form.cover_letter}
                        onChange={e => setForm(f => ({ ...f, cover_letter: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upload CV / Resume</label>
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/30 transition-all group">
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFile} />
                        <Upload size={24} className="text-gray-400 group-hover:text-gold-500 mb-2 transition-colors" />
                        {fileName ? (
                          <p className="text-sm font-medium text-navy-900">{fileName}</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700">Drop your CV here or click to browse</p>
                            <p className="text-xs text-gray-400 mt-1">PDF only — Max 5MB</p>
                          </>
                        )}
                      </label>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center gap-2" disabled={loading}>
                      <Send size={16} /> Submit Application
                    </button>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    {loading && <p className="text-sm text-gray-500 mt-2">Submitting your application...</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
