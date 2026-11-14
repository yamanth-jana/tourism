import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 16, showValue = false, reviewsCount }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.floor(rating)
                ? 'fill-accent-400 text-accent-400'
                : star <= rating
                ? 'fill-accent-400/50 text-accent-400'
                : 'fill-stone-300 text-stone-300 dark:fill-stone-600 dark:text-stone-600'
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount != null && (
        <span className="text-xs text-stone-500 dark:text-stone-400">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
