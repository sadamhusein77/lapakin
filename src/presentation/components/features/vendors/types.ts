import type { StreetVendor } from '../../../../domain/entities';

export type VendorStatus = 'open' | 'openingSoon' | 'closed';

export interface VendorWithStatus extends StreetVendor {
  status: VendorStatus;
}