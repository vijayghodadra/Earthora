import { motion } from 'framer-motion';
import { productData } from '../data/productData';
import './BrandStory.css';

const BrandStory = () => {
  return (
    <section id="story" className="product-story-section">
      <div className="section-container">
        
        <motion.div 
          className="story-centered-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">ABOUT US • OUR PHILOSOPHY</span>
          <h2 className="section-title story-heading">About EarthOra</h2>

          <p className="story-paragraph">{productData.story.paragraph1}</p>
          <p className="story-paragraph">{productData.story.paragraph2}</p>
        </motion.div>

      </div>
    </section>
  );
};

export default BrandStory;
