import { useState, useEffect, useCallback } from 'react';
import type { MockAccount } from '../../domain/entities';
import { VendorPanel } from '../components/features/vendors';
import { TopBar } from '../components/features/vendors/TopBar';
import { MapView } from '../components/features/vendors/MapView';
import { VendorDetail } from '../components/features/vendors/VendorDetail';
import { VendorForm } from '../components/features/vendors/VendorForm';
import { computeVendorStatus, type VendorWithStatus } from '../components/features/vendors';
import { StreetVendorRepository } from '../../data/repositories';
import { GetAllVendorsUseCase, GetVendorsByCategoryUseCase } from '../../domain/usecases';
import type { StreetVendor, VendorCategory } from '../../domain/entities';

const vendorRepo = new StreetVendorRepository();
const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepo);
const getVendorsByCategoryUseCase = new GetVendorsByCategoryUseCase(vendorRepo);

interface VendorPageProps {
  currentAccount: MockAccount;
  onLogout: () => void;
}

export function VendorPage({ currentAccount, onLogout }: VendorPageProps) {
  const [vendors, setVendors] = useState<StreetVendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorWithStatus | null>(null);
  const [activeCategory, setActiveCategory] = useState<VendorCategory | 'all'>('all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [simulatedMinutes, setSimulatedMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<StreetVendor | null>(null);
  const [myVendorIds, setMyVendorIds] = useState<string[]>(() => {
    return [currentAccount.vendorId, currentAccount.vendorId2].filter(Boolean) as string[];
  });

  const fetchVendors = useCallback(async () => {
    const data =
      activeCategory === 'all'
        ? await getAllVendorsUseCase.execute()
        : await getVendorsByCategoryUseCase.execute(activeCategory);
    setVendors(data);
  }, [activeCategory]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const vendorsWithStatus: VendorWithStatus[] = vendors.map((v) => ({
    ...v,
    status: computeVendorStatus(v, simulatedMinutes),
  }));

  const displayVendors = vendorsWithStatus.filter((v) => myVendorIds.includes(v.id));
  const visibleForCount = displayVendors;
  const openCount = visibleForCount.filter((v) => v.status === 'open').length;

  const handleMarkerClick = (vendor: VendorWithStatus) => {
    setSelectedVendor(vendor);
  };

  const handleSaveVendor = (vendor: StreetVendor) => {
    if (editingVendor) {
      setVendors((prev) => prev.map((v) => (v.id === vendor.id ? vendor : v)));
    } else {
      setVendors((prev) => [...prev, vendor]);
      setMyVendorIds((prev) => [...prev, vendor.id]);
    }
    setShowVendorForm(false);
    setEditingVendor(null);
  };

  const handleEditVendor = () => {
    if (selectedVendor) {
      const myVendor = vendors.find((v) => v.id === selectedVendor.id);
      if (myVendor && currentAccount.vendorId === myVendor.id) {
        setEditingVendor(myVendor);
        setShowVendorForm(true);
      }
    }
  };

  const centerPosition: [number, number] = selectedVendor
    ? [selectedVendor.coordinates.lat, selectedVendor.coordinates.lng]
    : [-6.2088, 106.8456];

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TopBar
        currentAccount={currentAccount}
        activeRole="vendor"
        onRoleChange={() => {}}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <VendorPanel
            vendors={vendors}
            myVendorIds={myVendorIds}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            showOpenOnly={showOpenOnly}
            onShowOpenOnlyChange={setShowOpenOnly}
            openCount={openCount}
            visibleForCount={visibleForCount}
            simulatedMinutes={simulatedMinutes}
            onTimeChange={setSimulatedMinutes}
            onEditVendor={(v) => {
              setEditingVendor(v);
              setShowVendorForm(true);
            }}
            onAddVendor={() => {
              setEditingVendor(null);
              setShowVendorForm(true);
            }}
          />
        </div>

        <div className="flex-1 relative z-10">
          <MapView
            vendors={displayVendors}
            centerPosition={centerPosition}
            onVendorClick={handleMarkerClick}
            markerRefs={{ current: {} }}
          />

          {selectedVendor && (
            <VendorDetail
              vendor={selectedVendor}
              isOwnVendor={currentAccount.vendorId === selectedVendor.id}
              onEdit={handleEditVendor}
              onClose={() => setSelectedVendor(null)}
            />
          )}
        </div>

        {showVendorForm && (
          <VendorForm
            vendor={editingVendor}
            onSave={handleSaveVendor}
            onCancel={() => {
              setShowVendorForm(false);
              setEditingVendor(null);
            }}
          />
        )}
      </div>
    </div>
  );
}