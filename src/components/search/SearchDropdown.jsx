import { Clock, TrendingUp, Search, MapPin, Star, Trash2, ArrowRight } from 'lucide-react';
import { getHighlightedTextParts } from '../../services/searchUtils';

export default function SearchDropdown({
  isOpen,
  query,
  suggestions = [],
  selectedIndex = -1,
  recentSearches = [],
  popularSearches = [],
  onSelectSuggestion,
  onSelectPopular,
  onSelectRecent,
  onClearRecent,
  onViewAllResults,
}) {
  if (!isOpen) return null;

  const hasQuery = Boolean(query && query.trim());

  return (
    <div
      id="search-suggestions-dropdown"
      aria-live="polite"
      className="absolute top-full left-0 right-0 mt-2 z-[1000] glass-card p-3 shadow-2xl rounded-2xl border border-stone-200/60 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl max-h-[480px] overflow-y-auto animate-fade-in"
    >
      {/* CASE 1: Query is empty -> Show Recent & Popular Searches */}
      {!hasQuery && (
        <div className="space-y-4 p-1">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-500" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearRecent();
                  }}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors flex items-center gap-1 text-[11px] font-normal"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, idx) => (
                  <button
                    key={`recent-${idx}`}
                    type="button"
                    onClick={() => onSelectRecent(term)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all text-sm group text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={15} className="text-stone-400 group-hover:text-primary-500 transition-colors" />
                      {term}
                    </span>
                    <ArrowRight size={14} className="text-stone-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 px-2">
              <TrendingUp size={14} className="text-amber-500" /> Popular Searches
            </div>
            <div className="flex flex-wrap gap-2 px-1">
              {popularSearches.map((term, idx) => (
                <button
                  key={`popular-${idx}`}
                  type="button"
                  onClick={() => onSelectPopular(term)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: Live Query Typed -> Suggestions list or No Results */}
      {hasQuery && (
        <div>
          {suggestions.length > 0 ? (
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-3 pt-1 pb-1 flex justify-between items-center">
                <span>Top Results ({suggestions.length})</span>
                <span className="text-[10px] text-stone-400 font-normal">Use ↑ ↓ & Enter</span>
              </div>

              {suggestions.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const nameParts = getHighlightedTextParts(item.name, query);

                return (
                  <button
                    key={item.id || `sugg-${idx}`}
                    type="button"
                    onClick={() => onSelectSuggestion(item)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-primary-500/10 dark:bg-primary-500/20 ring-1 ring-primary-500/40'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    {/* Image Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0 shadow-sm border border-stone-200/50 dark:border-stone-700/50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <MapPin size={20} />
                        </div>
                      )}
                    </div>

                    {/* Meta & Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-stone-900 dark:text-white text-sm truncate">
                          {nameParts.map((part, pIdx) =>
                            part.match ? (
                              <mark
                                key={`p-${pIdx}`}
                                className="bg-primary-500/20 dark:bg-primary-500/40 text-primary-700 dark:text-primary-300 rounded px-0.5 font-bold"
                              >
                                {part.text}
                              </mark>
                            ) : (
                              <span key={`p-${pIdx}`}>{part.text}</span>
                            )
                          )}
                        </span>

                        <span className="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] uppercase tracking-wide px-2 py-0.5 border border-stone-200 dark:border-stone-700">
                          {item.typeLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                        {item.state && (
                          <span className="flex items-center gap-0.5">
                            <MapPin size={12} className="text-stone-400" />
                            {item.district ? `${item.district}, ${item.state}` : item.state}
                          </span>
                        )}

                        {item.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-amber-500 font-medium ml-auto">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            {item.rating}
                          </span>
                        )}

                        {item.price && (
                          <span className="text-stone-600 dark:text-stone-300 font-medium ml-1">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {onViewAllResults && (
                <button
                  type="button"
                  onClick={onViewAllResults}
                  className="w-full mt-2 py-2 px-3 text-center text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search size={14} /> See all search results for &quot;{query}&quot;
                </button>
              )}
            </div>
          ) : (
            /* CASE 3: No Results Found */
            <div className="py-8 px-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                <Search size={22} />
              </div>
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                No matching destinations found.
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                Try searching for temples, beaches, states or categories like &quot;viz&quot; or &quot;water&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
