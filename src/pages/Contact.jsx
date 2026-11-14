import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, Globe, Share2, CheckCircle } from 'lucide-react';
import { contactApi } from '../services/api';

const faqs = [
  { q: 'How do I upload a hidden gem?', a: 'Go to the Upload Place page, fill in the details including name, location, category, description, and photos. Your submission will be reviewed by our admin team before publication.' },
  { q: 'Is Explore India free to use?', a: 'Yes, Explore India is completely free for all users. You can browse destinations, read reviews, and save favorites without any cost.' },
  { q: 'How are destinations verified?', a: 'All submissions go through a review process by our admin team. We verify information accuracy, check photos for authenticity, and ensure the content meets our quality standards.' },
  { q: 'Can I contribute reviews and photos?', a: 'Absolutely! Registered users can leave reviews, rate destinations, and upload photos of places they\'ve visited. Your contributions help fellow travelers.' },
  { q: 'How do I report incorrect information?', a: 'Use the Report button on any destination page. Select the reason (wrong location, fake information, etc.) and provide details. Our team will review and correct it.' },
  { q: 'Do you have a mobile app?', a: 'Our web platform is fully responsive and works great on mobile browsers. A native mobile app is on our roadmap for the future.' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await contactApi.sendMessage(form);
    } catch {}
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-primary-500" /> Send a Message
            </h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
                <CheckCircle size={48} className="text-success-500 mb-4" />
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-stone-600 dark:text-stone-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required placeholder="What's this about?" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us more..." className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@exploreindia.in' },
                  { icon: Phone, label: 'Phone', value: '+91 1800 123 4567' },
                  { icon: MapPin, label: 'Address', value: 'New Delhi, India' },
                ].map((info, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                      <info.icon size={22} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{info.label}</p>
                      <p className="text-sm font-semibold text-stone-900 dark:text-white">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Follow Us</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { Icon: Globe, label: 'Facebook', color: 'hover:bg-blue-600' },
                  { Icon: MessageSquare, label: 'Instagram', color: 'hover:bg-pink-600' },
                  { Icon: Share2, label: 'Twitter', color: 'hover:bg-sky-500' },
                  { Icon: Send, label: 'YouTube', color: 'hover:bg-red-600' },
                ].map(({ Icon, label, color }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`aspect-square rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 ${color} hover:text-white transition-colors`}
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            {/* Location Placeholder */}
            <div className="glass-card rounded-3xl h-48 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center mb-3">
                <MapPin size={28} className="text-secondary-500" />
              </div>
              <p className="text-stone-600 dark:text-stone-400 font-semibold">Our Location</p>
              <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">Map integration coming soon</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-stone-900 dark:text-white">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-stone-400 transition-transform shrink-0 ml-4 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
