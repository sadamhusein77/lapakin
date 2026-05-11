import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, EyeOff, Star, MapPin, Clock, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import type { VendorWithStatus } from '../vendors/types';

interface AdminPanelProps {
  vendors: VendorWithStatus[];
  onDeleteVendor: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onAddVendor?: () => void;
  onSelectVendor?: (vendor: VendorWithStatus) => void;
}

export function AdminPanel({ vendors, onDeleteVendor, onToggleVisibility, onAddVendor, onSelectVendor }: AdminPanelProps) {
  const [pendingDelete, setPendingDelete] = useState<VendorWithStatus | null>(null);

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDeleteVendor(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 h-full overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Panel Admin</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{vendors.length} pedagang</span>
            {onAddVendor && (
              <button
                onClick={onAddVendor}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Tambah
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelectVendor?.(vendor)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  vendor.isVisible
                    ? 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    : 'border-slate-200 bg-slate-50 opacity-60 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{vendor.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500" fill="currentColor" />
                        {vendor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {vendor.address.split(',')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {vendor.startTime} - {vendor.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        vendor.isOpen
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {vendor.isOpen ? 'Buka' : 'Tutup'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {vendor.category}
                      </span>
                      {!vendor.isVisible && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Disembunyikan
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onToggleVisibility(vendor.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        vendor.isVisible
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={vendor.isVisible ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {vendor.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => setPendingDelete(vendor)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Warung</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus warung "{pendingDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}