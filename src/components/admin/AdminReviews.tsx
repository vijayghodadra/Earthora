import React, { useState } from 'react';
import { Star, CheckCircle, Trash2, Plus, ShieldCheck, X } from 'lucide-react';
import type { Review } from '../../data/productData';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminReviewsProps {
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({ reviews, onUpdateReviews }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: '',
    rating: 5,
    title: '',
    comment: '',
    location: 'Mumbai, MH',
    verified: true,
    date: 'September 2026'
  });

  const handleDeleteReview = (id: number) => {
    if (window.confirm("Delete this review from live storefront?")) {
      onUpdateReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleToggleVerified = (id: number) => {
    onUpdateReviews(reviews.map(r => r.id === id ? { ...r, verified: !r.verified } : r));
  };

  const handleSaveNewReview = () => {
    if (!newReview.name || !newReview.comment) {
      alert("Name and comment are required.");
      return;
    }

    const created: Review = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating || 5),
      title: newReview.title || 'Exceptional experience',
      comment: newReview.comment,
      location: newReview.location || 'India',
      verified: Boolean(newReview.verified),
      date: newReview.date || 'September 2026'
    };

    onUpdateReviews([created, ...reviews]);
    setIsAdding(false);
    setNewReview({
      name: '',
      rating: 5,
      title: '',
      comment: '',
      location: 'Mumbai, MH',
      verified: true,
      date: 'September 2026'
    });
  };

  return (
    <div className="admin-reviews-view">
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Reviews & Customer Testimonials</h2>
          <p className="admin-view-subtitle">Moderate live customer reviews, verify purchases, and publish curated client feedback</p>
        </div>
        <button className="admin-btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Add Curated Review
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
                <h3>Add Verified Customer Review</h3>
                <button className="close-btn" onClick={() => setIsAdding(false)}><X size={20} /></button>
              </div>
              <div className="admin-modal-body grid-2">
                <div className="form-group">
                  <label>Client Name</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newReview.name} 
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
                <div className="form-group">
                  <label>Rating Stars (1 - 5)</label>
                  <select 
                    className="admin-input" 
                    value={newReview.rating}
                    onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Review Headline / Title</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newReview.title} 
                    onChange={e => setNewReview({...newReview, title: e.target.value})}
                    placeholder="e.g. Noticeable glow within days"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={newReview.location} 
                    onChange={e => setNewReview({...newReview, location: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Review Feedback</label>
                  <textarea 
                    className="admin-input textarea" 
                    rows={3}
                    value={newReview.comment} 
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                <button className="admin-btn-primary" onClick={handleSaveNewReview}>Publish Review</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Cards List */}
      <div className="reviews-admin-grid">
        {reviews.map(rev => (
          <div key={rev.id} className="admin-card review-card">
            <div className="flex-between align-start margin-bottom-sm">
              <div>
                <h4 className="review-user-name flex-center gap-xs">
                  {rev.name}
                  {rev.verified && <span className="verified-badge-sm"><CheckCircle size={12} /> Verified</span>}
                </h4>
                <span className="user-sub">{rev.location} • {rev.date}</span>
              </div>
              <div className="stars-row">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < rev.rating ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
            </div>

            <h5 className="review-title text-gold">{rev.title}</h5>
            <p className="review-comment-text">{rev.comment}</p>

            <div className="review-card-footer">
              <button 
                className={`admin-btn-secondary btn-sm ${rev.verified ? 'active' : ''}`}
                onClick={() => handleToggleVerified(rev.id)}
              >
                <ShieldCheck size={14} /> {rev.verified ? 'Verified Buyer' : 'Mark Verified'}
              </button>
              <button 
                className="admin-btn-danger btn-sm"
                onClick={() => handleDeleteReview(rev.id)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
