import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { submitContactInquiry } from '../services/contact.service.js';

const offices = [
  {
    city: 'Office',
    address: 'Office number B02 Mashapha Complex, Thohoyandou, 0950',
    phone: '+27 71 709 3059',
    email: 'sales@lightvisionproperties.co.za',
    hours: 'Mon – Fri: 8:00 – 17:30\nSat: 9:00 – 13:00',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    city: 'Head Office',
    address: 'Narehousing Tswinga Block 09, House number 283, Thohoyandou, 0950',
    phone: '+27 71 709 3059',
    email: 'invoices@lightvisionproperties.co.za',
    hours: 'Mon – Fri: 8:00 – 17:30\nSat: 9:00 – 13:00',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await submitContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });

      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to send message.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBanner
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out and our team will respond promptly."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      {/* Contact Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Phone, title: 'Call Us', info: '+27 71 709 3059', sub: 'Mon-Fri 8:00 – 17:30', href: 'tel:+27717093059' },
              { icon: Mail, title: 'Email Us', info: 'info@lightvisionproperties.co.za', sub: 'We respond within 2 hours', href: 'mailto:info@lightvisionproperties.co.za' },
              { icon: MessageCircle, title: 'WhatsApp', info: '+27 79 961 7443', sub: 'Available 24/7', href: 'https://wa.me/27799617443' },
            ].map(({ icon: Icon, title, info, sub, href }, i) => (
              <motion.a
                key={title}
                href={href}
                target={href.startsWith('https') ? '_blank' : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 group"
                style={{ boxShadow: '0 2px 16px rgba(15,27,61,0.07)' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-900 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                  <Icon size={22} className="text-gold-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-navy-900 mb-2">{title}</h3>
                <p className="text-gold-600 font-medium text-sm mb-1">{info}</p>
                <p className="text-gray-400 text-sm">{sub}</p>
              </motion.a>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-100"
              style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}
            >
              <h2 className="text-2xl font-serif font-semibold text-navy-900 mb-6">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll respond within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-light" placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-light" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-light" placeholder="+27 xx xxx xxxx" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                      <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-light">
                        <option value="">Select a subject</option>
                        <option>Property Enquiry</option>
                        <option>Valuation Request</option>
                        <option>Agent Contact</option>
                        <option>General Enquiry</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
                    <textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-light resize-none" placeholder="How can we assist you?" required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2">
                    <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  {error && (
                    <p className="text-sm text-red-500 mt-3">{error}</p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Office Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-navy-gradient rounded-3xl p-8 text-white">
                <h3 className="text-xl font-serif font-semibold mb-2">Head Office</h3>
                <p className="text-gold-400 font-medium mb-4">Cape Town</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Narehousing Tswinga Block 09, House number 283<br />Thohoyandou, 0950</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={15} className="text-gold-400 flex-shrink-0" />
                    <a href="tel:+27717093059" className="text-gray-300 hover:text-gold-400 transition-colors">+27 71 709 3059</a>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-gold-400 flex-shrink-0" />
                      <a href="mailto:info@lightvisionproperties.co.za" className="text-gray-300 hover:text-gold-400 transition-colors break-all">info@lightvisionproperties.co.za</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-gold-400 flex-shrink-0" />
                      <a href="mailto:sales@lightvisionproperties.co.za" className="text-gray-300 hover:text-gold-400 transition-colors break-all">sales@lightvisionproperties.co.za</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-gold-400 flex-shrink-0" />
                      <a href="mailto:invoices@lightvisionproperties.co.za" className="text-gray-300 hover:text-gold-400 transition-colors break-all">invoices@lightvisionproperties.co.za</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-300">
                      Mon – Fri: 8:00 – 17:30<br />
                      Sat: 9:00 – 13:00<br />
                      <span className="text-gray-500">Sun: Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/27799617443?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20a%20property."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-2xl transition-colors w-full"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Offices" title="Find Us Near You" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury"
              >
                <div className="h-48 overflow-hidden">
                  <img src={office.image} alt={office.city} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-4">{office.city}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5 text-gray-600">
                      <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                      {office.address}
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Phone size={14} className="text-gold-500 flex-shrink-0" />
                      <a href={`tel:${office.phone}`} className="hover:text-gold-600 transition-colors">{office.phone}</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Clock size={14} className="text-gold-500 flex-shrink-0" />
                      <span className="whitespace-pre-line">{office.hours}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
