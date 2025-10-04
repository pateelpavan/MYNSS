import { supabase } from './supabase';
import type { Database } from './supabase';

// Type aliases for easier usage
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

type Achievement = Database['public']['Tables']['achievements']['Row'];
type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];
type AchievementUpdate = Database['public']['Tables']['achievements']['Update'];

type Certificate = Database['public']['Tables']['certificates']['Row'];
type CertificateInsert = Database['public']['Tables']['certificates']['Insert'];
type CertificateUpdate = Database['public']['Tables']['certificates']['Update'];

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];
type EventRegistrationUpdate = Database['public']['Tables']['event_registrations']['Update'];

type EventPhoto = Database['public']['Tables']['event_photos']['Row'];
type EventPhotoInsert = Database['public']['Tables']['event_photos']['Insert'];
type EventPhotoUpdate = Database['public']['Tables']['event_photos']['Update'];

type Suggestion = Database['public']['Tables']['suggestions']['Row'];
type SuggestionInsert = Database['public']['Tables']['suggestions']['Insert'];
type SuggestionUpdate = Database['public']['Tables']['suggestions']['Update'];

type AdminUser = Database['public']['Tables']['admin_users']['Row'];
type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert'];
type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update'];

// Utility functions
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// User operations
export const userService = {
  // Create a new user
  create: async (userData: Omit<UserInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const user: UserInsert = {
      id: generateUUID(),
      ...userData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by roll number
  getByRollNumber: async (rollNumber: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('roll_number', rollNumber)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all users
  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get approved users
  getApproved: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get pending users
  getPending: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_approved', false)
      .eq('is_rejected', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Approve user
  approve: async (id: string, approvedBy: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_approved: true,
        is_rejected: false,
        approved_by: approvedBy,
        approved_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reject user
  reject: async (id: string, rejectedBy: string, reason?: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_approved: false,
        is_rejected: true,
        rejected_by: rejectedBy,
        rejected_at: getCurrentTimestamp(),
        rejection_reason: reason || 'No reason provided',
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user
  update: async (id: string, updates: UserUpdate) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete user
  delete: async (id: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Achievement operations
export const achievementService = {
  // Create achievement
  create: async (achievementData: Omit<AchievementInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const achievement: AchievementInsert = {
      id: generateUUID(),
      ...achievementData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('achievements')
      .insert(achievement)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get achievements by user ID
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('achievement_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all achievements with user info
  getAll: async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select(`
        *,
        users!inner(full_name, roll_number, is_approved)
      `)
      .eq('users.is_approved', true)
      .order('level', { ascending: false })
      .order('achievement_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get top achievements
  getTopAchievements: async (limit: number = 10) => {
    const { data, error } = await supabase
      .from('achievements')
      .select(`
        *,
        users!inner(full_name, roll_number, is_approved)
      `)
      .eq('users.is_approved', true)
      .order('level', { ascending: false })
      .order('achievement_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Update achievement
  update: async (id: string, updates: AchievementUpdate) => {
    const { data, error } = await supabase
      .from('achievements')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete achievement
  delete: async (id: string) => {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Certificate operations
export const certificateService = {
  // Create certificate
  create: async (certificateData: Omit<CertificateInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const certificate: CertificateInsert = {
      id: generateUUID(),
      ...certificateData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get certificates by user ID
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all certificates with user info
  getAll: async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        users!inner(full_name, roll_number)
      `)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Verify certificate
  verify: async (id: string, verifiedBy: string) => {
    const { data, error } = await supabase
      .from('certificates')
      .update({
        is_verified: true,
        verified_by: verifiedBy,
        verified_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update certificate
  update: async (id: string, updates: CertificateUpdate) => {
    const { data, error } = await supabase
      .from('certificates')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete certificate
  delete: async (id: string) => {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Event operations
export const eventService = {
  // Create event
  create: async (eventData: Omit<EventInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const event: EventInsert = {
      id: generateUUID(),
      ...eventData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all events
  getAll: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get event by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get upcoming events
  getUpcoming: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Update event
  update: async (id: string, updates: EventUpdate) => {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete event
  delete: async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Event registration operations
export const eventRegistrationService = {
  // Create event registration
  create: async (registrationData: Omit<EventRegistrationInsert, 'id' | 'registered_at' | 'created_at' | 'updated_at'>) => {
    const registration: EventRegistrationInsert = {
      id: generateUUID(),
      ...registrationData,
      registered_at: getCurrentTimestamp(),
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('event_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get registrations by event ID
  getByEventId: async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get registrations by user ID
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events!inner(title, start_date, end_date)
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Approve registration
  approve: async (id: string, approvedBy: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({
        is_approved: true,
        approved_by: approvedBy,
        approved_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if user is registered for event
  checkRegistration: async (eventId: string, userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Update attendance
  updateAttendance: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({
        attendance_status: status,
        attendance_date: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Event photo operations
export const eventPhotoService = {
  // Create event photo
  create: async (photoData: Omit<EventPhotoInsert, 'id' | 'upload_date' | 'created_at' | 'updated_at'>) => {
    const photo: EventPhotoInsert = {
      id: generateUUID(),
      ...photoData,
      upload_date: getCurrentTimestamp(),
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('event_photos')
      .insert(photo)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get photos by user ID
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get photos by event ID
  getByEventId: async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update photo
  update: async (id: string, updates: EventPhotoUpdate) => {
    const { data, error } = await supabase
      .from('event_photos')
      .update({
        ...updates,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete photo
  delete: async (id: string) => {
    const { error } = await supabase
      .from('event_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Suggestion operations
export const suggestionService = {
  // Create suggestion
  create: async (suggestionData: Omit<SuggestionInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const suggestion: SuggestionInsert = {
      id: generateUUID(),
      ...suggestionData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    const { data, error } = await supabase
      .from('suggestions')
      .insert(suggestion)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all suggestions
  getAll: async () => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get suggestions by status
  getByStatus: async (status: string) => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get suggestions by user ID
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  // Update suggestion status
  updateStatus: async (id: string, status: string, reviewedBy: string, response?: string) => {
    const { data, error } = await supabase
      .from('suggestions')
      .update({
        status: status as any,
        reviewed_by: reviewedBy,
        reviewed_at: getCurrentTimestamp(),
        response: response || null,
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  // Delete suggestion
  delete: async (id: string) => {
    const { error } = await supabase
      .from('suggestions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
// Admin user operations
export const adminUserService = {
  // Get admin by username
  getByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },
  // Get admin by email
  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },
  // Create admin user
  create: async (adminData: Omit<AdminUserInsert, 'id' | 'created_at' | 'updated_at'>) => {
    const admin: AdminUserInsert = {
      id: generateUUID(),
      ...adminData,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };
    const { data, error } = await supabase
      .from('admin_users')
      .insert(admin)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  // Update last login
  updateLastLogin: async (id: string) => {
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        last_login: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
// Statistics operations
export const statisticsService = {
  // Get user statistics
  getUserStats: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('is_approved, is_rejected');

    if (error) throw error;

    const stats = {
      total_users: data.length,
      approved_users: data.filter(u => u.is_approved).length,
      pending_users: data.filter(u => !u.is_approved && !u.is_rejected).length,
      rejected_users: data.filter(u => u.is_rejected).length,
    };

    return stats;
  },
  // Get achievement statistics
  getAchievementStats: async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('level, is_verified');

    if (error) throw error;

    const stats = data.reduce((acc, achievement) => {
      const level = achievement.level;
      if (!acc[level]) {
        acc[level] = { count: 0, verified_count: 0 };
      }
      acc[level].count++;
      if (achievement.is_verified) {
        acc[level].verified_count++;
      }
      return acc;
    }, {} as Record<string, { count: number; verified_count: number }>);

    return stats;
  },
  // Get event statistics
  getEventStats: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('event_date');

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total_events: data.length,
      upcoming_events: data.filter(e => e.event_date >= today).length,
      past_events: data.filter(e => e.event_date < today).length,
    };

    return stats;
  },
  // Get suggestion statistics
  getSuggestionStats: async () => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('status');

    if (error) throw error;

    const stats = data.reduce((acc, suggestion) => {
      const status = suggestion.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  },
};
// Export all services
export const supabaseService = {
  user: userService,
  achievement: achievementService,
  certificate: certificateService,
  event: eventService,
  eventRegistration: eventRegistrationService,
  eventPhoto: eventPhotoService,
  suggestion: suggestionService,
  adminUser: adminUserService,
  statistics: statisticsService,
};
// Realtime helpers
type PostgresChangePayload<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: T | null;
};

type TableChangeHandlers<T> = {
  onInsert?: (row: T) => void;
  onUpdate?: (row: T) => void;
  onDelete?: (row: T) => void;
  onAny?: (payload: PostgresChangePayload<T>) => void;
};

const subscribeToTableChanges = <T = any>(
  table: keyof Database['public']['Tables'] | string,
  handlers: TableChangeHandlers<T>
) => {
  const channel = supabase
    .channel(`realtime:${String(table)}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: String(table) },
      (payload: any) => {
        const evt = payload.eventType as PostgresChangePayload<T>['eventType'];
        const pgPayload: PostgresChangePayload<T> = {
          eventType: evt,
          new: payload.new as T | null,
          old: payload.old as T | null,
        };
        handlers.onAny?.(pgPayload);
        if (evt === 'INSERT' && pgPayload.new) handlers.onInsert?.(pgPayload.new);
        if (evt === 'UPDATE' && pgPayload.new) handlers.onUpdate?.(pgPayload.new);
        if (evt === 'DELETE' && pgPayload.old) handlers.onDelete?.(pgPayload.old);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const realtimeService = {
  subscribeToTableChanges,
  onUsers: (handlers: TableChangeHandlers<User>) => subscribeToTableChanges<User>('users', handlers),
  onEvents: (handlers: TableChangeHandlers<Event>) => subscribeToTableChanges<Event>('events', handlers),
  onAchievements: (handlers: TableChangeHandlers<Achievement>) => subscribeToTableChanges<Achievement>('achievements', handlers),
  onCertificates: (handlers: TableChangeHandlers<Certificate>) => subscribeToTableChanges<Certificate>('certificates', handlers),
  onEventRegistrations: (handlers: TableChangeHandlers<EventRegistration>) =>
    subscribeToTableChanges<EventRegistration>('event_registrations', handlers),
  onEventPhotos: (handlers: TableChangeHandlers<EventPhoto>) => subscribeToTableChanges<EventPhoto>('event_photos', handlers),
  onSuggestions: (handlers: TableChangeHandlers<Suggestion>) => subscribeToTableChanges<Suggestion>('suggestions', handlers),
  onAdminUsers: (handlers: TableChangeHandlers<AdminUser>) => subscribeToTableChanges<AdminUser>('admin_users', handlers),
};

// Export with existing services
export const supabaseLive = realtimeService;