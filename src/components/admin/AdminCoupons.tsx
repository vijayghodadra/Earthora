import React, { useState } from 'react';
import { Tag, Plus, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react';
import type { CouponCode } from '../../types/adminTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminCouponsProps {
  coupons: CouponCode[];
  onUpdateCoupons: (coupons: CouponCode[]) => void;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({ coupons, onUpdateCoupons }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<CouponCode>>({
    code: 'FESTIVE25',
    discountPercentage: 25,
    minOrderAmount: 3000,
    expiryDate: '2026-12-31',
    maxUsage: 300,
    active: true
  });

  const handleToggleActive = (id: string) => {
    onUpdateCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm("Remove coupon code?")) {
      onUpdateCoupons(coupons.filter(c => c.id !== id));
    }
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.discountPercentage) {
      alert("Code and discount percentage are required.");
      return;
    }

    const created: CouponCode = {
      id: `COUP-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountPercentage: Number(newCoupon.discountPercentage),
      minOrderAmount: Number(newCoupon.minOrderAmount || 0),
      expiryDate: newCoupon.expiryDate || '2026-12-31',
      usageCount: 0,
      maxUsage: Number(newCoupon.maxUsage || 1000),
      active: true
    };

    onUpdateCoupons([created, ...coupons]);
    setIsAdding(false);
  };

  return (
    <div className="admin-coupons-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Discount Coupons & Offers</h2>
          <p className="admin-view-subtitle">Generate promo vouchers, set minimum order conditions, and limit usage caps</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Create Coupon Code
        </button>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="admin-modal-header">
                <h3>Generate Promotional Coupon</h3>
                <button className="close-btn" onClick={() => setIsAdding(false)}><X size={20} /></button>
              </div>
              <div className="admin-modal-body grid-2">
                <div className="form-group">
                  <label>Coupon Code (e.g. FESTIVE25)</label>
                  <input 
                    type="text" 
                    className="admin-input uppercase font-mono" 
                    value={newCoupon.code} 
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newCoupon.discountPercentage} 
                    onChange={e => setNewCoupon({...newCoupon, discountPercentage: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Min Order Amount (₹)</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newCoupon.minOrderAmount} 
                    onChange={e => setNewCoupon({...newCoupon, minOrderAmount: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Redemption Usage</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newCoupon.maxUsage} 
                    onChange={e => setNewCoupon({...newCoupon, maxUsage: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    className="admin-input" 
                    value={newCoupon.expiryDate} 
                    onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleCreateCoupon}>Save Coupon</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Min Spend</th>
                <th>Redemptions</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td>
                    <span className="font-mono text-gold weight-700 coupon-tag-badge">
                      <Tag size={12} /> {coupon.code}
                    </span>
                  </td>
                  <td className="weight-600 text-emerald font-mono">{coupon.discountPercentage}% OFF</td>
                  <td>₹{coupon.minOrderAmount.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="font-mono font-sm">{coupon.usageCount} / {coupon.maxUsage}</span>
                  </td>
                  <td>{coupon.expiryDate}</td>
                  <td>
                    <button className="btn-unstyled" onClick={() => handleToggleActive(coupon.id)}>
                      {coupon.active ? (
                        <span className="status-badge status-delivered"><ToggleRight size={14} /> Active</span>
                      ) : (
                        <span className="status-badge status-cancelled"><ToggleLeft size={14} /> Inactive</span>
                      )}
                    </button>
                  </td>
                  <td>
                    <button className="admin-btn-danger btn-sm" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
