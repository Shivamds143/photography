import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotographyService, UserProfile, PageView, Booking } from '../types';
import { TIME_SLOTS } from '../lib/mockData';
import { db } from '../lib/databaseService';

interface BookingViewProps {
  services: PhotographyService[];
  preSelectedServiceId: string | null;
  currentUser: UserProfile | null;
  setCurrentPage: (page: PageView) => void;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  services,
  preSelectedServiceId,
  currentUser,
  setCurrentPage,
  onBookingCreated
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || (services.length > 0 ? services[0].id : '')
  );
  const [bookingDate, setBookingDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [name, setName] = useState<string>(currentUser?.full_name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [location, setLocation] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [isCheckingSlot, setIsCheckingSlot] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Sync with current user profile if available
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.full_name);
      if (!email) setEmail(currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Set default minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  // Conflict detection
  useEffect(() => {
    async function checkConflict() {
      if (!bookingDate || !timeSlot) {
        setConflictWarning(null);
        return;
      }
      setIsCheckingSlot(true);
      try {
        const hasConflict = await db.checkConflict(bookingDate, timeSlot);
        if (hasConflict) {
          setConflictWarning(
            `Notice: This exact time slot on ${bookingDate} is already reserved by another client. Please pick an alternate time slot or date.`
          );
        } else {
          setConflictWarning(null);
        }
      } catch (err) {
        console.error('Error checking conflict:', err);
      } finally {
        setIsCheckingSlot(false);
      }
    }
    checkConflict();
  }, [bookingDate, timeSlot]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      alert('Please choose a photography service package.');
      return;
    }

    if (!bookingDate) {
      alert('Please select a preferred shoot date.');
      return;
    }

    if (conflictWarning) {
      alert('Selected date and time slot is already booked. Please choose an alternate slot.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure user ID
      const customerId = currentUser ? currentUser.id : `usr-guest-${Date.now()}`;

      // If user isn't logged in, save local profile so they can track it
      if (!currentUser) {
        await db.login(email, 'customer');
      }

      const created = await db.createBooking({
        customer_id: customerId,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        service_id: selectedService.id,
        service_title: selectedService.title,
        service_price: selectedService.price,
        booking_date: bookingDate,
        time_slot: timeSlot,
        location: location.trim(),
        message: message.trim()
      });

      setSubmittedBooking(created);
      onBookingCreated(created);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if not supported
      }
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Error creating booking. Please verify details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#0c0d10] py-16 text-[#f1f3f7]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/30 bg-[#161410] px-3.5 py-1 text-xs text-[#d4af37]">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-widest">Client Reservation Portal</span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Book Your Photography Session
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Submit your reservation request in minutes. Real-time availability check prevents scheduling conflicts.
          </p>
        </div>

        {/* Success Screen */}
        {submittedBooking ? (
          <div className="mt-12 rounded-3xl border border-emerald-500/30 bg-[#101915] p-8 text-center sm:p-12 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="mt-5 font-serif text-3xl font-bold text-white">
              Booking Request Submitted!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
              Your request for <strong className="text-white">{submittedBooking.service_title}</strong> on{' '}
              <strong className="text-[#d4af37]">{submittedBooking.booking_date}</strong> has been logged.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-[#080d0a] p-6 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono text-emerald-400 font-bold">{submittedBooking.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Time Window:</span>
                <span className="text-white">{submittedBooking.time_slot}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Estimated Total:</span>
                <span className="text-white font-bold">${submittedBooking.service_price} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Initial Status:</span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 font-semibold uppercase text-[10px]">
                  {submittedBooking.status}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                id="booking-success-view-bookings-btn"
                onClick={() => setCurrentPage('customer-bookings')}
                className="flex items-center space-x-2 rounded-xl bg-[#d4af37] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110"
              >
                <span>View In My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setBookingDate('');
                  setLocation('');
                  setMessage('');
                }}
                className="rounded-xl border border-slate-700 bg-[#141720] px-6 py-3 text-xs font-semibold text-white hover:border-slate-500"
              >
                Book Another Shoot
              </button>
            </div>
          </div>
        ) : (
          /* Main Booking Form */
          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            {/* Step 1: Service Package Selection */}
            <div className="rounded-3xl border border-[#212634] bg-[#12151e] p-6 sm:p-8">
              <div className="flex items-center space-x-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-black">
                  1
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Select Photography Package</h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#1a1710] shadow-xl shadow-[#d4af37]/10 ring-1 ring-[#d4af37]'
                          : 'border-[#262b3a] bg-[#090b10] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-[#d4af37] uppercase">
                          {srv.category_name}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />}
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-white">{srv.title}</h4>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{srv.description}</p>
                      <div className="mt-4 flex items-baseline justify-between border-t border-white/5 pt-3">
                        <span className="font-serif text-lg font-bold text-white">${srv.price}</span>
                        <span className="text-[11px] text-slate-400">{Math.round(srv.duration_minutes / 60)} hrs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Time Slot Selection (With Live Conflict Guard) */}
            <div className="rounded-3xl border border-[#212634] bg-[#12151e] p-6 sm:p-8">
              <div className="flex items-center space-x-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-black">
                  2
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Choose Date & Preferred Session Slot</h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300">Shoot Date *</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                    <Calendar className="mr-2 h-4 w-4 text-[#d4af37]" />
                    <input
                      type="date"
                      required
                      min={minDateString}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-transparent text-white outline-none"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">Dates available 24 hours in advance.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Session Window *</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                    <Clock className="mr-2 h-4 w-4 text-[#d4af37]" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-transparent text-white outline-none"
                    >
                      {TIME_SLOTS.map((slot, i) => (
                        <option key={i} value={slot} className="bg-[#12151e] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Conflict notice */}
              {conflictWarning && (
                <div className="mt-4 flex items-start space-x-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <p>{conflictWarning}</p>
                </div>
              )}

              {isCheckingSlot && (
                <p className="mt-2 text-[11px] text-slate-400 animate-pulse">
                  Checking schedule conflict status...
                </p>
              )}
            </div>

            {/* Step 3: Client Information & Location */}
            <div className="rounded-3xl border border-[#212634] bg-[#12151e] p-6 sm:p-8">
              <div className="flex items-center space-x-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-black">
                  3
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Contact & Venue Details</h3>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300">Your Full Name *</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                    <User className="mr-2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Eleanor Rostova"
                      className="w-full bg-transparent outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Email Address *</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                    <Mail className="mr-2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full bg-transparent outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">Phone Number *</label>
                  <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                    <Phone className="mr-2 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-transparent outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Event Location / Venue Address *</label>
                <div className="mt-1 flex items-center rounded-xl border border-[#262b3a] bg-[#090b10] px-3.5 py-2.5 text-xs text-white">
                  <MapPin className="mr-2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. St. Regis Manor, 450 Vineyard Way, Napa Valley"
                    className="w-full bg-transparent outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Special Notes or Aesthetic Instructions</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the dress code, vibe, lighting preferences, or specific family portraits you desire..."
                  className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-3 text-xs text-white placeholder:text-slate-600 focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 4: Summary & Submit Action */}
            <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#17140e] to-[#12151e] p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                    Order Summary
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-white">
                    {selectedService?.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {bookingDate ? `${bookingDate} • ${timeSlot}` : 'Select a date above to complete booking'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-white">
                    ${selectedService?.price}
                  </span>
                  <span className="text-xs text-slate-400"> USD</span>
                  <p className="text-[10px] text-emerald-400 font-medium">No initial payment charged today</p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <button
                  id="submit-booking-btn"
                  type="submit"
                  disabled={isSubmitting || Boolean(conflictWarning)}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38c20] py-4 text-xs font-bold uppercase tracking-wider text-black shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isSubmitting ? 'Securing Slot...' : 'Submit Booking Request'}</span>
                </button>
                <p className="mt-3 text-center text-[11px] text-slate-500">
                  By submitting, your shoot is placed in Pending review status. Julian Vance will confirm details within 24 hours.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
