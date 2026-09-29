import { motion } from 'framer-motion';
import { productData } from '../data/productData';
import './BrandStory.css';

const BrandStory = () => {
  const { story } = productData;

  return (
    <section id="story" className="product-story-section">
      <div className="section-container">
        <motion.div 
          className="story-clean-wrapper"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Title & Tagline */}
          <h2 className="clean-story-title">{story.title}</h2>
          <p className="clean-story-tagline">{story.tagline}</p>

          {/* Narrative Body */}
          <div className="clean-story-body">
            {story.introParagraphs.map((paragraph, idx) => (
              <p key={idx} className="clean-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="clean-story-divider" />

          {/* Our Philosophy */}
          <div className="clean-story-block">
            <h3 className="clean-subheading">OUR PHILOSOPHY</h3>
            <h4 className="clean-motto">{story.philosophy.title}</h4>
            <p className="clean-paragraph">{story.philosophy.description}</p>
          </div>

          <div className="clean-story-divider" />

          {/* Our Promise */}
          <div className="clean-story-block">
            <h3 className="clean-subheading">OUR PROMISE</h3>
            <div className="clean-promise-list">
              {story.promises.map((promise) => (
                <div key={promise.title} className="clean-promise-row">
                  <span className="clean-promise-name">{promise.title}</span>
                  <span className="clean-promise-separator">—</span>
                  <span className="clean-promise-desc">{promise.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="clean-story-divider" />

          {/* Our Vision */}
          <div className="clean-story-block">
            <h3 className="clean-subheading">OUR VISION</h3>
            <p className="clean-paragraph clean-vision-text">{story.vision.statement}</p>
          </div>

          <div className="clean-story-divider" />

          {/* Signoff */}
          <div className="clean-story-closing">
            <p className="clean-signature">{story.signature}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
