import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { contactApi } from '../../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      try {
        await contactApi.subscribeNewsletter(email);
      } catch {}
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 sm:p-12 lg:p-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md mb-6">
              <Mail size={32} className="text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Our Travel Community
            </h2>
            <p className="text-white/80 mb-8">
              Subscribe to our newsletter and be the first to discover new hidden gems,
              travel tips, and exclusive destination guides.
            </p>

            {subscribed ? (
              <div className="glass-card flex items-center justify-center gap-3 p-4 max-w-md mx-auto bg-white/20 border-white/30">
                <CheckCircle size={24} className="text-white" />
                <span className="text-white font-semibold">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/90 text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button type="submit" className="px-6 py-3.5 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                  <Send size={18} /> Subscribe
                </button>
              </form>
            )}

            <p className="text-white/60 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
