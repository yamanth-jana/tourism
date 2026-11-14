import { Link } from 'react-router-dom';
import { Star, MapPin, Languages, Clock, CheckCircle, XCircle, Calendar, Phone, Award, Wallet } from 'lucide-react';
import { AVAILABILITY, GUIDE_TYPES } from '../../data/guides';

const availabilityStyles = {
  available: { badge: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300', label: 'Available', icon: CheckCircle, dot: 'bg-success-500' },
  busy: { badge: 'bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300', label: 'Busy', icon: Clock, dot: 'bg-accent-500' },
  offline: { badge: 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300', label: 'Offline', icon: XCircle, dot: 'bg-error-500' },
};

function getGuideType(typeId) {
  return GUIDE_TYPES.find((t) => t.id === typeId) || GUIDE_TYPES[0];
}

export default function GuideCard({ guide, compact = false }) {
  const avail = availabilityStyles[guide.availability] || availabilityStyles.available;
  const AvailIcon = avail.icon;
  const guideType = getGuideType(guide.guideType);
  const canBook = guide.availability === 'available';

  return (
    <div className="glass-card overflow-hidden group card-hover">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={guide.photo}
              alt={guide.name}
              className="w-16 h-16 rounded-2xl object-cover"
              loading="lazy"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 ${avail.dot}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-900 dark:text-white truncate">{guide.name}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {guide.districtName}, {guide.stateName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={13} className="fill-accent-400 text-accent-400" />
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{guide.rating}</span>
              <span className="text-xs text-stone-400">({guide.reviews} reviews)</span>
            </div>
          </div>
          <span className={`badge ${avail.badge} shrink-0`}>
            <AvailIcon size={12} /> {avail.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-[11px] font-semibold">
            {guideType.icon} {guideType.label}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <Languages size={13} className="text-primary-500 shrink-0" />
            <span className="truncate">{guide.languages.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <Award size={13} className="text-primary-500 shrink-0" />
            <span>{guide.experience} years experience</span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {guide.specialties.slice(0, 3).map((spec, idx) => (
              <span key={idx} className="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px]">
                {spec}
              </span>
            ))}
          </div>
        )}

        {!compact && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 leading-relaxed line-clamp-2">{guide.bio}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/50">
          <div className="flex flex-col">
            <span className="text-xs text-stone-400">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{guide.pricePerHour}</span>
              <span className="text-[10px] text-stone-400">/hr · ₹{guide.pricePerDay}/day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${guide.contactPhone}`}
              title="Contact guide"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-primary-50 dark:hover:bg-primary-500/15 hover:text-primary-500 transition-colors"
            >
              <Phone size={16} />
            </a>
            <Link
              to="/bookings"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                canBook
                  ? 'bg-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
              }`}
            >
              <Calendar size={15} /> {canBook ? 'Book Guide' : 'Unavailable'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
