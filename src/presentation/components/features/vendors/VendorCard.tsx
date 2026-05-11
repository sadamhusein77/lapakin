import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { VendorWithStatus } from './types';
import { categoryIcons, categoryColors, categoryBgColors } from './constants';

interface VendorCardProps {
  vendor: VendorWithStatus;
  isSelected: boolean;
  onClick: () => void;
}

export function VendorCard({ vendor, isSelected, onClick }: VendorCardProps) {
  const Icon = categoryIcons[vendor.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
      } ${!vendor.isVisible ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${categoryBgColors[vendor.category]}`}>
          <Icon className={`w-5 h-5 ${categoryColors[vendor.category]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
              {vendor.name}
            </h3>
            <span
              className={`w-2 h-2 rounded-full ${
                vendor.status === 'open'
                  ? 'bg-green-500'
                  : vendor.status === 'openingSoon'
                  ? 'bg-yellow-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{vendor.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              {vendor.rating}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{vendor.priceRange}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}