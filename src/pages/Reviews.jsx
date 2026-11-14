import { useState, useEffect } from 'react';
import { ThumbsUp, MapPin, Star, Filter } from 'lucide-react';
import defaultReviews from '../data/reviews';
import RatingStars from '../components/common/RatingStars';
import { reviewsApi } from '../services/api';

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState(defaultReviews);
  const [sortBy, setSortBy] = useState('recent');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      const res = await reviewsApi.getAllReviews();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setReviewsList(res.data);
      }
    }
    loadReviews();
  }, []);

  const handleHelpful = async (id) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r))
    );
    try {
      await reviewsApi.markHelpful(id);
    } catch {}
  };

  const filteredReviews = reviewsList
    .filter((r) => r.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
      return 0;
    });

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Community Reviews
          </p>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Traveler Reviews
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Read authentic experiences shared by fellow travelers across India.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <Filter size={16} /> Filter:
          </div>
          {[0, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                minRating === r
                  ? 'bg-primary-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {r === 0 ? 'All Ratings' : `${r}+ Stars`}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ml-auto"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="glass-card p-6 card-hover">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 dark:text-white">{review.userName}</h4>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars rating={review.rating} size={14} showValue />
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <MapPin size={12} /> {review.placeName}
                    </span>
                  </div>
                </div>
              </div>

              <h5 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">{review.title}</h5>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                {review.comment}
              </p>

              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Review ${idx + 1}`}
                      className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-3 border-t border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-500 transition-colors"
                >
                  <ThumbsUp size={16} /> Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-error-500 transition-colors">
                  <Star size={16} /> Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
