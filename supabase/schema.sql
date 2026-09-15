-- ====================================================================
-- AURA PHOTOGRAPHY STUDIO - SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Suitable for Third Year Computer Science Project
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Existing Tables (Optional - only if starting fresh)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  features TEXT[] DEFAULT '{}',
  cover_image TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY IMAGES TABLE
CREATE TABLE gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  category_name TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  camera_specs TEXT,
  location TEXT,
  orientation TEXT DEFAULT 'portrait' CHECK (orientation IN ('landscape', 'portrait', 'square')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  service_title TEXT NOT NULL,
  service_price NUMERIC(10, 2) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_date_slot ON bookings(booking_date, time_slot);
CREATE INDEX idx_gallery_category ON gallery_images(category_slug);
CREATE INDEX idx_services_category ON services(category_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
-- Users can view their own profile; Admins can view all
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id OR is_admin());

-- Users can update their own profile; Admins can update any
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id OR is_admin());

-- Profiles can be inserted upon signup
CREATE POLICY "Insert profile on signup" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR is_admin());

-- --- CATEGORIES POLICIES ---
-- Public can read categories
CREATE POLICY "Public read categories" 
ON categories FOR SELECT 
TO public 
USING (true);

-- Only admins can insert, update, or delete categories
CREATE POLICY "Admins manage categories" 
ON categories FOR ALL 
TO authenticated 
USING (is_admin());

-- --- SERVICES POLICIES ---
-- Public can read services
CREATE POLICY "Public read services" 
ON services FOR SELECT 
TO public 
USING (true);

-- Only admins can manage services
CREATE POLICY "Admins manage services" 
ON services FOR ALL 
TO authenticated 
USING (is_admin());

-- --- GALLERY IMAGES POLICIES ---
-- Public can read gallery images
CREATE POLICY "Public read gallery" 
ON gallery_images FOR SELECT 
TO public 
USING (true);

-- Only admins can manage gallery images
CREATE POLICY "Admins manage gallery" 
ON gallery_images FOR ALL 
TO authenticated 
USING (is_admin());

-- --- BOOKINGS POLICIES ---
-- Customers can view only their own bookings; Admins can view all bookings
CREATE POLICY "View bookings policy" 
ON bookings FOR SELECT 
TO authenticated 
USING (customer_id = auth.uid()::text OR is_admin());

-- Authenticated customers can insert booking requests
CREATE POLICY "Insert bookings policy" 
ON bookings FOR INSERT 
TO authenticated 
WITH CHECK (customer_id = auth.uid()::text OR is_admin());

-- Customers can update/cancel their own pending bookings; Admins can update any
CREATE POLICY "Update bookings policy" 
ON bookings FOR UPDATE 
TO authenticated 
USING (
  (customer_id = auth.uid()::text AND status = 'pending') 
  OR is_admin()
);

-- Only admins can delete bookings
CREATE POLICY "Delete bookings admin only" 
ON bookings FOR DELETE 
TO authenticated 
USING (is_admin());

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (SUPABASE AUTH HOOK)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

