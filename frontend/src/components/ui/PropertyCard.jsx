import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Bed, Bath, Car, Maximize2, Heart } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../../data/mockData';

export default function PropertyCard({ property, index = 0 }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-luxury group"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ '--tw-scale-x': '1.08', '--tw-scale-y': '1.08' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${property.status === 'available' ? 'bg-gold-500 text-white' : 'bg-navy-900 text-white'}`}>
            {property.status === 'available' ? 'For Sale' : property.status}
          </span>
          {property.featured && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-navy-900">
              Featured
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart size={15} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xl font-serif font-semibold text-white drop-shadow-lg">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-serif font-semibold text-navy-900 mb-1 group-hover:text-gold-600 transition-colors line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{property.location}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 py-4 border-t border-gray-100 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Bed size={14} className="text-gold-500" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={14} className="text-gold-500" />
            <span>{property.bathrooms}</span>
          </div>
        </div>

        <Link
          to={`/properties/${property.property_id}`}
          className="mt-4 flex items-center justify-center w-full py-2.5 rounded-xl border border-navy-900 text-navy-900 text-sm font-medium hover:bg-navy-900 hover:text-white transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
