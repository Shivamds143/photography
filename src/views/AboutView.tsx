import React from 'react';
import { 
  Camera, 
  Award, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { PageView } from '../types';

interface AboutViewProps {
  setCurrentPage: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setCurrentPage }) => {
  const equipment = [
    { category: 'Camera Bodies', items: ['Sony Alpha 1 (50.1MP Flagship)', 'Leica SL2 Dual System', 'Fujifilm GFX 100 II (Medium Format)'] },
    { category: 'Prime & Cine Lenses', items: ['Sony FE 50mm f/1.2 GM', 'Sony FE 85mm f/1.4 GM II', 'Sony FE 35mm f/1.4 GM', 'Leica 35mm Summilux'] },
    { category: 'Studio & On-Location Lighting', items: ['Profoto B10X Plus Strobes', 'Profoto OCF Beauty Dishes & Softboxes', 'Aputure Continuous LED Cine Lights'] },
    { category: 'Audio, Drone & Redundancy', items: ['DJI Mavic 3 Pro Cine Drone (4K/60fps)', 'Dual ProGrade V90 UHS-II SD Storage (Immediate dual backup)', 'SanDisk Professional 4TB NVMe SSD RAID'] }
  ];

  const milestones = [
    { year: '2017', title: 'Studio Founded', desc: 'Commenced independent editorial and portrait commissions in Manhattan.' },
    { year: '2020', title: 'European Destination Expansion', desc: 'Documented weddings across Lake Como, Provence, and the Amalfi Coast.' },
    { year: '2023', title: 'International Accolades', desc: 'Named in Fearless Photographers Top 50 and Rangefinder Magazine.' },
    { year: '2026', title: 'Aura Studio Atelier', desc: 'Now operating bespoke fine-art and commercial photography globally.' }
  ];

  return (
    <div className="w-full bg-[#0c0d10] py-16 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/30 bg-[#161410] px-3.5 py-1 text-xs text-[#d4af37]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-semibold uppercase tracking-widest">Artist Profile</span>
            </div>

            <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Julian Vance
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-widest text-[#d4af37] uppercase">
              Principal Photographer & Creative Director
            </p>

            <p className="mt-6 text-sm leading-relaxed text-slate-300">
              For me, photography has never been about manufacturing staged moments or barking instructions at uncomfortable subjects. It is an act of deep observation—listening to the subtle rhythm of a wedding day, catching the fleeting glance between lovers, and sculpting available light to turn brief seconds into eternal heirlooms.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Born in Seattle and trained in fine-art film printmaking in Florence, my photographic voice blends classical Renaissance chiaroscuro with contemporary high-fashion dynamism.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentPage('booking')}
                className="rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-bold text-black uppercase tracking-wider hover:brightness-110"
              >
                Inquire For Your Date
              </button>
              <button
                onClick={() => setCurrentPage('gallery')}
                className="rounded-xl border border-slate-700 bg-[#141720] px-6 py-3 text-xs font-semibold text-white hover:border-slate-500"
              >
                View Curated Gallery
              </button>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-[#272b38] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                alt="Julian Vance In Studio"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Hudson Street Atelier</span>
                  <span className="text-[#d4af37]">New York City</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Core Principles */}
        <div className="mt-24 border-t border-[#1e2330] pt-16">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-white">Our Artistic Philosophy</h2>
            <p className="mt-2 text-xs text-slate-400">The three foundational pillars guiding every shutter actuation.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">1. Honest Emotion</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                We believe in genuine joy, spontaneous tears, and quiet intimacy over contrived poses and rigid checklists.
              </p>
            </div>

            <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">2. Masterful Light</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Light is the brushstroke of fine art. Whether chasing twilight golden hour or sculpting high-contrast studio shadows, we command exposure with precision.
              </p>
            </div>

            <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">3. Archival Longevity</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Trends and gimmicky Instagram filters fade. Our color grading is calibrated to look just as breathtaking 50 years from now as it does today.
              </p>
            </div>
          </div>
        </div>

        {/* Equipment & Gear Manifesto */}
        <div className="mt-24 rounded-3xl border border-[#212634] bg-[#0f1118] p-8 sm:p-12">
          <div className="flex items-center space-x-2 text-[#d4af37]">
            <Camera className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Master Hardware</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white">Camera Equipment & Redundancy Protocol</h2>
          <p className="mt-2 text-xs text-slate-400">
            For critical events like weddings and commercial campaigns, reliability is paramount. We carry double redundancy on all bodies, lenses, and flash triggers.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {equipment.map((group, idx) => (
              <div key={idx} className="rounded-xl border border-[#1e2330] bg-[#090a0e] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">{group.category}</h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-slate-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Timeline Milestones */}
        <div className="mt-24 border-t border-[#1e2330] pt-16">
          <h2 className="text-center font-serif text-3xl font-bold text-white">Studio Milestones</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-[#212634] bg-[#12151e] p-5">
                <span className="font-serif text-2xl font-bold text-[#d4af37]">{m.year}</span>
                <h4 className="mt-2 text-sm font-semibold text-white">{m.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
