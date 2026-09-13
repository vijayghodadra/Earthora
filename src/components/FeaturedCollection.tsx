import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Plus } from 'lucide-react';
import ProductModal from './ProductModal.tsx';
import type { ProductBundle } from '../data/productData';
import './FeaturedCollection.css';

import img1 from '../assets/images (1).jpg';
import img2 from '../assets/images (2).jpg';
import img3 from '../assets/images (4).jpg';
import img4 from '../assets/images (3).jpg';
import img5 from '../assets/images6.jpg';

const defaultProducts = [
  {
    id: 'product-1',
    name: 'UBTAN FACE WASH',
    category: 'FACIAL CARE',
    desc: 'Formulated with saffron & turmeric\nfor natural radiance & glow.',
    price: '₹249',
    image: img1,
    className: 'item-1'
  },
  {
    id: 'product-2',
    name: 'ANTI-POLLUTION CREAM',
    category: 'DAY CREAM',
    desc: 'Protects skin from pollution\nwith natural botanical shields.',
    price: '₹349',
    image: img2,
    className: 'item-2'
  },
  {
    id: 'product-3',
    name: 'HYDRO BOOST GEL',
    category: 'MOISTURIZER',
    desc: 'Deep hydration water gel cream\nfor smooth, glowing skin.',
    price: '₹950',
    image: img3,
    className: 'item-3'
  },
  {
    id: 'product-4',
    name: 'GENTLE CLEANSER',
    category: 'DAILY CLEANSER',
    desc: 'Soothing formula for oily skin,\nmaintains natural moisture balance.',
    price: '₹599',
    image: img4,
    className: 'item-4'
  },
  {
    id: 'product-5',
    name: 'VITAMIN C GLOW WASH',
    category: 'FACE WASH',
    desc: 'Enriched with Vitamin C & Lemon\nfor instant skin brightening.',
    price: '₹399',
    image: img5,
    className: 'item-5'
  }
];

interface FeaturedCollectionProps {
  onAddToCart?: (bundle: any, quantity: number) => void;
  onBuyNow?: (bundle: any, quantity: number) => void;
  productsList?: ProductBundle[];
}

const FeaturedCollection = ({ onAddToCart, onBuyNow, productsList }: FeaturedCollectionProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const displayProducts = (productsList && productsList.length > 0)
    ? productsList.map((item, index) => ({
        id: item.id,
        name: item.name.toUpperCase(),
        category: item.badge || 'BOTANICAL CARE',
        desc: `${item.size || 'Natural Formula'}\nFormulated for pure radiance & glow.`,
        price: `₹${item.price}`,
        originalPrice: `₹${item.originalPrice || Math.round(item.price * 1.3)}`,
        image: item.image || img1,
        className: `item-${(index % 5) + 1}`,
        rawBundle: item
      }))
    : defaultProducts.map(p => ({ ...p, rawBundle: p }));

  const totalCount = displayProducts.length;

  return (
    <>
      <section id="collection" className="collection">
        <div className="collection-grid">
          
          <div className="intro-block">
            <div className="intro-eyebrow">THE COLLECTION</div>
            <h2 className="intro-title">Selected<br/>Pieces</h2>
            <p className="intro-desc">{totalCount} exceptional pieces.<br/>One uncompromising<br/>standard of luxury.</p>
          </div>

          {displayProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              className={`product-card ${product.className}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + (index * 0.1) }}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="card-top">
                <div className="card-number">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="divider">/</span>
                  <span>{String(totalCount).padStart(2, '0')}</span>
                </div>
                <div className="card-image-wrapper">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="circle-plus"><Plus size={16} /></div>
                </div>
              </div>
              <div className="card-bottom">
                <div className="card-bottom-flex">
                  <div className="text-stack">
                    <div className="card-category">{product.category}</div>
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-desc">
                      {product.desc.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                    </p>
                  </div>
                  <div className="price-stack">
                    <span className="card-price">{product.price}</span>
                  </div>
                </div>
                <button className="view-btn">
                  VIEW PIECE <MoveRight strokeWidth={1} size={32} className="arrow-icon" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      )}
    </>
  );
};

export default FeaturedCollection;
