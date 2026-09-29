import { useState, useEffect } from 'react';
// @ts-ignore
import Lenis from 'lenis';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FeaturedCollection from './components/FeaturedCollection';
import Benefits from './components/Benefits';
import Comparison from './components/Comparison';
import Reviews from './components/Reviews';
import BrandStory from './components/BrandStory';
import CartDrawer from './components/CartDrawer';
import type { CartItem } from './components/CartDrawer';
import Footer from './components/Footer';

import { productData } from './data/productData';
import type { ProductBundle, Review } from './data/productData';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { 
  initialOrders, 
  initialCustomers, 
  initialCoupons, 
  initialSettings 
} from './data/adminData';
import type { CustomerOrder, CustomerProfile, CouponCode, StoreSettings, OrderStatus } from './types/adminTypes';

import { UserAuthModal } from './components/auth/UserAuthModal';
import type { UserProfileData } from './components/auth/UserAuthModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { supabaseDb, isSupabaseConfigured } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Customer user authentication state
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(() => {
    const saved = localStorage.getItem('earthora_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);

  // Live Order Tracking State
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | undefined>(undefined);

  // Dynamic state with localStorage initialization
  const [bundles, setBundles] = useState<ProductBundle[]>(() => {
    const saved = localStorage.getItem('earthora_bundles');
    return saved ? JSON.parse(saved) : productData.bundles;
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('earthora_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((o: CustomerOrder) => !['ORD-9421', 'ORD-9420', 'ORD-9419', 'ORD-9418'].includes(o.id));
      } catch (e) {
        return [];
      }
    }
    return initialOrders;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('earthora_customers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((c: CustomerProfile) => !['CUST-101', 'CUST-102', 'CUST-103', 'CUST-104'].includes(c.id));
      } catch (e) {
        return [];
      }
    }
    return initialCustomers;
  });

  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('earthora_reviews');
    const initial = saved ? JSON.parse(saved) : productData.reviews;
    return initial.filter((r: Review) => r.id !== 3 && r.name !== 'Priya K.');
  });

  const [coupons, setCoupons] = useState<CouponCode[]>(() => {
    const saved = localStorage.getItem('earthora_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('earthora_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch live Supabase data on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabaseDb.getOrders().then(data => data && setOrders(data));
      supabaseDb.getProducts().then(data => {
        if (data && data.length > 0) {
          setBundles(data);
          localStorage.setItem('earthora_bundles', JSON.stringify(data));
        } else if (data && data.length === 0) {
          // If Supabase products table is empty, seed it with current bundles
          supabaseDb.syncProducts(bundles);
        }
      });
      supabaseDb.getReviews().then(data => data && setReviewsList(data));
    }
  }, []);

  // Sync state changes with localStorage & Supabase
  useEffect(() => {
    localStorage.setItem('earthora_bundles', JSON.stringify(bundles));
    if (isSupabaseConfigured) {
      supabaseDb.syncProducts(bundles);
    }
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem('earthora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('earthora_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('earthora_reviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem('earthora_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('earthora_settings', JSON.stringify(settings));
  }, [settings]);

  // Smooth scroll
  useEffect(() => {
    if (currentView !== 'store') return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [currentView]);

  const handleAddToCart = (bundle: ProductBundle, quantity: number) => {
    const qtyToAdd = quantity > 0 ? quantity : 1;
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.bundle.id === bundle.id);
      if (existingIdx > -1) {
        return prevItems.map((item, idx) => 
          idx === existingIdx 
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      } else {
        return [...prevItems, { bundle, quantity: qtyToAdd }];
      }
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (bundle: ProductBundle, quantity: number) => {
    handleAddToCart(bundle, quantity);
  };

  const handleQuickBuy = () => {
    const defaultBundle = bundles[1] || bundles[0];
    handleAddToCart(defaultBundle, 1);
  };

  const handleUpdateQty = (bundleId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.bundle.id === bundleId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (bundleId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.bundle.id !== bundleId));
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setCurrentView('admin');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          trackingNumber: trackingNumber || ord.trackingNumber,
          courier: courier || ord.courier
        };
      }
      return ord;
    }));
    if (isSupabaseConfigured) {
      supabaseDb.updateOrderStatus(orderId, status, trackingNumber);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => {
      const updated = prev.filter(c => c.id !== customerId);
      localStorage.setItem('earthora_customers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddReview = (newReview: Review) => {
    setReviewsList(prev => {
      const existingIdx = prev.findIndex(r => 
        r.id === newReview.id || 
        (Boolean(r.orderId) && r.orderId === newReview.orderId && r.productName === newReview.productName)
      );
      let updated: Review[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx] = newReview;
      } else {
        updated = [newReview, ...prev];
      }
      localStorage.setItem('earthora_reviews', JSON.stringify(updated));
      return updated;
    });
    if (isSupabaseConfigured) {
      supabaseDb.saveReviews([newReview, ...reviewsList]);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminPanel
        onReturnToStore={() => setCurrentView('store')}
        bundles={bundles}
        onUpdateBundles={setBundles}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        customers={customers}
        onDeleteCustomer={handleDeleteCustomer}
        reviews={reviewsList}
        onUpdateReviews={setReviewsList}
        coupons={coupons}
        onUpdateCoupons={setCoupons}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    );
  }

  return (
    <>
      <Navigation 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onQuickBuy={handleQuickBuy}
        onOpenAdmin={handleOpenAdminTrigger}
        currentUser={currentUser}
        onOpenAuth={() => setIsUserAuthOpen(true)}
        onLogout={() => {
          localStorage.removeItem('earthora_current_user');
          setCurrentUser(null);
        }}
        onOpenTracking={() => {
          setActiveTrackingOrderId(undefined);
          setIsTrackingOpen(true);
        }}
        orders={orders}
      />

      <main>
        <Hero 
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          productsList={bundles}
        />
        <Benefits />
        <FeaturedCollection 
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          productsList={bundles}
        />
        <Comparison />
        <BrandStory />
        <Reviews />
      </main>

      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        currentUser={currentUser}
        onOpenAuth={() => setIsUserAuthOpen(true)}
        onOpenTracking={(orderId) => {
          setActiveTrackingOrderId(orderId);
          setIsTrackingOpen(true);
        }}
        onPlaceOrder={(newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          setCartItems([]); // Automatically clear cart items upon successful order!
          setCustomers(prev => {
            const emailKey = (newOrder.email || newOrder.phone || '').toLowerCase().trim();
            const existingIdx = prev.findIndex(c => (c.email || c.phone || '').toLowerCase().trim() === emailKey);
            if (existingIdx > -1) {
              const updated = [...prev];
              const newTotalSpent = updated[existingIdx].totalSpent + newOrder.total;
              updated[existingIdx] = {
                ...updated[existingIdx],
                totalOrders: updated[existingIdx].totalOrders + 1,
                totalSpent: newTotalSpent,
                status: newTotalSpent > 3000 ? 'VIP' : 'Active'
              };
              return updated;
            } else {
              const newProfile: CustomerProfile = {
                id: `CUST-${Date.now().toString().slice(-4)}`,
                name: newOrder.customerName,
                email: newOrder.email,
                phone: newOrder.phone,
                location: newOrder.city,
                totalOrders: 1,
                totalSpent: newOrder.total,
                joinedDate: new Date().toISOString().slice(0, 10),
                status: newOrder.total > 3000 ? 'VIP' : 'Active'
              };
              return [newProfile, ...prev];
            }
          });
          if (isSupabaseConfigured) {
            supabaseDb.createOrder(newOrder);
          }
        }}
      />

      {/* Customer & Admin Login Modal */}
      <UserAuthModal
        isOpen={isUserAuthOpen}
        onClose={() => setIsUserAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderId={activeTrackingOrderId}
        currentUser={currentUser}
        onOpenStore={() => setIsTrackingOpen(false)}
        reviews={reviewsList}
        onAddReview={handleAddReview}
      />

      {/* Executive Admin Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </>
  );
}

export default App;
