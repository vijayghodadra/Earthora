import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  RefreshCw
} from 'lucide-react';
import type { CustomerOrder, CustomerProfile } from '../../types/adminTypes';
import type { ProductBundle } from '../../data/productData';

interface AdminDashboardProps {
  orders: CustomerOrder[];
  products: ProductBundle[];
  customers: CustomerProfile[];
  onNavigateTab: (tab: string) => void;
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  customers,
  onNavigateTab,
  onUpdateOrderStatus
}) => {
  // 100% Accurate Real-Time Store Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  // Calculate unique real customers from active orders or customer profiles
  const uniqueCustomerEmails = new Set(
    orders.map(o => (o.email || o.phone || '').toLowerCase().trim()).filter(Boolean)
  );
  const activeClientsCount = uniqueCustomerEmails.size > 0 ? uniqueCustomerEmails.size : customers.length;

  // Real Average Order Value (AOV)
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  return (
    <div className="admin-dashboard-view">
      {/* Header Banner */}
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Executive Dashboard</h2>
          <p className="admin-view-subtitle">Real-time performance metrics and store management overview</p>
        </div>
        <div className="admin-view-actions">
          <button className="admin-btn-secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button className="admin-btn-primary" onClick={() => onNavigateTab('products')}>
            <Plus size={14} /> Manage Products
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - 100% Pure Accurate Metrics */}
      <div className="kpi-grid">
        {/* Total Gross Revenue */}
        <motion.div 
          className="kpi-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="kpi-icon-wrap gold">
            <DollarSign size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Gross Revenue</span>
            <div className="kpi-value-row">
              <span className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
              <span className="kpi-badge badge-up">Live</span>
            </div>
            <span className="kpi-subtext">
              {totalOrdersCount > 0 
                ? `From ${totalOrdersCount} completed checkout${totalOrdersCount > 1 ? 's' : ''}` 
                : 'No revenue recorded yet'}
            </span>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div 
          className="kpi-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="kpi-icon-wrap emerald">
            <ShoppingBag size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Fulfillment Orders</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalOrdersCount}</span>
              <span className="kpi-badge badge-up">
                {deliveredOrders.length} Delivered
              </span>
            </div>
            <span className="kpi-subtext">
              {pendingOrders.length > 0 
                ? `${pendingOrders.length} pending processing` 
                : '0 pending processing'}
            </span>
          </div>
        </motion.div>

        {/* Active Clientele */}
        <motion.div 
          className="kpi-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="kpi-icon-wrap blue">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Clientele</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{activeClientsCount}</span>
              <span className="kpi-badge badge-up">Verified</span>
            </div>
            <span className="kpi-subtext">
              {activeClientsCount > 0 
                ? `${activeClientsCount} unique customer profile${activeClientsCount > 1 ? 's' : ''}` 
                : 'No customer accounts yet'}
            </span>
          </div>
        </motion.div>

        {/* Average Order Value (AOV) */}
        <motion.div 
          className="kpi-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="kpi-icon-wrap purple">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Average Order Value (AOV)</span>
            <div className="kpi-value-row">
              <span className="kpi-value">₹{averageOrderValue.toLocaleString('en-IN')}</span>
              <span className="kpi-badge badge-up">Per Order</span>
            </div>
            <span className="kpi-subtext">
              {totalOrdersCount > 0 
                ? `Calculated across ${totalOrdersCount} orders` 
                : 'Calculates after first order'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="admin-card margin-top-lg">
        <div className="admin-card-header flex-between">
          <div>
            <h3 className="admin-card-title">Recent Storefront Orders</h3>
            <p className="admin-card-desc">Live customer purchases placed via Earthora checkout</p>
          </div>
          <button className="admin-btn-text" onClick={() => onNavigateTab('orders')}>
            View All Orders ({orders.length}) →
          </button>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Purchased Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                      <ShoppingBag size={34} style={{ color: 'var(--accent-olive)', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                        No storefront orders placed yet
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '440px' }}>
                        Customer orders placed through the website will appear here in real-time with accurate payment and shipping details.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-gold weight-600">{order.id}</td>
                    <td>
                      <div className="user-cell">
                        <span className="user-name">{order.customerName}</span>
                        <span className="user-sub">{order.city || 'India'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="table-item-desc">
                        {order.items?.map(i => `${i.quantity}x ${i.bundleName}`).join(', ') || 'Item'}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-pill ${order.paymentMethod ? order.paymentMethod.toLowerCase() : 'cod'}`}>
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>
                    <td className="font-mono weight-600">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'processing'}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td>
                      <div className="flex-col-sm">
                        {order.status === 'Pending' && (
                          <button 
                            className="order-btn-accept"
                            onClick={() => onUpdateOrderStatus(order.id, 'Processing')}
                            title="Accept Order"
                          >
                            ✓ Accept
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button 
                            className="order-btn-ship"
                            onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                            title="Dispatch Order"
                          >
                            🚚 Ship
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button 
                            className="order-btn-deliver"
                            onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                            title="Mark as Delivered"
                          >
                            ✓ Deliver
                          </button>
                        )}
                        <select
                          className="admin-select-sm margin-top-xs"
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as CustomerOrder['status'])}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
