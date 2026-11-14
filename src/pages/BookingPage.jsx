import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import destinations from '../data/destinations';
import Breadcrumb from '../components/common/Breadcrumb';
import BookingForm from '../components/booking/BookingForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const placeId = id || searchParams.get('place');
  const destination = destinations.find((d) => d.id === placeId);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!destination) {
    return (
      <div className="pt-32 pb-16 container-max px-4 text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Destination Not Found</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">The place you're looking for doesn't exist.</p>
        <Link to="/explore" className="btn-primary">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Explore', to: '/explore' },
              { label: destination.name, to: `/place/${destination.id}` },
              { label: 'Book Visit' },
            ]}
          />

          {confirmedBooking ? (
            <BookingConfirmation booking={confirmedBooking} />
          ) : (
            <>
              <div className="glass-card overflow-hidden mb-6">
                <div className="relative h-40 sm:h-48">
                  <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Book Your Visit</h1>
                    <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {destination.name}, {destination.state}
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 sm:p-8">
                <BookingForm destination={destination} onConfirm={setConfirmedBooking} />
              </div>
              <div className="mt-4 text-center">
                <Link to={`/place/${destination.id}`} className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-500 transition-colors">
                  <ArrowLeft size={16} /> Back to {destination.name}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
