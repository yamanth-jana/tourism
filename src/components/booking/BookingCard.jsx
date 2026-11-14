import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, MapPin, Eye, XCircle } from 'lucide-react';

const statusStyles = {
  upcoming: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300',
  completed: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300',
  cancelled: 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300',
};

export default function BookingCard({ booking, onCancel }) {
  return (
    <div className="glass-card overflow-hidden group card-hover">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-40 h-32 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={booking.placeImage}
            alt={booking.placeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-bold text-stone-900 dark:text-white truncate">{booking.placeName}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {booking.district}, {booking.state}
              </p>
            </div>
            <span className={`badge ${statusStyles[booking.status] || statusStyles.upcoming} capitalize shrink-0`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <Calendar size={13} className="text-primary-500 shrink-0" />
              <span className="truncate">{new Date(booking.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <Clock size={13} className="text-primary-500 shrink-0" />
              <span className="truncate">{booking.timeSlot}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <Users size={13} className="text-primary-500 shrink-0" />
              <span className="truncate">{booking.visitors} pax</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/bookings/${booking.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-all"
            >
              <Eye size={14} /> View Details
            </Link>
            {booking.status === 'upcoming' && (
              <button
                onClick={() => onCancel?.(booking.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-error-500/10 text-error-600 dark:text-error-400 hover:bg-error-500 hover:text-white transition-all"
              >
                <XCircle size={14} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
