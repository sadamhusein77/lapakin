import type { VendorCategory } from '../../../../domain/entities';
import { TimeSlider } from '../vendors/TimeSlider';
import { FilterBar } from '../vendors/FilterBar';
import { VendorCard } from '../vendors/VendorCard';
import type { VendorWithStatus } from '../vendors/types';

interface CustomerPanelProps {
  vendors: VendorWithStatus[];
  activeCategory: string;
  onCategoryChange: (category: VendorCategory | 'all') => void;
  showOpenOnly: boolean;
  onShowOpenOnlyChange: (show: boolean) => void;
  openCount: number;
  totalCount: number;
  simulatedMinutes: number;
  onTimeChange: (time: number) => void;
  selectedVendor: VendorWithStatus | null;
  onVendorSelect: (vendor: VendorWithStatus) => void;
  isLoading: boolean;
}

export function CustomerPanel({
  vendors,
  activeCategory,
  onCategoryChange,
  showOpenOnly,
  onShowOpenOnlyChange,
  openCount,
  totalCount,
  simulatedMinutes,
  onTimeChange,
  selectedVendor,
  onVendorSelect,
  isLoading,
}: CustomerPanelProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 space-y-4 shrink-0">
        <TimeSlider simulatedTime={simulatedMinutes} onTimeChange={onTimeChange} />
        <FilterBar
          activeCategory={activeCategory as any}
          onCategoryChange={onCategoryChange as any}
          showOpenOnly={showOpenOnly}
          onShowOpenOnlyChange={onShowOpenOnlyChange}
          openCount={openCount}
          totalCount={totalCount}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Daftar Pedagang
          </h2>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Memuat...</div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Tidak ada pedagang</div>
            ) : (
              vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  isSelected={selectedVendor?.id === vendor.id}
                  onClick={() => onVendorSelect(vendor)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}