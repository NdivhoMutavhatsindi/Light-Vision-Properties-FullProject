import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, FileCheck, Zap, Droplets, Bug, Flame, Send } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import api from '../services/api.js';

const complianceCerts = [
  { icon: Zap, title: 'Electrical Certificate', desc: 'Mandatory certificate of compliance for all electrical installations, required for property transfer.' },
  { icon: Droplets, title: 'Plumbing Certificate', desc: 'Compliance certificate for water and plumbing systems, ensuring no leaks or illegal connections.' },
  { icon: Flame, title: 'Gas Certificate', desc: 'Certification for all gas installations and appliances on the property.' },
  { icon: Bug, title: 'Beetle Inspection', desc: 'Infestation report covering wood-destroying insects, required in coastal areas.' },
  { icon: FileCheck, title: 'Electrical Fence', desc: 'Certificate of compliance for all electric fencing on the property.' },
  { icon: Shield, title: 'Water Compliance', desc: 'Confirmation that all water meters and connections comply with municipal bylaws.' },
];

export default function CompliancePage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCert = (title) => {
    setSelectedCerts((current) =>
      current.includes(title)
        ? current.filter((c) => c !== title)
        : [...current, title]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.message) {
      setError('Please complete all required fields.');
      return;
    }

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      message: `${selectedCerts.length ? `Certificates Requested:\n${selectedCerts.join(', ')}\n\n` : ''}${form.message}`,
    };

    try {
      setError('');
      setLoading(true);
      await api.post('/compliance', payload);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit compliance request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBanner
        title="Compliance Services"
        subtitle="Ensuring your property meets all legal and regulatory requirements for a smooth transfer."
        breadcrumbs={[{ label: 'Compliance' }]}
      />

      {/* Intro */}
      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gold-line" />
                <span className="text-gold-600 text-xs font-semibold tracking-widest uppercase">Why It Matters</span>
              </div>
              <h2 className="text-4xl font-serif font-light text-navy-900 mb-6">
                Property Compliance Made Simple
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                All properties sold in South Africa require various compliance certificates before transfer can be registered. Our team coordinates with qualified specialists to ensure your property is fully compliant.
              </p>
              <ul className="space-y-3">
                {['Fast turnaround — certificates within 5-10 business days', 'Nationwide network of qualified specialists', 'Competitive rates and bundled packages', 'Full documentation management'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle size={16} className="text-gold-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Compliance"
                className="rounded-3xl shadow-luxury w-full"
              />
            </motion.div>
          </div>

          {/* Certificates Grid */}
          <SectionHeading eyebrow="Our Services" title="Compliance Certificates" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {complianceCerts.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-luxury transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.07)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center mb-4">
                  <cert.icon size={20} className="text-gold-400" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-navy-900 mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{cert.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Request Form */}
          <SectionHeading eyebrow="Get Started" title="Request Compliance Certificates" subtitle="Select the certificates you need and we'll handle the rest." />
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600">Our compliance team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Certificates Required</label>
                    <div className="grid grid-cols-2 gap-2">
                      {complianceCerts.map(cert => (
                        <label key={cert.title} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${selectedCerts.includes(cert.title) ? 'border-gold-500 bg-gold-50 text-navy-900' : 'border-gray-200 text-gray-600 hover:border-gold-300'}`}>
                          <input type="checkbox" className="sr-only" checked={selectedCerts.includes(cert.title)} onChange={() => toggleCert(cert.title)} />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedCerts.includes(cert.title) ? 'bg-gold-500 border-gold-500' : 'border-gray-300'}`}>
                            {selectedCerts.includes(cert.title) && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <span className="text-xs font-medium">{cert.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
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
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone *</label>
                      <input
                        type="tel"
                        className="input-light"
                        placeholder="+27 xx xxx xxxx"
                        required
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
                    <textarea
                      rows={4}
                      className="input-light resize-none"
                      placeholder="Please describe what you need and any additional details..."
                      required
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center gap-2" disabled={loading}>
                    <Send size={16} /> Submit Request
                  </button>
                  {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                  {loading && <p className="text-sm text-gray-500 mt-2">Submitting request...</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
