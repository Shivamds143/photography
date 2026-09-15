import { Category, PhotographyService, GalleryImage, Booking, Testimonial, Statistic, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-wedding',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Timeless cinematic moments capturing intimate vows, tears of joy, and magnificent celebrations.',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    display_order: 1
  },
  {
    id: 'cat-prewedding',
    name: 'Pre-Wedding',
    slug: 'pre-wedding',
    description: 'Romantic story-driven couple sessions amidst scenic architectural and natural landscapes.',
    cover_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    display_order: 2
  },
  {
    id: 'cat-portrait',
    name: 'Portrait',
    slug: 'portrait',
    description: 'Striking editorial and studio headshots highlighting raw personality and expressive depth.',
    cover_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    display_order: 3
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'High-concept lookbooks, avant-garde styling, and commercial model campaigns.',
    cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    display_order: 4
  },
  {
    id: 'cat-events',
    name: 'Events',
    slug: 'events',
    description: 'Dynamic cultural galas, live conferences, milestone anniversaries, and VIP gatherings.',
    cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    display_order: 5
  },
  {
    id: 'cat-nature',
    name: 'Nature',
    slug: 'nature',
    description: 'Breathtaking fine-art landscapes, golden hour vistas, and pristine atmospheric wilderness.',
    cover_image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    display_order: 6
  }
];

export const INITIAL_SERVICES: PhotographyService[] = [
  {
    id: 'srv-wedding-signature',
    title: 'The Royal Wedding Experience',
    slug: 'royal-wedding',
    category_id: 'cat-wedding',
    category_name: 'Wedding',
    description: 'Full-day comprehensive coverage from morning preparation to twilight grand exit, featuring two senior photographers and an assistant.',
    price: 2400,
    duration_minutes: 600,
    is_popular: true,
    cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Up to 10 hours continuous coverage',
      'Lead Photographer + Second Shooter',
      '450+ High-resolution retouched images',
      'Private online gallery with print store',
      'Full rights for personal printing & web',
      'Handcrafted linen fine-art wedding album'
    ]
  },
  {
    id: 'srv-prewedding-love',
    title: 'Cinematic Pre-Wedding Story',
    slug: 'pre-wedding-story',
    category_id: 'cat-prewedding',
    category_name: 'Pre-Wedding',
    description: 'Curated 4-hour storytelling session across two breathtaking destination locations with moodboard consultation.',
    price: 950,
    duration_minutes: 240,
    is_popular: false,
    cover_image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    features: [
      '4 Hours on-location shoot',
      'Up to 3 outfit changes',
      '60+ Master-graded fine-art photographs',
      'Cinematic 60-second teaser reel',
      'Location scout & styling assistance'
    ]
  },
  {
    id: 'srv-editorial-portrait',
    title: 'Editorial & Studio Portraiture',
    slug: 'editorial-portrait',
    category_id: 'cat-portrait',
    category_name: 'Portrait',
    description: 'Intimate studio or outdoor session crafted for artists, executives, and creative entrepreneurs seeking iconic visuals.',
    price: 450,
    duration_minutes: 90,
    is_popular: false,
    cover_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    features: [
      '90 Minutes studio or urban location',
      'Lighting setup with key & rim strobes',
      '20 Masterfully retouched portraits',
      'Professional color grading & black & white alternates',
      'Immediate sneak-peek delivered within 48h'
    ]
  },
  {
    id: 'srv-fashion-lookbook',
    title: 'Fashion Lookbook & Campaign',
    slug: 'fashion-campaign',
    category_id: 'cat-fashion',
    category_name: 'Fashion',
    description: 'Commercial photography tailored for apparel labels, agency talent, and designer lookbooks.',
    price: 1400,
    duration_minutes: 360,
    is_popular: false,
    cover_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
    features: [
      '6 Hours continuous shooting',
      'Full tethered capture monitor for art director',
      'Up to 8 complete styled looks',
      'Commercial usage license included',
      'Delivered in print TIFF and web-optimized assets'
    ]
  },
  {
    id: 'srv-event-coverage',
    title: 'Corporate Gala & Private Events',
    slug: 'event-gala',
    category_id: 'cat-events',
    category_name: 'Events',
    description: 'Unobtrusive documentary-style reportage capturing VIP keynote speeches, attendee interactions, and venue ambiance.',
    price: 850,
    duration_minutes: 240,
    is_popular: false,
    cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    features: [
      '4 Hours event coverage',
      'Same-day press/social media highlights pack',
      '250+ Color-corrected documentary images',
      'Online client delivery portal',
      'Discreet professional dress code & silent shutter'
    ]
  },
  {
    id: 'srv-nature-prints',
    title: 'Fine-Art Landscape Expedition',
    slug: 'landscape-expedition',
    category_id: 'cat-nature',
    category_name: 'Nature',
    description: 'Private 1-on-1 golden hour nature masterclass and commissioned outdoor fine-art photography.',
    price: 600,
    duration_minutes: 180,
    is_popular: false,
    cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    features: [
      '3-Hour dawn or dusk session',
      'Guided composition & focal blending guidance',
      'Custom framed 24x36 archival museum print',
      'Raw capture files & grading breakdown'
    ]
  }
];

