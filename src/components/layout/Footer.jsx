import { Link } from 'react-router-dom';
import { Compass, Globe, MessageCircle, Share2, Send, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import categories from '../../data/categories';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-stone-900 dark:bg-black text-stone-300 pt-16 pb-8 mt-auto">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Compass size={22} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-white">Explore India</span>
                <span className="text-[10px] text-stone-400">Tourism & Heritage</span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Discover India's famous and hidden destinations. Your gateway to incredible India's tourism and local heritage.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Globe, label: 'Facebook' },
                { Icon: MessageCircle, label: 'Instagram' },
                { Icon: Share2, label: 'Twitter' },
                { Icon: Send, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-stone-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore India' },
                { to: '/categories', label: 'Categories' },
                { to: '/hidden-gems', label: 'Hidden Gems' },
                { to: '/search', label: 'Search' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categories#${cat.id}`} className="hover:text-primary-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-4">
              Subscribe to get the latest travel updates and hidden gem discoveries.
            </p>
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-4 py-2.5 rounded-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
              {subscribed && (
                <p className="text-success-500 text-xs mt-2 animate-fade-in">
                  Subscribed! Thank you for joining.
                </p>
              )}
            </form>
            <div className="space-y-2 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Mail size={14} /> hello@exploreindia.in
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} /> +91 1800 123 4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> New Delhi, India
              </div>
            </div>
          </div>
        </div>

        <hr className="border-stone-800 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <p>© 2024 Explore India. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
