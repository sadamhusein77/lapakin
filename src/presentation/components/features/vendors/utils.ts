import type { StreetVendor } from '../../../../domain/entities';
import type { VendorStatus } from './types';

export function computeVendorStatus(
  vendor: StreetVendor,
  simulatedMinutes: number
): VendorStatus {
  if (!vendor.isVisible) return 'closed';

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
}