import { useState, useEffect, useRef, useCallback } from 'react';
import type { StreetVendor, VendorCategory, Role, MockAccount } from '../../domain/entities';
import { StreetVendorRepository } from '../../data/repositories';
import { GetAllVendorsUseCase, GetVendorsByCategoryUseCase } from '../../domain/usecases';
import {
  TopBar,
  VendorPanel,
  MapView,
  VendorDetail,
  VendorForm,
  computeVendorStatus,
  type VendorWithStatus,
} from '../components/features/vendors';
import { AdminPanel } from '../components/features/admin';
import { CustomerPanel } from '../components/features/customer';

const vendorRepo = new StreetVendorRepository();
const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepo);
const getVendorsByCategoryUseCase = new GetVendorsByCategoryUseCase(vendorRepo);

interface StreetVendorsProps {
  currentAccount: MockAccount;
  onLogout: () => void;
}

export function StreetVendors({ currentAccount, onLogout }: StreetVendorsProps) {
  const [vendors, setVendors] = useState<StreetVendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorWithStatus | null>(null);
  const [activeCategory, setActiveCategory] = useState<VendorCategory | 'all'>('all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<Role>(currentAccount.role);
  const [simulatedMinutes, setSimulatedMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<StreetVendor | null>(null);
  const [myVendorIds, setMyVendorIds] = useState<string[]>(() => {
    return [currentAccount.vendorId, currentAccount.vendorId2].filter(Boolean) as string[];
  });
  const markerRefs = useRef<Record<string, import('leaflet').Marker | null>>({});

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

  const displayVendors =
    activeRole === 'vendor'
      ? filteredVendors.filter((v) => myVendorIds.includes(v.id))
      : filteredVendors;

  const visibleForCount =
    activeRole === 'vendor'
      ? vendorsWithStatus.filter((v) => myVendorIds.includes(v.id))
      : vendorsWithStatus;
  const openCount = visibleForCount.filter((v) => v.status === 'open').length;

  const handleVendorClick = (vendor: VendorWithStatus) => {
    setSelectedVendor(vendor);
    if (markerRefs.current[vendor.id]) {
      markerRefs.current[vendor.id]?.openPopup();
    }
  };

  const handleMarkerClick = (vendor: VendorWithStatus) => {
    setSelectedVendor(vendor);
  };

  const handleSaveVendor = (vendor: StreetVendor) => {
    if (editingVendor) {
      setVendors((prev) => prev.map((v) => (v.id === vendor.id ? vendor : v)));
    } else {
      setVendors((prev) => [...prev, vendor]);
      if (activeRole === 'vendor') {
        setMyVendorIds((prev) => [...prev, vendor.id]);
      }
    }
    setShowVendorForm(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    if (selectedVendor?.id === id) setSelectedVendor(null);
  };

  const handleToggleVisibility = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isVisible: !v.isVisible } : v))
    );
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

  const handleLogout = () => {
    setActiveRole(currentAccount.role);
    onLogout();
  };

  const centerPosition: [number, number] = selectedVendor
    ? [selectedVendor.coordinates.lat, selectedVendor.coordinates.lng]
    : [-6.2088, 106.8456];

  const renderLeftPanel = () => {
    switch (activeRole) {
      case 'vendor':
        return (
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
        );
      case 'admin':
        return (
          <AdminPanel
            vendors={vendorsWithStatus}
            onDeleteVendor={handleDeleteVendor}
            onToggleVisibility={handleToggleVisibility}
            onAddVendor={() => {
              setEditingVendor(null);
              setShowVendorForm(true);
            }}
            onSelectVendor={(vendor) => {
              setSelectedVendor(vendor);
              if (markerRefs.current[vendor.id]) {
                markerRefs.current[vendor.id]?.openPopup();
              }
            }}
          />
        );
      default:
        return (
          <CustomerPanel
            vendors={displayVendors}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            showOpenOnly={showOpenOnly}
            onShowOpenOnlyChange={setShowOpenOnly}
            openCount={openCount}
            totalCount={visibleForCount.length}
            simulatedMinutes={simulatedMinutes}
            onTimeChange={setSimulatedMinutes}
            selectedVendor={selectedVendor}
            onVendorSelect={handleVendorClick}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TopBar
        currentAccount={currentAccount}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          {renderLeftPanel()}
        </div>

        <div className="flex-1 relative z-10">
          <MapView
            vendors={displayVendors}
            centerPosition={centerPosition}
            onVendorClick={handleMarkerClick}
            markerRefs={markerRefs}
          />

          {selectedVendor && (activeRole === 'customer' || activeRole === 'vendor') && (
            <VendorDetail
              vendor={selectedVendor}
              isOwnVendor={activeRole === 'vendor' && currentAccount.vendorId === selectedVendor.id}
              onEdit={activeRole === 'vendor' ? handleEditVendor : undefined}
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