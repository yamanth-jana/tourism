import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import CategoryCard from '../components/common/CategoryCard';
import DestinationCard from '../components/common/DestinationCard';
import categories from '../data/categories';
import destinations from '../data/destinations';

export default function Categories() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const catId = location.hash.slice(1);
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        setActiveCategory(cat);
        setTimeout(() => {
          const el = document.getElementById(catId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location.hash]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const categoryDestinations = useMemo(() => {
    if (!activeCategory) return [];
    return destinations.filter((d) => d.category === activeCategory.id);
  }, [activeCategory]);

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Browse Categories
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-4">
            Explore by Category
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            From ancient temples to pristine beaches, from snow-capped mountains to vibrant festivals —
            find your perfect destination by category.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="input-field pl-12"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
          {filteredCategories.map((cat) => (
            <div key={cat.id} id={cat.id} onClick={() => setActiveCategory(cat)}>
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>

        {activeCategory && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                {activeCategory.name} — Top Destinations
              </h2>
              <button
                onClick={() => setActiveCategory(null)}
                className="btn-ghost text-sm"
              >
                Clear
              </button>
            </div>
            {categoryDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryDestinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <p className="text-stone-500 dark:text-stone-400">
                  More {activeCategory.name} destinations coming soon!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
