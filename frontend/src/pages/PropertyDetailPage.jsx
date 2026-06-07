import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Bed, Bath, MapPin, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatPrice } from '../data/mockData';
import { getProperty, getSimilarProperties } from '../services/property.service.js';
import { submitPropertyInquiry } from '../services/inquiry.service.js';
import PropertyCard from '../components/ui/PropertyCard';
import SectionHeading from '../components/ui/SectionHeading';

function MortgageCalc({ price }) {
  const [deposit, setDeposit] = useState(Math.round(price * 0.1 / 100000) * 100000);
  const [rate, setRate] = useState(11.5);
  const [term, setTerm] = useState(20);

  const principal = price - deposit;
  const monthlyRate = rate / 100 / 12;
  const payments = term * 12;
  const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="text-lg font-serif font-semibold text-navy-900 mb-5">Mortgage Calculator</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Purchase Price</label>
          <div className="input-light bg-gray-100 py-3 text-sm font-medium">{formatPrice(price)}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deposit Amount</label>
          <input type="range" min={0} max={price * 0.5} step={100000} value={deposit} onChange={e => setDeposit(+e.target.value)} className="w-full accent-gold-500 mb-1" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(deposit)}</span>
            <span>{Math.round(deposit / price * 100)}%</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Interest Rate: {rate}%</label>
          <input type="range" min={7} max={20} step={0.25} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-gold-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Term: {term} years</label>
          <input type="range" min={5} max={30} step={5} value={term} onChange={e => setTerm(+e.target.value)} className="w-full accent-gold-500" />
        </div>
      </div>
      <div className="bg-navy-900 rounded-xl p-5 text-white text-center">
        <p className="text-sm text-gray-400 mb-1">Estimated Monthly Payment</p>
        <p className="text-3xl font-serif font-light text-gradient-gold">
          R {Math.round(monthly).toLocaleString('en-ZA')}
        </p>
        <p className="text-xs text-gray-500 mt-2">*Estimate only. Contact your bank for exact figures.</p>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams({ strict: false });
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getProperty(id);
        setProperty(data);
        setForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          message: `I am interested in ${data?.title || 'this property'}. Please contact me with more information.`,
        });
        const similarData = await getSimilarProperties(id);
        setSimilar(similarData);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || fetchError?.message || 'Unable to load property');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const imgs = property?.images?.map((image) => image.image_url) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPropertyInquiry({
        property_id: property.property_id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (submitError) {
      console.error(submitError);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-500">Loading property details…</div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 text-center text-red-600">{error}</div>
    );
  }

  if (!property) {
    return (
      <div className="pt-20 text-center text-gray-600">Property not found.</div>
    );
  }

  return (
    <div className="pt-20">
      {/* Gallery */}
      <section className="relative">
        <div className="grid grid-cols-4 grid-rows-2 h-[60vh] min-h-[400px] gap-1">
          <div className="col-span-2 row-span-2 cursor-pointer overflow-hidden" onClick={() => setLightbox(true)}>
            <img
              src={imgs[0] || 'https://via.placeholder.com/1200x800'}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {imgs.slice(1, 5).map((img, i) => (
            <div key={i} className="overflow-hidden cursor-pointer" onClick={() => { setCurrentImg(i + 1); setLightbox(true); }}>
              <img src={img || 'https://via.placeholder.com/800x600'} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 bg-white text-navy-900 text-sm font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          View all {Math.max(imgs.length, 1)} photos
        </button>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(false)}><X size={24} /></button>
          <button className="absolute left-6 text-white p-2" onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg - 1 + imgs.length) % imgs.length); }}>
            <ChevronLeft size={32} />
          </button>
          <img src={imgs[currentImg]} alt="" className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button className="absolute right-6 text-white p-2" onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg + 1) % imgs.length); }}>
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-6 text-white/60 text-sm">{currentImg + 1} / {imgs.length}</div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-500 text-white">{property.property_type}</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{property.status}</span>
                  {property.featured && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-50 text-gold-700">Featured</span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-light text-navy-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin size={15} className="text-gold-500" />
                  <span>{property.location}</span>
                </div>
                <p className="text-3xl font-serif font-semibold text-navy-900">{formatPrice(property.price)}</p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <Icon size={20} className="text-gold-500 mx-auto mb-2" />
                    <p className="text-xl font-serif font-semibold text-navy-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-serif font-semibold text-navy-900 mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
              </div>

              {/* Mortgage Calculator */}
              <MortgageCalc price={property.price} />
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
                style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}
              >
                <h3 className="text-lg font-serif font-semibold text-navy-900 mb-5">Make an Enquiry</h3>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3"
                    >
                      <CheckCircle size={24} className="text-green-500" />
                    </motion.div>
                    <p className="font-serif font-semibold text-navy-900 text-center">Thank you!</p>
                    <p className="text-sm text-gray-600 text-center mt-1">We'll contact you shortly</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                        <input
                          type="text"
                          placeholder="John"
                          value={form.first_name}
                          onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                          className="input-light text-sm w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                        <input
                          type="text"
                          placeholder="Smith"
                          value={form.last_name}
                          onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                          className="input-light text-sm w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
                        <input
                          type="email"
                          placeholder="john@email.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="input-light text-sm w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+27 82 123 4567"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          className="input-light text-sm w-full"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message *</label>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          className="input-light text-sm resize-none w-full"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center">
                      Send Enquiry
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-luxury px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="You May Also Like" title="Similar Properties" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similar.map((p, i) => <PropertyCard key={p.property_id} property={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
