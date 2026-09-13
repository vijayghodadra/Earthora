-- Earthora Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/wkoxputlkexiwkpgghux/sql)

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount TEXT,
  badge TEXT,
  best_value BOOLEAN DEFAULT false,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT,
  date TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Paid',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'Processing',
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  date TEXT,
  title TEXT,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  expiry_date TEXT,
  usage_count INT DEFAULT 0,
  max_usage INT DEFAULT 500,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read & Insert Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public Read & Insert Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public Read & Insert Reviews" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Public Read & Insert Coupons" ON public.coupons FOR ALL USING (true);