INSERT INTO categories (id, name, slug, description, cover_image, display_order) VALUES
('cat-wedding', 'Wedding', 'wedding', 'Timeless cinematic moments capturing intimate vows, tears of joy, and magnificent celebrations.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', 1),
('cat-prewedding', 'Pre-Wedding', 'pre-wedding', 'Romantic story-driven couple sessions amidst scenic architectural and natural landscapes.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', 2),
('cat-portrait', 'Portrait', 'portrait', 'Striking editorial and studio headshots highlighting raw personality and expressive depth.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', 3),
('cat-fashion', 'Fashion', 'fashion', 'High-concept lookbooks, avant-garde styling, and commercial model campaigns.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 4),
('cat-events', 'Events', 'events', 'Dynamic cultural galas, live conferences, milestone anniversaries, and VIP gatherings.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', 5),
('cat-nature', 'Nature', 'nature', 'Breathtaking fine-art landscapes, golden hour vistas, and pristine atmospheric wilderness.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, title, slug, category_id, category_name, description, price, duration_minutes, features, cover_image, is_popular) VALUES
('srv-wedding-signature', 'The Royal Wedding Experience', 'royal-wedding', 'cat-wedding', 'Wedding', 'Full-day comprehensive coverage from morning preparation to twilight grand exit, featuring two senior photographers and an assistant.', 2400.00, 600, ARRAY['Up to 10 hours continuous coverage', 'Lead Photographer + Second Shooter', '450+ High-resolution retouched images', 'Private online gallery with print store', 'Full rights for personal printing & web', 'Handcrafted linen fine-art wedding album'], 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', true),
('srv-prewedding-love', 'Cinematic Pre-Wedding Story', 'pre-wedding-story', 'cat-prewedding', 'Pre-Wedding', 'Curated 4-hour storytelling session across two breathtaking destination locations with moodboard consultation.', 950.00, 240, ARRAY['4 Hours on-location shoot', 'Up to 3 outfit changes', '60+ Master-graded fine-art photographs', 'Cinematic 60-second teaser reel', 'Location scout & styling assistance'], 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80', false),
('srv-editorial-portrait', 'Editorial & Studio Portraiture', 'editorial-portrait', 'cat-portrait', 'Portrait', 'Intimate studio or outdoor session crafted for artists, executives, and creative entrepreneurs seeking iconic visuals.', 450.00, 90, ARRAY['90 Minutes studio or urban location', 'Lighting setup with key & rim strobes', '20 Masterfully retouched portraits', 'Professional color grading & black & white alternates', 'Immediate sneak-peek delivered within 48h'], 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80', false),
('srv-fashion-lookbook', 'Fashion Lookbook & Campaign', 'fashion-campaign', 'cat-fashion', 'Fashion', 'Commercial photography tailored for apparel labels, agency talent, and designer lookbooks.', 1400.00, 360, ARRAY['6 Hours continuous shooting', 'Full tethered capture monitor for art director', 'Up to 8 complete styled looks', 'Commercial usage license included', 'Delivered in print TIFF and web-optimized assets'], 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80', false),
('srv-event-coverage', 'Corporate Gala & Private Events', 'event-gala', 'cat-events', 'Events', 'Unobtrusive documentary-style reportage capturing VIP keynote speeches, attendee interactions, and venue ambiance.', 850.00, 240, ARRAY['4 Hours event coverage', 'Same-day press/social media highlights pack', '250+ Color-corrected documentary images', 'Online client delivery portal', 'Discreet professional dress code & silent shutter'], 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', false),
('srv-nature-prints', 'Fine-Art Landscape Expedition', 'landscape-expedition', 'cat-nature', 'Nature', 'Private 1-on-1 golden hour nature masterclass and commissioned outdoor fine-art photography.', 600.00, 180, ARRAY['3-Hour dawn or dusk session', 'Guided composition & focal blending guidance', 'Custom framed 24x36 archival museum print', 'Raw capture files & grading breakdown'], 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO gallery_images (id, title, description, image_url, category_id, category_slug, category_name, featured, camera_specs, location, orientation) VALUES
('gal-1', 'Sunlit Vows in Provence', 'Intimate sunset exchange in the rolling lavender hills.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80', 'cat-wedding', 'wedding', 'Wedding', true, 'Sony A1 • 50mm f/1.2 GM • 1/1600s @ f/1.4 ISO 100', 'Valensole, France', 'portrait'),
('gal-2', 'The Grand Cathedral Walk', 'Silhouetted aisle exit bathed in stained glass reflections.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80', 'cat-wedding', 'wedding', 'Wedding', true, 'Leica SL2 • 35mm Summilux • 1/500s @ f/2.0 ISO 400', 'Florence, Italy', 'landscape'),
('gal-3', 'Twilight on Lake Como', 'Water taxi reflection during dusk pre-wedding session.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80', 'cat-prewedding', 'pre-wedding', 'Pre-Wedding', true, 'Canon R5 • 85mm f/1.2L • 1/800s @ f/1.4 ISO 200', 'Lake Como, Italy', 'portrait'),
('gal-4', 'Serengeti Whispers', 'Golden hour embrace under solitary acacia canopy.', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1400&q=80', 'cat-prewedding', 'pre-wedding', 'Pre-Wedding', false, 'Sony A7R V • 24-70mm f/2.8 GM II • 1/640s @ f/2.8 ISO 160', 'Maasai Mara, Kenya', 'landscape'),
('gal-5', 'Clair-obscur Silhouette', 'Dramatic chiaroscuro studio lighting capturing introspective stillness.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80', 'cat-portrait', 'portrait', 'Portrait', true, 'Hasselblad X2D 100C • 80mm f/1.9 • 1/250s @ f/2.8 ISO 64', 'Studio Aura, New York', 'portrait'),
('gal-6', 'Architect of Shadows', 'Monochromatic profile of a master cellist in rehearsal.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80', 'cat-portrait', 'portrait', 'Portrait', false, 'Nikon Z9 • 58mm f/0.95 Noct • 1/400s @ f/1.2 ISO 100', 'Berlin, Germany', 'portrait'),
('gal-7', 'Haute Couture Noir', 'Editorial structured blazer against minimalist brutalist concrete.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80', 'cat-fashion', 'fashion', 'Fashion', true, 'Sony A1 • 70-200mm f/2.8 GM II • 1/1000s @ f/3.2 ISO 200', 'Milan, Italy', 'portrait'),
('gal-8', 'Silk & Wind Motion', 'High-speed capture freezing flowing chiffon fabric in motion.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80', 'cat-fashion', 'fashion', 'Fashion', false, 'Canon R3 • 28-70mm f/2L • 1/2000s @ f/2.0 ISO 100', 'Paris, France', 'landscape'),
('gal-9', 'The Gala Champagne Toast', 'Candid laughter amidst sparkling crystal chandeliers.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80', 'cat-events', 'events', 'Events', true, 'Sony A7S III • 35mm f/1.4 GM • 1/250s @ f/1.8 ISO 1600', 'London, UK', 'landscape'),
('gal-10', 'Nocturne Symphony Keynote', 'Orchestral stage lighting bathing the symposium hall.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80', 'cat-events', 'events', 'Events', false, 'Nikon Z8 • 70-200mm f/2.8 VR S • 1/500s @ f/2.8 ISO 2500', 'Vienna, Austria', 'landscape'),
('gal-11', 'Mists Over Mount Rainier', 'Dawn reflection on alpine tarn with dramatic morning cloud inversion.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80', 'cat-nature', 'nature', 'Nature', true, 'Sony A7R V • 16-35mm f/2.8 GM • 0.8s @ f/11 ISO 50 (ND64)', 'Washington, USA', 'landscape'),
('gal-12', 'Emerald Gorge Solitude', 'Verdant waterfall cascades piercing through dense temperate rainforest.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80', 'cat-nature', 'nature', 'Nature', false, 'Fujifilm GFX 100 II • GF 23mm f/4 • 2.5s @ f/14 ISO 100', 'Oregon, USA', 'landscape')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- HOW TO PROMOTE A USER TO ADMIN:
-- 1. Sign up a user normally via the website or Supabase Auth dashboard.
-- 2. Run this command in your Supabase SQL Editor with the user's email:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your_admin_email@example.com';
-- ====================================================================
