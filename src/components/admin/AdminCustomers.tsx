import React, { useState } from 'react';
import { Search, Crown, MapPin } from 'lucide-react';
import type { CustomerProfile } from '../../types/adminTypes';

interface AdminCustomersProps {
  customers: CustomerProfile[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-customers-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Clientele & CRM Profiles</h2>
          <p className="admin-view-subtitle">Monitor customer lifetime values, VIP tiers, and purchase engagement</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card margin-bottom-lg">
        <div className="filter-bar-row">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="admin-input search-input"
              placeholder="Search by Customer Name, Email, or City..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filter-pills">
            {['ALL', 'VIP', 'ACTIVE', 'INACTIVE'].map(st => (
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

      {/* Customers Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client Name & Email</th>
                <th>Location</th>
                <th>Total Orders</th>
                <th>Lifetime Spend</th>
                <th>Tier Status</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="font-mono text-gold weight-600">{customer.id}</td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name flex-center gap-xs">
                        {customer.status === 'VIP' && <Crown size={14} className="text-gold" />}
                        {customer.name}
                      </span>
                      <span className="user-sub">{customer.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="flex-center gap-xs font-sm">
                      <MapPin size={12} className="text-gold" /> {customer.location}
                    </span>
                  </td>
                  <td className="weight-600">{customer.totalOrders} Orders</td>
                  <td className="font-mono weight-600 text-gold">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge status-${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="font-sm text-muted">{customer.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
