export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Razorpay' | 'UPI' | 'Card' | 'COD';

export interface OrderItem {
  bundleId: string;
  bundleName: string;
  size: string;
  unitPrice: number;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending COD' | 'Refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: OrderStatus;
  trackingNumber?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'VIP' | 'Inactive';
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  currencySymbol: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  upiEnabled: boolean;
  cardEnabled: boolean;
  razorpayEnabled: boolean;
  maintenanceMode: boolean;
}
