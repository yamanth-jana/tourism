import { useState } from 'react';
import { Upload, Image, Video, MapPin, Info, CheckCircle, Send } from 'lucide-react';
import states from '../data/states';
import categories from '../data/categories';
import { placeSubmissionsApi } from '../services/api';

export default function UploadPlace() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    district: '',
    category: '',
    description: '',
    history: '',
    bestTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await placeSubmissionsApi.submitPlace(formData);
    } catch {}
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '', state: '', district: '', category: '',
        description: '', history: '', bestTime: '',
      });
    }, 5000);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center max-w-lg mx-auto animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success-500" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">
              Submission Received!
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-4">
              All submissions are reviewed by the Admin before publication.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-500">
              You&apos;ll be notified once your place is approved and published.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
            <Upload size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Share a Hidden Place
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Know a place that deserves to be discovered? Share it with our community.
          </p>
        </div>

        <div className="glass-card p-4 mb-6 flex items-start gap-3 bg-primary-50/50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20">
          <Info size={20} className="text-primary-500 shrink-0 mt-0.5" />
          <p className="text-sm text-primary-700 dark:text-primary-300">
            All submissions are reviewed by the Admin before publication. Please provide
            accurate information and authentic photos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Place Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Secret Waterfall, Khajjiar"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                placeholder="e.g., Chamba"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe what makes this place special..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              History
            </label>
            <textarea
              name="history"
              value={formData.history}
              onChange={handleChange}
              rows={3}
              placeholder="Any historical background or local legends..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Best Time to Visit *
            </label>
            <input
              type="text"
              name="bestTime"
              value={formData.bestTime}
              onChange={handleChange}
              required
              placeholder="e.g., October to March"
              className="input-field"
            />
          </div>

          {/* Photo Upload Placeholder */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Photo Upload
            </label>
            <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
              <Image size={32} className="mx-auto text-stone-400 mb-2" />
              <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">
                Click to upload photos
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                PNG, JPG up to 10MB each
              </p>
            </div>
          </div>

          {/* Video Upload Placeholder */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Video Upload
            </label>
            <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
              <Video size={32} className="mx-auto text-stone-400 mb-2" />
              <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">
                Click to upload a video
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                MP4, MOV up to 100MB
              </p>
            </div>
          </div>

          {/* Map Coordinates Placeholder */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Map Coordinates
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Latitude"
                  className="input-field pl-10"
                />
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Longitude"
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full text-base py-3.5">
            <Send size={18} /> Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
}
