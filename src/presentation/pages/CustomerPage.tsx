import { useState, useEffect, useCallback, useRef } from 'react';
import type { MockAccount } from '../../domain/entities';
import { CustomerPanel } from '../components/features/customer';
import { TopBar } from '../components/features/vendors/TopBar';
import { MapView } from '../components/features/vendors/MapView';
import { VendorDetail } from '../components/features/vendors/VendorDetail';
import { computeVendorStatus, type VendorWithStatus } from '../components/features/vendors';
import { StreetVendorRepository } from '../../data/repositories';
import { GetAllVendorsUseCase, GetVendorsByCategoryUseCase } from '../../domain/usecases';
import type { StreetVendor, VendorCategory } from '../../domain/entities';
import L from 'leaflet';

const vendorRepo = new StreetVendorRepository();
const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepo);
const getVendorsByCategoryUseCase = new GetVendorsByCategoryUseCase(vendorRepo);

interface CustomerPageProps {
  currentAccount: MockAccount;
  onLogout: () => void;
}

export function CustomerPage({ currentAccount, onLogout }: CustomerPageProps) {
  const [vendors, setVendors] = useState<StreetVendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorWithStatus | null>(null);
  const [activeCategory, setActiveCategory] = useState<VendorCategory | 'all'>('all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedMinutes, setSimulatedMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    const data =
      activeCategory === 'all'
        ? await getAllVendorsUseCase.execute()
        : await getVendorsByCategoryUseCase.execute(activeCategory);
    setVendors(data);
    setIsLoading(false);
  }, [activeCategory]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const vendorsWithStatus: VendorWithStatus[] = vendors.map((v) => ({
    ...v,
    status: computeVendorStatus(v, simulatedMinutes),
  }));

  const filteredVendors = showOpenOnly
    ? vendorsWithStatus.filter((v) => v.status === 'open' || v.status === 'openingSoon')
    : vendorsWithStatus;

  const openCount = vendorsWithStatus.filter((v) => v.status === 'open').length;

  const handleVendorClick = (vendor: VendorWithStatus) => {
    setSelectedVendor(vendor);
    if (markerRefs.current[vendor.id]) {
      markerRefs.current[vendor.id]?.openPopup();
    }
  };

  const handleMarkerClick = (vendor: VendorWithStatus) => {
    setSelectedVendor(vendor);
  };

  const centerPosition: [number, number] = selectedVendor
    ? [selectedVendor.coordinates.lat, selectedVendor.coordinates.lng]
    : [-6.2088, 106.8456];

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TopBar
        currentAccount={currentAccount}
        activeRole="customer"
        onRoleChange={() => {}}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <CustomerPanel
            vendors={filteredVendors}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            showOpenOnly={showOpenOnly}
            onShowOpenOnlyChange={setShowOpenOnly}
            openCount={openCount}
            totalCount={vendorsWithStatus.length}
            simulatedMinutes={simulatedMinutes}
            onTimeChange={setSimulatedMinutes}
            selectedVendor={selectedVendor}
            onVendorSelect={handleVendorClick}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-1 relative z-10">
          <MapView
            vendors={filteredVendors}
            centerPosition={centerPosition}
            onVendorClick={handleMarkerClick}
            markerRefs={markerRefs}
          />

          {selectedVendor && (
            <VendorDetail
              vendor={selectedVendor}
              isOwnVendor={false}
              onClose={() => setSelectedVendor(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}