import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Droplets,
  Shield,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ProductBundle } from '../data/productData';
import './ProductModal.css';

export interface ProductModalData {
  id: string | number;
  name: string;
  category: string;
  desc: string;
  price: string;
  originalPrice?: string;
  image: string;
  volume?: string;
  tagline?: string;
  rating?: number;
  reviewsCount?: number;
  ingredients?: Array<{ name: string; botanicalName: string; description: string }>;
  benefits?: Array<{ title: string; desc: string }>;
  howToUse?: Array<{ step: string; title: string; desc: string }>;
}

interface ProductModalProps {
  product: ProductModalData | null;
  allProducts?: ProductModalData[];
  onSelectProduct?: (product: ProductModalData) => void;
  onClose: () => void;
  onAddToCart?: (bundle: ProductBundle, quantity: number) => void;
  onBuyNow?: (bundle: ProductBundle, quantity: number) => void;
}

type TabType = 'description' | 'ingredients' | 'benefits' | 'howToUse';

const defaultIngredients = [
  {
    name: 'Ashwagandha Extract',
    botanicalName: 'Withania Somnifera',
    description: 'Renowned botanical adaptogen known for revitalizing fatigued skin and calming sensory stress.'
  },
  {
    name: 'Rosehip & Jojoba Oil',
    botanicalName: 'Rosa Canina & Simmondsia',
    description: 'Rich in essential fatty acids and Vitamin C to restore radiance and strengthen natural moisture barriers.'
  },
  {
    name: 'Saffron Essence',
    botanicalName: 'Crocus Sativus',
    description: 'One of the world’s most precious botanicals, traditionally celebrated for luminous tone and clarity.'
  },
  {
    name: 'Sweet Almond Base',
    botanicalName: 'Prunus Dulcis',
    description: 'Deeply soothing oil rich in Vitamin E that protects, softens, and deeply conditions delicate skin.'
  },
  {
    name: 'Santal & Cedar Infusion',
    botanicalName: 'Santalum Album',
    description: 'Grounding natural aromatic notes that calm the senses and enhance the sensorial massage experience.'
  },
  {
    name: 'Sesame Seed Carrier',
    botanicalName: 'Sesamum Indicum',
    description: 'A traditional botanical carrier oil that ensures deep dermal delivery of essential nutrients.'
  }
];

const defaultBenefits = [
  {
    title: '100% Organically Certified',
    desc: 'Formulated with cold-pressed botanical extracts, free from mineral oils, parabens, and synthetic dyes.',
    icon: Sparkles
  },
  {
    title: 'Deep Skin Hydration',
    desc: 'Absorbs within minutes into the dermal layer without leaving sticky or greasy residue.',
    icon: Droplets
  },
  {
    title: 'Restores Radiant Barrier',
    desc: 'Rich in natural Vitamin E and adaptogens that protect against daily environmental oxidation.',
    icon: Shield
  },
  {
    title: 'Calming Aromatherapeutic Ritual',
    desc: 'Subtle herbal sandalwood & rosehip aroma designed to soothe senses during morning or evening routines.',
    icon: Sun
  }
];

const defaultHowToUse = [
  {
    step: '01',
    title: 'Dispense a few drops',
    desc: 'Take 3 to 5 drops of the warm elixir onto clean, dry palms.'
  },
  {
    step: '02',
    title: 'Warm & activate',
    desc: 'Rub your palms together gently to warm the oil and activate the natural botanical aromatics.'
  },
  {
    step: '03',
    title: 'Massage mindfully',
    desc: 'Massage in upward circular motions onto face, neck, or body until fully absorbed.'
  }
];

