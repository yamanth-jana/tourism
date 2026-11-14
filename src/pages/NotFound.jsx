import { Link } from 'react-router-dom';
import { Compass, Home, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <div className="text-[120px] sm:text-[180px] font-bold text-gradient leading-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center animate-float">
              <Compass size={40} className="text-primary-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">
          Lost in the Wilderness
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Looks like you've wandered off the beaten path. The page you're looking for
          doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/explore" className="btn-secondary">
            <MapPin size={18} /> Explore Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
