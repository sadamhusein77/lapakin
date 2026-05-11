import { useState } from 'react';
import { Type } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import type { StreetVendor, VendorCategory, VendorType } from '../../../../domain/entities';
import { VendorFormFields } from './VendorFormFields';

interface VendorFormProps {
  vendor?: StreetVendor | null;
  onSave: (vendor: StreetVendor) => void;
  onCancel: () => void;
  open?: boolean;
}

export function VendorForm({ vendor, onSave, onCancel, open = true }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    description: vendor?.description || '',
    category: vendor?.category || ('food' as VendorCategory),
    vendorType: vendor?.vendorType || ('fried rice' as VendorType),
    address: vendor?.address || '',
    phone: vendor?.phone || '',
    priceRange: vendor?.priceRange || '',
    startTime: vendor?.startTime || '08:00',
    endTime: vendor?.endTime || '22:00',
    isVisible: vendor?.isVisible ?? true,
    isOpen: vendor?.isOpen ?? false,
  });

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>(
    vendor ? [vendor.coordinates.lat, vendor.coordinates.lng] : [-6.2088, 106.8456]
  );

  const handleSubmit = () => {
    onSave({
      id: vendor?.id || `v${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      vendorType: formData.vendorType,
      coordinates: { lat: selectedPosition[0], lng: selectedPosition[1] },
      address: formData.address,
      rating: vendor?.rating || 4.0,
      priceRange: formData.priceRange,
      startTime: formData.startTime,
      endTime: formData.endTime,
      isOpen: formData.isOpen,
      isVisible: formData.isVisible,
      phone: formData.phone,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Type size={20} />
            {vendor ? 'Edit Warung' : 'Daftar Warung Baru'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <VendorFormFields
            formData={formData}
            selectedPosition={selectedPosition}
            onFormChange={setFormData}
            onPositionChange={setSelectedPosition}
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {vendor ? 'Simpan Perubahan' : 'Daftarkan Warung'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}