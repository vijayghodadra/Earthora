import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, CheckCircle2, Lock, Truck, UserCheck } from 'lucide-react';
import type { ProductBundle } from '../data/productData';
import type { CustomerOrder, PaymentMethod } from '../types/adminTypes';
import type { UserProfileData } from './auth/UserAuthModal';
import img1 from '../assets/images (1).jpg';
import './CartDrawer.css';

export interface CartItem {
  bundle: ProductBundle;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (bundleId: string, delta: number) => void;
  onRemoveItem: (bundleId: string) => void;
  onPlaceOrder?: (order: CustomerOrder) => void;
  currentUser?: UserProfileData | null;
  onOpenAuth?: () => void;
  onOpenTracking?: (orderId: string) => void;
}

export const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemoveItem,
  onPlaceOrder,
  currentUser,
  onOpenAuth,
  onOpenTracking
}: CartDrawerProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Razorpay');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');

  // Form Fields - Auto-fill from active logged-in user profile
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode] = useState('400001');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const subtotal = items.reduce((sum, item) => sum + item.bundle.price * item.quantity, 0);

  const handleStartCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!customerName || !email || !phone || !address || !city) {
      alert("Please fill in all contact & delivery address details.");
      return;
    }

    if (paymentMethod === 'Razorpay') {
      setIsRazorpayModalOpen(true);
    } else {
      processFinalOrder(paymentMethod);
    }
  };

  const processFinalOrder = (method: PaymentMethod, rzpPaymentId?: string) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: CustomerOrder = {
      id: orderId,
      customerName,
      email,
      phone,
      address,
      city,
      pincode: pincode || '400001',
      date: dateStr,
      items: items.map(i => ({
        bundleId: i.bundle.id,
        bundleName: i.bundle.name,
        size: i.bundle.size,
        unitPrice: i.bundle.price,
        quantity: i.quantity
      })),
      subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod: method,
      paymentStatus: method === 'COD' ? 'Pending COD' : 'Paid',
      razorpayPaymentId: rzpPaymentId || (method === 'Razorpay' ? `pay_rzp_${Math.floor(100000000 + Math.random() * 900000000)}` : undefined),
      razorpayOrderId: method === 'Razorpay' ? `order_rzp_${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      status: 'Pending', // Real-world: Order Placed (Waiting for Store Acceptance)
      courier: 'Delhivery Express',
      trackingNumber: `ETH-TRK-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }

    setCompletedOrderId(orderId);
    setIsRazorpayModalOpen(false);
    setIsCheckoutOpen(false);
    setIsOrderComplete(true);
  };

  const handleResetAndClose = () => {
    setIsOrderComplete(false);
    setIsCheckoutOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-overlay-container">
          <motion.div 
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="cart-header">
              <div className="cart-title">
                <ShoppingBag size={20} />
                <span>Your Order Cart</span>
              </div>
              <button className="cart-close-btn" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            {isOrderComplete ? (
              <div className="empty-cart-view text-center py-5">
                <CheckCircle2 size={54} className="text-emerald margin-bottom-md" />
                <h3 className="text-gold">Order Placed Successfully!</h3>
                <p className="user-sub">Order Reference: <strong>{completedOrderId}</strong></p>
                <div className="order-live-status-card">
                  <div className="live-status-indicator">
                    <span className="live-pulse-dot" />
                    <span className="live-status-text">Status: <strong>Order Placed (Pending Acceptance)</strong></span>
                  </div>
                  <p className="live-status-sub">
                    Your order has been queued for apothecary confirmation. You can track preparation, courier dispatch, and live delivery updates in real-time.
                  </p>
                </div>
                <div className="order-success-actions">
                  {onOpenTracking && (
                    <button 
                      className="btn-primary track-cta-btn" 
                      onClick={() => {
                        const ord = completedOrderId;
                        handleResetAndClose();
                        onOpenTracking(ord);
                      }}
                    >
                      <Truck size={17} />
                      <span>Track Your Order Live</span>
                    </button>
                  )}
                  <button className="btn-secondary" onClick={handleResetAndClose}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-cart-view">
                <ShoppingBag size={48} className="empty-icon" />
                <h3>Your cart is empty</h3>
                <p>Select a supply package from the product page to begin your ritual.</p>
                <button className="btn-primary" onClick={onClose}>
                  Browse Product Packages
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.bundle.id} className="cart-item-row">
                      <div className="cart-item-thumb">
                        <img src={item.bundle.image || img1} alt={item.bundle.name} />
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.bundle.name}</div>
                        <div className="cart-item-bundle">{item.bundle.size}</div>
                        <div className="cart-item-price">₹{item.bundle.price.toLocaleString()}</div>

                        <div className="cart-qty-row">
                          <div className="cart-qty-picker">
                            <button onClick={() => onUpdateQty(item.bundle.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.bundle.id, 1)}>+</button>
                          </div>
                          <button 
                            className="remove-item-btn"
                            onClick={() => onRemoveItem(item.bundle.id)}
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-footer">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free-shipping">FREE Express</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <button 
                    className="btn-primary checkout-btn"
                    onClick={handleStartCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>

                  <div className="cart-security-badge">
                    <ShieldCheck size={16} />
                    <span>256-bit SSL Encrypted & 100% Secure Checkout</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Checkout & Payment Modal */}
          <AnimatePresence>
            {isCheckoutOpen && (
              <motion.div 
                className="admin-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="admin-modal modal-lg"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <div className="admin-modal-header">
                    <div>
                      <h3>Customer Checkout & Payment</h3>
                      <span className="user-sub">Total Payable: <strong>₹{subtotal.toLocaleString()}</strong></span>
                    </div>
                    <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}><X size={20} /></button>
                  </div>

                  <div className="admin-modal-body grid-2">
                    {currentUser ? (
                      <div className="checkout-user-banner full-width">
                        <UserCheck size={18} className="text-emerald" />
                        <div>
                          <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                          <span className="user-sub">Your delivery details have been pre-filled.</span>
                        </div>
                      </div>
                    ) : (
                      onOpenAuth && (
                        <div className="checkout-login-banner full-width">
                          <span>Already have an Earthora account?</span>
                          <button 
                            type="button" 
                            className="checkout-auth-link"
                            onClick={() => {
                              setIsCheckoutOpen(false);
                              onOpenAuth();
                            }}
                          >
                            Sign In for 1-Click Checkout →
                          </button>
                        </div>
                      )
                    )}

                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className="admin-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>City & State</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Delivery Shipping Address</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Select Payment Option</label>
                      <div className="payment-options-grid margin-top-xs">
                        <button 
                          className={`payment-option-card ${paymentMethod === 'Razorpay' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('Razorpay')}
                          type="button"
                        >
                          <div className="rzp-badge">RAZORPAY</div>
                          <span className="weight-700">Razorpay Gateway</span>
                          <span className="user-sub">UPI, Credit/Debit Cards, NetBanking</span>
                        </button>

                        <button 
                          className={`payment-option-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('UPI')}
                          type="button"
                        >
                          <span className="weight-700">UPI Instant</span>
                          <span className="user-sub">GPay, PhonePe, Paytm</span>
                        </button>

                        <button 
                          className={`payment-option-card ${paymentMethod === 'Card' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('Card')}
                          type="button"
                        >
                          <span className="weight-700">Credit / Debit Card</span>
                          <span className="user-sub">Visa, MasterCard, RuPay</span>
                        </button>

                        <button 
                          className={`payment-option-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('COD')}
                          type="button"
                        >
                          <span className="weight-700">Cash on Delivery</span>
                          <span className="user-sub">Pay on delivery to courier</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="admin-modal-footer">
                    <button className="admin-btn-secondary" onClick={() => setIsCheckoutOpen(false)}>Cancel</button>
                    <button className="admin-btn-primary" onClick={handleConfirmOrder}>
                      {paymentMethod === 'Razorpay' ? 'Pay with Razorpay →' : `Complete Order (₹${subtotal.toLocaleString()}) →`}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simulated Official Razorpay Gateway Modal */}
          <AnimatePresence>
            {isRazorpayModalOpen && (
              <motion.div 
                className="admin-modal-overlay rzp-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="rzp-window"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <div className="rzp-header">
                    <div>
                      <div className="rzp-logo-tag">RAZORPAY SECURE</div>
                      <h3>Earthora Botanical Wellness</h3>
                      <p>Order Total: <strong>₹{subtotal.toLocaleString()}</strong></p>
                    </div>
                    <button className="close-btn text-white" onClick={() => setIsRazorpayModalOpen(false)}><X size={20} /></button>
                  </div>

                  <div className="rzp-body">
                    <div className="rzp-method-list">
                      <div className="rzp-method-item active">
                        <span className="weight-700">UPI / QR Code</span>
                        <span className="user-sub">Google Pay, PhonePe, Paytm, BHIM</span>
                      </div>
                      <div className="rzp-method-item">
                        <span className="weight-700">Cards</span>
                        <span className="user-sub">Visa, MasterCard, RuPay, Maestro</span>
                      </div>
                      <div className="rzp-method-item">
                        <span className="weight-700">NetBanking</span>
                        <span className="user-sub">HDFC, ICICI, SBI, Axis & all banks</span>
                      </div>
                    </div>

                    <div className="rzp-action-box margin-top-md">
                      <button 
                        className="rzp-pay-now-btn"
                        onClick={() => processFinalOrder('Razorpay')}
                      >
                        <Lock size={16} /> Pay ₹{subtotal.toLocaleString()} via Razorpay
                      </button>
                      <div className="rzp-footer-tag">
                        <ShieldCheck size={14} /> 256-bit Encryption • Powered by Razorpay
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
