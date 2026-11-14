import { Link } from 'react-router-dom';
import { MapPin, Heart, Share2, TrendingUp } from 'lucide-react';
import RatingStars from './RatingStars';

export default function HiddenGemCard({ gem }) {
  return (
    <div className="group glass-card card-hover overflow-hidden">
      <div className="relative h-52 overflow-hidden rounded-t-3xl">
        <img
          src={gem.image}
          alt={gem.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {gem.trending && (
          <span className="badge absolute top-3 left-3 bg-primary-500 text-white">
            <TrendingUp size={12} /> Trending
          </span>
        )}

        <div className="absolute top-3 right-3 flex gap-2">
          <button className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-600 dark:text-stone-300 hover:text-error-500 transition-colors">
            <Heart size={16} />
          </button>
          <button className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-600 dark:text-stone-300 hover:text-primary-500 transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">
            {gem.name}
          </h3>
          <RatingStars rating={gem.rating} size={14} showValue />
        </div>

        <div className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 mb-3">
          <MapPin size={14} />
          <span>{gem.location}</span>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-4">
          {gem.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">
            {gem.category}
          </span>
          <Link
            to={`/hidden-gems#${gem.id}`}
            className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 flex items-center gap-1 transition-all"
          >
            View <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
