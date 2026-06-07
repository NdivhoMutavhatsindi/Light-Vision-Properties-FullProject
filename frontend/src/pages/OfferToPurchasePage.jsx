import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Send, Shield, Clock, Star, Upload, X } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { createOffer } from '../services/offer.service.js';
import { getProperties } from '../services/property.service.js';

export default function OfferToPurchasePage() {
  const [downloadStep, setDownloadStep] = useState(true);
  const [uploadForm, setUploadForm] = useState({ first_name: '', last_name: '', email: '', phone: '', property_id: '', offer_amount: '', message: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = () => {
    // TODO: Connect to actual PDF download from backend/storage
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Light-Vision-Property-OTP-Form.pdf';
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (fetchError) {
        console.error('Unable to load property list for offers', fetchError);
      }
    };

    loadProperties();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setError('Please upload the signed OTP form.');
      return;
    }

    if (!uploadForm.first_name || !uploadForm.last_name || !uploadForm.email || !uploadForm.phone || !uploadForm.property_id || !uploadForm.offer_amount) {
      setError('Please complete all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('first_name', uploadForm.first_name);
    formData.append('last_name', uploadForm.last_name);
    formData.append('email', uploadForm.email);
    formData.append('phone', uploadForm.phone);
    formData.append('property_id', uploadForm.property_id);
    formData.append('offer_amount', uploadForm.offer_amount);
    formData.append('message', uploadForm.message);
    formData.append('offer_document', uploadedFile);

    createOffer(formData)
      .then(() => setSubmitted(true))
      .catch((err) => setError(err?.response?.data?.message || err.message || 'Unable to submit offer.'))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <PageBanner
        title="Offer to Purchase"
        subtitle="Professional assistance with all offer to purchase documentation and negotiations."
        breadcrumbs={[{ label: 'Offer to Purchase' }]}
      />

      <section className="section-padding">
        <div className="container-luxury px-4 sm:px-6 lg:px-8">
          {/* Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="gold-line" />
                <span className="text-gold-600 text-xs font-semibold tracking-widest uppercase">What Is An OTP?</span>
              </div>
              <h2 className="text-4xl font-serif font-light text-navy-900 mb-6">Understanding the Offer to Purchase</h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-lg">
                An Offer to Purchase (OTP) is a legally binding agreement between a buyer and seller. It outlines all the terms and conditions of the property sale, including purchase price, suspensive conditions, and transfer timelines.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our agents guide you through every clause, ensuring you fully understand what you are signing and that your interests are fully protected.
              </p>
              <div className="space-y-3">
                {[
                  'Expert explanation of all clauses',
                  'Negotiation of terms on your behalf',
                  'Suspensive conditions management',
                  'Liaison with attorneys and banks',
                  'Digital signature capabilities',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-navy-gradient rounded-3xl p-8 text-white space-y-6">
                <h3 className="text-2xl font-serif font-light">Key OTP Components</h3>
                {[
                  { icon: Star, title: 'Purchase Price', desc: 'The agreed price and how it will be paid — deposit, bond, or cash.' },
                  { icon: Clock, title: 'Occupation Date', desc: 'When the buyer takes physical occupation of the property.' },
                  { icon: Shield, title: 'Suspensive Conditions', desc: 'Conditions that must be met for the sale to proceed, such as bond approval.' },
                  { icon: FileText, title: 'Property Description', desc: 'Legal description of the property, fixtures, fittings included in the sale.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-0.5">{title}</p>
                      <p className="text-sm text-gray-300">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Three-Step Process */}
          <SectionHeading eyebrow="The Process" title="Simple 3-Step Workflow" subtitle="Download, complete, and submit your offer to purchase securely." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { step: 1, title: 'Download Form', desc: 'Get the official Light Vision Property OTP form', icon: Download, color: 'bg-blue-50 text-blue-600' },
              { step: 2, title: 'Complete & Sign', desc: 'Fill in your details and have it signed', icon: FileText, color: 'bg-gold-50 text-gold-600' },
              { step: 3, title: 'Upload Here', desc: 'Submit your completed form securely', icon: Upload, color: 'bg-green-50 text-green-600' },
            ].map(({ step, title, desc, icon: Icon, color }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <div className="text-4xl font-serif font-light text-gold-600 mb-2">{step}</div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Download & Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Download */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-gray-100"
              style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Download size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-navy-900 mb-3">Download Form</h3>
                <p className="text-gray-600 mb-6">Get the official Light Vision Property Offer to Purchase form. Read through all terms carefully.</p>
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center gap-2 text-base"
                >
                  <Download size={18} />
                  Download OTP Form (PDF)
                </motion.button>
                <p className="text-xs text-gray-400 mt-4">File size: 2.4 MB | Format: PDF</p>
              </div>
            </motion.div>

            {/* Upload */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border border-gray-100"
              style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle size={32} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-serif font-semibold text-navy-900 mb-2">Submitted!</h3>
                  <p className="text-gray-600 text-sm">We've received your signed offer. Our team will review it and be in touch within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-navy-900 mb-5">Submit Signed Offer</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                      <input
                        type="text"
                        className="input-light"
                        placeholder="First name"
                        required
                        value={uploadForm.first_name}
                        onChange={e => setUploadForm(f => ({ ...f, first_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        className="input-light"
                        placeholder="Last name"
                        required
                        value={uploadForm.last_name}
                        onChange={e => setUploadForm(f => ({ ...f, last_name: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                      <input type="email" className="input-light" placeholder="your@email.com" required onChange={e => setUploadForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone *</label>
                      <input type="tel" className="input-light" placeholder="+27 xx xxx xxxx" required onChange={e => setUploadForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property *</label>
                    <select
                      className="input-light"
                      required
                      value={uploadForm.property_id}
                      onChange={e => setUploadForm(f => ({ ...f, property_id: e.target.value }))}
                    >
                      <option value="">Select property</option>
                      {properties.map((property) => (
                        <option key={property.property_id} value={property.property_id}>
                          {property.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Offer Amount *</label>
                    <input
                      type="number"
                      className="input-light"
                      placeholder="Enter offer amount"
                      required
                      value={uploadForm.offer_amount}
                      onChange={e => setUploadForm(f => ({ ...f, offer_amount: e.target.value }))}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upload Signed OTP *</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/20 transition-all group">
                      <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} required />
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadedFile ? (
                          <>
                            <FileText size={24} className="text-green-500 mb-2" />
                            <p className="text-sm font-medium text-green-600">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          </>
                        ) : (
                          <>
                            <Upload size={24} className="text-gray-400 group-hover:text-gold-500 mb-2 transition-colors" />
                            <p className="text-sm font-medium text-gray-700">Drop your signed PDF here</p>
                            <p className="text-xs text-gray-500 mt-1">PDF only • Max 10MB</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Additional Notes</label>
                    <textarea rows={3} className="input-light resize-none" placeholder="Any special instructions or notes..." value={uploadForm.message} onChange={e => setUploadForm(f => ({ ...f, message: e.target.value }))} />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center gap-2" disabled={loading}>
                    <Send size={16} /> Submit Signed Offer
                  </button>
                  {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                  {loading && <p className="text-sm text-gray-500 mt-2">Submitting offer...</p>}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
