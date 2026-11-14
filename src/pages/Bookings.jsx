import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Compass } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import BookingHistory from '../components/booking/BookingHistory';
import bookingsData from '../data/bookings';
import { bookingsApi } from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState(bookingsData);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadBookings() {
      const res = await bookingsApi.getMyBookings();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setBookings(res.data);
      }
    }
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const res = await bookingsApi.cancelBooking(id);
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      } else {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
      }
    } catch {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Bookings' }]} />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">My Bookings</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Manage your tour visits and booking history</p>
          </div>
          <Link to="/explore" className="btn-primary text-sm">
            <Plus size={18} /> Book New Visit
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-4 text-center">
            <Calendar size={20} className="mx-auto text-primary-500 mb-1" />
            <div className="text-xl font-bold text-stone-900 dark:text-white">
              {bookings.filter((b) => b.status === 'upcoming').length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Upcoming</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Compass size={20} className="mx-auto text-success-500 mb-1" />
            <div className="text-xl font-bold text-stone-900 dark:text-white">
              {bookings.filter((b) => b.status === 'completed').length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Completed</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Calendar size={20} className="mx-auto text-error-500 mb-1" />
            <div className="text-xl font-bold text-stone-900 dark:text-white">
              {bookings.filter((b) => b.status === 'cancelled').length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Cancelled</div>
          </div>
        </div>

        <BookingHistory
          bookings={bookings}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
