import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  position: [number, number];
  onChange: (pos: [number, number]) => void;
}

export function LocationPicker({ position, onChange }: LocationPickerProps) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

interface LocationPickerMapProps {
  position: [number, number];
  onChange: (pos: [number, number]) => void;
}

export function LocationPickerMap({ position, onChange }: LocationPickerMapProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 h-[200px] mb-2 relative">
      <MapContainer center={position} zoom={15} className="h-full w-full" attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker position={position} onChange={onChange} />
      </MapContainer>
      <div className="absolute top-2 right-2 z-[400] bg-white/90 px-2 py-1 rounded text-xs text-slate-600 flex items-center gap-1">
        <MapPin size={12} className="text-blue-500" />
        Klik untuk ubah
      </div>
    </div>
  );
}