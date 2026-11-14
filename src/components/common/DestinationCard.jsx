import { Heart, Share2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { useFavorites } from '../../context/FavoritesContext';

export default function DestinationCard({ destination }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(destination.id);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      to={`/place/${destination.id}`}
      className="group glass-card card-hover overflow-hidden flex flex-col"
    >
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <span className="badge absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 text-primary-600 dark:text-primary-400 backdrop-blur-md">
          {destination.categoryName}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(destination.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            fav
              ? 'bg-error-500 text-white scale-110'
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:scale-110'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart size={18} className={fav ? 'fill-white' : ''} />
        </button>

        {destination.trending && (
          <span className="badge absolute bottom-3 left-3 bg-primary-500 text-white">
            Trending
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-tight line-clamp-1">
            {destination.name}
          </h3>
          <RatingStars rating={destination.rating} size={14} showValue />
        </div>

        <div className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 mb-3">
          <MapPin size={14} />
          <span>{destination.city}, {destination.state}</span>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 flex-1">
          {destination.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Best:</span> {destination.bestTimeToVisit}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-stone-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
            <span className="btn-primary px-4 py-2 text-sm">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
