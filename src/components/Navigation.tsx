import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';
import './Navigation.css';

interface NavigationProps {
  cartCount: number;
  onOpenCart: () => void;
  onQuickBuy: () => void;
  onOpenAdmin: () => void;
}

const Navigation = ({ cartCount, onOpenCart, onQuickBuy, onOpenAdmin }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Collection', href: '#formula' },
    { name: 'Product', href: '#collection' },
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
            <button 
              className="admin-portal-trigger" 
              onClick={onOpenAdmin} 
              title="Open Admin Portal"
            >
              <ShieldCheck size={16} />
              <span className="admin-trigger-label">Admin</span>
            </button>

            <button className="cart-trigger" onClick={onOpenCart} aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="nav-buy-btn" onClick={onQuickBuy}>
              Buy Now
            </button>
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

                <button 
                  className="drawer-link admin-drawer-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                >
                  <span className="flex-center gap-xs text-gold">
                    <ShieldCheck size={18} /> Executive Admin Portal
                  </span>
                  <ChevronRight size={18} className="chevron" />
                </button>
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

