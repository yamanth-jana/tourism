import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, Users, MapPin, Compass, Mail, Phone,
  CheckCircle, XCircle, Map, Phone as PhoneIcon, Lightbulb, ArrowLeft, Download, Share2,
} from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import bookingsData from '../data/bookings';

const statusStyles = {
  upcoming: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300',
  completed: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300',
  cancelled: 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300',
};

export default function BookingDetails() {
  const { id } = useParams();
  const booking = bookingsData.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="pt-32 pb-16 container-max px-4 text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Booking Not Found</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">This booking doesn't exist or has been removed.</p>
        <Link to="/bookings" className="btn-primary">View My Bookings</Link>
      </div>
    );
  }

  const handleShare = async () => {
    const text = `Booking ${booking.id} for ${booking.placeName} on ${booking.visitDate}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Explore India Booking', text }); } catch {}
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const detailItem = (icon, label, value) => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
        <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'My Bookings', to: '/bookings' },
              { label: booking.id },
            ]}
          />

          {/* Header */}
          <div className="glass-card overflow-hidden mb-6">
            <div className="relative h-48">
              <img src={booking.placeImage} alt={booking.placeName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{booking.placeName}</h1>
                    <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {booking.district}, {booking.state}
                    </p>
                  </div>
                  <span className={`badge ${statusStyles[booking.status]} capitalize`}>
                    {booking.status === 'upcoming' && <CheckCircle size={12} />}
                    {booking.status === 'cancelled' && <XCircle size={12} />}
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
              <div>
                <span className="text-xs text-stone-500 dark:text-stone-400">Booking ID</span>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400 tracking-wider">{booking.id}</p>
              </div>
              <span className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300">
                <CheckCircle size={12} /> Confirmed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Booking info */}
            <div className="glass-card p-5 lg:col-span-2">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detailItem(<Calendar size={18} className="text-primary-600 dark:text-primary-400" />, 'Visit Date', new Date(booking.visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}
                {detailItem(<Clock size={18} className="text-primary-600 dark:text-primary-400" />, 'Time Slot', booking.timeSlot)}
                {detailItem(<Users size={18} className="text-primary-600 dark:text-primary-400" />, 'Visitors', `${booking.visitors} ${booking.visitors > 1 ? 'People' : 'Person'}`)}
                {detailItem(<Compass size={18} className="text-primary-600 dark:text-primary-400" />, 'Guide', booking.guideRequired ? `Yes (${booking.language})` : 'Not Required')}
              </div>
              {booking.specialRequirements && (
                <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/50">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Special Requirements</p>
                  <p className="text-sm text-stone-700 dark:text-stone-300">{booking.specialRequirements}</p>
                </div>
              )}
            </div>

            {/* QR code placeholder */}
            <div className="glass-card p-5 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3 border-2 border-dashed border-stone-300 dark:border-stone-600">
                <svg className="w-16 h-16 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM9.75 15.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 019.75 19.875v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0115.75 9.375v-4.5z" />
                </svg>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 text-center">Show QR at entry gate</p>
            </div>
          </div>

          {/* Visitor details */}
          <div className="glass-card p-5 mb-6">
            <h3 className="font-bold text-stone-900 dark:text-white mb-4">Visitor Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {detailItem(<Users size={18} className="text-primary-600 dark:text-primary-400" />, 'Name', booking.visitorName)}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Email</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{booking.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Phone</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{booking.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps placeholder */}
          <div className="glass-card rounded-3xl h-56 flex flex-col items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center mb-3">
              <Map size={28} className="text-secondary-500" />
            </div>
            <p className="text-stone-600 dark:text-stone-400 font-semibold text-sm">Google Maps Integration</p>
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">Map view will be available with Google Maps API</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Emergency contacts */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <PhoneIcon size={18} className="text-error-500" /> Emergency Contacts
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Police', number: '100' },
                  { name: 'Ambulance', number: '108' },
                  { name: 'Tourist Helpline', number: '1363' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-error-50 dark:bg-error-500/10">
                    <div className="w-8 h-8 rounded-full bg-error-500 flex items-center justify-center shrink-0">
                      <PhoneIcon size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">{c.name}</p>
                      <p className="text-sm font-bold text-error-600 dark:text-error-400">{c.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel tips */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-primary-500" /> Travel Tips
              </h3>
              <ul className="space-y-2">
                {[
                  'Carry valid ID proof for entry',
                  'Arrive 15 minutes before your time slot',
                  'Dress modestly for religious sites',
                  'Keep emergency numbers handy',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="text-primary-500 mt-0.5">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary text-sm"><Download size={18} /> Download Ticket</button>
            <button onClick={handleShare} className="btn-secondary text-sm"><Share2 size={18} /> Share</button>
            <Link to="/bookings" className="btn-secondary text-sm"><ArrowLeft size={18} /> Back to Bookings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
