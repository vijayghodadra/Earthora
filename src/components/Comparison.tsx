import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { productData } from '../data/productData';
import './Comparison.css';

const Comparison = () => {
  return (
    <section id="comparison" className="comparison-section">
      <div className="section-container">
        
        <div className="comparison-header">
          <span className="section-eyebrow">THE EARTHORA STANDARD</span>
          <h2 className="section-title">Why Choose Earthora?</h2>
          <p className="section-subtitle">
            Rooted in Ayurveda, inspired by nature, and formulated to meet modern standards of quality and everyday well-being.
          </p>
        </div>

        <motion.div 
          className="comparison-table-wrapper"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="th-feature">Standard & Focus</th>
                <th className="th-others">Conventional Mass Brands</th>
                <th className="th-earthora">
                  <div className="th-earthora-content">
                    <span className="earthora-brand-name">Earthora</span>
                    <span className="earthora-sub-pill">Nature • Ayurveda • Quality</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.comparison.map((item, idx) => (
                <tr key={idx}>
                  <td className="td-feature">
                    <span className="feature-label">{item.feature}</span>
                  </td>
                  <td className="td-others">
                    <div className="td-comparison-cell">
                      <span className="icon-cross"><X size={16} /></span>
                      <span className="cell-text">{item.othersText || 'Mass-market commercial standard'}</span>
                    </div>
                  </td>
                  <td className="td-earthora">
                    <div className="td-comparison-cell">
                      <span className="icon-check"><Check size={18} /></span>
                      <span className="cell-text font-medium">{item.earthoraText}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </section>
  );
};

export default Comparison;
