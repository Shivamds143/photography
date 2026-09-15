import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Camera, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { PhotographyService, PageView } from '../types';

interface ServicesViewProps {
  services: PhotographyService[];
  setCurrentPage: (page: PageView) => void;
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  setCurrentPage,
  onSelectServiceForBooking
}) => {
  const faqs = [
    {
      q: 'How far in advance should we book our session or wedding?',
      a: 'For full-day weddings and international destination events, we suggest reserving 6 to 12 months in advance. Portrait and editorial studio sessions can often be accommodated with 2 to 4 weeks notice.'
    },
    {
      q: 'How are high-resolution photos delivered?',
      a: 'Every client receives access to a password-protected, private online gallery with uncompressed print-ready downloads, full web-optimized files, and built-in professional lab printing rights.'
    },
    {
      q: 'Can we customize our service package or add hours?',
      a: 'Yes. Every commission can be customized with additional shooters, aerial drone photography, handcrafted heirloom linen albums, and extended rehearsal coverage.'
    },
    {
      q: 'What is your turnaround time for final delivery?',
      a: 'An initial sneak-peek highlights gallery (15–25 images) is delivered within 48 to 72 hours of your session. Complete retouched galleries are delivered within 3 to 4 weeks.'
    }
  ];

  return (
    <div className="w-full bg-[#0c0d10] py-16 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/30 bg-[#161410] px-3.5 py-1 text-xs text-[#d4af37]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-widest">Transparent Investment</span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Photography Services & Experiences
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            Every collection includes personalized creative direction, high-definition digital licensing, and master color grading.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                srv.is_popular
                  ? 'border-[#d4af37] bg-gradient-to-b from-[#181510] to-[#12151e] shadow-2xl shadow-[#d4af37]/10'
                  : 'border-[#212634] bg-[#12151e] hover:border-slate-600'
              }`}
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={srv.cover_image}
                  alt={srv.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-[#d4af37] backdrop-blur-md">
                  {srv.category_name}
                </span>
                {srv.is_popular && (
                  <span className="absolute top-3 right-3 rounded-full bg-[#d4af37] px-3 py-1 text-[10px] font-bold text-black uppercase">
                    Signature
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-white">{srv.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{srv.description}</p>

                {/* Price & Duration */}
                <div className="mt-6 flex items-baseline justify-between border-y border-[#1f2330] py-4">
                  <div>
                    <span className="font-serif text-3xl font-bold text-white">${srv.price}</span>
                    <span className="text-xs text-slate-400"> USD</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                    <Clock className="h-4 w-4 text-[#d4af37]" />
                    <span>{Math.round(srv.duration_minutes / 60)} Hours</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Included In Package:</p>
                  <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
                    {srv.features.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4af37]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="p-6 pt-0">
                <button
                  id={`book-service-btn-${srv.id}`}
                  onClick={() => onSelectServiceForBooking(srv.id)}
                  className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    srv.is_popular
                      ? 'bg-[#d4af37] text-black hover:brightness-110'
                      : 'border border-[#2d3345] bg-[#1a1d27] text-white hover:border-[#d4af37]'
                  }`}
                >
                  Book This Experience
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 rounded-3xl border border-[#212634] bg-[#10131b] p-8 sm:p-12">
          <div className="flex items-center space-x-2 text-[#d4af37]">
            <HelpCircle className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Client Inquiries</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">Frequently Asked Questions</h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-[#1f2330] bg-[#0b0c10] p-5">
                <h4 className="text-sm font-semibold text-white">{faq.q}</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
