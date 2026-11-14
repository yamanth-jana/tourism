import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function StateCard({ state }) {
  return (
    <Link
      to={`/explore/${state.id}`}
      className="group relative overflow-hidden rounded-3xl card-hover"
    >
      <div className="relative h-64">
        <img
          src={state.image}
          alt={state.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
          <MapPin size={14} />
          <span>{state.capital}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{state.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">
            {state.touristPlaces} Tourist Places
          </span>
          <span className="flex items-center gap-1 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
            Explore <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
