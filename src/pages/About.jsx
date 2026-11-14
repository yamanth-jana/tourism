import { Target, Eye, Sparkles, Shield, Leaf, Globe2, Compass } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', description: 'To make India\'s diverse tourism and heritage accessible to every traveler, from iconic landmarks to hidden gems known only to locals.', color: 'from-primary-500 to-primary-700' },
  { icon: Eye, title: 'Our Vision', description: 'To become the most trusted and comprehensive tourism information platform for India, connecting travelers with authentic experiences.', color: 'from-secondary-500 to-secondary-700' },
  { icon: Globe2, title: 'Promoting Indian Tourism', description: 'We showcase India\'s incredible diversity — from snow-capped Himalayas to tropical backwaters, ancient temples to modern cities.', color: 'from-accent-500 to-accent-700' },
  { icon: Leaf, title: 'Preserving Local Heritage', description: 'We document and promote local heritage sites, ensuring that lesser-known cultural treasures are preserved and celebrated.', color: 'from-success-500 to-success-700' },
  { icon: Shield, title: 'Verified Information', description: 'Every submission is reviewed by our team to ensure accuracy and authenticity, providing reliable information for travelers.', color: 'from-rose-500 to-rose-700' },
  { icon: Sparkles, title: 'Community First', description: 'We believe in the power of community. Travelers share their discoveries, reviews, and tips to help others explore better.', color: 'from-pink-500 to-pink-700' },
];

export default function About() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-72 rounded-4xl overflow-hidden mb-12 mx-4 sm:mx-6 lg:mx-8">
        <img
          src="https://images.pexels.com/photos/356943/pexels-photo-356943.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="About Explore India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
            <Compass size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">About Explore India</h1>
          <p className="text-white/80 max-w-xl">
            Your gateway to discovering India's famous and hidden destinations.
          </p>
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Story */}
        <div className="glass-card p-8 sm:p-12 mb-12">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Our Story</h2>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-lg mb-4">
            Explore India was born from a simple idea: India is incredibly diverse, but many of its
            most beautiful destinations remain unknown to most travelers. While the Taj Mahal and
            Goa are on every tourist's list, there are thousands of hidden gems — from the Living
            Root Bridges of Meghalaya to the Ziro Valley in Arunachal Pradesh — that deserve attention.
          </p>
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-lg">
            We built this platform to bridge that gap. By combining comprehensive information about
            famous destinations with community-driven hidden gems, we aim to be the most complete
            tourism and heritage information system for India.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {values.map((value, idx) => (
            <div key={idx} className="glass-card p-6 card-hover">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                <value.icon size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">{value.title}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '8,400+', label: 'Destinations' },
            { value: '300+', label: 'Hidden Gems' },
            { value: '28', label: 'States Covered' },
            { value: '24,800+', label: 'Happy Travelers' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
