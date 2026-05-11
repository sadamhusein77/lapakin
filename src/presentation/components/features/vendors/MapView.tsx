import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import type { VendorWithStatus } from './types';
import { markerColors, categoryIcons, categoryColors, categoryBgColors } from './constants';

interface MapViewProps {
  vendors: VendorWithStatus[];
  centerPosition: [number, number];
  onVendorClick: (vendor: VendorWithStatus) => void;
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
}

const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10.875 14.25 23.25 15.375 24.125a1.5 1.5 0 001.25 0C17.75 39.25 32 26.875 32 16c0-8.837-7.163-16-16-16z" fill="${color}"/>
        <circle cx="16" cy="14" r="6" fill="white"/>
      </svg>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function MapView({
  vendors,
  centerPosition,
  onVendorClick,
  markerRefs,
}: MapViewProps) {
  return (
    <MapContainer
      center={centerPosition}
      zoom={14}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {vendors.map((vendor) => {
        const Icon = categoryIcons[vendor.category];
        const markerIcon = createColoredIcon(markerColors[vendor.status]);

        return (
          <Marker
            key={vendor.id}
            position={[vendor.coordinates.lat, vendor.coordinates.lng]}
            icon={markerIcon}
            ref={(ref) => {
              if (ref) markerRefs.current[vendor.id] = ref;
            }}
            eventHandlers={{
              click: () => onVendorClick(vendor),
            }}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
              <div className="flex items-center gap-2 py-1">
                <div className={`p-1 rounded ${categoryBgColors[vendor.category]}`}>
                  <Icon className={`w-4 h-4 ${categoryColors[vendor.category]}`} />
                </div>
                <div>
                  <span className="font-semibold">{vendor.name}</span>
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                      vendor.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : vendor.status === 'openingSoon'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {vendor.status === 'open' ? 'Buka' : vendor.status === 'openingSoon' ? 'Segera' : 'Tutup'}
                  </span>
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div className="min-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base">{vendor.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : vendor.status === 'openingSoon'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {vendor.status === 'open'
                      ? 'Buka'
                      : vendor.status === 'openingSoon'
                      ? 'Segera Buka'
                      : 'Tutup'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-3">{vendor.description}</p>
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-slate-600">{vendor.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-slate-600">
                      {vendor.startTime} - {vendor.endTime}
                    </span>
                  </p>
                  {vendor.phone && (
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      <span className="text-slate-600">{vendor.phone}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">Harga:</span>
                    <span className="text-slate-600 font-medium">{vendor.priceRange}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-3 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-semibold">{vendor.rating}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      <MapUpdater center={centerPosition} />
    </MapContainer>
  );
}