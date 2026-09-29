import img1 from '../assets/images (1).jpg';
import img2 from '../assets/images (2).jpg';
import img3 from '../assets/images (4).jpg'; // Neutrogena
import img4 from '../assets/images (3).jpg'; // Cetaphil
import img5 from '../assets/images6.jpg';

export interface ProductBundle {
  id: string;
  name: string;
  size: string;
  price: number;
  originalPrice: number;
  discount: string;
  badge?: string;
  bestValue?: boolean;
  image?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  botanicalName: string;
  description: string;
  image: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  location: string;
  productName?: string;
  orderId?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ModalProductInfo {
  id: string;
  name: string;
  category: string;
  tagline: string;
  desc: string;
  price: string;
  originalPrice: string;
  volume: string;
  rating: number;
  reviewsCount: number;
  image: string;
  ingredients: Array<{ name: string; botanicalName: string; description: string }>;
  benefits: Array<{ title: string; desc: string }>;
  howToUse: Array<{ step: string; title: string; desc: string }>;
}

export const detailedProductsCatalog: Record<string, ModalProductInfo> = {
  'product-1': {
    id: 'product-1',
    name: 'Mamaearth Ubtan Natural Face Wash',
    category: 'FACIAL CARE & RADIANCE',
    tagline: '100ml • Free Shipping Formulated for pure radiance & glow.',
    desc: 'Formulated with saffron & turmeric for natural skin radiance and gentle daily cleansing.',
    price: '₹249',
    originalPrice: '₹349',
    volume: '100ml / 3.4 fl oz',
    rating: 4.9,
    reviewsCount: 1250,
    image: img1,
    ingredients: [
      {
        name: 'Turmeric (Haldi)',
        botanicalName: 'Curcuma Longa',
        description: 'Rich in curcumin antioxidants that naturally soothe skin irritation and reverse sun tan.'
      },
      {
        name: 'Saffron Extract (Kesar)',
        botanicalName: 'Crocus Sativus',
        description: 'Traditional royal botanical celebrated for clearing skin tone and promoting warm luminosity.'
      },
      {
        name: 'Walnut Micro-Beads',
        botanicalName: 'Juglans Regia',
        description: 'Gentle physical exfoliants that lift away dead skin cells without stripping natural lipids.'
      },
      {
        name: 'Carrot Seed Oil',
        botanicalName: 'Daucus Carota',
        description: 'Packed with Provitamin A to shield the skin surface from environmental photo-aging.'
      }
    ],
    benefits: [
      {
        title: '100% Pure Cold-Pressed Botanical Formulation',
        desc: 'Crafted without sulfates, silicones, parabens, or synthetic dyes for pure skin compatibility.'
      },
      {
        title: 'Removes Tan & Restores Natural Glow',
        desc: 'Traditional ubtan herbs work synergistically to reduce hyperpigmentation from sun exposure.'
      },
      {
        title: 'Deep Pore Cleansing Without Tightness',
        desc: 'Purifies trapped impurities while preserving vital intercellular moisture.'
      },
      {
        title: 'Dermatologically Tested Formula',
        desc: 'Clinically verified safe for all skin types, including sensitive skin.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Splash with water',
        desc: 'Splash lukewarm water onto your face to open pores gently.'
      },
      {
        step: '02',
        title: 'Massage gently',
        desc: 'Apply a coin-sized amount and massage in circular upward motions for 1 minute.'
      },
      {
        step: '03',
        title: 'Rinse & glow',
        desc: 'Rinse thoroughly with cool water and pat dry with a soft towel.'
      }
    ]
  },
  'product-2': {
    id: 'product-2',
    name: 'Mamaearth Anti-Pollution Face Cream',
    category: 'DAY CARE & PROTECTION',
    tagline: '80g • Free Shipping Formulated for daily barrier defense & moisture.',
    desc: 'Protects skin from pollution with natural botanical shields while providing all-day hydration.',
    price: '₹349',
    originalPrice: '₹499',
    volume: '80g / 2.8 oz',
    rating: 4.8,
    reviewsCount: 890,
    image: img2,
    ingredients: [
      {
        name: 'Pollustop Matrix',
        botanicalName: 'Biosaccharide Gum-4',
        description: 'Forms an invisible non-occlusive botanical matrix that repels PM2.5 and urban dust particles.'
      },
      {
        name: 'Turmeric Root Extract',
        botanicalName: 'Curcuma Longa Root',
        description: 'Calms redness caused by atmospheric stress and free radical exposure.'
      },
      {
        name: 'Daisy Flower Extract',
        botanicalName: 'Bellis Perennis',
        description: 'Naturally hinders melanin synthesis to keep complexion bright and spot-free.'
      },
      {
        name: 'Organic Shea Butter Base',
        botanicalName: 'Vitellaria Paradoxa',
        description: 'Deeply seals in vital hydration without a heavy or greasy film.'
      }
    ],
    benefits: [
      {
        title: 'Urban Anti-Pollution Shield',
        desc: 'Forms an active botanical barrier preventing micro-pollutants from penetrating dermal layers.'
      },
      {
        title: 'Non-Greasy Fast Absorption',
        desc: 'Featherlight emulsion settles smoothly into skin for comfortable all-day wear.'
      },
      {
        title: 'Evens Out Dark Spots',
        desc: 'Daisy extract and natural Vitamin E minimize blemishes caused by daily UV stress.'
      },
      {
        title: 'Sustainably Sourced Botanicals',
        desc: 'Ethically cultivated ingredients free from mineral oil, silicones, and petrolatum.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Cleanse face',
        desc: 'Cleanse your face thoroughly with a mild botanical cleanser.'
      },
      {
        step: '02',
        title: 'Dot across face',
        desc: 'Take an adequate amount and dot across forehead, cheeks, nose, and neck.'
      },
      {
        step: '03',
        title: 'Blend evenly',
        desc: 'Gently massage in circular motions until completely absorbed before heading outdoors.'
      }
    ]
  },
  'product-3': {
    id: 'product-3',
    name: 'Neutrogena Hydro Boost Water Gel',
    category: 'MOISTURIZER & HYDRATION',
    tagline: '50g • Free Shipping Formulated for intense 72hr skin hydration.',
    desc: 'Deep hydration water gel cream that keeps skin supple, plump and glowing all day.',
    price: '₹950',
    originalPrice: '₹1250',
    volume: '50g / 1.7 oz',
    rating: 4.9,
    reviewsCount: 1040,
    image: img3,
    ingredients: [
      {
        name: 'Purified Hyaluronic Acid',
        botanicalName: 'Sodium Hyaluronate',
        description: 'Acts like a cellular sponge, absorbing up to 1,000 times its weight in water to quench skin.'
      },
      {
        name: 'Botanical Trehalose',
        botanicalName: 'Selaginella Lepidophylla',
        description: 'Naturally derived resurrection plant sugar that locks moisture deep within skin cells.'
      },
      {
        name: 'Prebiotic Complex',
        botanicalName: 'Skin Biome Activator',
        description: 'Feeds skin friendly microflora to reinforce protective barrier defenses.'
      },
      {
        name: 'Glycerin Matrix',
        botanicalName: 'Plant-Derived Glycerol',
        description: 'Delivers continuous dermal moisture replenishment throughout 72 hours.'
      }
    ],
    benefits: [
      {
        title: '72-Hour Continuous Hydration',
        desc: 'Clinically proven to strengthen moisture barrier and keep skin continuously refreshed.'
      },
      {
        title: 'Unique Water Gel Texture',
        desc: 'Instantly quenches dry skin without feeling heavy, sticky, or occlusive.'
      },
      {
        title: '100% Oil-Free & Non-Comedogenic',
        desc: 'Will never clog pores or trigger breakouts; perfect under makeup.'
      },
      {
        title: 'Dermatologist Recommended',
        desc: 'Formulated to restore optimal hydration for all skin types including oily and combination.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Prep your skin',
        desc: 'Cleanse and pat skin damp to maximize hyaluronic acid moisture binding.'
      },
      {
        step: '02',
        title: 'Apply water gel',
        desc: 'Scoop a dime-sized amount and smooth evenly over face, neck, and decollete.'
      },
      {
        step: '03',
        title: 'Feel the rush',
        desc: 'Enjoy the cooling burst of hydration as the gel transforms instantly into liquid moisture.'
      }
    ]
  },
  'product-4': {
    id: 'product-4',
    name: 'Cetaphil Gentle Oily Skin Cleanser',
    category: 'DERMATOLOGICAL CLEANSER',
    tagline: '125ml • Free Shipping Formulated for pure radiance & glow.',
    desc: '125ml • Free Shipping Formulated for pure radiance & glow.',
    price: '₹599',
    originalPrice: '₹779',
    volume: '200ml / 1.7 fl oz',
    rating: 4.8,
    reviewsCount: 128,
    image: img4,
    ingredients: [
      {
        name: 'Niacinamide (Vitamin B3)',
        botanicalName: 'Nicotinamide Adaptogen',
        description: 'Minimizes enlarged pores, regulates sebum flow, and restores uniform skin balance.'
      },
      {
        name: 'Panthenol (Pro-Vitamin B5)',
        botanicalName: 'D-Panthenol Complex',
        description: 'Intensively calms skin sensitivity and helps repair damaged lipid structures.'
      },
      {
        name: 'Hydrating Glycerin',
        botanicalName: 'Pure Botanical Humectant',
        description: 'Attracts water molecules to prevent post-cleansing tightness and dryness.'
      },
      {
        name: 'Zinc Coceth Sulfate',
        botanicalName: 'Mild Amphoteric Cleanser',
        description: 'Ultra-gentle cleansing agent that washes away 99% of excess oil without irritation.'
      }
    ],
    benefits: [
      {
        title: '100% pure cold-pressed botanical formulation',
        desc: 'Hypoallergenic and gentle on skin with zero harsh sulfates or parabens.'
      },
      {
        title: 'Deeply moisturizes without clogging skin pores',
        desc: 'Removes excess surface oils and grime while maintaining essential moisture barriers.'
      },
      {
        title: 'Ethically sourced adaptogens for natural radiance',
        desc: 'Clinically proven to defend against 5 signs of skin sensitivity including dryness and tightness.'
      },
      {
        title: 'Dermatologist Tested & Approved',
        desc: 'Specially engineered for combination to oily and sensitive skin types.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Dispense cleanser',
        desc: 'Apply 1-2 pumps of the soothing cleanser onto wet palms.'
      },
      {
        step: '02',
        title: 'Gentle lather',
        desc: 'Massage onto damp facial skin in circular motions, focusing on the T-zone.'
      },
      {
        step: '03',
        title: 'Rinse cleanly',
        desc: 'Rinse thoroughly with clean lukewarm water and pat dry gently.'
      }
    ]
  },
  'product-5': {
    id: 'product-5',
    name: 'Mamaearth Vitamin C Daily Glow Wash',
    category: 'BRIGHTENING FACE WASH',
    tagline: '100ml • Free Shipping Formulated for instant glow & refreshed skin.',
    desc: 'Enriched with Vitamin C & Lemon for instant skin brightening and refreshed complexion.',
    price: '₹399',
    originalPrice: '₹549',
    volume: '100ml / 3.4 fl oz',
    rating: 5.0,
    reviewsCount: 520,
    image: img5,
    ingredients: [
      {
        name: 'Vitamin C (Ascorbic Acid)',
        botanicalName: 'L-Ascorbic Acid',
        description: 'Reverses skin fatigue, protects against UV oxidation, and promotes collagen synthesis.'
      },
      {
        name: 'Lemon Peel Extract',
        botanicalName: 'Citrus Limon Peel',
        description: 'Naturally purifies clogged pores, balances excess sebum, and fades dark spots.'
      },
      {
        name: 'Aloe Vera Leaf Juice',
        botanicalName: 'Aloe Barbadensis',
        description: 'Soothes inflammation and replenishes vital skin moisture after every wash.'
      },
      {
        name: 'Plant-Based Glycerin',
        botanicalName: 'Glycerol',
        description: 'Leaves skin feeling soft, supple, and hydrated without squeaky tightness.'
      }
    ],
    benefits: [
      {
        title: 'Instant Radiant Glow',
        desc: 'Awakens tired skin with energizing Vitamin C for a fresh, illuminated appearance.'
      },
      {
        title: 'Clarifies Excess Oil',
        desc: 'Natural citrus fruit extracts tone pores and remove environmental micro-pollutants.'
      },
      {
        title: 'Non-Drying Daily Formula',
        desc: 'Gentle botanical foaming action that maintains natural acid mantle balance.'
      },
      {
        title: 'Free from Harmful Toxins',
        desc: 'Made with certified organic botanicals; zero SLS, parabens, or mineral oils.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Wet face',
        desc: 'Splash clean water across face and neck.'
      },
      {
        step: '02',
        title: 'Work up lather',
        desc: 'Dispense a small amount onto fingertips and gently lather in upward circular motions.'
      },
      {
        step: '03',
        title: 'Rinse & enjoy glow',
        desc: 'Rinse with cool water to seal pores and reveal radiant, revitalized skin.'
      }
    ]
  }
};

export function getProductModalData(bundle: any): ModalProductInfo {
  const idStr = String(bundle?.id || '');
  if (detailedProductsCatalog[idStr]) {
    const catalogItem = detailedProductsCatalog[idStr];
    return {
      ...catalogItem,
      name: bundle.name || catalogItem.name,
      price: bundle.price ? (typeof bundle.price === 'number' ? `₹${bundle.price}` : bundle.price) : catalogItem.price,
      originalPrice: bundle.originalPrice ? (typeof bundle.originalPrice === 'number' ? `₹${bundle.originalPrice}` : bundle.originalPrice) : catalogItem.originalPrice,
      image: bundle.image || catalogItem.image,
      category: bundle.badge || catalogItem.category,
      volume: bundle.size ? bundle.size.replace(' • Free Shipping', '') : catalogItem.volume
    };
  }

  // Fallback for custom added products from admin
  const priceNum = typeof bundle.price === 'number' ? bundle.price : parseInt(String(bundle.price || '').replace(/[^0-9]/g, '')) || 499;
  const origNum = bundle.originalPrice ? (typeof bundle.originalPrice === 'number' ? bundle.originalPrice : parseInt(String(bundle.originalPrice).replace(/[^0-9]/g, ''))) : Math.round(priceNum * 1.35);

  return {
    id: idStr || `product-${Date.now()}`,
    name: bundle.name || 'Earthora Botanical Formulation',
    category: bundle.badge || 'BOTANICAL CARE & RADIANCE',
    tagline: bundle.size ? `${bundle.size} Formulated for pure radiance & glow.` : 'Formulated for natural skin radiance and gentle daily nourishment.',
    desc: bundle.desc || 'Formulated with cold-pressed natural botanicals for deep nourishment and skin radiance.',
    price: `₹${priceNum}`,
    originalPrice: `₹${origNum}`,
    volume: bundle.size ? bundle.size.replace(' • Free Shipping', '') : '100ml / 3.4 fl oz',
    rating: 4.9,
    reviewsCount: 1250,
    image: bundle.image || img1,
    ingredients: [
      {
        name: 'Cold-Pressed Botanical Elixir',
        botanicalName: 'Pure Botanical Complex',
        description: 'Formulated with pure adaptogenic plant extracts that soothe and revitalize the skin.'
      },
      {
        name: 'Natural Vitamin E Complex',
        botanicalName: 'Tocopherol Extract',
        description: 'Potent antioxidant shield that protects against daily environmental oxidation.'
      },
      {
        name: 'Organic Jojoba Base',
        botanicalName: 'Simmondsia Chinensis',
        description: 'Deeply hydrating plant wax that mirrors skin natural sebum for seamless absorption.'
      }
    ],
    benefits: [
      {
        title: '100% Pure Cold-Pressed Botanical Formulation',
        desc: 'Free from mineral oils, harsh parabens, sulfates, and synthetic dyes.'
      },
      {
        title: 'Deeply Moisturizes Without Clogging Pores',
        desc: 'Lightweight nutrient-dense texture absorbs smoothly into the dermal layers.'
      },
      {
        title: 'Restores Radiant Skin Barrier',
        desc: 'Enriched with essential fatty acids and antioxidants for long-lasting glow.'
      }
    ],
    howToUse: [
      {
        step: '01',
        title: 'Dispense properly',
        desc: 'Take an adequate amount onto clean, dry hands.'
      },
      {
        step: '02',
        title: 'Activate & warm',
        desc: 'Gently warm between palms to release natural botanical aromatics.'
      },
      {
        step: '03',
        title: 'Apply mindfully',
        desc: 'Smooth gently onto skin until absorbed.'
      }
    ]
  };
}

export const productData = {
  id: 'earthora-radiance-elixir',
  name: 'Earthora Aura Radiance & Cleansing Elixir',
  category: 'AYURVEDIC & BOTANICAL WELLNESS',
  tagline: 'A refined daily ritual for luminous, deeply refreshed and nourished skin.',
  rating: 4.9,
  reviewCount: 1250,
  bundles: [
    {
      id: 'product-1',
      name: 'Mamaearth Ubtan Natural Face Wash',
      size: '100ml • Free Shipping',
      price: 249,
      originalPrice: 349,
      discount: '28% OFF',
      badge: 'FACIAL CARE & RADIANCE',
      bestValue: false,
      image: img1,
    },
    {
      id: 'product-2',
      name: 'Mamaearth Anti-Pollution Face Cream',
      size: '80g • Free Shipping',
      price: 349,
      originalPrice: 499,
      discount: '30% OFF',
      badge: 'DAY CARE & PROTECTION',
      bestValue: false,
      image: img2,
    },
    {
      id: 'product-3',
      name: 'Neutrogena Hydro Boost Water Gel',
      size: '50g • Free Shipping',
      price: 950,
      originalPrice: 1250,
      discount: '24% OFF',
      badge: 'MOISTURIZER & HYDRATION',
      bestValue: true,
      image: img3,
    },
    {
      id: 'product-4',
      name: 'Cetaphil Gentle Oily Skin Cleanser',
      size: '125ml • Free Shipping',
      price: 599,
      originalPrice: 779,
      discount: '20% OFF',
      badge: 'DERMATOLOGICAL CLEANSER',
      bestValue: false,
      image: img4,
    },
    {
      id: 'product-5',
      name: 'Mamaearth Vitamin C Daily Glow Wash',
      size: '100ml • Free Shipping',
      price: 399,
      originalPrice: 549,
      discount: '27% OFF',
      badge: 'BRIGHTENING FACE WASH',
      bestValue: false,
      image: img5,
    }
  ] as ProductBundle[],
  galleryImages: [img1, img2, img3, img4, img5],
  trustHighlights: [
    { title: '10K+ Customers', label: 'HAPPY CLIENTS WORLDWIDE' },
    { title: '100% Botanical', label: 'ORGANIC BOTANICAL BLEND' },
    { title: 'GMP Certified', label: 'HIGHEST MANUFACTURING STANDARDS' },
    { title: '4.9★ Rating', label: '1,250+ VERIFIED REVIEWS' }
  ],
  benefits: [
    {
      id: 1,
      title: 'Relaxes & Soothes',
      desc: 'Supports the body natural need for muscle relaxation and mindful self-care after a long demanding day.',
      icon: 'sparkles'
    },
    {
      id: 2,
      title: 'Nourishes & Hydrates',
      desc: 'A lightweight botanical blend that keeps skin feeling velvety soft, smooth, and deeply hydrated.',
      icon: 'droplets'
    },
    {
      id: 3,
      title: 'Active Lifestyle Support',
      desc: 'Rich in natural antioxidants that boost vitality and fit seamlessly into your active daily routine.',
      icon: 'shield'
    }
  ],
  story: {
    eyebrow: 'ABOUT US • ROOTED IN AYURVEDA',
    title: 'About Earthora',
    tagline: 'Rooted in Ayurveda. Inspired by Nature.',
    introParagraphs: [
      'At Earthora, we believe wellness begins with a closer connection to nature and the timeless wisdom of Ayurveda. Our journey is built around a simple idea — creating thoughtfully formulated wellness and personal-care products that fit naturally into modern lifestyles while staying inspired by traditional Ayurvedic principles.',
      'We carefully select ingredients with a focus on quality, authenticity, and consistency, and work to bring together traditional knowledge with modern standards of product development and manufacturing.',
      'From everyday wellness to skincare, every Earthora product is created with attention to what matters most — quality ingredients, responsible formulation, and a commitment to your everyday well-being.'
    ],
    philosophy: {
      tag: 'OUR PHILOSOPHY',
      title: 'Nature. Ayurveda. Quality.',
      description: "We believe good products don't need to be complicated. Our aim is to create simple, purposeful products inspired by nature and Ayurveda, designed for everyday use."
    },
    promises: [
      {
        title: 'Ayurveda-Inspired Formulations',
        description: 'Inspired by traditional Ayurvedic knowledge and natural ingredients.'
      },
      {
        title: 'Quality & Care',
        description: 'We believe every product should meet consistent quality standards.'
      },
      {
        title: 'Thoughtful Ingredients',
        description: 'We focus on carefully selected ingredients and responsible formulation.'
      },
      {
        title: 'Modern Wellness',
        description: "Bringing traditional wisdom into products designed for today's lifestyle."
      }
    ],
    vision: {
      tag: 'OUR VISION',
      statement: 'To build a trusted Indian wellness brand that brings together the wisdom of Ayurveda, the goodness of nature, and modern standards of quality.'
    },
    signature: 'Earthora — Rooted in Ayurveda. Inspired by Nature.'
  },
  ingredients: [
    {
      id: 1,
      name: 'Ashwagandha Extract',
      botanicalName: 'Withania Somnifera',
      description: 'Renowned botanical adaptogen known for revitalizing fatigued skin and calming sensory stress.',
      image: img1
    },
    {
      id: 2,
      name: 'Rosehip & Jojoba Oil',
      botanicalName: 'Rosa Canina & Simmondsia',
      description: 'Rich in essentials fatty acids and Vitamin C to restore radiance and strengthen natural moisture barriers.',
      image: img2
    },
    {
      id: 3,
      name: 'Saffron Essence',
      botanicalName: 'Crocus Sativus',
      description: 'One of the world’s most precious botanicals, traditionally celebrated for luminous tone and clarity.',
      image: img3
    },
    {
      id: 4,
      name: 'Sweet Almond Base',
      botanicalName: 'Prunus Dulcis',
      description: 'Deeply soothing oil rich in Vitamin E that protects, softens, and deeply conditions delicate skin.',
      image: img4
    },
    {
      id: 5,
      name: 'Santal & Cedar Infusion',
      botanicalName: 'Santalum Album',
      description: 'Grounding natural aromatic notes that calm the senses and enhance the sensorial massage experience.',
      image: img5
    },
    {
      id: 6,
      name: 'Sesame Seed Carrier',
      botanicalName: 'Sesamum Indicum',
      description: 'A traditional botanical carrier oil that ensures deep dermal delivery of essential nutrients.',
      image: img1
    }
  ] as Ingredient[],
  usageSteps: [
    {
      step: '01',
      title: 'Dispense a few drops',
      desc: 'Take 3 to 5 drops of the warm elixir onto your clean palms.'
    },
    {
      step: '02',
      title: 'Warm & activate',
      desc: 'Rub your palms together gently to warm the oil and activate the natural botanical aromatics.'
    },
    {
      step: '03',
      title: 'Massage mindfully',
      desc: 'Massage in upward circular motions onto face, neck, or body until fully absorbed.'
    }
  ],
  lifestyle: {
    eyebrow: 'PART OF YOUR DAILY ELEVATION',
    title: 'A calm ritual, built seamlessly into your day',
    description: 'A few warm drops, a few quiet minutes. Earthora turns an everyday habit into an extraordinary moment of self-care — morning or evening, wherever your journey leads.',
    bullets: [
      'Non-greasy, absorbs within minutes',
      'Warm, subtle natural herbal aroma',
      'Sleek amber bottle designed for home display & travel'
    ],
    image: img5
  },
  comparison: [
    { 
      feature: 'Core Formulation', 
      earthoraText: 'Rooted in Ayurveda & inspired by nature', 
      othersText: 'Chemical-heavy synthetic bases', 
      earthora: true, 
      others: false 
    },
    { 
      feature: 'Ingredient Sourcing', 
      earthoraText: 'Carefully selected for authenticity, quality & consistency', 
      othersText: 'Low-cost bulk fillers & diluted extracts', 
      earthora: true, 
      others: false 
    },
    { 
      feature: 'Product Philosophy', 
      earthoraText: 'Simple, purposeful products made for daily modern life', 
      othersText: 'Over-complicated formulas with unnecessary additives', 
      earthora: true, 
      others: false 
    },
    { 
      feature: 'Quality & Safety', 
      earthoraText: 'Traditional wisdom with modern manufacturing standards', 
      othersText: 'Unstandardized commercial processing', 
      earthora: true, 
      others: false 
    },
    { 
      feature: 'Clean & Responsible', 
      earthoraText: 'Free from harsh parabens, silicones & artificial dyes', 
      othersText: 'Commonly contains harsh sulfates & synthetic dyes', 
      earthora: true, 
      others: false 
    },
    { 
      feature: 'Everyday Well-being', 
      earthoraText: 'Gentle on skin barrier for consistent daily wellness', 
      othersText: 'Can strip moisture barrier and cause irritation', 
      earthora: true, 
      others: false 
    }
  ],
  reviews: [
    {
      id: 1,
      name: 'Aarav M.',
      rating: 5,
      date: 'August 24, 2026',
      title: 'Remarkable texture and immediate relief',
      comment: 'Earthora has completely replaced my standard post-shower moisturizer. The scent is subtle and grounding, and my skin feels deeply nourished without any oily residue.',
      verified: true,
      location: 'Mumbai, MH'
    },
    {
      id: 2,
      name: 'Vikram S.',
      rating: 5,
      date: 'August 18, 2026',
      title: 'A true luxury ritual',
      comment: 'The packaging and product quality are exceptional. Using it in the evening before sleep has become my favorite way to unwind.',
      verified: true,
      location: 'New Delhi, DL'
    }
  ] as Review[],
  faqs: [
    {
      id: 1,
      question: 'How often should I use the Earthora Radiance Elixir?',
      answer: 'For optimal benefits, we recommend applying 3-5 drops once or twice daily after cleansing. It works beautifully as part of your morning skincare routine or your evening unwind ritual.'
    },
    {
      id: 2,
      question: 'Is this product suitable for all skin types?',
      answer: 'Yes! Earthora is formulated with lightweight botanical oils (such as Jojoba and Sweet Almond) that balance hydration without clogging pores, making it suitable for dry, normal, combination, and sensitive skin.'
    },
    {
      id: 3,
      question: 'Will it leave a greasy or sticky residue?',
      answer: 'No. Unlike heavy synthetic oils, our cold-pressed botanical carrier blend absorbs into the dermal layer within 2-3 minutes, leaving skin soft, supple, and dry to the touch.'
    },
    {
      id: 4,
      question: 'What is the shelf life of the elixir?',
      answer: 'Earthora products have a shelf life of 24 months unopened, and 12 months after opening. Store in a cool, dry place away from direct sunlight.'
    },
    {
      id: 5,
      question: 'What are the delivery times and payment options?',
      answer: 'We offer Express Shipping across India (3-5 business days) with Cash on Delivery (COD), UPI, and major Credit/Debit cards supported.'
    }
  ] as FAQItem[]
};
