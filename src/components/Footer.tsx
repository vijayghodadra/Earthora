import './Footer.css';
import { ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

interface FooterProps {
  onOpenAdmin?: () => void;
}

const Footer = ({ onOpenAdmin }: FooterProps) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="section-container">
        
        <div className="footer-top">
          <div className="footer-brand-col">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="footer-logo">
              <div className="footer-logo-badge">
                <img src={logoImg} alt="EarthOra" className="footer-logo-img" />
              </div>
            </a>
            <p className="footer-tagline">
              Premium Organic Haircare & Botanical Wellness. Formulated with 100% pure Ayurvedic extracts for timeless hair vitality.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <div className="footer-col-title">Navigation</div>
              <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>Home</a>
              <a href="#collection" onClick={(e) => handleNavClick(e, '#collection')}>Our Collections</a>
              <a href="#benefits" onClick={(e) => handleNavClick(e, '#benefits')}>Key Benefits</a>
              <a href="#story" onClick={(e) => handleNavClick(e, '#story')}>Brand Story</a>
              <a href="#reviews" onClick={(e) => handleNavClick(e, '#reviews')}>Customer Reviews</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Product & Care</div>
              <a href="#usage" onClick={(e) => handleNavClick(e, '#usage')}>How To Use</a>
              <a href="#comparison" onClick={(e) => handleNavClick(e, '#comparison')}>Why EarthOra</a>
              <a href="#details" onClick={(e) => handleNavClick(e, '#details')}>Formula Ingredients</a>
              <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')}>FAQ & Support</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Executive & Admin</div>
              {onOpenAdmin && (
                <button 
                  className="footer-admin-btn"
                  onClick={onOpenAdmin}
                >
                  <ShieldCheck size={16} /> Executive Admin Portal
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} EarthOra Luxury Botanical Care. All rights reserved.</div>
          <div className="footer-trust-notes">
            <span>GMP Certified</span> • <span>Dermatologically Tested</span> • <span>100% Vegan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

