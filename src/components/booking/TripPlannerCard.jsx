import { Clock, X, MapPin, Plus, UtensilsCrossed, Camera, ArrowUp, ArrowDown, ArrowRight, RotateCcw } from 'lucide-react';

export default function TripPlannerCard({
  day,
  places,
  dayIndex,
  totalDays,
  onRemovePlace,
  onReplacePlace,
  onMoveUp,
  onMoveDown,
  onMoveToDay,
  onAddSuggested,
}) {
  const safePlaces = places ?? [];
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
            {day ?? dayIndex + 1}
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white">Day {day ?? dayIndex + 1}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {safePlaces.filter((p) => !p.isMeal && !p.isActivity).length} places
              {safePlaces.length > 0 && ` · ${Math.round(safePlaces.reduce((acc, p) => acc + (p.visitDuration || 0), 0) / 60)}h`}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAddSuggested(dayIndex)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-all"
        >
          <Plus size={14} /> Add Place
        </button>
      </div>

      {safePlaces.length > 0 ? (
        <div className="space-y-2">
          {safePlaces.map((place, idx) => {
            const isMeal = place.isMeal;
            const isActivity = place.isActivity;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-2xl group transition-colors ${
                  isMeal
                    ? 'bg-accent-50 dark:bg-accent-500/10 border border-accent-200/50 dark:border-accent-500/20'
                    : isActivity
                    ? 'bg-secondary-50 dark:bg-secondary-500/10 border border-secondary-200/50 dark:border-secondary-500/20'
                    : 'bg-stone-50/80 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {/* Travel connector */}
                {idx > 0 && (
                  <div className="absolute -mt-8 ml-5 text-stone-300 dark:text-stone-600">
                    <ArrowRight size={10} />
                  </div>
                )}

                {isMeal || isActivity ? (
                  <div className="w-12 h-12 rounded-xl bg-white/60 dark:bg-stone-800/60 flex items-center justify-center shrink-0">
                    {isMeal ? (
                      <UtensilsCrossed size={20} className="text-accent-500" />
                    ) : (
                      <Camera size={20} className="text-secondary-500" />
                    )}
                  </div>
                ) : (
                  <img src={place.image} alt={place.name} className="w-12 h-12 rounded-xl object-cover shrink-0" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23f5f5f4" width="48" height="48"/%3E%3C/svg%3E'; }} />
                )}

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isMeal ? 'text-accent-700 dark:text-accent-300' : isActivity ? 'text-secondary-700 dark:text-secondary-300' : 'text-stone-900 dark:text-white'
                  }`}>
                    {place.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <Clock size={11} /> {place.time}
                    {!isMeal && !isActivity && place.visitDuration && (
                      <span className="text-stone-400">· {place.visitDuration}min</span>
                    )}
                  </div>
                </div>

                {/* Edit controls — only for real places */}
                {!isMeal && !isActivity && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button
                        onClick={() => onMoveUp(dayIndex, idx)}
                        className="p-1 rounded-lg text-stone-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                        title="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                    )}
                    {idx < safePlaces.length - 1 && (
                      <button
                        onClick={() => onMoveDown(dayIndex, idx)}
                        className="p-1 rounded-lg text-stone-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                        title="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    )}
                    {totalDays > 1 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value !== '') onMoveToDay(dayIndex, idx, Number(e.target.value));
                          e.target.value = '';
                        }}
                        className="text-xs px-1.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 border-none focus:outline-none cursor-pointer"
                        title="Move to day"
                        defaultValue=""
                      >
                        <option value="" disabled>→</option>
                        {Array.from({ length: totalDays }, (_, i) => i).filter((i) => i !== dayIndex).map((i) => (
                          <option key={i} value={i}>Day {i + 1}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => onReplacePlace(dayIndex, idx)}
                      className="p-1 rounded-lg text-stone-400 hover:text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-500/10 transition-colors"
                      title="Replace place"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => onRemovePlace(dayIndex, idx)}
                      className="p-1 rounded-lg text-stone-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                      title="Remove place"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-700">
          <MapPin size={24} className="mx-auto text-stone-300 dark:text-stone-600 mb-2" />
          <p className="text-sm text-stone-400 dark:text-stone-500">No places added yet</p>
        </div>
      )}
    </div>
  );
}
