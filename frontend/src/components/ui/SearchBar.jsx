import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({ onSearch, variant = 'light' }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ query, type, category });
  };

  const inputClass = variant === 'dark'
    ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-gold-400'
    : 'bg-white border-gray-200 text-navy-900 placeholder-gray-400 focus:border-gold-500';

  const labelClass = variant === 'dark' ? 'text-white/70' : 'text-gray-500';

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`flex flex-col md:flex-row gap-3 p-3 rounded-2xl ${variant === 'dark' ? 'glass' : 'bg-white shadow-luxury'}`}>
        {/* Search input */}
        <div className="flex-1 relative">
          <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${variant === 'dark' ? 'text-white/50' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by location, property name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none transition-colors ${inputClass}`}
          />
        </div>

        {/* Type select */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`border rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors cursor-pointer ${inputClass} md:w-40`}
        >
          <option value="">All Types</option>
          <option value="For Sale">For Sale</option>
          <option value="To Let">To Let</option>
          <option value="Commercial">Commercial</option>
        </select>

        {/* Category select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`border rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-colors cursor-pointer ${inputClass} md:w-44`}
        >
          <option value="">All Categories</option>
          <option value="Luxury Villa">Luxury Villa</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Apartment">Apartment</option>
          <option value="Estate">Estate</option>
          <option value="Manor">Manor</option>
        </select>

        {/* Submit */}
        <button type="submit" className="btn-primary gap-2 md:px-6">
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  );
}
