import React from 'react';
import { 
  Camera, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Award, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { Category, PhotographyService, GalleryImage, PageView, Testimonial } from '../types';
import { TESTIMONIALS, STATISTICS } from '../lib/mockData';

interface HomeViewProps {
  categories: Category[];
  services: PhotographyService[];
  galleryImages: GalleryImage[];
  setCurrentPage: (page: PageView) => void;
  onSelectCategory: (slug: string) => void;
  onSelectServiceForBooking: (serviceId: string) => void;
  onOpenLightbox: (img: GalleryImage) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  services,
  galleryImages,
  setCurrentPage,
  onSelectCategory,
  onSelectServiceForBooking,
  onOpenLightbox
}) => {
  const featuredImages = galleryImages.filter(img => img.featured).slice(0, 6);
  const featuredServices = services.slice(0, 3);

  return (
    <div className="w-full bg-[#0c0d10] text-[#f1f3f7]">
      {/* 1. HERO SECTION (Full-Screen Photography Visual, Strong Headline, CTAs) */}
      <section className="relative flex min-h-[92vh] sm:min-h-[95vh] items-center justify-center overflow-hidden">
        {/* Large photography visual background - clearly visible while maintaining cinematic dark atmosphere */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Hero Cinematic Photography"
            className="h-full w-full object-cover object-center brightness-[0.74] sm:brightness-[0.78] scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle cinematic gradient overlays: preserves photo luminosity while ensuring text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/40 to-black/50" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-[#0c0d10]/70" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/40 bg-black/50 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
              Fine-Art &amp; Editorial Storytelling
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-[4.75rem] lg:leading-[1.12]">
            Capturing Timeless Stories <br />
            <span className="italic font-normal text-[#e6ca65] drop-shadow">Through Light and Emotion</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-200 drop-shadow sm:text-lg md:text-xl">
            Dedicated to authentic memories, cinematic composition, and effortless poise. From intimate vows in Provence to grand metropolitan galas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <button
              id="hero-book-now-btn"
              onClick={() => setCurrentPage('booking')}
              className="group flex w-full items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59e2b] to-[#b38c20] px-8 py-4 text-sm font-bold tracking-wider text-black uppercase shadow-xl shadow-[#d4af37]/25 transition-all hover:brightness-110 active:scale-95 sm:w-auto"
            >
              <Calendar className="h-4 w-4 text-black transition-transform group-hover:scale-110" />
              <span>Book Your Session</span>
            </button>

            <button
              id="hero-explore-portfolio-btn"
              onClick={() => setCurrentPage('gallery')}
              className="group flex w-full items-center justify-center space-x-2.5 rounded-xl border border-white/25 bg-black/45 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-[#d4af37] hover:bg-black/70 active:scale-95 sm:w-auto"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="h-4 w-4 text-[#d4af37] transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Highlights strip */}
          <div className="mt-14 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-full border border-white/10 bg-black/35 px-6 py-2.5 backdrop-blur-sm text-xs text-slate-300">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
              <span>Full Commercial &amp; Personal Rights</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
              <span>Fast 48-Hour Sneak Peeks</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
              <span>Worldwide Destination Travel</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. PHOTOGRAPHER INTRODUCTION */}
      <section className="border-t border-[#1a1d26] py-24 bg-[#0a0b0e]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-[#232734] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80"
                  alt="Julian Vance, Lead Photographer"
                  className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-serif text-2xl font-bold text-white">Julian Vance</p>
                  <p className="text-xs tracking-widest text-[#d4af37] uppercase">Lead Artist & Founder</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 rounded-full bg-[#181b24] px-3 py-1 text-xs text-[#d4af37]">
                <Camera className="h-3.5 w-3.5" />
                <span>The Story Behind The Lens</span>
              </div>

              <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                "Photography is the poetry of unspoken instants."
              </h2>

              <p className="mt-6 text-base leading-relaxed text-slate-300">
                With nearly a decade devoted to documentary wedding storytelling and high-concept editorial portraits, Julian approaches each commission with reverence for genuine human connection. Rather than rigid, unnatural poses, our studio emphasizes natural light, organic movement, and authentic intimacy.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#212634] bg-[#12151e] p-4">
                  <Award className="h-5 w-5 text-[#d4af37]" />
                  <h4 className="mt-2 text-sm font-semibold text-white">Top 10 Storyteller</h4>
                  <p className="mt-1 text-xs text-slate-400">Awarded by International Wedding Photojournalists 2025</p>
                </div>
                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4">
                  <Clock className="h-5 w-5 text-[#d4af37]" />
                  <h4 className="mt-2 text-sm font-semibold text-white">Seamless Workflow</h4>
                  <p className="mt-1 text-xs text-slate-400">High-res cloud gallery with print licensing included</p>
                </div>
                <div className="rounded-lg border border-[#212634] bg-[#12151e] p-4">
                  <ShieldCheck className="h-5 w-5 text-[#d4af37]" />
                  <h4 className="mt-2 text-sm font-semibold text-white">Master Equipment</h4>
                  <p className="mt-1 text-xs text-slate-400">Dual-slot Sony A1 & Leica SL systems with backup gear</p>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-[#d4af37] hover:underline"
                >
                  <span>Read Full Biography & Equipment Manifesto</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SECTION */}
      <section className="py-24 bg-[#0c0d10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">Disciplines</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">Featured Collections</h2>
              <p className="mt-2 text-sm text-slate-400">Select any collection to view dedicated portfolios and curated sessions.</p>
            </div>
            <button
              onClick={() => setCurrentPage('gallery')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#d4af37] hover:underline"
            >
              <span>View All Portfolios</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#212634] bg-[#12151e] transition-all hover:border-[#d4af37]/50 hover:shadow-2xl"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={cat.cover_image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED FEATURED GALLERY PREVIEW */}
      <section className="border-t border-[#1a1d26] py-24 bg-[#090a0d]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">Visual Archive</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">Curated Masterworks</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              Click any photograph to view high-resolution details, full EXIF camera specs, and focal settings.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => onOpenLightbox(img)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#212634] bg-[#12151e] shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-95"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <span className="rounded-full bg-black/60 p-2 text-[#d4af37] backdrop-blur-md">
                        <Eye className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-widest text-[#d4af37] uppercase">
                        {img.category_name}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white">{img.title}</h4>
                      {img.camera_specs && (
                        <p className="mt-1 font-mono text-[10px] text-slate-300">{img.camera_specs}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentPage('gallery')}
              className="inline-flex items-center space-x-2 rounded-xl border border-[#2b3040] bg-[#13151c] px-6 py-3 text-xs font-semibold text-slate-200 hover:border-[#d4af37] hover:text-white"
            >
              <span>Explore Complete Gallery ({galleryImages.length} Photographs)</span>
              <ArrowRight className="h-4 w-4 text-[#d4af37]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. SERVICES & PACKAGES HIGHLIGHT */}
      <section className="py-24 bg-[#0c0d10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">Investment & Experiences</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">Photography Services</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              Transparent, comprehensive commissions with no hidden travel fees or print surcharges.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-8 transition-all ${
                  service.is_popular
                    ? 'border-[#d4af37] bg-gradient-to-b from-[#191610] to-[#12151e] shadow-2xl shadow-[#d4af37]/10'
                    : 'border-[#212634] bg-[#12151e] hover:border-slate-600'
                }`}
              >
                {service.is_popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#d4af37] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                    Signature Choice
                  </span>
                )}

                <div>
                  <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                    {service.category_name}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-white">{service.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">{service.description}</p>

                  <div className="mt-6 flex items-baseline space-x-1">
                    <span className="font-serif text-4xl font-bold text-white">${service.price}</span>
                    <span className="text-xs text-slate-400">/ session ({Math.round(service.duration_minutes / 60)} hrs)</span>
                  </div>

                  <div className="mt-6 border-t border-[#1f2330] pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Package Inclusions:</p>
                    <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4af37]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectServiceForBooking(service.id)}
                    className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      service.is_popular
                        ? 'bg-[#d4af37] text-black hover:brightness-110'
                        : 'border border-[#2d3345] bg-[#1a1d27] text-white hover:border-[#d4af37]'
                    }`}
                  >
                    Select & Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentPage('services')}
              className="text-xs font-semibold text-[#d4af37] hover:underline"
            >
              View all 6 photography packages and full custom commission details →
            </button>
          </div>
        </div>
      </section>

      {/* 6. STATISTICS & COUNTERS */}
      <section className="border-y border-[#1c1f2b] bg-[#090a0d] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATISTICS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl text-[#d4af37]">
                  {stat.value}{stat.suffix}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-24 bg-[#0c0d10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">Verified Testimonials</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">Words From Our Clients</h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="relative rounded-2xl border border-[#212634] bg-[#12151e] p-6 shadow-xl"
              >
                <div className="flex items-center space-x-1 text-[#d4af37]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#d4af37]" />
                  ))}
                </div>

                <p className="mt-4 text-xs italic leading-relaxed text-slate-300">
                  "{t.comment}"
                </p>

                <div className="mt-6 flex items-center space-x-3 border-t border-[#1f2330] pt-4">
                  <img
                    src={t.avatar}
                    alt={t.client_name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#d4af37]/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.client_name}</h4>
                    <p className="text-[11px] text-slate-400">{t.role} • {t.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="relative overflow-hidden border-t border-[#1e222d] py-20 bg-gradient-to-b from-[#13151c] to-[#0c0d10]">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="rounded-full bg-[#d4af37]/20 px-3.5 py-1 text-xs font-semibold text-[#d4af37] uppercase">
            Let's Make History
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-5xl">
            Ready to Capture Your Story?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Sessions fill 4 to 6 months in advance. Secure your preferred date and time online with instant confirmation tracking.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setCurrentPage('booking')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38c20] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:brightness-110"
            >
              <Calendar className="h-4 w-4" />
              <span>Select Date & Book Now</span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="rounded-xl border border-slate-700 bg-[#161922] px-8 py-3.5 text-xs font-medium text-white hover:border-slate-500"
            >
              Contact The Atelier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
