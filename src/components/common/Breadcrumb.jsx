import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Home size={15} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight size={15} className="text-stone-400 dark:text-stone-600 shrink-0" />
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-stone-500 dark:text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`font-semibold ${
                  isLast
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
