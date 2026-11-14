import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, TrendingUp, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import HiddenGemCard from '../components/common/HiddenGemCard';
import hiddenGems from '../data/hiddenGems';

export default function HiddenGems() {
  const [search, setSearch] = useState('');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    }
  }, [location.hash]);

  const filteredGems = useMemo(() => {
    return hiddenGems.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.state.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase());
      const matchesTrending = !showTrendingOnly || g.trending;
      return matchesSearch && matchesTrending;
    });
  }, [search, showTrendingOnly]);

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-4xl overflow-hidden mb-10">
          <img
            src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Hidden Gems"
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 backdrop-blur-md text-primary-300 text-sm font-semibold mb-4">
              <TrendingUp size={16} /> Community Driven
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Hidden Gems of India
            </h1>
            <p className="text-white/80 max-w-xl">
              Discover offbeat destinations shared by our community of travelers.
              These hidden treasures are waiting to be explored.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hidden gems..."
              className="input-field pl-12"
            />
          </div>
          <button
            onClick={() => setShowTrendingOnly(!showTrendingOnly)}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              showTrendingOnly
                ? 'bg-primary-500 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <TrendingUp size={18} /> Trending Only
          </button>
          <Link to="/upload-place" className="btn-primary">
            <Upload size={18} /> Upload Place
          </Link>
        </div>

        {filteredGems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGems.map((gem) => (
              <div key={gem.id} id={gem.id} className="scroll-mt-24">
                <HiddenGemCard gem={gem} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <MapPin size={48} className="mx-auto text-stone-400 mb-4" />
            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
              No hidden gems found
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              Be the first to share a hidden gem!
            </p>
            <Link to="/upload-place" className="btn-primary">
              <Upload size={18} /> Upload a Place
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
