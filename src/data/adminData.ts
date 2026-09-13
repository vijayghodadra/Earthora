import type { CustomerOrder, CustomerProfile, CouponCode, StoreSettings } from '../types/adminTypes';

export const initialOrders: CustomerOrder[] = [
  {
    id: 'ORD-9421',
    customerName: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98765 43210',
    address: '42 Lotus Crest, Altamount Road',
    city: 'Mumbai',
    pincode: '400026',
    date: '2026-09-13 14:22',
    items: [
      {
        bundleId: 'bundle-2',
        bundleName: '2 Month Supply (100ml)',
        size: '100ml',
        unitPrice: 4190,
        quantity: 1,
      }
    ],
    subtotal: 4190,
    discount: 0,
    total: 4190,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    razorpayPaymentId: 'pay_rzp_984210984',
    razorpayOrderId: 'order_rzp_882910',
    status: 'Processing',
    trackingNumber: 'ETH-TRACK-88921'
  },
  {
    id: 'ORD-9420',
    customerName: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    phone: '+91 98112 34567',
    address: '108 Defense Colony, Block C',
    city: 'New Delhi',
    pincode: '110024',
    date: '2026-09-13 11:05',
    items: [
      {
        bundleId: 'bundle-1',
        bundleName: '1 Month Supply (50ml)',
        size: '50ml',
        unitPrice: 2490,
        quantity: 2,
      }
    ],
    subtotal: 4980,
    discount: 498,
    total: 4482,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Shipped',
    trackingNumber: 'ETH-TRACK-88918'
  },
  {
    id: 'ORD-9419',
    customerName: 'Kavita Subramanian',
    email: 'kavita.sub@example.com',
    phone: '+91 97400 88219',
    address: '15 Indiranagar 10th Main',
    city: 'Bengaluru',
    pincode: '560038',
    date: '2026-09-12 18:45',
    items: [
      {
        bundleId: 'bundle-2',
        bundleName: '2 Month Supply (100ml)',
        size: '100ml',
        unitPrice: 4190,
        quantity: 1,
      }
    ],
    subtotal: 4190,
    discount: 0,
    total: 4190,
    paymentMethod: 'COD',
    paymentStatus: 'Pending COD',
    status: 'Delivered',
    trackingNumber: 'ETH-TRACK-88905'
  },
  {
    id: 'ORD-9418',
    customerName: 'Siddharth Varma',
    email: 'sid.varma@example.com',
    phone: '+91 99001 12233',
    address: '77 Jubilee Hills Road No. 36',
    city: 'Hyderabad',
    pincode: '500033',
    date: '2026-09-12 09:12',
    items: [
      {
        bundleId: 'bundle-1',
        bundleName: '1 Month Supply (50ml)',
        size: '50ml',
        unitPrice: 2490,
        quantity: 1,
      }
    ],
    subtotal: 2490,
    discount: 0,
    total: 2490,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    razorpayPaymentId: 'pay_rzp_984180123',
    razorpayOrderId: 'order_rzp_882905',
    status: 'Delivered',
    trackingNumber: 'ETH-TRACK-88892'
  }
];

export const initialCustomers: CustomerProfile[] = [
  {
    id: 'CUST-101',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, MH',
    totalOrders: 3,
    totalSpent: 11870,
    joinedDate: '2026-03-15',
    status: 'VIP'
  },
  {
    id: 'CUST-102',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    phone: '+91 98112 34567',
    location: 'New Delhi, DL',
    totalOrders: 2,
    totalSpent: 8672,
    joinedDate: '2026-05-20',
    status: 'Active'
  },
  {
    id: 'CUST-103',
    name: 'Kavita Subramanian',
    email: 'kavita.sub@example.com',
    phone: '+91 97400 88219',
    location: 'Bengaluru, KA',
    totalOrders: 4,
    totalSpent: 16760,
    joinedDate: '2026-01-10',
    status: 'VIP'
  },
  {
    id: 'CUST-104',
    name: 'Siddharth Varma',
    email: 'sid.varma@example.com',
    phone: '+91 99001 12233',
    location: 'Hyderabad, TS',
    totalOrders: 1,
    totalSpent: 2490,
    joinedDate: '2026-09-12',
    status: 'Active'
  }
];

export const initialCoupons: CouponCode[] = [
  {
    id: 'COUP-1',
    code: 'EARTH10',
    discountPercentage: 10,
    minOrderAmount: 2000,
    expiryDate: '2026-12-31',
    usageCount: 142,
    maxUsage: 500,
    active: true
  },
  {
    id: 'COUP-2',
    code: 'LUXURY20',
    discountPercentage: 20,
    minOrderAmount: 4000,
    expiryDate: '2026-10-15',
    usageCount: 89,
    maxUsage: 200,
    active: true
  }
];

export const initialSettings: StoreSettings = {
  storeName: 'Earthora Luxury Botanical Wellness',
  tagline: 'Ayurvedic & Botanical Radiance Elixirs',
  contactEmail: 'concierge@earthora.com',
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

export const monthlySalesData = [
  { month: 'Apr', revenue: 245000, orders: 72 },
  { month: 'May', revenue: 312000, orders: 94 },
  { month: 'Jun', revenue: 428000, orders: 124 },
  { month: 'Jul', revenue: 589000, orders: 168 },
  { month: 'Aug', revenue: 742000, orders: 210 },
  { month: 'Sep', revenue: 895000, orders: 254 }
];
