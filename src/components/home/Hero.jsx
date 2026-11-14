import { useNavigate } from 'react-router-dom';
import { Compass, Gem, MapPin } from 'lucide-react';
import SearchBar from '../search/Search';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.pexels.com/photos/12716176/pexels-photo-12716176.jpeg?auto=compress&cs=tinysrgb&w=1920"
        >
          <source
            src="/videos/Hero.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/40 mb-6 animate-float">
          <Compass size={40} className="text-white" />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance animate-slide-up">
          Explore India
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Discover India's Famous & Hidden Destinations
        </p>

        <div className="relative z-30 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <SearchBar placeholder="Search for places, states, categories..." />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => navigate('/explore')}
            className="btn-primary text-base px-8 py-3.5"
          >
            <Compass size={20} /> Explore Now
          </button>
          <button
            onClick={() => navigate('/hidden-gems')}
            className="btn-secondary text-base px-8 py-3.5 text-white border-white/30 bg-white/10 hover:bg-white/20"
          >
            <Gem size={20} /> Discover Hidden Gems
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12 text-white/70 text-sm animate-fade-in-slow" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} /> 28 States
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div>8,400+ Destinations</div>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <div>300+ Hidden Gems</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent z-5" />
    </section>
  );
}
