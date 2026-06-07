import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Building2Icon } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import PropertyCard from '../components/ui/PropertyCard';
import SearchBar from '../components/ui/SearchBar';
import { getProperties } from '../services/property.service.js';

const sortOptions = ['Newest', 'Price: High to Low', 'Price: Low to High', 'Size: Largest'];

export default function PropertiesPage() {
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('Newest');
  const [filters, setFilters] = useState({ type: '', category: '', minBeds: '', maxPrice: '' });
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const filtered = useMemo(() => {
    let result = [...properties];
    
    result = result.filter((p) => p.status === 'available');

    if (search) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.location?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.type) result = result.filter((p) => p.type === filters.type);
    if (filters.category) {
      result = result.filter(
        (p) => p.property_type === filters.category
      );
    }
    if (filters.minBeds) result = result.filter((p) => p.bedrooms >= parseInt(filters.minBeds));
    if (filters.maxPrice) result = result.filter((p) => p.price <= parseInt(filters.maxPrice) * 1000000);

    if (sort === 'Newest') {
      result.sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      );
    }
    if (sort === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sort === 'Price: Low to High') result.sort((a, b) => a.price - b.price);

    return result;
  }, [search, filters, sort, properties]);

  const paginated = filtered.slice(0, page * perPage);

  return (
    <div>
      <PageBanner
        title="Luxury Properties"
        subtitle="Discover our curated collection of South Africa's most prestigious properties."
        breadcrumbs={[{ label: 'Properties' }]}
        image="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search + Controls */}
          <div className="bg-white rounded-2xl p-5 shadow-luxury mb-8" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
            <SearchBar onSearch={({ query, type, category }) => { setSearch(query); setFilters(f => ({ ...f, type, category })); }} />

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-navy-900 hover:border-gold-500 hover:text-gold-600 transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {Object.values(filters).some(Boolean) && <span className="w-2 h-2 bg-gold-500 rounded-full" />}
                </button>
                <span className="text-sm text-gray-500">{filtered.length} properties found</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 text-navy-900"
                >
                  {sortOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-900'}`}>
                    <Grid3X3 size={16} />
                  </button>
                  <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-navy-900 text-white' : 'text-gray-400 hover:text-navy-900'}`}>
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                  <select className="input-light text-sm" value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All Types</option>
                    <option>For Sale</option>
                    <option>To Let</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                  <select className="input-light text-sm" value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}>
                    <option value="">All Categories</option>
                    <option>Luxury Villa</option>
                    <option>Penthouse</option>
                    <option>Apartment</option>
                    <option>Estate</option>
                    <option>Manor</option>
                    <option>House</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Min Bedrooms</label>
                  <select className="input-light text-sm" value={filters.minBeds} onChange={(e) => setFilters(f => ({ ...f, minBeds: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Max Price (Rm)</label>
                  <select className="input-light text-sm" value={filters.maxPrice} onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="10">R10M</option>
                    <option value="20">R20M</option>
                    <option value="30">R30M</option>
                    <option value="50">R50M</option>
                  </select>
                </div>
                <button
                  onClick={() => setFilters({ type: '', category: '', minBeds: '', maxPrice: '' })}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors col-span-full"
                >
                  <X size={14} /> Clear Filters
                </button>
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-xl font-serif">Loading properties...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Building2Icon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-serif">No properties found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {paginated.map((property, i) => (
                <PropertyCard key={property.property_id} property={property} index={i % 9} />
              ))}
            </div>
          )}

          {/* Load More */}
          {paginated.length < filtered.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setPage(p => p + 1)}
                className="btn-navy"
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
