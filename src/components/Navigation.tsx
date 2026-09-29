import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronRight, ShieldCheck, User, LogOut, Package } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';
import type { UserProfileData } from './auth/UserAuthModal';
import type { CustomerOrder } from '../types/adminTypes';
import './Navigation.css';

interface NavigationProps {
  cartCount: number;
  onOpenCart: () => void;
  onQuickBuy: () => void;
  onOpenAdmin: () => void;
  currentUser?: UserProfileData | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTracking: () => void;
  orders?: CustomerOrder[];
}

const Navigation = ({ 
  cartCount, 
  onOpenCart, 
  onQuickBuy, 
  onOpenAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenTracking,
  orders = []
}: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Collection', href: '#collection' },
    { name: 'About Us', href: '#story' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanPhone = (p?: string) => (p || '').replace(/\D/g, '');
  const userOrdersCount = (currentUser && orders)
    ? orders.filter(o => {
        const orderPhoneClean = cleanPhone(o.phone);
        const userPhoneClean = cleanPhone(currentUser.phone);
        const phoneMatch = userPhoneClean.length >= 8 && orderPhoneClean.endsWith(userPhoneClean.slice(-10));
        const emailMatch = Boolean(o.email && currentUser.email && o.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
        const nameMatch = Boolean(o.customerName && currentUser.name && o.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim());
        return phoneMatch || emailMatch || nameMatch;
      }).length
    : 0;

  return (
    <>
      <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="nav-logo">
            <img src={logoImg} alt="EarthOra" className="brand-logo-img" />
          </a>

          <nav className="nav-desktop-menu">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="nav-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            {/* User Account / Profile Trigger */}
            {currentUser ? (
              <div className="user-profile-menu-container">
                <button 
                  className="user-profile-trigger" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  title={`Logged in as ${currentUser.name}`}
                >
                  <div className="user-avatar-circle">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-nav-name">{currentUser.name.split(' ')[0]}</span>
                  {userOrdersCount > 0 && (
                    <span className="user-nav-orders-pill" title={`${userOrdersCount} active/total order${userOrdersCount > 1 ? 's' : ''}`}>
                      {userOrdersCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      className="user-nav-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="dropdown-user-header">
                        <p className="dropdown-user-name">{currentUser.name}</p>
                        <p className="dropdown-user-email">{currentUser.phone || currentUser.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <button 
                        className="dropdown-item user-orders-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenTracking();
                        }}
                      >
                        <div className="orders-item-lead">
                          <Package size={16} className="orders-lead-icon" />
                          <span>My Orders</span>
                        </div>
                        <span className={`user-orders-count-badge ${userOrdersCount > 0 ? 'badge-active' : 'badge-zero'}`} title={`${userOrdersCount} total orders`}>
                          {userOrdersCount}
                        </span>
                      </button>
                      {currentUser.email === 'earthora@gmail.com' && onOpenAdmin && (
                        <button 
                          className="dropdown-item admin-portal-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAdmin();
                          }}
                        >
                          <ShieldCheck size={16} className="text-gold" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                      <button 
                        className="dropdown-item logout-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                className="nav-auth-trigger" 
                onClick={onOpenAuth} 
                title="Customer Sign In / Register"
              >
                <User size={18} />
                <span className="auth-trigger-label">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button className="cart-trigger" onClick={onOpenCart} aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Quick Buy Button */}
            <button className="nav-buy-btn" onClick={onQuickBuy}>
              Buy Now
            </button>

            {/* Mobile Toggle */}
            <button 
              className="mobile-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <img src={logoImg} alt="EarthOra" className="brand-logo-img drawer-logo-img" />
                <button onClick={() => setMobileMenuOpen(false)} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="drawer-links">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="drawer-link"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, link.href);
                    }}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={18} className="chevron" />
                  </a>
                ))}

                {/* Mobile User Authentication */}
                {currentUser ? (
                  <div className="drawer-user-card">
                    <div className="drawer-user-info">
                      <div className="user-avatar-circle">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="drawer-user-name">{currentUser.name}</p>
                        <p className="drawer-user-email">{currentUser.phone || currentUser.email}</p>
                      </div>
                    </div>
                    <button 
                      className="drawer-orders-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenTracking();
                      }}
                    >
                      <div className="orders-item-lead">
                        <Package size={16} className="orders-lead-icon" />
                        <span>My Orders</span>
                      </div>
                      <span className={`user-orders-count-badge ${userOrdersCount > 0 ? 'badge-active' : 'badge-zero'}`}>
                        {userOrdersCount}
                      </span>
                    </button>
                    {currentUser.email === 'earthora@gmail.com' && onOpenAdmin && (
                      <button 
                        className="drawer-orders-btn"
                        style={{ marginTop: '0.45rem', borderColor: 'rgba(197, 160, 89, 0.4)' }}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAdmin();
                        }}
                      >
                        <div className="orders-item-lead text-gold">
                          <ShieldCheck size={16} />
                          <span>Admin Dashboard</span>
                        </div>
                      </button>
                    )}
                    <button 
                      className="drawer-logout-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button 
                    className="drawer-auth-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                  >
                    <User size={18} />
                    <span>Customer Sign In / Register</span>
                  </button>
                )}
              </div>

              <div className="drawer-footer">
                <button 
                  className="btn-primary drawer-buy-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onQuickBuy();
                  }}
                >
                  Order Now • Free Shipping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
