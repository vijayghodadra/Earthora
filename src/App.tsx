import { useState, useEffect } from 'react';
// @ts-ignore
import Lenis from 'lenis';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeaturedCollection from './components/FeaturedCollection';
import Benefits from './components/Benefits';
import Comparison from './components/Comparison';
import Reviews from './components/Reviews';
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

import { supabaseDb, isSupabaseConfigured } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Dynamic state with localStorage initialization
  const [bundles, setBundles] = useState<ProductBundle[]>(() => {
    const saved = localStorage.getItem('earthora_bundles');
    return saved ? JSON.parse(saved) : productData.bundles;
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('earthora_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('earthora_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem('earthora_reviews');
    return saved ? JSON.parse(saved) : productData.reviews;
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
      supabaseDb.getProducts().then(data => data && setBundles(data));
      supabaseDb.getReviews().then(data => data && setReviewsList(data));
    }
  }, []);

  // Sync state changes with localStorage & Supabase
  useEffect(() => {
    localStorage.setItem('earthora_bundles', JSON.stringify(bundles));
    if (isSupabaseConfigured) supabaseDb.saveProducts(bundles);
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

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          trackingNumber: trackingNumber || ord.trackingNumber
        };
      }
      return ord;
    }));
    if (isSupabaseConfigured) {
      supabaseDb.updateOrderStatus(orderId, status, trackingNumber);
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
      />

      <main>
        <Hero 
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          productsList={bundles}
        />
        <TrustBar />
        <Benefits />
        <FeaturedCollection 
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          productsList={bundles}
        />
        <Comparison />
        <Reviews reviewsList={reviewsList} />
      </main>

      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={(newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          if (isSupabaseConfigured) {
            supabaseDb.createOrder(newOrder);
          }
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </>
  );
}

export default App;
