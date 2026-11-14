import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Flag, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { reportsApi } from '../services/api';

const reportReasons = [
  { id: 'spam', label: 'Spam', description: 'Irrelevant or promotional content' },
  { id: 'wrong-location', label: 'Wrong Location', description: 'Incorrect or misleading location' },
  { id: 'fake-info', label: 'Fake Information', description: 'False or misleading details' },
  { id: 'inappropriate', label: 'Inappropriate Photo', description: 'Offensive or irrelevant images' },
  { id: 'duplicate', label: 'Duplicate', description: 'Already exists on the platform' },
  { id: 'other', label: 'Other', description: 'Something else' },
];

export default function Report() {
  const [searchParams] = useSearchParams();
  const placeId = searchParams.get('place');
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await reportsApi.submitReport({
        placeId,
        reason: selectedReason,
        details,
      });
    } catch {}
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
              Report Submitted
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              Thank you for helping keep Explore India accurate. Our team will review your report
              and take appropriate action within 48 hours.
            </p>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-error-500 to-error-700 shadow-lg shadow-error-500/30 mb-4">
            <Flag size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3">
            Report a Problem
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Help us keep Explore India accurate and safe for everyone.
          </p>
        </div>

        {placeId && (
          <div className="glass-card p-4 mb-6 flex items-start gap-3 bg-error-50/50 dark:bg-error-500/10 border-error-200 dark:border-error-500/20">
            <AlertCircle size={20} className="text-error-500 shrink-0 mt-0.5" />
            <p className="text-sm text-error-700 dark:text-error-300">
              You're reporting a specific destination. Please provide as much detail as possible.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Reason for Reporting *
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                    selectedReason === reason.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{reason.label}</p>
                    <p className={`text-xs ${selectedReason === reason.id ? 'text-white/80' : 'text-stone-500 dark:text-stone-400'}`}>
                      {reason.description}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 ml-4 ${
                    selectedReason === reason.id ? 'border-white bg-white' : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {selectedReason === reason.id && <div className="w-full h-full rounded-full bg-primary-500 scale-50" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Please provide more information about the issue..."
              className="input-field resize-none"
            />
          </div>

          <button type="submit" disabled={!selectedReason} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
