export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  display_order: number;
}

export interface PhotographyService {
  id: string;
  title: string;
  slug: string;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  description: string;
  price: number;
  duration_minutes: number;
  features: string[];
  cover_image: string;
  is_popular?: boolean;
}

export type OrientationType = 'landscape' | 'portrait' | 'square';

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  featured?: boolean;
  camera_specs?: string;
  location?: string;
  orientation?: OrientationType;
  created_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string;
  service_title: string;
  service_price: number;
  booking_date: string; // YYYY-MM-DD
  time_slot: string;    // e.g. "10:00 AM - 12:00 PM"
  location: string;
  message?: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  category: string;
  comment: string;
  avatar: string;
  rating: number;
  date: string;
}

export interface Statistic {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

export type PageView =
  | 'home'
  | 'about'
  | 'services'
  | 'gallery'
  | 'contact'
  | 'booking'
  | 'login'
  | 'register'
  | 'customer-dashboard'
  | 'customer-bookings'
  | 'customer-profile'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-bookings'
  | 'admin-gallery'
  | 'admin-categories'
  | 'admin-services'
  | 'admin-users';
