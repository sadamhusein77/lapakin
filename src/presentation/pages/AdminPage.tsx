import { useState, useEffect, useCallback, useRef } from 'react';
import type { MockAccount } from '../../domain/entities';
import { AdminPanel } from '../components/features/admin';
import { TopBar } from '../components/features/vendors/TopBar';
import { MapView } from '../components/features/vendors/MapView';
import { VendorForm } from '../components/features/vendors/VendorForm';
import { computeVendorStatus, type VendorWithStatus } from '../components/features/vendors';
import { StreetVendorRepository } from '../../data/repositories';
import { GetAllVendorsUseCase } from '../../domain/usecases';
import type { StreetVendor } from '../../domain/entities';
import L from 'leaflet';

const vendorRepo = new StreetVendorRepository();
const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepo);

interface AdminPageProps {
  currentAccount: MockAccount;
  onLogout: () => void;
}

export function AdminPage({ currentAccount, onLogout }: AdminPageProps) {
  const [vendors, setVendors] = useState<StreetVendor[]>([]);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<StreetVendor | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const fetchVendors = useCallback(async () => {
    const data = await getAllVendorsUseCase.execute();
    setVendors(data);
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const simulatedMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const vendorsWithStatus: VendorWithStatus[] = vendors.map((v) => ({
    ...v,
    status: computeVendorStatus(v, simulatedMinutes),
  }));

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isVisible: !v.isVisible } : v))
    );
  };

  const handleSaveVendor = (vendor: StreetVendor) => {
    if (editingVendor) {
      setVendors((prev) => prev.map((v) => (v.id === vendor.id ? vendor : v)));
    } else {
      setVendors((prev) => [...prev, vendor]);
    }
    setShowVendorForm(false);
    setEditingVendor(null);
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <TopBar
        currentAccount={currentAccount}
        activeRole="admin"
        onRoleChange={() => {}}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[400px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <AdminPanel
            vendors={vendorsWithStatus}
            onDeleteVendor={handleDeleteVendor}
            onToggleVisibility={handleToggleVisibility}
            onAddVendor={() => {
              setEditingVendor(null);
              setShowVendorForm(true);
            }}
            onSelectVendor={(vendor) => {
              if (markerRefs.current[vendor.id]) {
                markerRefs.current[vendor.id]?.openPopup();
              }
            }}
          />
        </div>

        <div className="flex-1 relative z-10">
          <MapView
            vendors={vendorsWithStatus}
            centerPosition={[-6.2088, 106.8456]}
            onVendorClick={() => {}}
            markerRefs={markerRefs}
          />
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