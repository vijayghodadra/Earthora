import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, CheckCircle2, Truck, Check, PackageCheck } from 'lucide-react';
import type { CustomerOrder, OrderStatus } from '../../types/adminTypes';

interface AdminOrdersProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  
  // Tracking edit state for order detail modal
  const [trackingCode, setTrackingCode] = useState('');
  const [courierName, setCourierName] = useState('Delhivery Express');

  // Quick Dispatch / Ship Modal state
  const [shippingOrder, setShippingOrder] = useState<CustomerOrder | null>(null);
  const [shipCourier, setShipCourier] = useState('Delhivery Express');
  const [shipTrackingCode, setShipTrackingCode] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.razorpayPaymentId && order.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phone && order.phone.includes(searchTerm));

    const matchesStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setTrackingCode(order.trackingNumber || `ETH-TRK-${Math.floor(100000 + Math.random() * 900000)}`);
    setCourierName(order.courier || 'Delhivery Express');
  };

  const handleSaveTracking = () => {
    if (selectedOrder) {
      onUpdateOrderStatus(selectedOrder.id, selectedOrder.status, trackingCode, courierName);
      setSelectedOrder({ ...selectedOrder, trackingNumber: trackingCode, courier: courierName });
    }
  };

  // Quick action: Accept order (Pending -> Processing)
  const handleAcceptOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Processing');
  };

  // Quick action: Open Ship modal (Processing -> Shipped)
  const handleOpenShipModal = (order: CustomerOrder) => {
    setShippingOrder(order);
    setShipCourier(order.courier || 'Delhivery Express');
    setShipTrackingCode(order.trackingNumber || `ETH-TRK-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Confirm shipping
  const handleConfirmShip = () => {
    if (!shippingOrder) return;
    onUpdateOrderStatus(shippingOrder.id, 'Shipped', shipTrackingCode, shipCourier);
    setShippingOrder(null);
  };

  // Quick action: Mark delivered (Shipped -> Delivered)
  const handleMarkDelivered = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Delivered');
  };

  // Quick action: Cancel order
  const handleCancelOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      onUpdateOrderStatus(orderId, 'Cancelled');
    }
  };

  return (
    <div className="admin-orders-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Order Lifecycle & Fulfillment</h2>
          <p className="admin-view-subtitle">Accept storefront orders, dispatch with courier tracking, and confirm doorstep deliveries</p>
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
              placeholder="Search Order ID, Client Name, Phone, Razorpay Payment ID..."
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
                <th>Client Details</th>
                <th>Purchased Items</th>
                <th>Total Paid</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Lifecycle Action</th>
                <th>View</th>
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
                        <span className="user-sub">{order.city || 'India'} • {order.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-items-list">
                        {order.items?.map((it, idx) => (
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
                      <span className={`payment-pill ${order.paymentMethod ? order.paymentMethod.toLowerCase() : 'cod'}`}>
                        {order.paymentMethod === 'Razorpay' ? 'Razorpay Secure' : order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <div className="flex-col-sm">
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status === 'Pending' && 'Pending Acceptance'}
                          {order.status === 'Processing' && 'Accepted & Packing'}
                          {order.status === 'Shipped' && 'Shipped / In Transit'}
                          {order.status === 'Delivered' && 'Delivered'}
                          {order.status === 'Cancelled' && 'Cancelled'}
                        </span>
                        {order.trackingNumber && order.status === 'Shipped' && (
                          <span className="font-mono text-xs text-muted">Trk: {order.trackingNumber.slice(0, 14)}...</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="lifecycle-actions-group">
                        {/* 1. Pending -> Accept Order */}
                        {order.status === 'Pending' && (
                          <div className="flex-gap-xs">
                            <button 
                              className="order-btn-accept" 
                              onClick={() => handleAcceptOrder(order.id)}
                              title="Accept Order & Start Preparation"
                            >
                              <CheckCircle2 size={13} />
                              <span>Accept Order</span>
                            </button>
                            <button 
                              className="order-btn-cancel-sm" 
                              onClick={() => handleCancelOrder(order.id)}
                              title="Cancel Order"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {/* 2. Processing -> Ship Order */}
                        {order.status === 'Processing' && (
                          <button 
                            className="order-btn-ship" 
                            onClick={() => handleOpenShipModal(order)}
                            title="Assign Tracking & Ship"
                          >
                            <Truck size={13} />
                            <span>Ship Order</span>
                          </button>
                        )}

                        {/* 3. Shipped -> Deliver Order */}
                        {order.status === 'Shipped' && (
                          <button 
                            className="order-btn-deliver" 
                            onClick={() => handleMarkDelivered(order.id)}
                            title="Confirm Customer Delivery"
                          >
                            <PackageCheck size={13} />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        {/* 4. Delivered */}
                        {order.status === 'Delivered' && (
                          <span className="lifecycle-complete-tag">
                            <Check size={13} /> Completed
                          </span>
                        )}

                        {/* 5. Cancelled */}
                        {order.status === 'Cancelled' && (
                          <span className="lifecycle-cancelled-tag">
                            Cancelled
                          </span>
                        )}

                        {/* Dropdown Override */}
                        <select
                          className={`admin-select-sm status-select status-${order.status.toLowerCase()} margin-top-xs`}
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
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

      {/* Quick Dispatch / Ship Modal Dialog */}
      <AnimatePresence>
        {shippingOrder && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="admin-modal-header">
                <div>
                  <h3>Dispatch & Ship Order</h3>
                  <span className="font-mono text-gold">{shippingOrder.id} • {shippingOrder.customerName}</span>
                </div>
                <button className="close-btn" onClick={() => setShippingOrder(null)}><X size={20} /></button>
              </div>

              <div className="admin-modal-body">
                <div className="form-group margin-bottom-md">
                  <label>Courier Shipping Partner</label>
                  <select 
                    className="admin-input"
                    value={shipCourier}
                    onChange={e => setShipCourier(e.target.value)}
                  >
                    <option value="Delhivery Express">Delhivery Express</option>
                    <option value="BlueDart Logistics">BlueDart Logistics</option>
                    <option value="DTDC Air Express">DTDC Air Express</option>
                    <option value="Shiprocket Direct">Shiprocket Direct</option>
                    <option value="India Post Speed">India Post Speed</option>
                  </select>
                </div>

                <div className="form-group margin-bottom-md">
                  <label>Consignment / Tracking Number</label>
                  <input 
                    type="text" 
                    className="admin-input font-mono"
                    value={shipTrackingCode}
                    onChange={e => setShipTrackingCode(e.target.value)}
                    placeholder="e.g. ETH-TRK-748921"
                  />
                  <span className="user-sub margin-top-xs">
                    This tracking number will be immediately visible to the customer on their live tracking dashboard.
                  </span>
                </div>

                <div className="delivery-destination-preview">
                  <strong>Delivery To:</strong> {shippingOrder.address}, {shippingOrder.city} - {shippingOrder.pincode}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setShippingOrder(null)}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleConfirmShip}>
                  <Truck size={15} /> Confirm & Dispatch Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="admin-modal-overlay">
            <motion.div 
              className="admin-modal modal-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="admin-modal-header">
                <div>
                  <h3>Order Specification & Logistics</h3>
                  <span className="font-mono text-gold">{selectedOrder.id} • Placed {selectedOrder.date}</span>
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

                  <h4 className="detail-card-title margin-top-lg">Purchased Products</h4>
                  <div className="modal-items-list">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="modal-item-line">
                        <span><strong>{it.quantity}x</strong> {it.bundleName} ({it.size})</span>
                        <span className="font-mono">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="modal-total-line margin-top-xs">
                      <span>Total Amount:</span>
                      <strong className="text-gold font-mono">₹{selectedOrder.total.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                <div className="order-detail-card">
                  <h4 className="detail-card-title">Lifecycle & Logistics Management</h4>
                  
                  <div className="detail-row">
                    <span className="label">Current Status:</span>
                    <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="lifecycle-modal-actions margin-top-sm margin-bottom-md">
                    {selectedOrder.status === 'Pending' && (
                      <button 
                        className="order-btn-accept full-width py-2"
                        onClick={() => {
                          handleAcceptOrder(selectedOrder.id);
                          setSelectedOrder({ ...selectedOrder, status: 'Processing' });
                        }}
                      >
                        <CheckCircle2 size={16} /> Accept Order (Mark Processing)
                      </button>
                    )}
                    {selectedOrder.status === 'Processing' && (
                      <button 
                        className="order-btn-ship full-width py-2"
                        onClick={() => {
                          const ord = selectedOrder;
                          setSelectedOrder(null);
                          handleOpenShipModal(ord);
                        }}
                      >
                        <Truck size={16} /> Dispatch / Ship Order
                      </button>
                    )}
                    {selectedOrder.status === 'Shipped' && (
                      <button 
                        className="order-btn-deliver full-width py-2"
                        onClick={() => {
                          handleMarkDelivered(selectedOrder.id);
                          setSelectedOrder({ ...selectedOrder, status: 'Delivered' });
                        }}
                      >
                        <PackageCheck size={16} /> Confirm Customer Delivery
                      </button>
                    )}
                  </div>

                  <div className="detail-row">
                    <span className="label">Payment Mode:</span>
                    <span className={`payment-pill ${selectedOrder.paymentMethod ? selectedOrder.paymentMethod.toLowerCase() : 'cod'}`}>
                      {selectedOrder.paymentMethod === 'Razorpay' ? 'Razorpay Secure' : selectedOrder.paymentMethod}
                    </span>
                  </div>
                  {selectedOrder.razorpayPaymentId && (
                    <div className="detail-row">
                      <span className="label">Razorpay Ref:</span>
                      <span className="value font-mono text-emerald weight-600">{selectedOrder.razorpayPaymentId}</span>
                    </div>
                  )}

                  <div className="form-group margin-top-md">
                    <label>Shipping Carrier</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      value={courierName}
                      onChange={e => setCourierName(e.target.value)}
                    />
                  </div>

                  <div className="form-group margin-top-sm">
                    <label>Tracking Reference Code</label>
                    <div className="flex-gap-sm">
                      <input 
                        type="text" 
                        className="admin-input font-mono"
                        value={trackingCode}
                        onChange={e => setTrackingCode(e.target.value)}
                      />
                      <button className="admin-btn-secondary" onClick={handleSaveTracking}>Save</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
