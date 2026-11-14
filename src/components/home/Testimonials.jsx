import { Quote } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import testimonials from '../../data/testimonials';

export default function Testimonials() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Real stories from real travelers who explored India with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card p-6 card-hover relative">
              <Quote size={40} className="absolute top-4 right-4 text-primary-200 dark:text-primary-500/20" />
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{t.role}</p>
                </div>
              </div>
              <RatingStars rating={t.rating} size={16} />
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
                "{t.text}"
              </p>
              <p className="text-xs text-stone-400 mt-3">📍 {t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
