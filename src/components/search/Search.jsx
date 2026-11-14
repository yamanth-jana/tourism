import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import SearchDropdown from "./SearchDropdown";
import {
  searchItems,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  POPULAR_SEARCHES,
} from '../../services/searchUtils';
import states from '../../data/states';
import categories from '../../data/categories';

export default function Search({
  placeholder = 'Search for places, states, categories...',
  initialQuery = '',
  showFilterButton = true,
  className = '',
  onSearchSubmit,
  compact = false,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [minRating, setMinRating] = useState(0);

  const [recentSearches, setRecentSearches] = useState(getRecentSearches());
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Sync initial query prop
  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  // Debounce (200ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  // Compute live search suggestions (Max 8)
  const suggestions = useMemo(() => {
    if (!debouncedQuery && selectedState === 'all' && selectedCategory === 'all' && selectedType === 'all' && minRating === 0) {
      return [];
    }

    const results = searchItems(debouncedQuery, {
      state: selectedState,
      category: selectedCategory,
      type: selectedType,
      minRating: minRating,
    });

    return results.slice(0, 8);
  }, [debouncedQuery, selectedState, selectedCategory, selectedType, minRating]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    setRecentSearches(getRecentSearches());
  };

  const executeSearch = useCallback((searchTerm, itemUrl = null) => {
    if (searchTerm) {
      saveRecentSearch(searchTerm);
      setRecentSearches(getRecentSearches());
    }

    setIsOpen(false);

    if (itemUrl) {
      navigate(itemUrl);
    } else if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }

    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  }, [navigate, onSearchSubmit]);

  // Keyboard navigation support (Up, Down, Enter, Escape)
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const selectedItem = suggestions[selectedIndex];
        executeSearch(selectedItem.name, selectedItem.url);
      } else {
        executeSearch(query);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const handleSelectSuggestion = (item) => {
    executeSearch(item.name, item.url);
  };

  const handleSelectPopular = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  const handleSelectRecent = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const hasActiveFilters = selectedState !== 'all' || selectedCategory !== 'all' || selectedType !== 'all' || minRating > 0;

  return (
    <div ref={searchContainerRef} className={`relative z-50 w-full ${className}`}>
      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative z-20">
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            compact
              ? 'px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700'
              : 'glass-card p-2 shadow-soft hover:shadow-soft-lg'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-1 px-3">
            <SearchIcon
              size={compact ? 18 : 20}
              className="text-stone-400 dark:text-stone-500 flex-shrink-0"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-expanded={isOpen}
              aria-controls="search-suggestions-dropdown"
              aria-autocomplete="list"
              className={`w-full bg-transparent text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none ${
                compact ? 'text-sm py-1' : 'text-base py-2'
              }`}
            />

            {/* Clear input button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(-1);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          {showFilterButton && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                hasActiveFilters || showFilters
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title="Toggle filters"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            className={`btn-primary ${compact ? 'py-1.5 px-4 text-xs' : 'py-2.5 px-6 text-sm'}`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Expandable Filter Bar */}
      {showFilterButton && showFilters && (
        <div className="glass-card p-4 mt-2 z-20 space-y-3 animate-fade-in text-xs border border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/50 dark:border-stone-800">
            <span className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px]">
              Filter Destinations
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSelectedState('all');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setMinRating(0);
                }}
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Type Filter */}
            <div>
              <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="all">All Types</option>
                <option value="places">Known Places</option>
                <option value="hidden_gems">Hidden Gems</option>
                <option value="hotels">Hotels</option>
                <option value="restaurants">Restaurants</option>
                <option value="guides">Guides</option>
                <option value="categories">Categories</option>
                <option value="states">States</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="all">All States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0★ & above</option>
                <option value={4.5}>4.5★ & above</option>
                <option value={4.8}>4.8★ & above</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Suggestions */}
      <SearchDropdown
        isOpen={isOpen}
        query={debouncedQuery}
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        recentSearches={recentSearches}
        popularSearches={POPULAR_SEARCHES}
        onSelectSuggestion={handleSelectSuggestion}
        onSelectPopular={handleSelectPopular}
        onSelectRecent={handleSelectRecent}
        onClearRecent={handleClearRecent}
        onViewAllResults={() => executeSearch(query)}
      />
    </div>
  );
}
