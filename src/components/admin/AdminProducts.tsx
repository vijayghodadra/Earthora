import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Check, X, Sparkles, Upload } from 'lucide-react';
import type { ProductBundle } from '../../data/productData';

interface AdminProductsProps {
  bundles: ProductBundle[];
  onUpdateBundles: (updatedBundles: ProductBundle[]) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ bundles, onUpdateBundles }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductBundle>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Partial<ProductBundle>>({
    name: '',
    size: '50ml • Express Delivery',
    price: 2990,
    originalPrice: 3990,
    discount: '25% OFF',
    badge: 'NEW BUNDLE',
    bestValue: false,
    image: bundles[0]?.image || ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditMode) {
          setEditForm(prev => ({ ...prev, image: base64String }));
        } else {
          setNewForm(prev => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (bundle: ProductBundle) => {
    setEditingId(bundle.id);
    setEditForm({ ...bundle });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = bundles.map(b => b.id === editingId ? { ...b, ...editForm } as ProductBundle : b);
    onUpdateBundles(updated);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteBundle = (id: string) => {
    if (bundles.length <= 1) {
      alert("Store must have at least one product bundle available.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product bundle?")) {
      onUpdateBundles(bundles.filter(b => b.id !== id));
    }
  };

  const handleSaveNewBundle = () => {
    if (!newForm.name || !newForm.price) {
      alert("Please specify bundle name and price.");
      return;
    }
    const newId = `bundle-${Date.now()}`;
    const created: ProductBundle = {
      id: newId,
      name: newForm.name,
      size: newForm.size || '50ml',
      price: Number(newForm.price),
      originalPrice: Number(newForm.originalPrice || newForm.price),
      discount: newForm.discount || 'Special Offer',
      badge: newForm.badge,
      bestValue: Boolean(newForm.bestValue),
      image: newForm.image || bundles[0]?.image
    };
    onUpdateBundles([...bundles, created]);
    setIsAddingNew(false);
    setNewForm({
      name: '',
      size: '50ml • Express Delivery',
      price: 2990,
      originalPrice: 3990,
      discount: '25% OFF',
      badge: 'NEW BUNDLE',
      bestValue: false,
      image: bundles[0]?.image || ''
    });
  };

  return (
    <div className="admin-products-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Manage Products & Inventory</h2>
          <p className="admin-view-subtitle">Add new products with image upload, edit pricing, and remove items</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setIsAddingNew(true)}>
          <Plus size={16} /> Add Product Bundle
        </button>
      </div>

      <div className="admin-alert-banner margin-bottom-lg">
        <Sparkles size={18} className="text-gold" />
        <span>Product updates and uploaded images directly publish to the customer storefront in real-time!</span>
      </div>

      {/* Add New Product Modal */}
      <AnimatePresence>
        {isAddingNew && (
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
                <h3>Add New Product</h3>
                <button className="close-btn" onClick={() => setIsAddingNew(false)}><X size={20} /></button>
              </div>
              <div className="admin-modal-body grid-2">
                <div className="form-group full-width">
                  <label>Product Image Upload</label>
                  <div className="image-upload-box">
                    {newForm.image ? (
                      <div className="upload-preview">
                        <img src={newForm.image} alt="Preview" />
                        <button type="button" className="change-img-btn" onClick={() => setNewForm({...newForm, image: ''})}>Remove Image</button>
                      </div>
                    ) : (
                      <label className="upload-dropzone">
                        <Upload size={24} className="text-gold" />
                        <span>Click to Upload Product Image File</span>
                        <span className="user-sub">Supports PNG, JPG, WEBP</span>
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, false)} hidden />
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Product / Bundle Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.name} 
                    onChange={e => setNewForm({...newForm, name: e.target.value})}
                    placeholder="e.g. 3 Month Supply Package"
                  />
                </div>

                <div className="form-group">
                  <label>Size / Desc</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.size} 
                    onChange={e => setNewForm({...newForm, size: e.target.value})}
                    placeholder="e.g. 150ml • Free Shipping"
                  />
                </div>

                <div className="form-group">
                  <label>Sale Price (₹)</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newForm.price} 
                    onChange={e => setNewForm({...newForm, price: Number(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newForm.originalPrice} 
                    onChange={e => setNewForm({...newForm, originalPrice: Number(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Label</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.discount} 
                    onChange={e => setNewForm({...newForm, discount: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Badge Label</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.badge || ''} 
                    onChange={e => setNewForm({...newForm, badge: e.target.value})}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setIsAddingNew(false)}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleSaveNewBundle}>Save & Publish</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="product-bundles-grid">
        {bundles.map((bundle) => {
          const isEditing = editingId === bundle.id;

          return (
            <motion.div 
              key={bundle.id}
              className={`product-bundle-card ${bundle.bestValue ? 'highlight' : ''}`}
              layout
            >
              {bundle.bestValue && <div className="card-top-tag">BEST VALUE SELECTION</div>}

              <div className="card-main">
                <div className="product-img-box">
                  {bundle.image ? (
                    <img src={bundle.image} alt={bundle.name} />
                  ) : (
                    <div className="placeholder-img"><Package size={32} /></div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="product-details">
                    <div className="flex-between align-start">
                      <div>
                        <h3 className="product-title">{bundle.name}</h3>
                        <p className="product-size">{bundle.size}</p>
                      </div>
                      {bundle.badge && <span className="badge-gold">{bundle.badge}</span>}
                    </div>

                    <div className="price-row">
                      <span className="current-price">₹{bundle.price.toLocaleString('en-IN')}</span>
                      <span className="orig-price">₹{bundle.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="discount-tag">{bundle.discount}</span>
                    </div>

                    <div className="card-actions">
                      <button className="admin-btn-secondary" onClick={() => handleStartEdit(bundle)}>
                        <Edit2 size={14} /> Edit Product
                      </button>
                      <button className="admin-btn-danger" onClick={() => handleDeleteBundle(bundle.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="product-edit-form">
                    <div className="form-group">
                      <label>Upload New Image</label>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, true)} className="admin-input-sm" />
                    </div>
                    <div className="form-group">
                      <label>Product Name</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Price (₹)</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={editForm.price || 0} 
                          onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Original (₹)</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={editForm.originalPrice || 0} 
                          onChange={e => setEditForm({...editForm, originalPrice: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="admin-btn-primary" onClick={handleSaveEdit}>
                        <Check size={14} /> Save
                      </button>
                      <button className="admin-btn-secondary" onClick={() => setEditingId(null)}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
