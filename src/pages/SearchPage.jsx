import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Gem, Filter, Calendar, Compass, Building2, Utensils, Star, ArrowRight } from 'lucide-react';
import DestinationCard from '../components/common/DestinationCard';
import BookingCard from '../components/booking/BookingCard';
import SearchBar from '../components/search/Search';
import { searchItems } from '../services/searchUtils';
import states from '../data/states';
import categories from '../data/categories';
import bookingsData from '../data/bookings';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [specialFilter, setSpecialFilter] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    if (qParam === 'trending' || qParam === 'top-rated') {
      setQuery('');
      setSpecialFilter(qParam);
    } else {
      setQuery(qParam);
      setSpecialFilter(null);
    }
  }, [searchParams]);

  // Main smart search results across all 8 types
  const searchResults = useMemo(() => {
    let items = searchItems(query, {
      state: selectedState,
      category: selectedCategory,
      type: filterType === 'bookings' ? 'all' : filterType,
    });

    if (specialFilter === 'trending') {
      items = items.filter((d) => d.trending || d.rating >= 4.7);
    } else if (specialFilter === 'top-rated') {
      items = items.filter((d) => d.rating >= 4.8);
    }

    // Sort
    if (sortBy === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [query, selectedState, selectedCategory, filterType, specialFilter, sortBy]);

  // Bookings match (for bookings tab)
  const bookingResults = useMemo(() => {
    if (filterType !== 'bookings' && filterType !== 'all') return [];
    if (!query) return filterType === 'bookings' ? bookingsData : [];
    const q = query.toLowerCase();
    return bookingsData.filter((b) =>
      b.placeName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.visitorName.toLowerCase().includes(q) ||
      b.state.toLowerCase().includes(q)
    );
  }, [query, filterType]);

  const filterTypes = [
    { id: 'all', label: 'All Results', icon: Search },
    { id: 'places', label: 'Tourist Places', icon: MapPin },
    { id: 'hidden_gems', label: 'Hidden Gems', icon: Gem },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'restaurants', label: 'Restaurants', icon: Utensils },
    { id: 'guides', label: 'Guides', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Search Destinations & Services
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
            Live search across tourist places, hidden gems, states, districts, guides, hotels, and restaurants.
          </p>
        </div>

        {/* Enhanced Live Search Bar with Dropdown & Filters */}
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar
            initialQuery={query}
            placeholder="Search by place, state, district, guide, hotel, or restaurant..."
            onSearchSubmit={(q) => {
              setQuery(q);
              setSearchParams(q ? { q } : {});
            }}
          />
        </div>

        {/* Filter Type Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {filterTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setFilterType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filterType === type.id
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <IconComponent size={15} /> {type.label}
              </button>
            );
          })}
        </div>

        {/* Advanced Filter Bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 font-medium">
              <Filter size={16} /> Filters:
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="all">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ml-auto"
            >
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {query ? (
              <>
                Found <span className="font-bold text-stone-900 dark:text-white">{searchResults.length + bookingResults.length}</span> results for &quot;<span className="font-bold text-stone-900 dark:text-white">{query}</span>&quot;
              </>
            ) : (
              <>
                Showing <span className="font-bold text-stone-900 dark:text-white">{searchResults.length}</span> destinations & services
              </>
            )}
          </p>
        </div>

        {/* Main Search Results Grid */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {searchResults.map((item) => {
              // Known Places & Hidden Gems standard card rendering
              if (item.type === 'place' || item.type === 'hidden_gem') {
                return (
                  <DestinationCard
                    key={item.id}
                    destination={{
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      rating: item.rating,
                      categoryName: item.categoryName,
                      state: item.state,
                      shortDescription: item.description,
                      reviewsCount: 120,
                    }}
                  />
                );
              }

              // Hotel or Restaurant custom card
              if (item.type === 'hotel' || item.type === 'restaurant') {
                return (
                  <div key={item.id} className="glass-card p-4 rounded-3xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                    <div>
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-stone-200 dark:bg-stone-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 left-3 badge bg-stone-900/80 text-white backdrop-blur-md">
                          {item.typeLabel}
                        </span>
                        {item.rating && (
                          <span className="absolute top-3 right-3 badge bg-white/90 dark:bg-stone-900/90 text-amber-500 font-bold backdrop-blur-md flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> {item.rating}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1 group-hover:text-primary-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-2">
                        <MapPin size={12} /> {item.district}, {item.state}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-stone-800">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        {item.price}
                      </span>
                      <Link to={item.url} className="text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-primary-500 flex items-center gap-1">
                        Explore <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              }

              // States, Districts, Categories or Guides standard fallback cards
              return (
                <div key={item.id} className="glass-card p-4 rounded-3xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                  <div>
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-3 bg-stone-200 dark:bg-stone-800">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 badge bg-primary-600 text-white">
                        {item.typeLabel}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1 group-hover:text-primary-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                      {item.state ? `${item.state}` : item.categoryName}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <Link to={item.url} className="mt-4 btn-secondary text-xs py-2 w-full text-center flex items-center justify-center gap-1">
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Bookings Section */}
        {(filterType === 'all' || filterType === 'bookings') && bookingResults.length > 0 && (
          <div className="mb-12">
            <h3 className="font-bold text-stone-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary-500" /> Matched Bookings ({bookingResults.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {bookingResults.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {/* No Results Empty State */}
        {searchResults.length === 0 && bookingResults.length === 0 && (
          <div className="glass-card p-12 text-center max-w-xl mx-auto rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2">
              No matching destinations found.
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
              Try searching for common terms like &quot;temples&quot;, &quot;waterfalls&quot;, &quot;viz&quot;, or clear active filters.
            </p>
            <Link to="/explore" className="btn-primary">
              Browse All Destinations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
