import { createClient } from '@supabase/supabase-js';
import type { CustomerOrder, OrderStatus } from '../types/adminTypes';
import type { ProductBundle, Review } from '../data/productData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wkoxputlkexiwkpgghux.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY');

// Supabase Database Sync Helper Functions
export const supabaseDb = {
  // Orders
  async getOrders(): Promise<CustomerOrder[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase getOrders warning:', error.message);
        return null;
      }
      return data as CustomerOrder[];
    } catch (e) {
      console.warn('Supabase getOrders catch:', e);
      return null;
    }
  },

  async createOrder(order: CustomerOrder): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('orders').insert([order]);
      if (error) console.warn('Supabase createOrder warning:', error.message);
      return !error;
    } catch (e) {
      console.warn('Supabase createOrder catch:', e);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, tracking_number: trackingNumber })
        .eq('id', orderId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // Products
  async getProducts(): Promise<ProductBundle[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) return null;
      return data as ProductBundle[];
    } catch (e) {
      return null;
    }
  },

  async saveProducts(bundles: ProductBundle[]): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('products').upsert(bundles);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // Reviews
  async getReviews(): Promise<Review[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('reviews').select('*');
      if (error) return null;
      return data as Review[];
    } catch (e) {
      return null;
    }
  },

  async saveReviews(reviews: Review[]): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('reviews').upsert(reviews);
      return !error;
    } catch (e) {
      return false;
    }
  }
};
