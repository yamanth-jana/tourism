import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import destinations from '../data/destinations';
import DestinationCard from '../components/common/DestinationCard';

export default function Favorites() {
  const { favorites } = useFavorites();
  const favoriteDestinations = destinations.filter((d) => favorites.includes(d.id));

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-error-500 to-error-700 shadow-lg shadow-error-500/30 mb-4">
            <Heart size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Your Favorites
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            {favoriteDestinations.length > 0
              ? `You have ${favoriteDestinations.length} saved ${favoriteDestinations.length === 1 ? 'place' : 'places'}`
              : 'No favorites yet — start exploring!'}
          </p>
        </div>

        {favoriteDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center max-w-lg mx-auto">
            <Heart size={64} className="mx-auto text-stone-300 dark:text-stone-700 mb-4" />
            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
              No favorites yet
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">
              Browse destinations and tap the heart icon to save them here for quick access.
            </p>
            <Link to="/explore" className="btn-primary">
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
