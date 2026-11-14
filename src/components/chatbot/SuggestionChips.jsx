import {
  Flame, Gem, Building2, Waves, Landmark, Droplets,
  Hotel, UtensilsCrossed, Map, Phone, Lightbulb, Plane, CalendarDays, Users, CloudSun,
} from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Popular Places', icon: Flame, query: 'Show me popular places' },
  { label: 'Hidden Gems', icon: Gem, query: 'Show hidden gems' },
  { label: 'Temples', icon: Building2, query: 'Suggest temples' },
  { label: 'Beaches', icon: Waves, query: 'Suggest beaches' },
  { label: 'Waterfalls', icon: Droplets, query: 'Suggest waterfalls' },
  { label: 'Museums', icon: Landmark, query: 'Suggest museums' },
  { label: 'Nearby Hotels', icon: Hotel, query: 'Hotels nearby' },
  { label: 'Nearby Restaurants', icon: UtensilsCrossed, query: 'Restaurants nearby' },
  { label: 'Nearby Guides', icon: Users, query: 'Show nearby guides' },
  { label: 'Trip Planner', icon: Plane, query: 'Plan my trip' },
  { label: '2-Day Trip', icon: CalendarDays, query: 'Plan a 2 day trip' },
  { label: 'Weather', icon: CloudSun, query: 'What is the weather like' },
  { label: 'Travel Tips', icon: Lightbulb, query: 'Travel tips' },
  { label: 'Emergency Contacts', icon: Phone, query: 'Emergency contacts' },
  { label: 'Google Maps', icon: Map, query: 'Google Maps' },
];

export default function SuggestionChips({ onSuggestion }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-t border-stone-200/60 dark:border-stone-700/50 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm">
      {SUGGESTIONS.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.query)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-stone-100/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/50 hover:bg-primary-50 dark:hover:bg-primary-500/15 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 transition-all duration-200 active:scale-95"
          >
            <Icon size={13} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
