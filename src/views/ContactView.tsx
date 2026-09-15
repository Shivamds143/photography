import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';
import { Category, PageView } from '../types';

interface ContactViewProps {
  categories: Category[];
  setCurrentPage: (page: PageView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ categories, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Wedding',
    date: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full bg-[#0c0d10] py-16 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/30 bg-[#161410] px-3.5 py-1 text-xs text-[#d4af37]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-widest">Inquiries & Commissions</span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get In Touch With The Studio
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Tell us about your celebration, editorial vision, or commercial brand campaign. We reply to all inquiries within 24 hours.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#212634] bg-[#12151e] p-8 shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-white">Inquiry Received!</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
                    Thank you, {formData.name}. Julian and the Aura Studio team will review your project details and respond shortly to {formData.email}.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', category: 'Wedding', date: '', message: '' });
                    }}
                    className="mt-6 rounded-xl border border-slate-700 bg-[#171a24] px-6 py-2.5 text-xs font-semibold text-white hover:border-[#d4af37]"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-white">Send An Inquiry Message</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Charlotte & Liam"
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="charlotte@example.com"
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Photography Discipline</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">Target Date / Estimated Window</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300">Event Location & Creative Vision *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your wedding venue, aesthetic preferences, schedule details, or inspiration..."
                      className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38c20] py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Inquiry Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Studio Info */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-[#212634] bg-[#12151e] p-8">
              <h3 className="font-serif text-xl font-bold text-white">Direct Atelier Contact</h3>
              <p className="mt-1 text-xs text-slate-400">Feel free to visit our Manhattan studio by appointment.</p>

              <div className="mt-6 space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Studio Location</p>
                    <p className="text-slate-400">480 Hudson Street, 4th Floor</p>
                    <p className="text-slate-400">West Village, New York, NY 10014</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Direct Email</p>
                    <p className="text-slate-400">inquiries@aurastudio.com</p>
                    <p className="text-slate-400">julian@aurastudio.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Phone / Concierge</p>
                    <p className="text-slate-400">+1 (212) 555-0194</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/15 text-[#d4af37]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Operating Hours</p>
                    <p className="text-slate-400">Monday – Friday: 09:00 AM – 06:00 PM EST</p>
                    <p className="text-slate-400">Weekends: Reserved for on-location shoots</p>
                  </div>
                </div>
              </div>

              {/* Ready to schedule banner */}
              <div className="mt-8 rounded-2xl border border-[#d4af37]/30 bg-[#17140e] p-4 text-xs">
                <p className="font-bold text-[#d4af37]">Instant Online Booking Available</p>
                <p className="mt-1 text-slate-300">
                  Know your date and selected service already? Use our automated reservation wizard to check live slot availability.
                </p>
                <button
                  onClick={() => setCurrentPage('booking')}
                  className="mt-3 inline-block font-semibold text-white underline hover:text-[#d4af37]"
                >
                  Proceed to Automated Booking →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
