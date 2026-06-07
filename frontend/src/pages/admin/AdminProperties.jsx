import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, X, Upload, CheckCircle } from 'lucide-react';
import DashboardHeader from '../../components/admin/DashboardHeader';
import {
  createProperty,
  deleteProperty,
  getProperties,
  updateProperty,
  uploadPropertyImages,
} from '../../services/property.service';
import { formatPrice } from '../../data/mockData';

const initialForm = {
  title: '',
  location: '',
  price: '',
  property_type: 'Luxury Villa',
  bedrooms: '',
  bathrooms: '',
  featured: false,
  status: 'available',
  description: '',
};

const statusStyles = {
  available: 'bg-green-50 text-green-700',
  sold: 'bg-red-50 text-red-700',
  pending: 'bg-yellow-50 text-amber-700',
  rented: 'bg-blue-50 text-blue-700',
};

const mapPropertyToForm = (property) => ({
  title: property?.title || '',
  location: property?.location || '',
  price: property?.price != null ? String(property.price) : '',
  property_type: property?.property_type || 'Luxury Villa',
  bedrooms: property?.bedrooms != null ? String(property.bedrooms) : '',
  bathrooms: property?.bathrooms != null ? String(property.bathrooms) : '',
  featured: property?.featured || false,
  status: property?.status || 'available',
  description: property?.description || '',
});

function PropertyModal({ property, onClose, onSaved }) {
  const isEdit = !!property;
  const [form, setForm] = useState(mapPropertyToForm(property));
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingImages, setExistingImages] = useState(property?.images || []);

  useEffect(() => {
    setForm(mapPropertyToForm(property));
    setExistingImages(property?.images || []);
    setSelectedImages([]);
    setPreviewUrls([]);
  }, [property]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(files);
    setPreviewUrls(urls);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        location: form.location,
        price: Number(form.price),
        property_type: form.property_type,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        featured: form.featured,
        status: form.status,
        description: form.description,
      };

      const savedProperty = isEdit
        ? await updateProperty(property.property_id, payload)
        : await createProperty(payload);

      if (selectedImages.length) {
        await uploadPropertyImages(savedProperty.property_id, selectedImages);
      }

      setSaved(true);
      setTimeout(() => {
        onSaved?.();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Unable to save property');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-semibold text-navy-900">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={15} />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle size={40} className="text-green-500" />
            <p className="font-semibold text-navy-900">Property {isEdit ? 'updated' : 'created'} successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Property Title *</label>
              <input
                type="text"
                className="input-light"
                value={form.title}
                onChange={handleChange('title')}
                required
                placeholder="e.g. The Clifton Residence"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location *</label>
              <input
                type="text"
                className="input-light"
                value={form.location}
                onChange={handleChange('location')}
                required
                placeholder="Full property location"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price (R) *</label>
                <input
                  type="number"
                  className="input-light"
                  value={form.price}
                  onChange={handleChange('price')}
                  required
                  placeholder="e.g. 18500000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Listing Type</label>
                <select
                  className="input-light"
                  value={form.property_type}
                  onChange={handleChange('property_type')}
                >
                  <option>Luxury Villa</option>
                  <option>Penthouse</option>
                  <option>Apartment</option>
                  <option>Estate</option>
                  <option>Manor</option>
                  <option>House</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { field: 'bedrooms', label: 'Bedrooms', placeholder: '4' },
                { field: 'bathrooms', label: 'Bathrooms', placeholder: '3' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                  <input
                    type="number"
                    className="input-light"
                    value={form[field]}
                    onChange={handleChange(field)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Featured</label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleChange('featured')}
                    className="accent-gold-500"
                  />
                  <span className="text-sm text-gray-600">Mark as featured</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  className="input-light"
                  value={form.status}
                  onChange={handleChange('status')}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Property Images</label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/20 transition-all">
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Upload size={20} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Upload property images</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP — Max 10MB each</p>
              </label>
            </div>
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Existing images</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {existingImages.map((image) => (
                    <img key={image.image_id} src={image.image_url} alt="Existing property" className="h-20 w-full object-cover rounded-2xl" />
                  ))}
                </div>
              </div>
            )}
            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">New image preview</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {previewUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index + 1}`} className="h-20 w-full object-cover rounded-2xl" />
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                rows={4}
                className="input-light resize-none"
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Property description..."
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
                {saving ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Property' : 'Create Property')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function AdminProperties() {
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | property object
  const [deleteId, setDeleteId] = useState(null);

  const loadProperties = () => {
    setLoading(true);
    getProperties()
      .then(setProperties)
      .catch((err) => setError(err?.message || 'Unable to load properties'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filtered = properties.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <DashboardHeader title="Properties Management" />
      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-light pl-9 text-sm w-64"
            />
          </div>
          <button onClick={() => setModal('create')} className="btn-primary text-sm py-2.5 gap-2">
            <Plus size={15} /> Add Property
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Property', 'Type', 'Price', 'Beds/Baths', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((property) => (
                  <tr key={property.property_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images?.[0]?.image_url || property.image || 'https://via.placeholder.com/80'}
                          alt={property.title}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-navy-900 text-sm line-clamp-1">{property.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{property.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700">
                        {property.property_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-navy-900">{formatPrice(property.price)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{property.bedrooms} / {property.bathrooms}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[property.status] || 'bg-gray-100 text-gray-500'}`}>
                          {property.status}
                        </span>
                        {property.featured && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold-50 text-gold-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setModal(property)}
                          className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gold-600 hover:bg-gold-50 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(property.property_id)}
                          className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {properties.length} properties
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <PropertyModal
            property={modal === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={loadProperties}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Delete Property?</h3>
              <p className="text-sm text-gray-600 mb-6">This action cannot be undone. The property will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
                <button
                  onClick={async () => {
                    await deleteProperty(deleteId);
                    setDeleteId(null);
                    loadProperties();
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-full transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
