import { Link } from 'react-router-dom';
import { Shield, MapPinned, Users, Sparkles, Heart, Camera, Gem } from 'lucide-react';

const features = [
  {
    icon: MapPinned,
    title: 'Comprehensive Coverage',
    description: 'From iconic monuments to remote villages — explore 8,400+ destinations across all 28 states and 8 Union Territories.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: Gem,
    title: 'Hidden Gems Discovery',
    description: 'Community-driven hidden gems that take you off the beaten path. Discover places only locals know about.',
    color: 'from-secondary-500 to-secondary-700',
  },
  {
    icon: Shield,
    title: 'Verified Information',
    description: 'Every submission is reviewed by our admin team. Accurate details on history, timings, fees, and facilities.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: Users,
    title: 'Community Reviews',
    description: 'Real reviews and ratings from fellow travelers. Share your experiences and help others plan better trips.',
    color: 'from-success-500 to-success-700',
  },
  {
    icon: Camera,
    title: 'Rich Media',
    description: 'Photo galleries, video placeholders, and detailed descriptions bring each destination to life before you visit.',
    color: 'from-rose-500 to-rose-700',
  },
  {
    icon: Heart,
    title: 'Save & Share',
    description: 'Bookmark your favorite places, create travel lists, and share discoveries with friends and family.',
    color: 'from-pink-500 to-pink-700',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-4">
            Your Trusted Travel Companion
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            We combine deep local knowledge with modern technology to bring you the most comprehensive
            tourism and heritage information platform for India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-6 card-hover group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/about" className="btn-primary">
            <Sparkles size={18} /> Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
