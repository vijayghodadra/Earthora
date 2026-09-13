import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, ShieldCheck } from 'lucide-react';
import type { CustomerOrder, OrderStatus } from '../../types/adminTypes';

interface AdminOrdersProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [trackingCode, setTrackingCode] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.razorpayPaymentId && order.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setTrackingCode(order.trackingNumber || `ETH-TRK-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSaveTracking = () => {
    if (selectedOrder) {
      onUpdateOrderStatus(selectedOrder.id, selectedOrder.status, trackingCode);
      setSelectedOrder({ ...selectedOrder, trackingNumber: trackingCode });
    }
  };

  return (
    <div className="admin-orders-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Orders & Payment Details</h2>
          <p className="admin-view-subtitle">Track customer purchases, Razorpay transaction IDs, and fulfillment status</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card margin-bottom-lg">
        <div className="filter-bar-row">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="admin-input search-input"
              placeholder="Search Order ID, Client Name, Razorpay Payment ID, City..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}><X size={14} /></button>
            )}
          </div>

          <div className="status-filter-pills">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button 
                key={st}
                className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Client Name</th>
                <th>Purchased Items</th>
                <th>Total Paid</th>
                <th>Payment Mode</th>
                <th>Razorpay / Transaction Ref</th>
                <th>Fulfillment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    No orders matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="user-cell">
                        <span className="font-mono text-gold weight-600">{order.id}</span>
                        <span className="user-sub">{order.date}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-cell">
                        <span className="user-name">{order.customerName}</span>
                        <span className="user-sub">{order.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-items-list">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="item-row font-sm">
                            <span className="weight-600 text-gold">{it.quantity}x</span> {it.bundleName}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono weight-600">₹{order.total.toLocaleString('en-IN')}</span>
                    </td>
                    <td>
                      <span className={`payment-pill ${order.paymentMethod.toLowerCase()}`}>
                        {order.paymentMethod === 'Razorpay' ? 'Razorpay Gateway' : order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      {order.razorpayPaymentId ? (
                        <div className="user-cell font-mono">
                          <span className="text-emerald weight-600 font-sm">{order.razorpayPaymentId}</span>
                          <span className="user-sub text-emerald">Verified Paid</span>
                        </div>
                      ) : (
                        <span className="user-sub">{order.paymentStatus}</span>
                      )}
                    </td>
                    <td>
                      <select
                        className={`admin-select-sm status-select status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="admin-btn-secondary btn-icon-only" onClick={() => handleOpenModal(order)}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
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
                  <h3>Order Specification & Payment Details</h3>
                  <span className="font-mono text-gold">{selectedOrder.id} • {selectedOrder.date}</span>
                </div>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
              </div>

              <div className="admin-modal-body grid-2 gap-lg">
                <div className="order-detail-card">
                  <h4 className="detail-card-title">Customer Information</h4>
                  <div className="detail-row">
                    <span className="label">Full Name:</span>
                    <span className="value weight-600">{selectedOrder.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedOrder.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedOrder.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Address:</span>
                    <span className="value">{selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}</span>
                  </div>
                </div>

                <div className="order-detail-card">
                  <h4 className="detail-card-title">Payment & Gateway Details</h4>
                  <div className="detail-row">
                    <span className="label">Payment Option:</span>
                    <span className={`payment-pill ${selectedOrder.paymentMethod.toLowerCase()}`}>
                      {selectedOrder.paymentMethod === 'Razorpay' ? 'Razorpay Secure' : selectedOrder.paymentMethod}
                    </span>
                  </div>
                  {selectedOrder.razorpayPaymentId && (
                    <>
                      <div className="detail-row">
                        <span className="label">Razorpay Ref ID:</span>
                        <span className="value font-mono text-emerald weight-600">{selectedOrder.razorpayPaymentId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Payment Status:</span>
                        <span className="status-badge status-delivered"><ShieldCheck size={12} /> {selectedOrder.paymentStatus}</span>
                      </div>
                    </>
                  )}
                  <div className="form-group margin-top-md">
                    <label>Tracking Reference Code</label>
                    <div className="flex-gap-sm">
                      <input 
                        type="text" 
                        className="admin-input font-mono"
                        value={trackingCode}
                        onChange={e => setTrackingCode(e.target.value)}
                      />
                      <button className="admin-btn-secondary" onClick={handleSaveTracking}>Update Code</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
