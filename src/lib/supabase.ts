import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching the existing schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          roll_number: string;
          branch: string;
          password: string;
          profile_photo: string;
          qr_code: string;
          is_approved: boolean;
          is_rejected: boolean;
          approved_by: string | null;
          approved_at: string | null;
          rejected_by: string | null;
          rejected_at: string | null;
          rejection_reason: string | null;
          join_date: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          roll_number: string;
          branch: string;
          password: string;
          profile_photo?: string;
          qr_code: string;
          is_approved?: boolean;
          is_rejected?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          rejected_by?: string | null;
          rejected_at?: string | null;
          rejection_reason?: string | null;
          join_date: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          roll_number?: string;
          branch?: string;
          password?: string;
          profile_photo?: string;
          qr_code?: string;
          is_approved?: boolean;
          is_rejected?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          rejected_by?: string | null;
          rejected_at?: string | null;
          rejection_reason?: string | null;
          join_date?: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          level: 'national' | 'district' | 'state';
          achievement_date: string;
          photo_url: string | null;
          is_verified: boolean;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          level: 'national' | 'district' | 'state';
          achievement_date: string;
          photo_url?: string | null;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          level?: 'national' | 'district' | 'state';
          achievement_date?: string;
          photo_url?: string | null;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          file_url: string;
          upload_date: string;
          is_verified: boolean;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          file_url: string;
          upload_date: string;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          file_url?: string;
          upload_date?: string;
          is_verified?: boolean;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          start_date: string;
          end_date: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          start_date: string;
          end_date: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          start_date?: string;
          end_date?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          user_roll_number: string;
          user_name: string;
          is_approved: boolean;
          approved_by: string | null;
          approved_at: string | null;
          attendance_status: string | null;
          attendance_date: string | null;
          registered_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          event_id: string;
          user_id: string;
          user_roll_number: string;
          user_name: string;
          is_approved?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          attendance_status?: string | null;
          attendance_date?: string | null;
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          user_roll_number?: string;
          user_name?: string;
          is_approved?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          attendance_status?: string | null;
          attendance_date?: string | null;
          registered_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_photos: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          photo_url: string;
          title: string;
          description: string;
          upload_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          event_id: string;
          photo_url: string;
          title: string;
          description: string;
          upload_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          photo_url?: string;
          title?: string;
          description?: string;
          upload_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          user_roll_number: string;
          title: string;
          description: string;
          category: 'general' | 'event' | 'system' | 'achievement';
          status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
          reviewed_by: string | null;
          reviewed_at: string | null;
          response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          user_name: string;
          user_roll_number: string;
          title: string;
          description: string;
          category: 'general' | 'event' | 'system' | 'achievement';
          status?: 'pending' | 'reviewed' | 'implemented' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          user_roll_number?: string;
          title?: string;
          description?: string;
          category?: 'general' | 'event' | 'system' | 'achievement';
          status?: 'pending' | 'reviewed' | 'implemented' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          email: string;
          password: string;
          full_name: string;
          role: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          password: string;
          full_name: string;
          role: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          password?: string;
          full_name?: string;
          role?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Type-safe Supabase client
export type SupabaseClient = typeof supabase;
