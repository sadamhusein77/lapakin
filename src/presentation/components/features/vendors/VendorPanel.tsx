import { Plus } from 'lucide-react';
import type { StreetVendor, VendorCategory } from '../../../../domain/entities';
import { TimeSlider } from './TimeSlider';
import { FilterBar } from './FilterBar';
import type { VendorWithStatus } from './types';
import { categoryIcons, categoryColors, categoryBgColors } from './constants';

interface VendorPanelProps {
  vendors: StreetVendor[];
  myVendorIds: string[];
  activeCategory: VendorCategory | 'all';
  onCategoryChange: (category: VendorCategory | 'all') => void;
  showOpenOnly: boolean;
  onShowOpenOnlyChange: (show: boolean) => void;
  openCount: number;
  visibleForCount: VendorWithStatus[];
  simulatedMinutes: number;
  onTimeChange: (time: number) => void;
  onEditVendor: (vendor: StreetVendor) => void;
  onAddVendor: () => void;
}

export function VendorPanel({
  vendors,
  myVendorIds,
  activeCategory,
  onCategoryChange,
  showOpenOnly,
  onShowOpenOnlyChange,
  openCount,
  visibleForCount,
  simulatedMinutes,
  onTimeChange,
  onEditVendor,
  onAddVendor,
}: VendorPanelProps) {
  const myVendors = myVendorIds
    .map((id) => vendors.find((v) => v.id === id))
    .filter(Boolean) as StreetVendor[];
  const canAddMore = myVendorIds.length < 2;

  const getStatus = (vendor: StreetVendor) => {
    const [startH, startM] = vendor.startTime.split(':').map(Number);
    const [endH, endM] = vendor.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const isOvernight = endMinutes < startMinutes;
    let isOpen: boolean;
    if (isOvernight) {
      isOpen = simulatedMinutes >= startMinutes || simulatedMinutes <= endMinutes;
    } else {
      isOpen = simulatedMinutes >= startMinutes && simulatedMinutes <= endMinutes;
    }
    if (!isOpen) return 'closed';
    if (simulatedMinutes >= startMinutes - 30 && simulatedMinutes < startMinutes) {
      return 'openingSoon';
    }
    return 'open';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 space-y-4 shrink-0">
        <TimeSlider simulatedTime={simulatedMinutes} onTimeChange={onTimeChange} />
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
          showOpenOnly={showOpenOnly}
          onShowOpenOnlyChange={onShowOpenOnlyChange}
          openCount={openCount}
          totalCount={visibleForCount.length}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Warung Saya
          </h2>

          {myVendors.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm mb-3">Belum memiliki warung</p>
              <button
                onClick={onAddVendor}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Tambah Warung Baru
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myVendors.map((myVendor) => {
                const status = getStatus(myVendor);
                const Icon = categoryIcons[myVendor.category];
                return (
                  <div
                    key={myVendor.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${categoryBgColors[myVendor.category]}`}>
                      <Icon className={`w-5 h-5 ${categoryColors[myVendor.category]}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {myVendor.name}
                      </h3>
                      <p className="text-sm text-slate-500">{myVendor.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : status === 'openingSoon'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {status === 'open'
                            ? 'Buka'
                            : status === 'openingSoon'
                            ? 'Segera Buka'
                            : 'Tutup'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onEditVendor(myVendor)}
                      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
              {canAddMore && (
                <button
                  onClick={onAddVendor}
                  className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 rounded-lg font-medium hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Tambah Warung Baru
                </button>
              )}
              {!canAddMore && (
                <p className="text-xs text-slate-400 text-center">Maksimal 2 warung per akun</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}