const ProductModal = ({ 
  product, 
  allProducts,
  onSelectProduct,
  onClose, 
  onAddToCart, 
  onBuyNow 
}: ProductModalProps) => {
  const [currentProduct, setCurrentProduct] = useState<ProductModalData | null>(product);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setQuantity(1);
    }
  }, [product]);

  if (!currentProduct) return null;

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const currentIndex = allProducts 
    ? allProducts.findIndex(p => String(p.id) === String(currentProduct.id))
    : -1;

  const handleSwitchProduct = (targetProd: ProductModalData) => {
    setCurrentProduct(targetProd);
    setQuantity(1);
    onSelectProduct?.(targetProd);
  };

  const handlePrevProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allProducts || allProducts.length <= 1) return;
    const newIdx = (currentIndex - 1 + allProducts.length) % allProducts.length;
    handleSwitchProduct(allProducts[newIdx]);
  };

  const handleNextProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allProducts || allProducts.length <= 1) return;
    const newIdx = (currentIndex + 1) % allProducts.length;
    handleSwitchProduct(allProducts[newIdx]);
  };

  const currentPriceNum = parseInt(currentProduct.price.replace(/[^0-9]/g, '')) || 2490;
  const currentOriginalNum = currentProduct.originalPrice 
    ? parseInt(currentProduct.originalPrice.replace(/[^0-9]/g, '')) 
    : Math.round(currentPriceNum * 1.4);

  const bundleData: ProductBundle = {
    id: typeof currentProduct.id === 'string' && String(currentProduct.id).startsWith('product-')
      ? String(currentProduct.id)
      : `product-${currentProduct.id}`,
    name: currentProduct.name,
    size: currentProduct.volume || '100ml / 3.4 fl oz',
    price: currentPriceNum,
    originalPrice: currentOriginalNum,
    discount: `${Math.round(((currentOriginalNum - currentPriceNum) / currentOriginalNum) * 100)}% OFF`,
    image: currentProduct.image
  };

  const handleAddToCartClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (onAddToCart) {
      onAddToCart(bundleData, quantity);
    } else {
      alert(`Added ${quantity} x ${currentProduct.name} to cart!`);
    }
    onClose();
  };

  const handleBuyNowClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (onBuyNow) {
      onBuyNow(bundleData, quantity);
    } else if (onAddToCart) {
      onAddToCart(bundleData, quantity);
    }
    onClose();
  };

  const ingredientsList = currentProduct.ingredients || defaultIngredients;
  const benefitsList = currentProduct.benefits || defaultBenefits;
  const howToUseList = currentProduct.howToUse || defaultHowToUse;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
          
          {/* Left Product Image Section */}
          <div className="modal-image-col">
            <div className="modal-main-image-wrapper">
              <button 
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#e53935' : 'none'} color={isWishlisted ? '#e53935' : '#4a5568'} />
              </button>

              {allProducts && allProducts.length > 1 && (
                <>
                  <button 
                    type="button"
                    className="modal-nav-arrow prev"
                    onClick={handlePrevProduct}
                    aria-label="Previous product"
                    title="Previous product"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    type="button"
                    className="modal-nav-arrow next"
                    onClick={handleNextProduct}
                    aria-label="Next product"
                    title="Next product"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentProduct.image}
                  src={currentProduct.image} 
                  alt={currentProduct.name} 
                  className="modal-product-img"
                  initial={{ scale: 0.94, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.05, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>

            {/* Product Switcher Thumbnails Strip */}
            {allProducts && allProducts.length > 1 && (
              <div className="modal-thumbnails-strip" aria-label="All products">
                {allProducts.map((p) => {
                  const isActive = String(p.id) === String(currentProduct.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`modal-thumb-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleSwitchProduct(p)}
                      title={p.name}
                      aria-label={`View ${p.name}`}
                    >
                      <img src={p.image} alt={p.name} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Right Product Details & Tabs Section */}
          <div className="modal-info-col">
            <div className="modal-header-block">
              <div className="modal-badge-row">
                <span className="modal-category-badge">✨ {currentProduct.category || 'DERMATOLOGICAL CLEANSER'}</span>
              </div>

              <h2 className="modal-product-title">{currentProduct.name}</h2>
              <p className="modal-tagline">{currentProduct.tagline || currentProduct.desc}</p>

              <div className="modal-rating-row">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#d97706" color="#d97706" />
                  ))}
                </div>
                <span className="rating-score">{currentProduct.rating || 4.8}</span>
                <span className="reviews-count">({currentProduct.reviewsCount || 128} reviews)</span>
                <span className="divider-line">|</span>
                <span className="stock-status">
                  <CheckCircle2 size={14} className="in-stock-icon" /> In Stock (Available)
                </span>
              </div>

              {/* Price Banner */}
              <div className="modal-price-box">
                <div className="price-main-stack">
                  <span className="modal-price-val">{currentProduct.price}</span>
                  {currentProduct.originalPrice && (
                    <span className="modal-price-orig">{currentProduct.originalPrice}</span>
                  )}
                  {!currentProduct.originalPrice && (
                    <span className="modal-price-orig">₹{currentOriginalNum}</span>
                  )}
                </div>
                <span className="volume-label">Net Vol: {currentProduct.volume || '200ml / 1.7 fl oz'}</span>
              </div>
            </div>

            {/* TABBED MENU NAVIGATION */}
            <div className="modal-tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && <motion.div className="tab-indicator" layoutId="activeTabIndicator" />}
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
                {activeTab === 'ingredients' && <motion.div className="tab-indicator" layoutId="activeTabIndicator" />}
              </button>
              <button 
                className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
                {activeTab === 'benefits' && <motion.div className="tab-indicator" layoutId="activeTabIndicator" />}
              </button>
              <button 
                className={`tab-btn ${activeTab === 'howToUse' ? 'active' : ''}`}
                onClick={() => setActiveTab('howToUse')}
              >
                How To Use
                {activeTab === 'howToUse' && <motion.div className="tab-indicator" layoutId="activeTabIndicator" />}
              </button>
            </div>

            {/* DYNAMIC TAB CONTENT AREA */}
            <div className="modal-tab-content-container">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="desc-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="tab-panel"
                  >
                    <p className="tab-desc-text">
                      {currentProduct.desc || currentProduct.tagline}
                    </p>
                    <div className="tab-highlights-list">
                      <div className="tab-highlight-item">
                        <CheckCircle2 size={15} className="highlight-icon" />
                        <span>100% pure cold-pressed botanical formulation</span>
                      </div>
                      <div className="tab-highlight-item">
                        <CheckCircle2 size={15} className="highlight-icon" />
                        <span>Deeply moisturizes without clogging skin pores</span>
                      </div>
                      <div className="tab-highlight-item">
                        <CheckCircle2 size={15} className="highlight-icon" />
                        <span>Ethically sourced adaptogens for natural radiance</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'ingredients' && (
                  <motion.div
                    key="ingredients-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="tab-panel"
                  >
                    <div className="modal-ingredients-grid">
                      {ingredientsList.map((item, index) => (
                        <div key={index} className="modal-ingredient-card">
                          <h4 className="ing-name">{item.name}</h4>
                          <span className="ing-botanical">{item.botanicalName}</span>
                          <p className="ing-desc">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'benefits' && (
                  <motion.div
                    key="benefits-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="tab-panel"
                  >
                    <div className="modal-benefits-list">
                      {benefitsList.map((benefit, index) => {
                        const IconComponent = (benefit as any).icon || Sparkles;
                        return (
                          <div key={index} className="modal-benefit-row">
                            <div className="benefit-icon-badge">
                              <IconComponent size={16} />
                            </div>
                            <div className="benefit-text-group">
                              <h4 className="benefit-title">{benefit.title}</h4>
                              <p className="benefit-desc">{benefit.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'howToUse' && (
                  <motion.div
                    key="howToUse-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="tab-panel"
                  >
                    <div className="modal-use-steps">
                      {howToUseList.map((stepItem, index) => (
                        <div key={index} className="modal-use-step">
                          <span className="step-badge">{stepItem.step}</span>
                          <div className="step-info">
                            <h4 className="step-heading">{stepItem.title}</h4>
                            <p className="step-details">{stepItem.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION BUTTONS & QTY SELECTOR */}
            <div className="modal-actions-wrapper">
              <div className="modal-qty-picker">
                <button onClick={handleDecreaseQty} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className="qty-num">{quantity}</span>
                <button onClick={handleIncreaseQty} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>

              <button 
                className="btn-primary modal-add-cart-btn"
                onClick={handleAddToCartClick}
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>

              <button 
                className="btn-green modal-buy-now-btn"
                onClick={handleBuyNowClick}
              >
                Buy Now
              </button>
            </div>

            {/* TRUST BADGES FOOTER */}
            <div className="modal-trust-footer">
              <div className="trust-badge-item">
                <Truck size={15} className="badge-icon" />
                <span>Free Express Delivery</span>
              </div>
              <div className="trust-badge-item">
                <ShieldCheck size={15} className="badge-icon" />
                <span>100% Organically Certified</span>
              </div>
              <div className="trust-badge-item">
                <RotateCcw size={15} className="badge-icon" />
                <span>14-Day Returns</span>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
