import { Users, MapPin, Gem, Star, TrendingUp, Award } from 'lucide-react';

const stats = [
  { icon: MapPin, value: '8,400+', label: 'Tourist Places', color: 'from-primary-500 to-primary-700' },
  { icon: Users, value: '24,800+', label: 'Active Users', color: 'from-secondary-500 to-secondary-700' },
  { icon: Gem, value: '300+', label: 'Hidden Gems', color: 'from-accent-500 to-accent-700' },
  { icon: Star, value: '15,600+', label: 'Reviews & Ratings', color: 'from-success-500 to-success-700' },
  { icon: TrendingUp, value: '12.5%', label: 'Monthly Growth', color: 'from-rose-500 to-rose-700' },
  { icon: Award, value: '28', label: 'States Covered', color: 'from-pink-500 to-pink-700' },
];

export default function Statistics() {
  return (
    <section className="section-padding bg-gradient-to-b from-transparent to-primary-50/50 dark:to-primary-950/10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            By the Numbers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Trusted by Travelers Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5 text-center card-hover"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
