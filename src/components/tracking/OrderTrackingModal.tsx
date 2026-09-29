import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  Truck, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Star,
  Sparkles,
  Edit3
} from 'lucide-react';
import type { CustomerOrder, OrderStatus, OrderItem } from '../../types/adminTypes';
import type { UserProfileData } from '../auth/UserAuthModal';
import type { Review } from '../../data/productData';
import './OrderTrackingModal.css';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  initialOrderId?: string;
  currentUser?: UserProfileData | null;
  onOpenStore?: () => void;
  reviews?: Review[];
  onAddReview?: (review: Review) => void;
}

const STEPS: { status: OrderStatus; label: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  {
    status: 'Pending',
    label: 'Order Placed',
    desc: 'Order received & queued for store acceptance',
    icon: Clock
  },
  {
    status: 'Processing',
    label: 'Order Accepted & Packed',
    desc: 'Accepted by Earthora apothecary & eco-packaged',
    icon: Package
  },
  {
    status: 'Shipped',
    label: 'Shipped / In Transit',
    desc: 'Dispatched via premium logistics partner',
    icon: Truck
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    desc: 'Safely delivered to your doorstep',
    icon: CheckCircle2
  }
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: '★★★★★ (5/5) Exceptional Quality - Life Changing',
  4: '★★★★☆ (4/5) Very Good - Visible Glow & Results',
  3: '★★★☆☆ (3/5) Average - Pure & Satisfactory',
  2: '★★☆☆☆ (2/5) Fair - Expected Greater Benefits',
  1: '★☆☆☆☆ (1/5) Poor - Did Not Meet Expectations'
};

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId,
  currentUser,
  onOpenStore,
  reviews = [],
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'my_orders' | 'search'>('my_orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<CustomerOrder[] | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState('');

  // Review Form State per item (key: `${orderId}_${itemIdx}`)
  const [reviewForms, setReviewForms] = useState<{
    [key: string]: {
      rating: number;
      hoverRating: number;
      title: string;
      comment: string;
      isEditing?: boolean;
      errorMessage?: string;
      successMessage?: string;
    };
  }>({});

  const handleStarClick = (itemKey: string, rating: number) => {
    setReviewForms(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { hoverRating: 0, title: '', comment: '' }),
        rating,
        errorMessage: undefined
      }
    }));
  };

  const handleStarHover = (itemKey: string, hoverRating: number) => {
    setReviewForms(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { rating: 5, title: '', comment: '' }),
        hoverRating
      }
    }));
  };

  const handleTitleChange = (itemKey: string, title: string) => {
    setReviewForms(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { rating: 5, hoverRating: 0, comment: '' }),
        title,
        errorMessage: undefined
      }
    }));
  };

  const handleCommentChange = (itemKey: string, comment: string) => {
    setReviewForms(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { rating: 5, hoverRating: 0, title: '' }),
        comment,
        errorMessage: undefined
      }
    }));
  };

  const handleSubmitReview = (
    order: CustomerOrder,
    _item: OrderItem,
    cleanName: string,
    itemKey: string,
    existingReviewId?: number
  ) => {
    const currentForm = reviewForms[itemKey] || {
      rating: 5,
      hoverRating: 0,
      title: '',
      comment: ''
    };

    const trimmedComment = (currentForm.comment || '').trim();
    if (!trimmedComment) {
      setReviewForms(prev => ({
        ...prev,
        [itemKey]: {
          ...currentForm,
          errorMessage: 'Please enter a short review description of your experience.'
        }
      }));
      return;
    }

    const rating = currentForm.rating || 5;
    const defaultTitles: Record<number, string> = {
      5: 'Exceptional Ayurvedic Quality',
      4: 'Noticeable Radiance & Glow',
      3: 'Pure & Gentle Botanical Care',
      2: 'Decent Formulation',
      1: 'Could Be Improved'
    };

    const newRev: Review = {
      id: existingReviewId || Date.now(),
      name: currentUser?.name || order.customerName || 'Verified Patron',
      rating,
      date: 'Today',
      title: currentForm.title.trim() || defaultTitles[rating] || 'Verified Experience',
      comment: trimmedComment,
      verified: true,
      location: order.city ? `${order.city}, India` : 'Verified Buyer',
      productName: cleanName,
      orderId: order.id
    };

    if (onAddReview) {
      onAddReview(newRev);
    }

    setReviewForms(prev => ({
      ...prev,
      [itemKey]: {
        ...currentForm,
        isEditing: false,
        errorMessage: undefined,
        successMessage: 'Your review has been successfully submitted and published!'
      }
    }));

    setTimeout(() => {
      setReviewForms(prev => {
        if (!prev[itemKey]) return prev;
        return {
          ...prev,
          [itemKey]: {
            ...prev[itemKey],
            successMessage: undefined
          }
        };
      });
    }, 4000);
  };

  // Normalize phone helper
  const cleanPhone = (p?: string) => (p || '').replace(/\D/g, '');

  // Find user's orders if logged in (by phone, email, or customerName)
  const userOrders = currentUser 
    ? orders.filter(o => {
        const orderPhoneClean = cleanPhone(o.phone);
        const userPhoneClean = cleanPhone(currentUser.phone);
        const phoneMatch = userPhoneClean.length >= 8 && orderPhoneClean.endsWith(userPhoneClean.slice(-10));
        const emailMatch = Boolean(o.email && currentUser.email && o.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
        const nameMatch = Boolean(o.customerName && currentUser.name && o.customerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim());
        return phoneMatch || emailMatch || nameMatch;
      })
    : [];

  // On mount or when initialOrderId is provided
  useEffect(() => {
    if (initialOrderId) {
      const match = orders.find(o => o.id.toUpperCase() === initialOrderId.toUpperCase().trim());
      if (match) {
        setExpandedOrderId(match.id);
        setActiveTab('my_orders');
      }
    } else if (userOrders.length > 0 && !expandedOrderId) {
      setExpandedOrderId(userOrders[0].id);
    }
  }, [initialOrderId, orders, currentUser]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchMessage('');

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchMessage('Please enter an Order ID or 10-digit Phone number.');
      setSearchedOrders(null);
      return;
    }

    const cleanQuery = cleanPhone(query);

    const matches = orders.filter(o => {
      const orderPhone = cleanPhone(o.phone);
      const matchPhone = cleanQuery.length >= 8 && orderPhone.includes(cleanQuery);
      const matchId = o.id.toLowerCase().includes(query);
      const matchEmail = Boolean(o.email && o.email.toLowerCase().includes(query));
      const matchName = Boolean(o.customerName && o.customerName.toLowerCase().includes(query));
      const matchTrack = Boolean(o.trackingNumber && o.trackingNumber.toLowerCase().includes(query));
      return matchId || matchPhone || matchEmail || matchName || matchTrack;
    });

    if (matches.length > 0) {
      setSearchedOrders(matches);
      setExpandedOrderId(matches[0].id);
      setSearchMessage('');
    } else {
      setSearchedOrders([]);
      setSearchMessage(`No order found matching "${searchQuery}". Please check your Order ID or registered Mobile number.`);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTrackingId(code);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  if (!isOpen) return null;

  // Active orders vs delivered
  const activeOrdersCount = userOrders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped').length;
  const deliveredOrdersCount = userOrders.filter(o => o.status === 'Delivered').length;

  const ordersToDisplay = activeTab === 'search' && searchedOrders !== null ? searchedOrders : userOrders;

  const capitalizedUserName = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : '';
  const userFirstName = capitalizedUserName ? capitalizedUserName.split(' ')[0] : '';

  return (
    <AnimatePresence>
      <div className="tracking-modal-overlay" onClick={onClose}>
        <motion.div 
          className="tracking-modal-dialog modal-profile-mode"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          {/* Top Header */}
          <div className="tracking-modal-header">
            <div className="header-branding">
              <div className="tracking-header-icon">
                <Package size={20} />
              </div>
              <div>
                <h3 className="tracking-title">
                  {currentUser ? `${userFirstName}'s Orders & Tracking` : 'Order Tracking & History'}
                </h3>
                <p className="tracking-subtitle">
                  {currentUser 
                    ? `Logged in as ${capitalizedUserName} • ${currentUser.phone || currentUser.email}`
                    : 'Check your order status, dispatch details, and doorstep delivery'}
                </p>
              </div>
            </div>
            <button className="tracking-close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {/* User Quick Stats Banner (If user logged in) */}
          {currentUser && (
            <div className="user-profile-stats-strip">
              <div className="stat-pill">
                <span className="stat-label">Total Orders:</span>
                <strong className="stat-number">{userOrders.length}</strong>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Active Shipments:</span>
                <strong className="stat-number text-gold">{activeOrdersCount}</strong>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Delivered:</span>
                <strong className="stat-number text-emerald">{deliveredOrdersCount}</strong>
              </div>
            </div>
          )}

          {/* Tabs: My Orders vs Search by Phone/ID */}
          <div className="tracking-tabs-bar">
            <button 
              className={`tracking-tab-btn ${activeTab === 'my_orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('my_orders')}
            >
              <Package size={15} />
              <span>My Orders ({userOrders.length})</span>
            </button>
            <button 
              className={`tracking-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={15} />
              <span>Search by Order ID / Mobile</span>
            </button>
          </div>

          <div className="tracking-modal-body">
            {/* Search Tab Form */}
            {activeTab === 'search' && (
              <div className="search-tab-wrapper">
                <form onSubmit={handleSearch} className="tracking-search-bar">
                  <div className="search-input-wrapper">
                    <Search size={18} className="tracking-search-icon" />
                    <input 
                      type="text" 
                      className="tracking-search-input"
                      placeholder="Enter 10-digit Phone (e.g. 9510461351) or Order ID (e.g. ORD-9152)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        className="clear-btn" 
                        onClick={() => { setSearchQuery(''); setSearchMessage(''); setSearchedOrders(null); }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button type="submit" className="tracking-search-submit">
                    Find Order
                  </button>
                </form>

                {searchMessage && (
                  <div className="tracking-error-banner margin-top-sm">
                    <AlertCircle size={16} />
                    <span>{searchMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Direct Orders Listing */}
            {ordersToDisplay.length > 0 ? (
              <div className="orders-cards-list">
                <div className="orders-list-header flex-between">
                  <span className="orders-count-text">
                    Showing {ordersToDisplay.length} order{ordersToDisplay.length > 1 ? 's' : ''}:
                  </span>
                  <span className="click-hint">Click on any order to view step-by-step progress</span>
                </div>

                {ordersToDisplay.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const stepIdx = getStepIndex(order.status);

                  return (
                    <div 
                      key={order.id} 
                      className={`order-full-card ${isExpanded ? 'expanded' : ''}`}
                    >
                      {/* Card Top Row */}
                      <div 
                        className="order-card-header"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        <div className="order-id-group">
                          <div className="order-id-title">
                            <span className="order-hash">#</span>
                            <strong className="order-id-text">{order.id}</strong>
                          </div>
                          <span className="order-date-sub">{order.date}</span>
                        </div>

                        <div className="order-status-badge-wrap">
                          <span className={`tracking-status-badge status-${order.status.toLowerCase()}`}>
                            <span className="status-dot" />
                            <span>
                              {order.status === 'Pending' && 'Order Placed'}
                              {order.status === 'Processing' && 'Accepted & Packing'}
                              {order.status === 'Shipped' && 'In Transit'}
                              {order.status === 'Delivered' && 'Delivered'}
                              {order.status === 'Cancelled' && 'Cancelled'}
                            </span>
                          </span>
                          <span className="order-total-price">₹{order.total.toLocaleString('en-IN')}</span>
                          <button className="expand-card-btn" aria-label="Toggle details">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Items Purchased Preview ("kya order the") */}
                      <div className="order-items-preview-strip">
                        <div className="items-tags-row">
                          <span className="items-label">Ordered:</span>
                          {order.items?.map((it, idx) => {
                            const cleanName = it.bundleName
                              .replace(/•\s*Free Shipping/gi, '')
                              .trim();
                            return (
                              <span key={idx} className="item-name-tag">
                                <span className="item-qty-badge">{it.quantity}×</span>
                                <span>{cleanName}</span>
                              </span>
                            );
                          })}
                        </div>
                        <div className="payment-pill-mini">
                          {order.paymentMethod} • {order.paymentStatus}
                        </div>
                      </div>

                      {/* Delivered Order Quick Review Banner */}
                      {order.status === 'Delivered' && (
                        <div className="delivered-quick-action-strip">
                          <div className="quick-action-info">
                            <CheckCircle2 size={15} className="text-emerald" />
                            <span>Successfully Delivered to Doorstep</span>
                          </div>
                          <button
                            type="button"
                            className="quick-review-pill-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedOrderId(order.id);
                            }}
                          >
                            <Star size={13} fill="#e5b95f" color="#e5b95f" />
                            <span>Rate & Review Delivered Items</span>
                          </button>
                        </div>
                      )}

                      {/* Courier & Tracking Quick Strip */}
                      {order.status !== 'Cancelled' && (
                        <div className="order-courier-mini-bar">
                          <div className="courier-carrier-info">
                            <Truck size={15} className="text-gold" />
                            <span>Carrier: <strong>{order.courier || 'Delhivery Express'}</strong></span>
                          </div>

                          {order.trackingNumber ? (
                            <div className="tracking-copy-row">
                              <span className="trk-label">Tracking ID:</span>
                              <code className="trk-code">{order.trackingNumber}</code>
                              <button 
                                className="copy-mini-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyTracking(order.trackingNumber!);
                                }}
                                title="Copy tracking code"
                              >
                                {copiedTrackingId === order.trackingNumber ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                                <span>{copiedTrackingId === order.trackingNumber ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          ) : (
                            <span className="trk-pending-text">Tracking code will be assigned upon dispatch.</span>
                          )}
                        </div>
                      )}

                      {/* Expanded Section: 4-Step Journey & Delivery Info */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            className="order-expanded-details"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Stepper */}
                            {order.status === 'Cancelled' ? (
                              <div className="cancelled-banner margin-top-md">
                                <AlertCircle size={20} />
                                <div>
                                  <strong>Order #{order.id} is Cancelled</strong>
                                  <p>
                                    {order.paymentStatus === 'Paid'
                                      ? 'A full refund has been initiated to your source account.'
                                      : 'No payment was deducted for this order.'}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="stepper-section margin-top-md">
                                <h4 className="stepper-title">Fulfillment Journey</h4>
                                <div className="stepper-track">
                                  {STEPS.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isCompleted = stepIdx > idx;
                                    const isCurrent = stepIdx === idx;
                                    const isUpcoming = stepIdx < idx;

                                    return (
                                      <div 
                                        key={step.status} 
                                        className={`stepper-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                                      >
                                        <div className="stepper-node-indicator">
                                          <div className="stepper-icon-wrap">
                                            <Icon size={16} />
                                          </div>
                                          {idx < STEPS.length - 1 && (
                                            <div className={`stepper-connector ${isCompleted ? 'active' : ''}`} />
                                          )}
                                        </div>
                                        <div className="stepper-node-content">
                                          <div className="stepper-node-header">
                                            <span className="stepper-node-name">{step.label}</span>
                                            {isCurrent && <span className="current-pulse-badge">In Progress</span>}
                                            {isCompleted && <span className="completed-check-tag">Completed</span>}
                                          </div>
                                          <p className="stepper-node-desc">
                                            {isCurrent && step.status === 'Pending' && 'Order received. Apothecary team is reviewing and will accept order shortly.'}
                                            {isCurrent && step.status === 'Processing' && 'Order accepted! Formulations are being hand-blended and packed with luxury seal.'}
                                            {isCurrent && step.status === 'Shipped' && `In transit via ${order.courier || 'Express Logistics'}. Expected delivery within 2-3 business days.`}
                                            {isCurrent && step.status === 'Delivered' && 'Order safely delivered to your doorstep.'}
                                            {!isCurrent && step.desc}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Delivered Products & Reviews Section ("after order successfull deliver ho jaye to ak review section open hona chahiye usi product k niche jo order kiye the my orders me") */}
                            {order.status === 'Delivered' && (
                              <div className="delivered-reviews-container margin-top-md">
                                <div className="delivered-reviews-header">
                                  <div className="header-eyebrow-row">
                                    <Sparkles size={14} className="text-gold" />
                                    <span className="eyebrow-text">Delivered Items • Customer Reviews</span>
                                  </div>
                                  <h4 className="delivered-reviews-heading">Rate & Review Your Formulations</h4>
                                  <p className="delivered-reviews-subtext">
                                    Share your experience with stars & feedback directly below each ordered formulation.
                                  </p>
                                </div>

                                <div className="delivered-products-list">
                                  {order.items?.map((it, idx) => {
                                    const cleanName = it.bundleName.replace(/•\s*Free Shipping/gi, '').trim();
                                    const itemKey = `${order.id}_${idx}`;
                                    const existingReview = (reviews || []).find(r => 
                                      (r.orderId === order.id && (r.productName?.toLowerCase().trim() === cleanName.toLowerCase().trim() || !r.productName))
                                    );
                                    const formState = reviewForms[itemKey] || {
                                      rating: existingReview ? existingReview.rating : 5,
                                      hoverRating: 0,
                                      title: existingReview ? existingReview.title : '',
                                      comment: existingReview ? existingReview.comment : '',
                                      isEditing: false
                                    };
                                    const isEditingOrNew = !existingReview || formState.isEditing;

                                    return (
                                      <div key={idx} className="delivered-product-review-card">
                                        {/* Product Details Header */}
                                        <div className="delivered-item-header">
                                          <div className="delivered-item-info">
                                            <span className="delivered-qty-tag">{it.quantity}×</span>
                                            <div>
                                              <h5 className="delivered-product-name">{cleanName}</h5>
                                              <span className="delivered-product-sub">
                                                {it.size ? `${it.size} • ` : ''}₹{it.unitPrice.toLocaleString('en-IN')}
                                              </span>
                                            </div>
                                          </div>
                                          <span className="delivered-pill-check">
                                            <CheckCircle2 size={13} className="text-emerald" />
                                            <span>Delivered</span>
                                          </span>
                                        </div>

                                        {/* Review Area Under Ordered Product */}
                                        <div className="product-review-container">
                                          {!isEditingOrNew && existingReview ? (
                                            /* Already Reviewed Card */
                                            <div className="submitted-review-box">
                                              <div className="submitted-review-header">
                                                <div className="submitted-stars-row">
                                                  {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                      key={s}
                                                      size={16}
                                                      fill={s <= existingReview.rating ? "#e5b95f" : "none"}
                                                      color={s <= existingReview.rating ? "#e5b95f" : "#d1d5db"}
                                                    />
                                                  ))}
                                                  <strong className="submitted-score">{existingReview.rating}.0 / 5</strong>
                                                </div>

                                                <div className="review-meta-group">
                                                  <span className="verified-badge-pill">
                                                    <ShieldCheck size={12} className="text-emerald" />
                                                    <span>Verified Customer</span>
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="edit-review-btn"
                                                    onClick={() => {
                                                      setReviewForms(prev => ({
                                                        ...prev,
                                                        [itemKey]: {
                                                          rating: existingReview.rating,
                                                          hoverRating: 0,
                                                          title: existingReview.title,
                                                          comment: existingReview.comment,
                                                          isEditing: true
                                                        }
                                                      }));
                                                    }}
                                                  >
                                                    <Edit3 size={13} />
                                                    <span>Edit Review</span>
                                                  </button>
                                                </div>
                                              </div>

                                              <h6 className="submitted-review-title">{existingReview.title}</h6>
                                              <p className="submitted-review-comment">"{existingReview.comment}"</p>
                                              <div className="submitted-review-footer">
                                                <span>Submitted on {existingReview.date} • {existingReview.location}</span>
                                              </div>
                                            </div>
                                          ) : (
                                            /* Review Form (Stars + Short Description) */
                                            <div className="active-review-form">
                                              <div className="form-prompt-row">
                                                <Star size={15} fill="#e5b95f" color="#e5b95f" />
                                                <span className="prompt-label">Rate this formulation & leave feedback:</span>
                                              </div>

                                              {/* 1 to 5 Stars Picker */}
                                              <div className="stars-picker-container">
                                                <div 
                                                  className="stars-buttons-row"
                                                  onMouseLeave={() => handleStarHover(itemKey, 0)}
                                                >
                                                  {[1, 2, 3, 4, 5].map((starNum) => {
                                                    const currentScore = formState.hoverRating || formState.rating || 5;
                                                    const isFilled = starNum <= currentScore;
                                                    return (
                                                      <button
                                                        key={starNum}
                                                        type="button"
                                                        className="star-picker-btn"
                                                        onMouseEnter={() => handleStarHover(itemKey, starNum)}
                                                        onClick={() => handleStarClick(itemKey, starNum)}
                                                        aria-label={`Rate ${starNum} stars`}
                                                      >
                                                        <Star
                                                          size={25}
                                                          fill={isFilled ? "#e5b95f" : "none"}
                                                          color={isFilled ? "#e5b95f" : "#c4c4c4"}
                                                          className="star-svg"
                                                        />
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                                <span className="rating-desc-badge">
                                                  {RATING_DESCRIPTIONS[formState.hoverRating || formState.rating || 5]}
                                                </span>
                                              </div>

                                              {/* Short Review Headline */}
                                              <div className="review-input-group">
                                                <label className="input-tiny-label">Review Headline</label>
                                                <input
                                                  type="text"
                                                  className="review-input-field"
                                                  placeholder="e.g. Glowing skin in a week! Loved the scent & texture"
                                                  value={formState.title}
                                                  onChange={(e) => handleTitleChange(itemKey, e.target.value)}
                                                  maxLength={90}
                                                />
                                              </div>

                                              {/* Short Description */}
                                              <div className="review-input-group">
                                                <label className="input-tiny-label">Short Description / Experience *</label>
                                                <textarea
                                                  rows={3}
                                                  className="review-textarea-field"
                                                  placeholder="Write your short review about the formulation, scent, absorption, and results..."
                                                  value={formState.comment}
                                                  onChange={(e) => handleCommentChange(itemKey, e.target.value)}
                                                  maxLength={500}
                                                />
                                                <div className="textarea-footer-hint">
                                                  <span>{(formState.comment || '').length}/500 characters</span>
                                                </div>
                                              </div>

                                              {formState.errorMessage && (
                                                <div className="review-alert-msg error">
                                                  <AlertCircle size={14} />
                                                  <span>{formState.errorMessage}</span>
                                                </div>
                                              )}

                                              {formState.successMessage && (
                                                <div className="review-alert-msg success">
                                                  <CheckCircle2 size={14} />
                                                  <span>{formState.successMessage}</span>
                                                </div>
                                              )}

                                              {/* Action Buttons */}
                                              <div className="review-form-actions">
                                                <button
                                                  type="button"
                                                  className="btn-submit-review"
                                                  onClick={() => handleSubmitReview(order, it, cleanName, itemKey, existingReview?.id)}
                                                >
                                                  <Check size={15} />
                                                  <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
                                                </button>

                                                {existingReview && (
                                                  <button
                                                    type="button"
                                                    className="btn-cancel-review"
                                                    onClick={() => {
                                                      setReviewForms(prev => ({
                                                        ...prev,
                                                        [itemKey]: {
                                                          ...formState,
                                                          isEditing: false,
                                                          errorMessage: undefined
                                                        }
                                                      }));
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Destination & Summary Split */}
                            <div className="order-details-split margin-top-md">
                              <div className="order-info-card">
                                <h5 className="info-card-title"><MapPin size={15} /> Delivery Destination</h5>
                                <p className="recipient-name"><strong>{order.customerName}</strong></p>
                                <p className="recipient-address">{order.address}</p>
                                <p className="recipient-city">{order.city} - {order.pincode}</p>
                                <p className="recipient-phone">Phone: {order.phone}</p>
                              </div>

                              <div className="order-info-card">
                                <h5 className="info-card-title"><ShoppingBag size={15} /> Price Breakdown</h5>
                                <div className="subtotal-line">
                                  <span>Subtotal ({order.items?.length || 0} items)</span>
                                  <span>₹{order.subtotal?.toLocaleString('en-IN') || order.total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="subtotal-line">
                                  <span>Express Shipping</span>
                                  <span className="text-emerald weight-600">FREE</span>
                                </div>
                                <div className="subtotal-line total-highlight">
                                  <span>Grand Total:</span>
                                  <strong className="text-gold font-mono">₹{order.total.toLocaleString('en-IN')}</strong>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state if user has no orders yet */
              <div className="empty-tracking-state">
                <ShoppingBag size={52} className="empty-state-icon" />
                <h4>No Orders Placed Yet</h4>
                <p>
                  {currentUser 
                    ? `Hello ${currentUser.name}! You haven't placed any orders with this account yet (${currentUser.phone || currentUser.email}).`
                    : 'No orders found. Once you place an order, its complete dispatch status and items will be displayed here.'}
                </p>
                <button 
                  className="btn-primary margin-top-md"
                  onClick={() => {
                    onClose();
                    if (onOpenStore) onOpenStore();
                    const el = document.querySelector('#collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Earthora Collection</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            <div className="tracking-support-note margin-top-md">
              <ShieldCheck size={16} className="text-gold" />
              <span>For delivery updates or modifications, contact Earthora concierge at <strong>support@earthora.com</strong></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
