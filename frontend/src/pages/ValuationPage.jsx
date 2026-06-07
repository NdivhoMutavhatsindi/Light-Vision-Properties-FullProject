import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, ChevronRight, Send, Building2, FileText } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { submitValuationRequest } from '../services/valuation.service.js';

const steps = [
  { step: 1, title: 'Property Details', icon: Building2, fields: ['property_address', 'property_type', 'floor_area', 'erf_size'] },
  { step: 2, title: 'Property Features', icon: TrendingUp, fields: ['bedrooms', 'bathrooms', 'garages', 'year_built', 'property_condition'] },
  { step: 3, title: 'Your Contact Info', icon: FileText, fields: ['first_name', 'last_name', 'email', 'phone', 'preferred_contact', 'message'] },
];

export default function ValuationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_address: '',
    property_type: 'Freestanding House',
    floor_area: '',
    erf_size: '',
    bedrooms: '',
    bathrooms: '',
    garages: '',
    year_built: '',
    property_condition: 'Excellent',
    swimming_pool: false,
    solar_power: false,
    home_theatre: false,
    wine_cellar: false,
    smart_home: false,
    staff_quarters: false,
    generator: false,
    borehole: false,
    preferred_contact: 'Phone Call',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const next = () => setCurrentStep(s => Math.min(s + 1, 3));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitValuationRequest({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        property_address: form.property_address,
        property_type: form.property_type,
        floor_area: form.floor_area ? Number(form.floor_area) : null,
        erf_size: form.erf_size ? Number(form.erf_size) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        garages: form.garages ? Number(form.garages) : null,
        year_built: form.year_built ? Number(form.year_built) : null,
        property_condition: form.property_condition,
        swimming_pool: form.swimming_pool,
        solar_power: form.solar_power,
        home_theatre: form.home_theatre,
        wine_cellar: form.wine_cellar,
        smart_home: form.smart_home,
        staff_quarters: form.staff_quarters,
        generator: form.generator,
        borehole: form.borehole,
        preferred_contact: form.preferred_contact,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit valuation request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBanner
        title="Property Valuation"
        subtitle="Get an accurate, professional valuation of your property from our certified experts."
        breadcrumbs={[{ label: 'Valuation' }]}
      />

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Free Assessment', desc: 'No obligation initial property assessment from our expert valuators.' },
              { title: 'Certified Valuators', desc: 'All valuations are conducted by qualified, registered property valuators.' },
              { title: 'Detailed Report', desc: 'Comprehensive written report with market comparison and recommended listing price.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-white rounded-2xl p-8 border border-gray-100"
                style={{ boxShadow: '0 2px 16px rgba(15,27,61,0.07)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Multi-step Form */}
          <SectionHeading eyebrow="Get Started" title="Request a Valuation" subtitle="Complete the form below and one of our specialists will be in touch within 24 hours." />

          <div className="max-w-2xl mx-auto">
            {/* Step Progress */}
            <div className="flex items-center mb-12">
              {steps.map((s, i) => (
                <div key={s.step} className="flex-1 flex items-center">
                  <motion.div
                    className="flex flex-col items-center flex-1"
                    animate={{ scale: currentStep === s.step ? 1.05 : 1 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentStep >= s.step ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-400'} ${currentStep === s.step ? 'ring-4 ring-gold-300' : ''}`}
                      animate={currentStep === s.step ? { boxShadow: '0 0 20px rgba(200, 169, 107, 0.4)' } : {}}
                    >
                      {currentStep > s.step ? <CheckCircle size={18} /> : <s.icon size={18} />}
                    </motion.div>
                    <span className={`text-xs mt-3 text-center font-medium ${currentStep >= s.step ? 'text-navy-900' : 'text-gray-400'}`}>{s.title}</span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div
                      className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${currentStep > s.step ? 'bg-gold-500' : 'bg-gray-200'}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStep > s.step ? 1 : 0 }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-300">
                    <CheckCircle size={32} className="text-gold-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-navy-900 mb-3">Request Received!</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Thank you for your valuation request. One of our certified valuators will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Step 1 */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <h3 className="text-xl font-serif font-semibold text-navy-900 mb-5">Property Details</h3>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property Address *</label>
                        <input
                          type="text"
                          className="input-light"
                          placeholder="e.g. 12 Oak Lane, Constantia, Cape Town"
                          required
                          value={form.property_address}
                          onChange={e => setForm(f => ({ ...f, property_address: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property Type</label>
                          <select
                            className="input-light"
                            value={form.property_type}
                            onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}
                          >
                            <option>Freestanding House</option>
                            <option>Apartment / Flat</option>
                            <option>Townhouse</option>
                            <option>Penthouse</option>
                            <option>Estate Property</option>
                            <option>Farm / Plot</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Floor Area (m²)</label>
                          <input
                            type="number"
                            className="input-light"
                            placeholder="e.g. 250"
                            value={form.floor_area}
                            onChange={e => setForm(f => ({ ...f, floor_area: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Erf / Plot Size (m²)</label>
                        <input
                          type="number"
                          className="input-light"
                          placeholder="e.g. 800"
                          value={form.erf_size}
                          onChange={e => setForm(f => ({ ...f, erf_size: e.target.value }))}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <h3 className="text-xl font-serif font-semibold text-navy-900 mb-5">Property Features</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { field: 'bedrooms', label: 'Bedrooms', opts: ['1', '2', '3', '4', '5', '6+'] },
                          { field: 'bathrooms', label: 'Bathrooms', opts: ['1', '2', '3', '4', '5+'] },
                          { field: 'garages', label: 'Garages', opts: ['0', '1', '2', '3', '4+'] },
                        ].map(({ field, label, opts }) => (
                          <div key={field}>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                            <select
                              className="input-light"
                              value={form[field]}
                              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            >
                              {opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Year Built</label>
                          <input
                            type="number"
                            className="input-light"
                            placeholder="e.g. 2018"
                            value={form.year_built}
                            onChange={e => setForm(f => ({ ...f, year_built: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property Condition</label>
                          <select
                            className="input-light"
                            value={form.property_condition}
                            onChange={e => setForm(f => ({ ...f, property_condition: e.target.value }))}
                          >
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Average</option>
                            <option>Needs Work</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Special Features (select all that apply)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'swimming_pool', label: 'Swimming Pool' },
                            { key: 'solar_power', label: 'Solar Power' },
                            { key: 'home_theatre', label: 'Home Theatre' },
                            { key: 'wine_cellar', label: 'Wine Cellar' },
                            { key: 'smart_home', label: 'Smart Home' },
                            { key: 'staff_quarters', label: 'Staff Quarters' },
                            { key: 'generator', label: 'Generator' },
                            { key: 'borehole', label: 'Borehole' },
                          ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded accent-gold-500"
                                checked={form[key]}
                                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <h3 className="text-xl font-serif font-semibold text-navy-900 mb-5">Your Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                          <input
                            type="text"
                            className="input-light"
                            placeholder="First name"
                            required
                            value={form.first_name}
                            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
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
                            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
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
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Preferred Contact Method</label>
                        <select
                          className="input-light"
                          value={form.preferred_contact}
                          onChange={(e) => setForm((f) => ({ ...f, preferred_contact: e.target.value }))}
                        >
                          <option>Phone Call</option>
                          <option>Email</option>
                          <option>WhatsApp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Additional message</label>
                        <textarea
                          className="input-light min-h-[120px] resize-none"
                          placeholder="Any details to help our valuators"
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    {currentStep > 1 ? (
                      <button type="button" onClick={prev} className="btn-outline py-2.5 px-5 text-sm">
                        Back
                      </button>
                    ) : <div />}
                    {currentStep < 3 ? (
                      <button type="button" onClick={next} className="btn-primary gap-2 text-sm py-2.5">
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button type="submit" disabled={loading} className="btn-primary gap-2 text-sm py-2.5">
                        <Send size={16} /> {loading ? 'Sending...' : 'Submit Request'}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
