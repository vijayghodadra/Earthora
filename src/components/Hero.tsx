import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Truck, Plus, Minus, Check, Tag } from 'lucide-react';
import type { ProductBundle } from '../data/productData';
import './Hero.css';

import img1 from '../assets/images (1).jpg';
import img2 from '../assets/images (2).jpg';
import img3 from '../assets/images (4).jpg';
import img4 from '../assets/images (3).jpg';
import img5 from '../assets/images6.jpg';

interface HeroProps {
  onAddToCart: (bundle: ProductBundle, quantity: number) => void;
  onBuyNow: (bundle: ProductBundle, quantity: number) => void;
  productsList?: ProductBundle[];
}

const defaultHeroProducts = [
  {
    id: 'product-1',
    name: 'Mamaearth Ubtan Natural Face Wash',
    category: 'FACIAL CARE & RADIANCE',
    tagline: 'Formulated with Saffron & Turmeric for natural skin radiance and gentle daily cleansing.',
    price: 249,
    originalPrice: 349,
    discount: '28% OFF',
    size: '100ml • Free Shipping',
    rating: 4.9,
    reviewCount: 1250,
    image: img1
  },
  {
    id: 'product-2',
    name: 'Mamaearth Anti-Pollution Face Cream',
    category: 'DAY CARE & PROTECTION',
    tagline: 'Protects skin against environmental pollution while maintaining smooth botanical nourishment.',
    price: 349,
    originalPrice: 499,
    discount: '30% OFF',
    size: '80g • Free Shipping',
    rating: 4.8,
    reviewCount: 890,
    image: img2
  },
  {
    id: 'product-3',
    name: 'Neutrogena Hydro Boost Water Gel',
    category: 'MOISTURIZER & HYDRATION',
    tagline: 'Intense hydration water gel cream that keeps skin supple, plump and glowing all day.',
    price: 950,
    originalPrice: 1250,
    discount: '24% OFF',
    size: '50g • Free Shipping',
    rating: 4.9,
    reviewCount: 1040,
    image: img3
  },
  {
    id: 'product-4',
    name: 'Cetaphil Gentle Oily Skin Cleanser',
    category: 'DERMATOLOGICAL CLEANSER',
    tagline: 'Gentle daily cleanser designed for oily to combination skin, removing excess oil without drying.',
    price: 599,
    originalPrice: 750,
    discount: '20% OFF',
    size: '125ml • Free Shipping',
    rating: 4.7,
    reviewCount: 670,
    image: img4
  },
  {
    id: 'product-5',
    name: 'Mamaearth Vitamin C Daily Glow Wash',
    category: 'BRIGHTENING FACE WASH',
    tagline: 'Enriched with Vitamin C and Lemon for an instant refreshing glow and clear skin texture.',
    price: 399,
    originalPrice: 549,
    discount: '27% OFF',
    size: '100ml • Free Shipping',
    rating: 5.0,
    reviewCount: 520,
    image: img5
  }
];

const Hero = ({ onAddToCart, onBuyNow, productsList }: HeroProps) => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map dynamic products from props or fallback to default
  const activeProducts = (productsList && productsList.length > 0)
    ? productsList.map(item => ({
        id: item.id,
        name: item.name,
        category: item.badge || 'BOTANICAL CARE & RADIANCE',
        tagline: 'Formulated for natural skin radiance and gentle daily nourishment.',
        price: item.price,
        originalPrice: item.originalPrice || Math.round(item.price * 1.3),
        discount: item.discount || 'Special Offer',
        size: item.size || '50ml • Free Shipping',
        rating: 4.9,
        reviewCount: 1250,
        image: item.image || img1,
        rawBundle: item
      }))
    : defaultHeroProducts.map(item => ({ ...item, rawBundle: item as unknown as ProductBundle }));

  const safeIndex = activeProductIndex < activeProducts.length ? activeProductIndex : 0;
  const activeProduct = activeProducts[safeIndex] || activeProducts[0];

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const currentBundle: ProductBundle = activeProduct.rawBundle || {
    id: activeProduct.id,
    name: activeProduct.name,
    size: activeProduct.size,
    price: activeProduct.price,
    originalPrice: activeProduct.originalPrice,
    discount: activeProduct.discount,
    image: activeProduct.image
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    onAddToCart(currentBundle, quantity);
    setQuantity(1);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    onBuyNow(currentBundle, quantity);
    setQuantity(1);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <section id="hero" className="hero-section">
      <div className="section-container hero-grid">
        
        {/* Left Column - Image Gallery */}
        <motion.div 
          className="hero-media-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="main-image-container">
            <AnimatePresence mode="wait">
              <motion.img 
                key={safeIndex}
                src={activeProduct.image} 
                alt={activeProduct.name}
                className="main-product-img"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
          </div>

          {/* Gallery Thumbnails */}
          <div className="gallery-thumbnails">
            {activeProducts.map((prod, idx) => (
              <button
                key={prod.id}
                className={`thumbnail-btn ${safeIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveProductIndex(idx)}
                aria-label={`Select product ${prod.name}`}
              >
                <img src={prod.image} alt={prod.name} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Dynamic Product Details Panel */}
        <motion.div 
          className="hero-content-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeProduct.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="hero-details-container"
            >
              <span className="section-eyebrow">{activeProduct.category}</span>
              <h1 className="hero-product-title">{activeProduct.name}</h1>

              {/* Rating Summary */}
              <div className="hero-rating-bar">
                <div className="stars-wrapper">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#d97706" color="#d97706" />
                  ))}
                </div>
                <span className="rating-num">{activeProduct.rating}</span>
                <span className="rating-dot">•</span>
                <a href="#reviews" className="reviews-link">
                  {activeProduct.reviewCount.toLocaleString()} verified reviews
                </a>
              </div>

              <p className="hero-description">{activeProduct.tagline}</p>

              {/* PRICE & DISCOUNT BOX */}
              <div className="hero-simple-price-card">
                <div className="price-left-stack">
                  <span className="hero-current-price">₹{activeProduct.price.toLocaleString()}</span>
                  <span className="hero-original-price">₹{activeProduct.originalPrice.toLocaleString()}</span>
                  <span className="hero-discount-badge">
                    <Tag size={12} /> {activeProduct.discount}
                  </span>
                </div>
                <div className="price-size-info">{activeProduct.size}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quantity & CTAs */}
          <div className="cta-purchase-container">
            <div className="quantity-controls">
              <span className="qty-label">Qty:</span>
              <div className="qty-picker">
                <button onClick={decrementQty} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button onClick={incrementQty} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="cta-buttons-row">
              <button 
                className="btn-primary add-cart-btn"
                onClick={handleAddToCartClick}
              >
                Add to Cart — ₹{(activeProduct.price * quantity).toLocaleString()}
              </button>
              <button 
                className="btn-green buy-now-btn"
                onClick={handleBuyNowClick}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Highlights Checklist */}
          <div className="hero-trust-checklist">
            <div className="trust-item">
              <Check size={16} className="check-icon" />
              <span>Free Express Shipping across India</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={16} className="check-icon" />
              <span>100% Authentic Botanical Assurance</span>
            </div>
            <div className="trust-item">
              <Truck size={16} className="check-icon" />
              <span>Cash on Delivery (COD) Available</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
