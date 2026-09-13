import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://wkoxputlkexiwkpgghux.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb3hwdXRsa2V4aXdrcGdnaHV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI5OTE0MiwiZXhwIjoyMTA0ODc1MTQyfQ.tLxvQkiTuTbLvd1yUJmDeihbsqWkaOcieJoQhnbWiZI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getBase64Image(filename) {
  const filePath = path.resolve(__dirname, '../src/assets', filename);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
    return `data:image/jpeg;base64,${fileData.toString('base64')}`;
  }
  return '';
}

const productsToSeed = [
  {
    id: 'product-1',
    name: 'Mamaearth Ubtan Natural Face Wash',
    size: '100ml • Free Shipping',
    price: 249,
    original_price: 349,
    discount: '28% OFF',
    badge: 'FACIAL CARE & RADIANCE',
    best_value: false,
    image: getBase64Image('images (1).jpg')
  },
  {
    id: 'product-2',
    name: 'Mamaearth Anti-Pollution Face Cream',
    size: '80g • Free Shipping',
    price: 349,
    original_price: 499,
    discount: '30% OFF',
    badge: 'DAY CARE & PROTECTION',
    best_value: false,
    image: getBase64Image('images (2).jpg')
  },
  {
    id: 'product-3',
    name: 'Neutrogena Hydro Boost Water Gel',
    size: '50g • Free Shipping',
    price: 950,
    original_price: 1250,
    discount: '24% OFF',
    badge: 'MOISTURIZER & HYDRATION',
    best_value: true,
    image: getBase64Image('images (4).jpg')
  },
  {
    id: 'product-4',
    name: 'Cetaphil Gentle Oily Skin Cleanser',
    size: '125ml • Free Shipping',
    price: 599,
    original_price: 750,
    discount: '20% OFF',
    badge: 'DERMATOLOGICAL CLEANSER',
    best_value: false,
    image: getBase64Image('images (3).jpg')
  },
  {
    id: 'product-5',
    name: 'Mamaearth Vitamin C Daily Glow Wash',
    size: '100ml • Free Shipping',
    price: 399,
    original_price: 549,
    discount: '27% OFF',
    badge: 'BRIGHTENING FACE WASH',
    best_value: false,
    image: getBase64Image('images6.jpg')
  }
];

async function seed() {
  console.log('Seeding products to Supabase...');
  
  // Upsert products
  const { data, error } = await supabase
    .from('products')
    .upsert(productsToSeed, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log('Successfully seeded 5 products with images to Supabase database!');
  }
}

seed();
