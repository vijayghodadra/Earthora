import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, MapPin } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const paymentBreakdown = [
    { mode: 'UPI Express', percentage: 58, color: '#D4AF37' },
    { mode: 'Credit / Debit Cards', percentage: 28, color: '#3B82F6' },
    { mode: 'Cash on Delivery (COD)', percentage: 14, color: '#10B981' },
  ];

  const regionalBreakdown = [
    { city: 'Mumbai & MMR', sales: '₹420,000', share: '28%' },
    { city: 'Delhi NCR', sales: '₹345,000', share: '23%' },
    { city: 'Bengaluru', sales: '₹280,000', share: '19%' },
    { city: 'Hyderabad', sales: '₹195,000', share: '13%' },
    { city: 'Others', sales: '₹255,000', share: '17%' },
  ];

  return (
    <div className="admin-analytics-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Analytics & Intelligence</h2>
          <p className="admin-view-subtitle">In-depth insights on customer acquisition, regional sales, and revenue distribution</p>
        </div>
      </div>

      <div className="admin-two-col-grid">
        {/* Payment Channels Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title flex-center gap-xs">
              <PieChart size={18} className="text-gold" /> Payment Method Distribution
            </h3>
          </div>
          <div className="analytics-payment-list margin-top-md">
            {paymentBreakdown.map((item) => (
              <div key={item.mode} className="payment-progress-row">
                <div className="flex-between font-sm margin-bottom-xs">
                  <span className="weight-600">{item.mode}</span>
                  <span className="font-mono text-gold weight-700">{item.percentage}%</span>
                </div>
                <div className="progress-bar-track">
                  <motion.div 
                    className="progress-bar-fill"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title flex-center gap-xs">
              <MapPin size={18} className="text-gold" /> Top Metropolitan Markets
            </h3>
          </div>
          <div className="table-responsive margin-top-md">
            <table className="admin-table compact">
              <thead>
                <tr>
                  <th>Region / City</th>
                  <th>Gross Revenue</th>
                  <th>Market Share</th>
                </tr>
              </thead>
              <tbody>
                {regionalBreakdown.map((reg) => (
                  <tr key={reg.city}>
                    <td className="weight-600">{reg.city}</td>
                    <td className="font-mono text-gold">{reg.sales}</td>
                    <td className="font-mono weight-600">{reg.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
