import { Filter, MapPin } from 'lucide-react';
import type { VendorCategory } from '../../../../domain/entities';

interface FilterBarProps {
  activeCategory: VendorCategory | 'all';
  onCategoryChange: (category: VendorCategory | 'all') => void;
  showOpenOnly: boolean;
  onShowOpenOnlyChange: (show: boolean) => void;
  openCount: number;
  totalCount: number;
}

const categories: { key: VendorCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'food', label: 'Makanan' },
  { key: 'drinks', label: 'Minuman' },
  { key: 'goods', label: 'Barang' },
  { key: 'services', label: 'Jasa' },
];

export function FilterBar({
  activeCategory,
  onCategoryChange,
  showOpenOnly,
  onShowOpenOnlyChange,
  openCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-blue-600" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Filter</span>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Open Now toggle */}
      <button
        onClick={() => onShowOpenOnlyChange(!showOpenOnly)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-150 w-full
          ${showOpenOnly
            ? 'bg-green-500 text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }
        `}
      >
        <MapPin size={16} />
        <span className="text-sm font-medium">Buka Sekarang</span>
        <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {openCount}/{totalCount}
        </span>
      </button>
    </div>
  );
}