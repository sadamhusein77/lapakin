import { MapPin, Clock, DollarSign, Phone, Type, CheckCircle, Navigation } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import type { VendorCategory, VendorType } from '../../../../domain/entities';
import { LocationPickerMap } from './LocationPicker';

export interface VendorFormData {
  name: string;
  description: string;
  category: VendorCategory;
  vendorType: VendorType;
  address: string;
  phone: string;
  priceRange: string;
  startTime: string;
  endTime: string;
  isVisible: boolean;
  isOpen: boolean;
}

interface VendorFormFieldsProps {
  formData: VendorFormData;
  selectedPosition: [number, number];
  onFormChange: (data: VendorFormData) => void;
  onPositionChange: (pos: [number, number]) => void;
}

const categories: { key: VendorCategory; label: string }[] = [
  { key: 'food', label: 'Makanan' },
  { key: 'drinks', label: 'Minuman' },
  { key: 'goods', label: 'Barang' },
  { key: 'services', label: 'Jasa' },
];

const vendorTypes: { key: VendorType; label: string }[] = [
  { key: 'fried rice', label: 'Nasi Goreng' },
  { key: 'noodles', label: 'Mie/Nasi' },
  { key: 'snacks', label: 'Jajanan' },
  { key: 'drinks', label: 'Minuman' },
  { key: 'goods', label: 'Barang' },
  { key: 'services', label: 'Jasa' },
];

export function VendorFormFields({
  formData,
  selectedPosition,
  onFormChange,
  onPositionChange,
}: VendorFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Type size={14} />
          Nama Warung *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          placeholder="Nama warung Anda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
          placeholder="Deskripsi singkat warung Anda"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kategori *</Label>
          <Select
            value={formData.category}
            onValueChange={(val) => onFormChange({ ...formData, category: val as VendorCategory })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.key} value={cat.key}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Jenis *</Label>
          <Select
            value={formData.vendorType}
            onValueChange={(val) => onFormChange({ ...formData, vendorType: val as VendorType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent>
              {vendorTypes.map((vt) => (
                <SelectItem key={vt.key} value={vt.key}>
                  {vt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin size={14} />
          Alamat *
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onFormChange({ ...formData, address: e.target.value })}
          placeholder="Alamat lengkap"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Navigation size={14} />
          Lokasi di Peta *
        </Label>
        <LocationPickerMap position={selectedPosition} onChange={onPositionChange} />
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle size={14} />
          <span>
            Lokasi: {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone size={14} />
            No. Telepon
          </Label>
          <Input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            placeholder="08xx-xxxx-xxxx"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceRange" className="flex items-center gap-2">
            <DollarSign size={14} />
            Range Harga *
          </Label>
          <Input
            id="priceRange"
            type="text"
            value={formData.priceRange}
            onChange={(e) => onFormChange({ ...formData, priceRange: e.target.value })}
            placeholder="10k-20k"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock size={14} />
          Jam Operasional *
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => onFormChange({ ...formData, startTime: e.target.value })}
            className="flex-1"
          />
          <span className="text-slate-400">-</span>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => onFormChange({ ...formData, endTime: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer flex-1">
          <Checkbox
            id="visibility"
            checked={formData.isVisible}
            onCheckedChange={(checked) =>
              onFormChange({ ...formData, isVisible: checked as boolean })
            }
          />
          <span className="text-sm text-slate-700">Tampilkan di peta</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer flex-1">
          <Checkbox
            id="isOpen"
            checked={formData.isOpen}
            onCheckedChange={(checked) =>
              onFormChange({ ...formData, isOpen: checked as boolean })
            }
          />
          <span className="text-sm text-slate-700">Sedang Buka</span>
        </label>
      </div>
    </div>
  );
}