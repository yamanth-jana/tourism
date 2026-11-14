import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function CategoryCard({ category }) {
  const Icon = Icons[category.icon] || Icons.Sparkles;

  return (
    <Link
      to={`/categories#${category.id}`}
      className="group relative overflow-hidden rounded-3xl card-hover"
    >
      <div className="relative h-48">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} />
        </div>
        <h3 className="text-lg font-bold mb-1">{category.name}</h3>
        <p className="text-sm text-white/80">{category.count} places</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
        <span className="flex items-center gap-1 text-white text-sm font-semibold">
          Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
