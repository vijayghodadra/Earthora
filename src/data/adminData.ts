import type { CustomerOrder, CustomerProfile, CouponCode, StoreSettings } from '../types/adminTypes';

export const initialOrders: CustomerOrder[] = [];

export const initialCustomers: CustomerProfile[] = [];

export const initialCoupons: CouponCode[] = [
  {
    id: 'COUP-1',
    code: 'EARTH10',
    discountPercentage: 10,
    minOrderAmount: 2000,
    expiryDate: '2026-12-31',
    usageCount: 0,
    maxUsage: 500,
    active: true
  },
  {
    id: 'COUP-2',
    code: 'LUXURY20',
    discountPercentage: 20,
    minOrderAmount: 4000,
    expiryDate: '2026-10-15',
    usageCount: 0,
    maxUsage: 200,
    active: true
  }
];

export const initialSettings: StoreSettings = {
  storeName: 'Earthora Luxury Botanical Wellness',
  tagline: 'Rooted in Ayurveda. Inspired by Nature.',
  contactEmail: 'support@earthora.com',
  contactPhone: '+91 (022) 4890-1200',
  currencySymbol: '₹',
  taxRatePercent: 18,
  freeShippingThreshold: 2000,
  codEnabled: true,
  upiEnabled: true,
  cardEnabled: true,
  razorpayEnabled: true,
  maintenanceMode: false
};

export const monthlySalesData = [];
