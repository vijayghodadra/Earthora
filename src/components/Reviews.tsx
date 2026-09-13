import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { productData, type Review } from '../data/productData';
import './Reviews.css';

interface ReviewsProps {
  reviewsList?: Review[];
}

const Reviews = ({ reviewsList }: ReviewsProps) => {
  const displayReviews = reviewsList && reviewsList.length > 0 ? reviewsList : productData.reviews;

  return (
    <section id="reviews" className="reviews-section">
      <div className="section-container">
        
        <div className="reviews-header">
          <span className="section-eyebrow">COMMUNITY TESTIMONIALS</span>
          <h2 className="section-title">Loved by over 10,000 customers</h2>
          
          <div className="reviews-summary-card">
            <div className="summary-score">{productData.rating}</div>
            <div className="summary-info">
              <div className="summary-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#e5b95f" color="#e5b95f" />
                ))}
              </div>
              <div className="summary-text">Based on {productData.reviewCount.toLocaleString()} verified customer ratings</div>
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {displayReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              className="review-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="review-card-top">
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#e5b95f" color="#e5b95f" />
                  ))}
                </div>
                <span className="review-date">{review.date}</span>
              </div>

              <h3 className="review-title">{review.title}</h3>
              <p className="review-comment">"{review.comment}"</p>

              <div className="review-author">
                <div className="author-name">{review.name}</div>
                {review.verified && (
                  <div className="verified-badge">
                    <CheckCircle size={12} />
                    <span>Verified Buyer • {review.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
