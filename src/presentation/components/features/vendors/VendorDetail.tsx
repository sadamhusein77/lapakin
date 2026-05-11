import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import type { VendorWithStatus } from './types';
import { categoryIcons, categoryColors, categoryBgColors } from './constants';

interface VendorDetailProps {
  vendor: VendorWithStatus;
  isOwnVendor: boolean;
  onEdit?: () => void;
  onClose: () => void;
}

export function VendorDetail({ vendor, isOwnVendor, onEdit, onClose }: VendorDetailProps) {
  const Icon = categoryIcons[vendor.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-6 right-6 max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-5 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${categoryBgColors[vendor.category]}`}>
          <Icon className={`w-6 h-6 ${categoryColors[vendor.category]}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {vendor.name}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                vendor.status === 'open'
                  ? 'bg-green-100 text-green-700'
                  : vendor.status === 'openingSoon'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {vendor.status === 'open'
                ? 'Buka'
                : vendor.status === 'openingSoon'
                ? 'Segera Buka'
                : 'Tutup'}
            </span>
          </div>
          <p className="text-slate-500 mt-1">{vendor.description}</p>
          <div className="flex items-center gap-1 mt-2 text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold">{vendor.rating}</span>
            <span className="text-slate-400 text-sm ml-2">{vendor.priceRange}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
        >
          &times;
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
        <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <MapPin size={16} className="text-blue-500" />
          {vendor.address}
        </p>
        <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Clock size={16} className="text-blue-500" />
          {vendor.startTime} - {vendor.endTime}
        </p>
        {vendor.phone && (
          <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Phone size={16} className="text-blue-500" />
            {vendor.phone}
          </p>
        )}
      </div>
      {isOwnVendor && onEdit && (
        <button
          onClick={onEdit}
          className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Edit Warung
        </button>
      )}
    </motion.div>
  );
}