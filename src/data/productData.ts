import img1 from '../assets/images (1).jpg';
import img2 from '../assets/images (2).jpg';
import img3 from '../assets/images (3).jpg';
import img4 from '../assets/images (4).jpg';
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
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
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
      originalPrice: 750,
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
    },
    {
      id: 4,
      title: 'Daily Mindful Ritual',
      desc: 'Made to turn everyday grooming into a grounding, luxurious moment of personal renewal.',
      icon: 'sun'
    }
  ],
  story: {
    eyebrow: 'MADE FOR TODAY’S DISCERNING INDIVIDUAL',
    title: 'Most people never make time for the quiet care their body deserves.',
    paragraph1: 'Long days, constant stress, and environmental fatigue are part of modern life — yet the body’s need for a moment of calm is often the first thing we skip.',
    paragraph2: 'Earthora Aura Elixir is a signature botanical formulation crafted for total wellness. A few warm drops rubbed between palms and massage gently into skin turn a daily routine into an elevated self-care ritual.',
    bullets: [
      'Lightweight, non-greasy texture — absorbs smoothly with zero sticky residue',
      'Free from harmful chemicals, parabens & artificial colorants',
      'Infused with 6 pure botanical extracts in a nutrient-rich carrier base',
      'Ideal for morning energizing or evening relaxation rituals'
    ]
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
    { feature: '100% Pure Botanical Ingredients', earthora: true, others: false },
    { feature: 'Non-Greasy Fast Absorption Formula', earthora: true, others: false },
    { feature: 'Free from Parabens & Mineral Oils', earthora: true, others: false },
    { feature: 'Rich in Essential Vitamin E & Antioxidants', earthora: true, others: true },
    { feature: 'Sustainably & Ethically Sourced', earthora: true, others: false },
    { feature: 'Cruelty-Free & Dermatologically Tested', earthora: true, others: false }
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
    },
    {
      id: 3,
      name: 'Priya K.',
      rating: 5,
      date: 'August 10, 2026',
      title: 'Visible skin radiance in two weeks',
      comment: 'I was skeptical about facial oils, but Earthora absorbs so fast. My skin looks vibrant and feels smooth all day long.',
      verified: true,
      location: 'Bengaluru, KA'
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
