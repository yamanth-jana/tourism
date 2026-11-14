import { Link } from 'react-router-dom';
import {
  CheckCircle, Download, Share2, ArrowLeft, Calendar, Clock,
  Users, MapPin, Compass, FileText, Mail, Phone,
} from 'lucide-react';

export default function BookingConfirmation({ booking }) {
  const handleShare = async () => {
    const shareText = `My booking for ${booking.placeName} on ${booking.visitDate} (${booking.timeSlot}) - Booking ID: ${booking.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Explore India Booking', text: shareText }); } catch {}
    } else {
      navigator.clipboard?.writeText(shareText);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Success header */}
      <div className="glass-card p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-500 via-primary-500 to-success-500" />
        <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle size={40} className="text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-1">Booking Confirmed!</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Your visit has been successfully booked. Save your booking ID for future reference.</p>
      </div>

      {/* Booking ID banner */}
      <div className="glass-card p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">Booking ID</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-wider">{booking.id}</p>
        </div>
        <span className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300 px-4 py-1.5">
          <CheckCircle size={14} /> Confirmed
        </span>
      </div>

      {/* Details grid */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Booking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-500 dark:text-stone-400">Tourist Place</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{booking.placeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Visit Date</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">
                {new Date(booking.visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Time Slot</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">{booking.timeSlot}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <Users size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Visitors</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">{booking.visitors} {booking.visitors > 1 ? 'People' : 'Person'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <Compass size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Guide</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">
                {booking.guideRequired ? `Yes (${booking.language})` : 'Not Required'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Booked On</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Visitor contact */}
        <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Mail size={14} className="text-primary-500" /> {booking.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <Phone size={14} className="text-primary-500" /> {booking.phone}
            </div>
          </div>
        </div>
      </div>

      {/* QR placeholder */}
      <div className="glass-card p-6 mb-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3 border-2 border-dashed border-stone-300 dark:border-stone-600">
          <svg className="w-16 h-16 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM9.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 019.75 19.875v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 19.875v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0115.75 9.375v-4.5z" />
          </svg>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">Show this QR code at entry</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-secondary text-sm">
          <Download size={18} /> Download Ticket
        </button>
        <button onClick={handleShare} className="btn-secondary text-sm">
          <Share2 size={18} /> Share Booking
        </button>
        <Link to="/bookings" className="btn-secondary text-sm">
          <ArrowLeft size={18} /> View My Bookings
        </Link>
      </div>
    </div>
  );
}
