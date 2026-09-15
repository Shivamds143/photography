import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Camera
} from 'lucide-react';
import { UserProfile, Booking, PageView } from '../types';
import { db } from '../lib/databaseService';

interface CustomerDashboardViewProps {
  currentUser: UserProfile;
  setCurrentPage: (page: PageView) => void;
  onBookingsUpdated: () => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  currentUser,
  setCurrentPage,
  onBookingsUpdated
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await db.getCustomerBookings(currentUser.id);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    const res = await db.cancelBooking(bookingId, currentUser.id);
    if (res.success) {
      setActionMessage('Booking was successfully cancelled.');
      await loadBookings();
      onBookingsUpdated();
      setSelectedBooking(null);
      setTimeout(() => setActionMessage(null), 3000);
    } else {
      alert(res.message || 'Unable to cancel booking.');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            <Clock className="h-3 w-3" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#0c0d10] py-12 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Top Strip */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#212634] bg-[#12151e] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.full_name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#d4af37]/40"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                  {currentUser.full_name}
                </h1>
                <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold text-[#d4af37] uppercase">
                  Client Portal
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{currentUser.email} • {currentUser.phone || 'No phone registered'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('booking')}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38c20] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:brightness-110"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Another Shoot</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            {actionMessage}
          </div>
        )}

        {/* Quick Stats Banner */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <p className="text-xs text-slate-400">Total Bookings</p>
            <p className="mt-1 font-serif text-3xl font-bold text-white">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <p className="text-xs text-slate-400">Active / Upcoming Shoots</p>
            <p className="mt-1 font-serif text-3xl font-bold text-[#d4af37]">
              {bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <p className="text-xs text-slate-400">Completed Sessions</p>
            <p className="mt-1 font-serif text-3xl font-bold text-emerald-400">
              {bookings.filter((b) => b.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-white">My Photography Bookings</h2>
            <span className="text-xs text-slate-400">
              Showing only your private reservations ({bookings.length})
            </span>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-[#212634] bg-[#12151e] p-12 text-center text-xs text-slate-400">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[#262b3a] bg-[#10121a] p-12 text-center">
              <Camera className="mx-auto h-10 w-10 text-slate-600" />
              <h3 className="mt-3 font-serif text-xl font-bold text-white">No Bookings Found</h3>
              <p className="mt-1 text-xs text-slate-400">
                You haven't scheduled any photography sessions with Aura Studio yet.
              </p>
              <button
                onClick={() => setCurrentPage('booking')}
                className="mt-6 rounded-xl bg-[#d4af37] px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:brightness-110"
              >
                Schedule Your First Session
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#212634] bg-[#12151e] p-6 transition-all hover:border-slate-600 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {booking.service_title}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>{booking.booking_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{booking.time_slot}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span className="truncate max-w-[200px]">{booking.location}</span>
                      </span>
                      <span className="font-bold text-white">
                        ${booking.service_price} USD
                      </span>
                    </div>

                    {booking.notes && (
                      <p className="mt-1 text-xs text-[#d4af37] italic">
                        Studio Note: {booking.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center space-x-2 sm:mt-0">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-xl border border-slate-700 bg-[#161922] px-4 py-2 text-xs font-semibold text-white hover:border-[#d4af37]"
                    >
                      View Details
                    </button>

                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-[#262b3a] bg-[#10131c] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1e2330] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Ref: {selectedBooking.id}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {selectedBooking.service_title}
                  </h3>
                </div>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="rounded-xl bg-[#090b10] p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold text-white">{selectedBooking.booking_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Slot:</span>
                    <span className="text-white">{selectedBooking.time_slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-white text-right max-w-[240px]">{selectedBooking.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Investment:</span>
                    <span className="font-bold text-[#d4af37]">${selectedBooking.service_price} USD</span>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div>
                    <span className="text-slate-500 block">Your Special Message:</span>
                    <p className="mt-1 rounded-lg bg-[#090b10] p-3 text-slate-300">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}

                {selectedBooking.notes && (
                  <div>
                    <span className="text-slate-500 block">Photographer's Studio Notes:</span>
                    <p className="mt-1 rounded-lg border border-[#d4af37]/20 bg-[#17140e] p-3 text-[#d4af37]">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#1e2330] pt-4">
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') ? (
                  <button
                    onClick={() => handleCancel(selectedBooking.id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Cancel This Booking
                  </button>
                ) : <span />}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl bg-[#d4af37] px-5 py-2 text-xs font-bold text-black uppercase hover:brightness-110"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
