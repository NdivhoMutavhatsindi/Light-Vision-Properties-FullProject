import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, Users, Shield, CheckCircle, Send } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { submitLegalRequest } from '../services/legal.service.js';

const legalServices = [
  { icon: FileText, title: 'Conveyancing', desc: 'Full transfer and registration of property in the Deeds Office. Our attorneys ensure a seamless, legally compliant transfer process.' },
  { icon: Scale, title: 'Contract Review', desc: 'Expert review of all agreements, ensuring your interests are fully protected before you sign.' },
  { icon: Users, title: 'Estate Planning', desc: 'Comprehensive advice on property in estate plans, wills, and trust structures for optimal asset protection.' },
  { icon: Shield, title: 'Dispute Resolution', desc: 'Experienced representation in property-related disputes, negotiations, and litigation.' },
];

const attorneys = [
  { name: 'Adv. Helena van Niekerk', title: 'Senior Conveyancer', speciality: 'Luxury Property Transfers', image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400', years: 18 },
  { name: 'Adv. Thabo Sithole', title: 'Property Attorney', speciality: 'Commercial Property Law', image: 'https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?auto=compress&cs=tinysrgb&w=400', years: 14 },
  { name: 'Adv. Claire du Plessis', title: 'Conveyancer', speciality: 'Estate & Trust Law', image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400', years: 11 },
];

export default function LegalPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitLegalRequest({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ first_name: '', last_name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBanner
        title="Legal Advisors"
        subtitle="Expert property legal services from qualified attorneys and conveyancers."
        breadcrumbs={[{ label: 'Legal Advisors' }]}
      />

      {/* Services */}
      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Legal Services" title="Comprehensive Property Law" subtitle="Our panel of experienced property attorneys provides expert guidance at every stage of your transaction." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {legalServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-luxury transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.07)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center flex-shrink-0">
                  <s.icon size={22} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enquiry Form */}
          <SectionHeading eyebrow="Speak to a Lawyer" title="Legal Enquiry Form" subtitle="Submit your legal enquiry and one of our attorneys will respond promptly." />
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">Enquiry Received!</h3>
                  <p className="text-gray-600">One of our attorneys will contact you within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      First Name *
    </label>
    <input
      type="text"
      className="input-light"
      placeholder="John"
      required
      value={form.first_name}
      onChange={e =>
        setForm(f => ({
          ...f,
          first_name: e.target.value
        }))
      }
    />
  </div>

  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      Last Name *
    </label>
    <input
      type="text"
      className="input-light"
      placeholder="Doe"
      required
      value={form.last_name}
      onChange={e =>
        setForm(f => ({
          ...f,
          last_name: e.target.value
        }))
      }
    />
  </div>
</div>
                  <div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
    Email Address *
  </label>

  <input
    type="email"
    className="input-light"
    placeholder="john@example.com"
    required
    value={form.email}
    onChange={e =>
      setForm(f => ({
        ...f,
        email: e.target.value
      }))
    }
  />
</div>
<div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
    Phone Number *
  </label>

  <input
    type="tel"
    className="input-light"
    placeholder="+27 82 123 4567"
    required
    value={form.phone}
    onChange={e =>
      setForm(f => ({
        ...f,
        phone: e.target.value
      }))
    }
  />
</div>
                  <div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
    Legal Enquiry *
  </label>

  <textarea
    rows={6}
    className="input-light resize-none"
    placeholder="Please describe your legal matter in detail..."
    required
    value={form.message}
    onChange={e =>
      setForm(f => ({
        ...f,
        message: e.target.value
      }))
    }
  />
</div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2">
                    <Send size={16} /> {loading ? 'Sending...' : 'Submit Enquiry'}
                  </button>
                  {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
