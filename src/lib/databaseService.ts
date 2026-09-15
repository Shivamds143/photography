import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Category, 
  PhotographyService, 
  GalleryImage, 
  Booking, 
  UserProfile, 
  BookingStatus 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  INITIAL_GALLERY, 
  INITIAL_BOOKINGS, 
  INITIAL_USERS 
} from './mockData';

const STORAGE_KEYS = {
  CATEGORIES: 'aura_categories',
  SERVICES: 'aura_services',
  GALLERY: 'aura_gallery',
  BOOKINGS: 'aura_bookings',
  USERS: 'aura_users',
  CURRENT_USER: 'aura_current_user'
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// ----------------------------------------------------
// Database Service Interface
// ----------------------------------------------------

export const db = {
  // === CATEGORIES ===
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    }
    return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async addCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').insert([newCategory]).select().single();
      if (!error && data) return data as Category;
    }

    const list = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = [...list, newCategory];
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Category;
    }

    const list = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = list.map(c => c.id === id ? { ...c, ...updates } : c);
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return updated.find(c => c.id === id)!;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return true;
    }

    const list = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const updated = list.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return true;
  },

  // === SERVICES ===
  async getServices(): Promise<PhotographyService[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*').order('price', { ascending: true });
      if (!error && data && data.length > 0) return data as PhotographyService[];
    }
    return getFromStorage<PhotographyService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async addService(service: Omit<PhotographyService, 'id'>): Promise<PhotographyService> {
    const newService: PhotographyService = {
      ...service,
      id: `srv-${Date.now()}`
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').insert([newService]).select().single();
      if (!error && data) return data as PhotographyService;
    }

    const list = getFromStorage<PhotographyService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const updated = [...list, newService];
    saveToStorage(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async createService(service: Omit<PhotographyService, 'id'>): Promise<PhotographyService> {
    return this.addService(service);
  },

  async updateService(id: string, updates: Partial<PhotographyService>): Promise<PhotographyService> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
      if (!error && data) return data as PhotographyService;
    }

    const list = getFromStorage<PhotographyService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const updated = list.map(s => s.id === id ? { ...s, ...updates } : s);
    saveToStorage(STORAGE_KEYS.SERVICES, updated);
    return updated.find(s => s.id === id)!;
  },

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (!error) return true;
    }

    const list = getFromStorage<PhotographyService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const updated = list.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, updated);
    return true;
  },

  // === GALLERY ===
  async getGalleryImages(categorySlug?: string): Promise<GalleryImage[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (categorySlug && categorySlug !== 'all') {
        query = query.eq('category_slug', categorySlug);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as GalleryImage[];
    }

    const list = getFromStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    if (categorySlug && categorySlug !== 'all') {
      return list.filter(img => img.category_slug.toLowerCase() === categorySlug.toLowerCase());
    }
    return list;
  },

  async addGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
    const newImage: GalleryImage = {
      ...image,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery_images').insert([newImage]).select().single();
      if (!error && data) return data as GalleryImage;
    }

    const list = getFromStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const updated = [newImage, ...list];
    saveToStorage(STORAGE_KEYS.GALLERY, updated);
    return newImage;
  },

  async createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
    return this.addGalleryImage(image);
  },

  async updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery_images').update(updates).eq('id', id).select().single();
      if (!error && data) return data as GalleryImage;
    }

    const list = getFromStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const updated = list.map(img => img.id === id ? { ...img, ...updates } : img);
    saveToStorage(STORAGE_KEYS.GALLERY, updated);
    return updated.find(img => img.id === id)!;
  },

  async deleteGalleryImage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (!error) return true;
    }

    const list = getFromStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const updated = list.filter(img => img.id !== id);
    saveToStorage(STORAGE_KEYS.GALLERY, updated);
    return true;
  },

  // === BOOKINGS ===
  async getAllBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true });
      if (!error && data) return data as Booking[];
    }
    return getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .order('booking_date', { ascending: false });
      if (!error && data) return data as Booking[];
    }
    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return list.filter(b => b.customer_id === customerId);
  },

  async checkConflict(date: string, timeSlot: string): Promise<boolean> {
    const list = await this.getAllBookings();
    // Confirmed or pending booking on the exact same date & time slot
    return list.some(
      b => b.booking_date === date && b.time_slot === timeSlot && (b.status === 'confirmed' || b.status === 'pending')
    );
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'created_at'>): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
      if (!error && data) return data as Booking;
    }

    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const updated = [newBooking, ...list];
    saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
    return newBooking;
  },

  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const updates: Partial<Booking> = { status };
    if (notes !== undefined) updates.notes = notes;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Booking;
    }

    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const updated = list.map(b => b.id === id ? { ...b, ...updates } : b);
    saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
    return updated.find(b => b.id === id)!;
  },

  async updateBookingNotes(id: string, notes: string): Promise<Booking> {
    const updates: Partial<Booking> = { notes };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Booking;
    }

    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const updated = list.map(b => b.id === id ? { ...b, ...updates } : b);
    saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
    return updated.find(b => b.id === id)!;
  },

  async cancelBooking(id: string, customerId: string): Promise<{ success: boolean; message?: string }> {
    const list = getFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const booking = list.find(b => b.id === id);

    if (!booking) return { success: false, message: 'Booking not found' };
    if (booking.customer_id !== customerId) {
      return { success: false, message: 'Unauthorized: You can only cancel your own bookings' };
    }
    if (booking.status === 'completed') {
      return { success: false, message: 'Cannot cancel an already completed booking' };
    }

    await this.updateBookingStatus(id, 'cancelled', 'Cancelled by client');
    return { success: true };
  },

  // === USERS / PROFILES ===
  async getAllUsers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data as UserProfile[];
    }
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (!error && data) return data as UserProfile;
    }

    const list = getFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = list.map(u => u.id === id ? { ...u, ...updates } : u);
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return updated.find(u => u.id === id)!;
  },

  // === AUTHENTICATION HELPER ===
  getCurrentUser(): UserProfile | null {
    return getFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: UserProfile | null): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  async login(email: string, role: 'customer' | 'admin' = 'customer'): Promise<UserProfile> {
    const users = await this.getAllUsers();
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      // Auto register demo profile
      existing = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace('.', ' '),
        role,
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        created_at: new Date().toISOString().split('T')[0]
      };
      const updated = [...users, existing];
      saveToStorage(STORAGE_KEYS.USERS, updated);
    }

    this.setCurrentUser(existing);
    return existing;
  },

  async register(data: { email: string; full_name: string; phone?: string; role?: 'customer' | 'admin' }): Promise<UserProfile> {
    const users = await this.getAllUsers();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone || '',
      role: data.role || 'customer',
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [...users, newUser];
    saveToStorage(STORAGE_KEYS.USERS, updated);
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  resetDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
