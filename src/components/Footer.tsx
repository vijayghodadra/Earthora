import './Footer.css';
import { ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

interface FooterProps {
  onOpenAdmin?: () => void;
}

const Footer = ({ onOpenAdmin }: FooterProps) => {
  return (
    <footer className="footer">
      <div className="section-container">
        
        <div className="footer-top">
          <div className="footer-brand-col">
            <a href="#hero" className="footer-logo">
              <img src={logoImg} alt="EarthOra" className="brand-logo-img footer-logo-img" />
            </a>
            <p className="footer-tagline">
              Curated botanical wellness. Crafted with uncompromising standards for those who value elegance and distinction.
            </p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <div className="footer-col-title">Navigation</div>
              <a href="#hero">Overview</a>
              <a href="#benefits">Benefits</a>
              <a href="#formula">Formula Details</a>
              <a href="#routine">Daily Ritual</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Social & Journal</div>
              <a href="#">Instagram</a>
              <a href="#">Pinterest</a>
              <a href="#">Ayurvedic Journal</a>
              <a href="#">Press Enquiries</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Customer Care</div>
              <a href="#faq">Shipping & Returns</a>
              <a href="#faq">Track Your Order</a>
              {onOpenAdmin && (
                <button 
                  className="footer-admin-btn"
                  onClick={onOpenAdmin}
                >
                  <ShieldCheck size={14} /> Executive Admin Portal
                </button>
              )}
              <a href="#faq">Privacy Policy</a>
              <a href="#faq">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} Earthora Luxury Botanical Care. All rights reserved.</div>
          <div className="footer-trust-notes">
            <span>GMP Certified</span> • <span>Dermatologically Tested</span> • <span>Cruelty Free</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

