import { useState } from 'react';
import { Calendar, Clock, Users, User, Mail, Phone, MessageSquare, CheckCircle, Loader } from 'lucide-react';
import { bookingsApi } from '../../services/api';

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];
const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Other'];

export default function BookingForm({ destination, onConfirm }) {
  const [form, setForm] = useState({
    visitDate: '',
    timeSlot: 'Morning',
    visitors: 1,
    visitorName: '',
    email: '',
    phone: '',
    specialRequirements: '',
    guideRequired: 'no',
    language: 'English',
    termsAccepted: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.termsAccepted || submitting) return;
    setSubmitting(true);

    const bookingPayload = {
      placeId: destination.id,
      placeName: destination.name,
      placeImage: destination.image,
      state: destination.state,
      district: destination.district || destination.city,
      visitDate: form.visitDate,
      timeSlot: form.timeSlot,
      visitors: Number(form.visitors),
      visitorName: form.visitorName,
      email: form.email,
      phone: form.phone,
      guideRequired: form.guideRequired === 'yes',
      language: form.language,
      specialRequirements: form.specialRequirements,
      entryFee: destination.entryFee || 'N/A',
    };

    try {
      const res = await bookingsApi.createBooking(bookingPayload);
      setSubmitting(false);
      if (res.ok && res.data) {
        onConfirm(res.data);
      } else {
        const fallbackBooking = {
          id: `BK-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
          ...bookingPayload,
          status: 'upcoming',
          bookingDate: new Date().toISOString().split('T')[0],
        };
        onConfirm(fallbackBooking);
      }
    } catch {
      setSubmitting(false);
      const fallbackBooking = {
        id: `BK-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
        ...bookingPayload,
        status: 'upcoming',
        bookingDate: new Date().toISOString().split('T')[0],
      };
      onConfirm(fallbackBooking);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">Tourist Place</label>
          <input value={destination.name} readOnly className={`${inputClass} bg-stone-100/60 dark:bg-stone-800/40`} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">State</label>
          <input value={destination.state} readOnly className={`${inputClass} bg-stone-100/60 dark:bg-stone-800/40`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">District</label>
          <input value={destination.district || destination.city} readOnly className={`${inputClass} bg-stone-100/60 dark:bg-stone-800/40`} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
            <Calendar size={12} /> Visit Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={form.visitDate}
            onChange={(e) => update('visitDate', e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
          <Clock size={12} /> Preferred Time Slot
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => update('timeSlot', slot)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                form.timeSlot === slot
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
            <Users size={12} /> Number of Visitors
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={form.visitors}
            onChange={(e) => update('visitors', e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
            <User size={12} /> Visitor Name
          </label>
          <input
            type="text"
            value={form.visitorName}
            onChange={(e) => update('visitorName', e.target.value)}
            placeholder="Full name"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
            <Mail size={12} /> Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="email@example.com"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
            <Phone size={12} /> Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 98765 43210"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">Guide Required?</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update('guideRequired', 'yes')}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                form.guideRequired === 'yes'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => update('guideRequired', 'no')}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                form.guideRequired === 'no'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              No
            </button>
          </div>
        </div>
        {form.guideRequired === 'yes' && (
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">Language Preference</label>
            <select value={form.language} onChange={(e) => update('language', e.target.value)} className={inputClass}>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1">
          <MessageSquare size={12} /> Special Requirements (Optional)
        </label>
        <textarea
          rows={2}
          value={form.specialRequirements}
          onChange={(e) => update('specialRequirements', e.target.value)}
          placeholder="Wheelchair access, dietary needs, etc."
          className={`${inputClass} resize-none`}
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          checked={form.termsAccepted}
          onChange={(e) => update('termsAccepted', e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-primary-500 focus:ring-primary-500/50 cursor-pointer"
        />
        <span className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          I agree to the Terms and Conditions. I understand that booking confirmation is subject to availability and the destination's visiting policies. Cancellations can be made up to 24 hours before the visit.
        </span>
      </label>

      <button
        type="submit"
        disabled={!form.termsAccepted || submitting}
        className="w-full btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {submitting ? (
          <><Loader size={18} className="animate-spin" /> Confirming...</>
        ) : (
          <><CheckCircle size={18} /> Confirm Booking</>
        )}
      </button>
    </form>
  );
}