export const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Sunlit Vows in Provence',
    description: 'Intimate sunset exchange in the rolling lavender hills.',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-wedding',
    category_slug: 'wedding',
    category_name: 'Wedding',
    featured: true,
    camera_specs: 'Sony A1 • 50mm f/1.2 GM • 1/1600s @ f/1.4 ISO 100',
    location: 'Valensole, France',
    orientation: 'portrait',
    created_at: '2026-06-12'
  },
  {
    id: 'gal-2',
    title: 'The Grand Cathedral Walk',
    description: 'Silhouetted aisle exit bathed in stained glass reflections.',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-wedding',
    category_slug: 'wedding',
    category_name: 'Wedding',
    featured: true,
    camera_specs: 'Leica SL2 • 35mm Summilux • 1/500s @ f/2.0 ISO 400',
    location: 'Florence, Italy',
    orientation: 'landscape',
    created_at: '2026-05-18'
  },
  {
    id: 'gal-3',
    title: 'Twilight on Lake Como',
    description: 'Water taxi reflection during dusk pre-wedding session.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-prewedding',
    category_slug: 'pre-wedding',
    category_name: 'Pre-Wedding',
    featured: true,
    camera_specs: 'Canon R5 • 85mm f/1.2L • 1/800s @ f/1.4 ISO 200',
    location: 'Lake Como, Italy',
    orientation: 'portrait',
    created_at: '2026-07-04'
  },
  {
    id: 'gal-4',
    title: 'Serengeti Whispers',
    description: 'Golden hour embrace under solitary acacia canopy.',
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-prewedding',
    category_slug: 'pre-wedding',
    category_name: 'Pre-Wedding',
    featured: false,
    camera_specs: 'Sony A7R V • 24-70mm f/2.8 GM II • 1/640s @ f/2.8 ISO 160',
    location: 'Maasai Mara, Kenya',
    orientation: 'landscape',
    created_at: '2026-04-22'
  },
  {
    id: 'gal-5',
    title: 'Clair-obscur Silhouette',
    description: 'Dramatic chiaroscuro studio lighting capturing introspective stillness.',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-portrait',
    category_slug: 'portrait',
    category_name: 'Portrait',
    featured: true,
    camera_specs: 'Hasselblad X2D 100C • 80mm f/1.9 • 1/250s @ f/2.8 ISO 64',
    location: 'Studio Aura, New York',
    orientation: 'portrait',
    created_at: '2026-08-10'
  },
  {
    id: 'gal-6',
    title: 'Architect of Shadows',
    description: 'Monochromatic profile of a master cellist in rehearsal.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-portrait',
    category_slug: 'portrait',
    category_name: 'Portrait',
    featured: false,
    camera_specs: 'Nikon Z9 • 58mm f/0.95 Noct • 1/400s @ f/1.2 ISO 100',
    location: 'Berlin, Germany',
    orientation: 'portrait',
    created_at: '2026-03-15'
  },
  {
    id: 'gal-7',
    title: 'Haute Couture Noir',
    description: 'Editorial structured blazer against minimalist brutalist concrete.',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-fashion',
    category_slug: 'fashion',
    category_name: 'Fashion',
    featured: true,
    camera_specs: 'Sony A1 • 70-200mm f/2.8 GM II • 1/1000s @ f/3.2 ISO 200',
    location: 'Milan, Italy',
    orientation: 'portrait',
    created_at: '2026-08-01'
  },
  {
    id: 'gal-8',
    title: 'Silk & Wind Motion',
    description: 'High-speed capture freezing flowing chiffon fabric in motion.',
    image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-fashion',
    category_slug: 'fashion',
    category_name: 'Fashion',
    featured: false,
    camera_specs: 'Canon R3 • 28-70mm f/2L • 1/2000s @ f/2.0 ISO 100',
    location: 'Paris, France',
    orientation: 'landscape',
    created_at: '2026-07-29'
  },
  {
    id: 'gal-9',
    title: 'The Gala Champagne Toast',
    description: 'Candid laughter amidst sparkling crystal chandeliers.',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-events',
    category_slug: 'events',
    category_name: 'Events',
    featured: true,
    camera_specs: 'Sony A7S III • 35mm f/1.4 GM • 1/250s @ f/1.8 ISO 1600',
    location: 'London, UK',
    orientation: 'landscape',
    created_at: '2026-06-20'
  },
  {
    id: 'gal-10',
    title: 'Nocturne Symphony Keynote',
    description: 'Orchestral stage lighting bathing the symposium hall.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-events',
    category_slug: 'events',
    category_name: 'Events',
    featured: false,
    camera_specs: 'Nikon Z8 • 70-200mm f/2.8 VR S • 1/500s @ f/2.8 ISO 2500',
    location: 'Vienna, Austria',
    orientation: 'landscape',
    created_at: '2026-02-14'
  },
  {
    id: 'gal-11',
    title: 'Mists Over Mount Rainier',
    description: 'Dawn reflection on alpine tarn with dramatic morning cloud inversion.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-nature',
    category_slug: 'nature',
    category_name: 'Nature',
    featured: true,
    camera_specs: 'Sony A7R V • 16-35mm f/2.8 GM • 0.8s @ f/11 ISO 50 (ND64)',
    location: 'Washington, USA',
    orientation: 'landscape',
    created_at: '2026-05-02'
  },
  {
    id: 'gal-12',
    title: 'Emerald Gorge Solitude',
    description: 'Verdant waterfall cascades piercing through dense temperate rainforest.',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    category_id: 'cat-nature',
    category_slug: 'nature',
    category_name: 'Nature',
    featured: false,
    camera_specs: 'Fujifilm GFX 100 II • GF 23mm f/4 • 2.5s @ f/14 ISO 100',
    location: 'Oregon, USA',
    orientation: 'landscape',
    created_at: '2026-01-18'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@studio.com',
    full_name: 'Julian Vance (Lead Photographer)',
    phone: '+1 (555) 234-8901',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-10'
  },
  {
    id: 'usr-customer-1',
    email: 'customer@example.com',
    full_name: 'Eleanor Rostova',
    phone: '+1 (555) 987-6543',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-02-01'
  },
  {
    id: 'usr-customer-2',
    email: 'marcus.chen@example.com',
    full_name: 'Marcus Chen',
    phone: '+1 (555) 345-6789',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-03-12'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    customer_id: 'usr-customer-1',
    customer_name: 'Eleanor Rostova',
    customer_email: 'customer@example.com',
    customer_phone: '+1 (555) 987-6543',
    service_id: 'srv-wedding-signature',
    service_title: 'The Royal Wedding Experience',
    service_price: 2400,
    booking_date: '2026-10-24',
    time_slot: '10:00 AM - 08:00 PM',
    location: 'St. Regis Manor & Vineyard, Napa Valley',
    message: 'We would love focus on candid family interactions and sunset shots around the vineyard.',
    status: 'confirmed',
    notes: 'Bride requested golden-hour drone shots if weather permits.',
    created_at: '2026-08-10'
  },
  {
    id: 'bkg-102',
    customer_id: 'usr-customer-1',
    customer_name: 'Eleanor Rostova',
    customer_email: 'customer@example.com',
    customer_phone: '+1 (555) 987-6543',
    service_id: 'srv-prewedding-love',
    service_title: 'Cinematic Pre-Wedding Story',
    service_price: 950,
    booking_date: '2026-09-28',
    time_slot: '02:00 PM - 06:00 PM',
    location: 'Palace of Fine Arts & Baker Beach, San Francisco',
    message: 'Bringing 2 evening gowns and one casual suit look.',
    status: 'pending',
    notes: 'Review tide schedule for Baker Beach.',
    created_at: '2026-09-01'
  },
  {
    id: 'bkg-103',
    customer_id: 'usr-customer-2',
    customer_name: 'Marcus Chen',
    customer_email: 'marcus.chen@example.com',
    customer_phone: '+1 (555) 345-6789',
    service_id: 'srv-editorial-portrait',
    service_title: 'Editorial & Studio Portraiture',
    service_price: 450,
    booking_date: '2026-07-15',
    time_slot: '11:00 AM - 12:30 PM',
    location: 'Studio Aura Downtown',
    message: 'Vogue-style founder portraits for Forbes 30-under-30 feature.',
    status: 'completed',
    notes: 'Completed delivery on 2026-07-17. Client gave 5 stars.',
    created_at: '2026-07-02'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    client_name: 'Sophia & Alexander Wright',
    role: 'Wedding Clients',
    category: 'Wedding',
    comment: 'Julian did not simply take pictures; he captured the soul of our wedding. Looking through our album brings back the tears, the laughter, and the goosebumps just like that afternoon.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'August 2026'
  },
  {
    id: 't-2',
    client_name: 'Claire Dupont',
    role: 'Creative Director, Atelier Noir',
    category: 'Fashion',
    comment: 'The lighting control and composition are peerless. In 10 years in the European fashion circuit, Julian remains our go-to photographer for flagship lookbooks.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'June 2026'
  },
  {
    id: 't-3',
    client_name: 'David & Maya Patel',
    role: 'Pre-Wedding Clients',
    category: 'Pre-Wedding',
    comment: 'Neither of us felt natural in front of cameras, but Julian made us laugh and feel effortless. The images look like stills from an Italian cinema film.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'May 2026'
  }
];

export const STATISTICS: Statistic[] = [
  { label: 'Weddings Captured', value: 320, suffix: '+', description: 'Across 14 countries' },
  { label: 'International Awards', value: 28, suffix: '', description: 'WPPI & Fearless Photo' },
  { label: 'Client Satisfaction', value: 99.4, suffix: '%', description: 'Based on 450+ verified reviews' },
  { label: 'Years of Dedication', value: 9, suffix: '+', description: 'Visual storytelling mastery' }
];

export const TIME_SLOTS = [
  '08:00 AM - 10:00 AM (Sunrise / Morning Golden Hour)',
  '10:30 AM - 12:30 PM (Mid-day Light)',
  '01:30 PM - 03:30 PM (Afternoon Session)',
  '04:00 PM - 06:00 PM (Golden Hour)',
  '06:30 PM - 08:30 PM (Sunset / Twilight Blue Hour)'
];
