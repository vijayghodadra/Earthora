import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.jpeg';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Star, 
  Tag, 
  ArrowLeft, 
  Bell, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

import './AdminPanel.css';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminReviews } from './AdminReviews';
import { AdminCoupons } from './AdminCoupons';

import type { CustomerOrder, CustomerProfile, CouponCode, StoreSettings, OrderStatus } from '../../types/adminTypes';
import type { ProductBundle, Review } from '../../data/productData';

interface AdminPanelProps {
  onReturnToStore: () => void;
  bundles: ProductBundle[];
  onUpdateBundles: (bundles: ProductBundle[]) => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  customers: CustomerProfile[];
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
  coupons: CouponCode[];
  onUpdateCoupons: (coupons: CouponCode[]) => void;
  settings?: StoreSettings;
  onUpdateSettings?: (settings: StoreSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onReturnToStore,
  bundles,
  onUpdateBundles,
  orders,
  onUpdateOrderStatus,
  customers,
  reviews,
  onUpdateReviews,
  coupons,
  onUpdateCoupons
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

  const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Manage Products', icon: Package, badge: bundles.length.toString() },
    { id: 'orders', label: 'Orders & Payment Details', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : null },
    { id: 'customers', label: 'User Data & Accounts', icon: Users, badge: null },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star, badge: reviews.length.toString() },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: null },
  ];

  return (
    <div className={`admin-root-container ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={logoImg} alt="EarthOra" className="brand-logo-img sidebar-logo-img" />
        </div>

        <nav className="sidebar-menu">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
                {item.badge && <span className={`sidebar-badge ${isActive ? 'active' : ''}`}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="return-store-btn" onClick={onReturnToStore}>
            <ArrowLeft size={16} /> Return to Storefront
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-wrapper">
        {/* Top Header Bar */}
        <header className="admin-top-bar">
          <div className="top-bar-left">
            <span className="live-status-pill">
              <span className="live-pulse" /> Storefront Live & Operational
            </span>
          </div>

          <div className="top-bar-right">
            {/* Theme Toggle Button */}
            <button 
              className="top-bar-btn theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'White'} Theme`}
            >
              {theme === 'light' ? <Moon size={18} className="text-gold" /> : <Sun size={18} className="text-gold" />}
            </button>

            <div className="notification-wrapper">
              <button 
                className="top-bar-btn" 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {pendingOrdersCount > 0 && <span className="notif-badge">{pendingOrdersCount}</span>}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    className="notifications-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="notif-header">
                      <h4>Notifications & Alerts</h4>
                      <span className="font-mono text-gold font-sm">{pendingOrdersCount} Action Items</span>
                    </div>
                    <div className="notif-body">
                      {pendingOrdersCount > 0 ? (
                        <div className="notif-item" onClick={() => { setActiveTab('orders'); setNotificationsOpen(false); }}>
                          <ShoppingBag size={16} className="text-gold" />
                          <div>
                            <p className="notif-text">{pendingOrdersCount} customer order(s) awaiting processing</p>
                            <span className="notif-time">Just now</span>
                          </div>
                        </div>
                      ) : (
                        <p className="p-3 text-muted text-center font-sm">No pending alerts</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="admin-profile-pill">
              <div className="profile-avatar">EA</div>
              <div className="profile-info">
                <span className="profile-name">Executive Admin</span>
                <span className="profile-role">Store Manager</span>
              </div>
            </div>

            <button className="top-bar-btn text-gold" onClick={onReturnToStore} title="Exit Portal">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* View Component Switcher */}
        <div className="admin-content-body">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              orders={orders}
              products={bundles}
              customers={customers}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              bundles={bundles}
              onUpdateBundles={onUpdateBundles}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers
              customers={customers}
            />
          )}

          {activeTab === 'reviews' && (
            <AdminReviews
              reviews={reviews}
              onUpdateReviews={onUpdateReviews}
            />
          )}

          {activeTab === 'coupons' && (
            <AdminCoupons
              coupons={coupons}
              onUpdateCoupons={onUpdateCoupons}
            />
          )}
        </div>
      </main>
    </div>
  );
};
