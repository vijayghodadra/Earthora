import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
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
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0) + 895000;
  const totalOrdersCount = orders.length + 250;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');

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

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
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
              <span className="kpi-badge badge-up"><ArrowUpRight size={12} /> +18.4%</span>
            </div>
            <span className="kpi-subtext">vs. ₹755,000 previous month</span>
          </div>
        </motion.div>

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
              <span className="kpi-badge badge-up"><ArrowUpRight size={12} /> +12.1%</span>
            </div>
            <span className="kpi-subtext">{pendingOrders.length} pending processing</span>
          </div>
        </motion.div>

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
              <span className="kpi-value">{customers.length + 1240}</span>
              <span className="kpi-badge badge-up"><ArrowUpRight size={12} /> +24.8%</span>
            </div>
            <span className="kpi-subtext">32% VIP repeat buyers</span>
          </div>
        </motion.div>

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
            <span className="kpi-label">Conversion Rate</span>
            <div className="kpi-value-row">
              <span className="kpi-value">4.82%</span>
              <span className="kpi-badge badge-up"><ArrowUpRight size={12} /> +0.9%</span>
            </div>
            <span className="kpi-subtext">Industry avg: 2.1%</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Overview Table */}

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
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-gold weight-600">{order.id}</td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">{order.customerName}</span>
                      <span className="user-sub">{order.city}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-item-desc">
                      {order.items.map(i => `${i.quantity}x ${i.bundleName}`).join(', ')}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-pill ${order.paymentMethod.toLowerCase()}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="font-mono weight-600">₹{order.total.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-select-sm"
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as CustomerOrder['status'])}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
