import React from 'react';
import { Camera, MapPin, Mail, Phone, Clock, Award, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onOpenGuide: () => void;
  onOpenDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onOpenGuide,
  onOpenDbModal
}) => {
  return (
    <footer className="border-t border-[#1e222d] bg-[#08090b] text-slate-400">
      {/* Top Banner */}
      <div className="border-b border-[#181b24] bg-[#0c0e12] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Award-Winning Fine Art Photography Atelier</p>
              <p className="text-xs text-slate-400">Ranked Top 10 Wedding &amp; Editorial Storytellers 2024–2026</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('booking')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59e2b] to-[#b38c20] px-4 py-2 text-xs font-bold tracking-wider text-black uppercase shadow-md shadow-[#d4af37]/20 transition-all hover:brightness-110 active:scale-95"
            >
              <span>Inquire for Dates</span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="flex items-center space-x-1.5 rounded-xl border border-[#272b38] bg-[#12141a] px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-[#d4af37]/40 hover:text-white"
            >
              <span>Contact Atelier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37] text-black">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-white">AURA</span>
                <span className="ml-1 text-xs tracking-widest text-[#d4af37] uppercase">STUDIO</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Dedicated to cinematic elegance, authentic emotions, and timeless fine-art visual storytelling across weddings, editorial portraits, and international destination events.
            </p>
            <div className="mt-6 flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Bookings Open for 2026 & 2027 Season
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-white uppercase">Exploration</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-[#d4af37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-[#d4af37] transition-colors">
                  About Julian Vance
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('services')} className="hover:text-[#d4af37] transition-colors">
                  Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('booking')} className="hover:text-[#d4af37] transition-colors">
                  Book a Photography Shoot
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#d4af37] transition-colors">
                  Contact Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Photography Disciplines */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-white uppercase">Categories</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Luxury Weddings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Pre-Wedding Escapes
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Editorial Portraits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Fashion Lookbooks
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  VIP Galas & Events
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Fine-Art Landscapes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & Hours */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-white uppercase">Studio Atelier</h4>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#d4af37]" />
                <span>480 Hudson Street, Studio 4B, New York, NY 10014</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#d4af37]" />
                <span className="hover:text-white">atelier@aurastudio.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#d4af37]" />
                <span>+1 (212) 555-0194</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 shrink-0 text-[#d4af37]" />
                <span>Mon – Sat: 09:00 – 19:00 EST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#181b24] pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Aura Studio. All photographic rights reserved.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0">
            {onOpenGuide && (
              <button
                id="footer-open-guide-btn"
                onClick={onOpenGuide}
                className="text-slate-500 hover:text-[#d4af37] transition-colors text-[11px]"
              >
                Setup &amp; DB Guide
              </button>
            )}
            {onOpenGuide && onOpenDbModal && <span>•</span>}
            {onOpenDbModal && (
              <button
                id="footer-open-db-btn"
                onClick={onOpenDbModal}
                className="text-slate-500 hover:text-[#d4af37] transition-colors text-[11px]"
              >
                Database Status
              </button>
            )}
            <span>•</span>
            <button
              onClick={() => setCurrentPage('admin-login')}
              className="text-slate-400 hover:text-[#d4af37] transition-colors text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
