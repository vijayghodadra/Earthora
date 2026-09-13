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
  const [dragActive, setDragActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clean empty initial form for new product addition
  const initialNewFormState: Partial<ProductBundle> = {
    name: '',
    size: '',
    price: undefined,
    originalPrice: undefined,
    discount: '',
    badge: '',
    bestValue: false,
    image: ''
  };

  const [newForm, setNewForm] = useState<Partial<ProductBundle>>(initialNewFormState);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to handle image file reader
  const processImageFile = (file: File, callback: (base64: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (base64) => {
        if (isEditMode) {
          setEditForm(prev => ({ ...prev, image: base64 }));
        } else {
          setNewForm(prev => ({ ...prev, image: base64 }));
        }
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isEditMode = false) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], (base64) => {
        if (isEditMode) {
          setEditForm(prev => ({ ...prev, image: base64 }));
        } else {
          setNewForm(prev => ({ ...prev, image: base64 }));
        }
      });
    }
  };

  // Auto calculate discount percentage when price and original price change
  const handlePriceChange = (priceVal?: number, origPriceVal?: number, isEditMode = false) => {
    const currentPrice = priceVal !== undefined ? priceVal : (isEditMode ? editForm.price : newForm.price);
    const currentOrig = origPriceVal !== undefined ? origPriceVal : (isEditMode ? editForm.originalPrice : newForm.originalPrice);

    let calculatedDiscount = '';
    if (currentPrice && currentOrig && currentOrig > currentPrice) {
      const discountPct = Math.round(((currentOrig - currentPrice) / currentOrig) * 100);
      calculatedDiscount = `${discountPct}% OFF`;
    }

    if (isEditMode) {
      setEditForm(prev => ({
        ...prev,
        ...(priceVal !== undefined && { price: priceVal }),
        ...(origPriceVal !== undefined && { originalPrice: origPriceVal }),
        discount: calculatedDiscount || prev.discount
      }));
    } else {
      setNewForm(prev => ({
        ...prev,
        ...(priceVal !== undefined && { price: priceVal }),
        ...(origPriceVal !== undefined && { originalPrice: origPriceVal }),
        discount: calculatedDiscount || prev.discount
      }));
    }
  };

  const handleStartEdit = (bundle: ProductBundle) => {
    setEditingId(bundle.id);
    setEditForm({ ...bundle });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    if (!editForm.name || !editForm.price) {
      alert("Please fill in the product title and sale price.");
      return;
    }
    const updated = bundles.map(b => b.id === editingId ? { ...b, ...editForm } as ProductBundle : b);
    onUpdateBundles(updated);
    setEditingId(null);
    setEditForm({});
    showNotification("Product updated successfully!");
  };

  const handleDeleteBundle = (id: string) => {
    if (bundles.length <= 1) {
      alert("Store must have at least one product bundle available.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      onUpdateBundles(bundles.filter(b => b.id !== id));
      showNotification("Product deleted successfully!");
    }
  };

  const handleSaveNewBundle = () => {
    if (!newForm.name || newForm.price === undefined || newForm.price <= 0) {
      alert("Please enter a valid Product Title and Sale Price.");
      return;
    }
    const newId = `product-${Date.now()}`;
    const salePrice = Number(newForm.price);
    const origPrice = newForm.originalPrice ? Number(newForm.originalPrice) : Math.round(salePrice * 1.3);

    let finalDiscount = newForm.discount;
    if (!finalDiscount && origPrice > salePrice) {
      finalDiscount = `${Math.round(((origPrice - salePrice) / origPrice) * 100)}% OFF`;
    }

    const created: ProductBundle = {
      id: newId,
      name: newForm.name,
      size: newForm.size || '100ml • Free Shipping',
      price: salePrice,
      originalPrice: origPrice,
      discount: finalDiscount || 'Special Offer',
      badge: newForm.badge || 'NEW ARRIVAL',
      bestValue: Boolean(newForm.bestValue),
      image: newForm.image || bundles[0]?.image || ''
    };

    onUpdateBundles([...bundles, created]);
    setIsAddingNew(false);
    setNewForm(initialNewFormState);
    showNotification(`New product "${created.name}" added successfully!`);
  };

  return (
    <div className="admin-products-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Manage Products & Inventory</h2>
          <p className="admin-view-subtitle">Add new products with image upload, edit pricing details, and manage catalog</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setIsAddingNew(true)}>
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {toastMessage && (
        <motion.div 
          className="admin-alert-banner margin-bottom-lg text-emerald"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </motion.div>
      )}

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
                <button className="close-btn" onClick={() => { setIsAddingNew(false); setNewForm(initialNewFormState); }}><X size={20} /></button>
              </div>

              <div className="admin-modal-body grid-2">
                {/* Image Upload Box */}
                <div className="form-group full-width">
                  <label className="form-label font-semibold">Product Image</label>
                  <div 
                    className={`image-upload-box ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, false)}
                  >
                    {newForm.image ? (
                      <div className="upload-preview flex flex-col items-center gap-2">
                        <img src={newForm.image} alt="Preview" style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'contain' }} />
                        <div className="flex gap-2">
                          <label className="admin-btn-secondary text-xs cursor-pointer">
                            Change Image
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, false)} hidden />
                          </label>
                          <button type="button" className="admin-btn-danger text-xs" onClick={() => setNewForm({...newForm, image: ''})}>Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label className="upload-dropzone flex flex-col items-center justify-center p-6 border-2 border-dashed border-gold rounded-lg cursor-pointer text-center">
                        <Upload size={32} className="text-gold mb-2" />
                        <span className="font-semibold text-sm">Click or Drag & Drop Product Image File</span>
                        <span className="text-xs text-muted mt-1">Supports PNG, JPG, WEBP formats</span>
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, false)} hidden />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title & Category */}
                <div className="form-group">
                  <label className="form-label font-semibold">Product Title *</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.name || ''} 
                    onChange={e => setNewForm({...newForm, name: e.target.value})}
                    placeholder="e.g. Mamaearth Ubtan Natural Face Wash"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold">Category / Badge Tag</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.badge || ''} 
                    onChange={e => setNewForm({...newForm, badge: e.target.value})}
                    placeholder="e.g. FACIAL CARE & RADIANCE"
                  />
                </div>

                {/* Size / Volume */}
                <div className="form-group">
                  <label className="form-label font-semibold">Quantity / Size Details</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.size || ''} 
                    onChange={e => setNewForm({...newForm, size: e.target.value})}
                    placeholder="e.g. 100ml • Free Shipping"
                  />
                </div>

                {/* Pricing Fields */}
                <div className="form-group">
                  <label className="form-label font-semibold">Sale Price (₹) *</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newForm.price !== undefined ? newForm.price : ''} 
                    onChange={e => handlePriceChange(e.target.value ? Number(e.target.value) : undefined, undefined, false)}
                    placeholder="e.g. 249"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold">Original Price / MRP (₹)</label>
                  <input 
                    type="number" 
                    className="admin-input" 
                    value={newForm.originalPrice !== undefined ? newForm.originalPrice : ''} 
                    onChange={e => handlePriceChange(undefined, e.target.value ? Number(e.target.value) : undefined, false)}
                    placeholder="e.g. 349"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-semibold">Discount Offer Tag</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newForm.discount || ''} 
                    onChange={e => setNewForm({...newForm, discount: e.target.value})}
                    placeholder="e.g. 28% OFF (Auto-calculated if left blank)"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="form-group full-width flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
                    <input 
                      type="checkbox" 
                      checked={Boolean(newForm.bestValue)} 
                      onChange={e => setNewForm({...newForm, bestValue: e.target.checked})}
                      className="w-4 h-4 accent-gold"
                    />
                    <span>Highlight as "Best Value / Featured Selection"</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => { setIsAddingNew(false); setNewForm(initialNewFormState); }}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleSaveNewBundle}>Save & Publish Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Catalog Grid */}
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
                    <div className="placeholder-img flex items-center justify-center h-full text-muted"><Package size={36} /></div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="product-details">
                    <div className="flex-between align-start">
                      <div>
                        <h3 className="product-title font-bold text-base">{bundle.name}</h3>
                        <p className="product-size text-sm text-muted">{bundle.size}</p>
                      </div>
                      {bundle.badge && <span className="badge-gold">{bundle.badge}</span>}
                    </div>

                    <div className="price-row">
                      <span className="current-price">₹{bundle.price.toLocaleString('en-IN')}</span>
                      {bundle.originalPrice && <span className="orig-price">₹{bundle.originalPrice.toLocaleString('en-IN')}</span>}
                      {bundle.discount && <span className="discount-tag">{bundle.discount}</span>}
                    </div>

                    <div className="card-actions">
                      <button className="admin-btn-secondary" onClick={() => handleStartEdit(bundle)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="admin-btn-danger" onClick={() => handleDeleteBundle(bundle.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="product-edit-form">
                    <div className="form-group">
                      <label className="form-label text-xs font-semibold">Update Product Image</label>
                      <div className="flex items-center gap-2">
                        {editForm.image && <img src={editForm.image} alt="Thumb" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />}
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, true)} className="admin-input-sm text-xs" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-xs font-semibold">Title</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Product Title"
                      />
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label text-xs font-semibold">Sale Price (₹)</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={editForm.price !== undefined ? editForm.price : ''} 
                          onChange={e => handlePriceChange(e.target.value ? Number(e.target.value) : undefined, undefined, true)}
                          placeholder="249"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label text-xs font-semibold">MRP Price (₹)</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={editForm.originalPrice !== undefined ? editForm.originalPrice : ''} 
                          onChange={e => handlePriceChange(undefined, e.target.value ? Number(e.target.value) : undefined, true)}
                          placeholder="349"
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label text-xs font-semibold">Discount</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={editForm.discount || ''} 
                          onChange={e => setEditForm({...editForm, discount: e.target.value})}
                          placeholder="28% OFF"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label text-xs font-semibold">Category Badge</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={editForm.badge || ''} 
                          onChange={e => setEditForm({...editForm, badge: e.target.value})}
                          placeholder="FACIAL CARE"
                        />
                      </div>
                    </div>

                    <div className="card-actions mt-3">
                      <button className="admin-btn-primary" onClick={handleSaveEdit}>
                        <Check size={14} /> Save Changes
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
