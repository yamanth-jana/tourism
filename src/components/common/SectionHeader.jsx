import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, linkTo, linkText }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        {subtitle && (
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            {subtitle}
          </p>
        )}
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 flex items-center gap-1 transition-all"
        >
          {linkText || 'View All'} <span>→</span>
        </Link>
      )}
    </div>
  );
}
