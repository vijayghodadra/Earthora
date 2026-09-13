import React, { useState } from 'react';
import { Save, Building, DollarSign, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import type { StoreSettings } from '../../types/adminTypes';

interface AdminSettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-settings-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Storefront & Business Settings</h2>
          <p className="admin-view-subtitle">Configure business contact details, taxes, shipping rules, and payment gateways</p>
        </div>
        <button className="admin-btn-primary" onClick={handleSave}>
          {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Settings Saved!' : 'Save Configurations'}
        </button>
      </div>

      <div className="admin-two-col-grid">
        {/* Business Info */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title flex-center gap-xs">
              <Building size={18} className="text-gold" /> Store Identity & Contact
            </h3>
          </div>
          <div className="form-grid margin-top-md">
            <div className="form-group">
              <label>Store Brand Name</label>
              <input 
                type="text" 
                className="admin-input"
                value={form.storeName}
                onChange={e => setForm({...form, storeName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input 
                type="text" 
                className="admin-input"
                value={form.tagline}
                onChange={e => setForm({...form, tagline: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Concierge Email</label>
              <input 
                type="email" 
                className="admin-input"
                value={form.contactEmail}
                onChange={e => setForm({...form, contactEmail: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Concierge Phone</label>
              <input 
                type="text" 
                className="admin-input"
                value={form.contactPhone}
                onChange={e => setForm({...form, contactPhone: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Financial & Shipping */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title flex-center gap-xs">
              <DollarSign size={18} className="text-gold" /> Payment Gateways & Shipping
            </h3>
          </div>
          <div className="form-grid margin-top-md">
            <div className="form-group">
              <label>GST / Tax Rate (%)</label>
              <input 
                type="number" 
                className="admin-input"
                value={form.taxRatePercent}
                onChange={e => setForm({...form, taxRatePercent: Number(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Free Shipping Threshold (₹)</label>
              <input 
                type="number" 
                className="admin-input"
                value={form.freeShippingThreshold}
                onChange={e => setForm({...form, freeShippingThreshold: Number(e.target.value)})}
              />
            </div>

            <div className="toggle-setting-row margin-top-sm">
              <span>Enable UPI Instant Checkout</span>
              <button className="btn-unstyled" onClick={() => setForm({...form, upiEnabled: !form.upiEnabled})}>
                {form.upiEnabled ? <ToggleRight size={28} className="text-gold" /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div className="toggle-setting-row">
              <span>Enable Credit / Debit Cards</span>
              <button className="btn-unstyled" onClick={() => setForm({...form, cardEnabled: !form.cardEnabled})}>
                {form.cardEnabled ? <ToggleRight size={28} className="text-gold" /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div className="toggle-setting-row">
              <span>Enable Cash on Delivery (COD)</span>
              <button className="btn-unstyled" onClick={() => setForm({...form, codEnabled: !form.codEnabled})}>
                {form.codEnabled ? <ToggleRight size={28} className="text-gold" /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
