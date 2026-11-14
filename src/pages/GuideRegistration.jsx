import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Phone, Calendar, MapPin, Award, Languages, Wallet, Upload, FileText, Check, X, ArrowLeft, ArrowRight, ShieldCheck, Building2, Briefcase, Users as UsersIcon, Search, ChevronDown, Plus, Hash, Globe, Link2, CircleAlert as AlertCircle, Loader as Loader2, CircleCheck as CheckCircle2 } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useNotifications } from '../context/NotificationContext';
import { useGuideRequests } from '../context/GuideRequestsContext';
import { useAuth } from '../context/AuthContext';

/* ---------- Guide type definitions ---------- */

const GUIDE_TYPES = [
  { id: 'government', label: 'Government Certified Guide', icon: ShieldCheck, desc: 'Licensed by a government tourism body (Ministry of Tourism, ASI, state tourism corps).' },
  { id: 'private', label: 'Private Tourism Organization Guide', icon: Building2, desc: 'Employed by a private travel or tourism company.' },
  { id: 'freelance', label: 'Freelance Professional Guide', icon: Briefcase, desc: 'Independent professional offering guided tours.' },
  { id: 'community', label: 'Local Community Guide', icon: UsersIcon, desc: 'Local resident sharing community culture and heritage.' },
];

const GOVT_ORGS = [
  'Ministry of Tourism (Government of India)',
  'Archaeological Survey of India (ASI)',
  'Andhra Pradesh Tourism (APTDC)',
  'Telangana Tourism (TGSTDC)',
  'Karnataka Tourism (KSTDC)',
  'Kerala Tourism (KTDC)',
  'Tamil Nadu Tourism',
  'Rajasthan Tourism',
  'Goa Tourism',
  'Gujarat Tourism',
  'Odisha Tourism',
  'Maharashtra Tourism',
  'Other Government Tourism Organization',
];

const PRIVATE_COMPANIES = [
  'MakeMyTrip',
  'Yatra',
  'Thomas Cook India',
  'Cox & Kings',
  'SOTC Travel',
  'TravelTriangle',
  'IRCTC Tourism',
  'Sterling Holiday Resorts',
  'TreeHouse Hotels',
  'Other Company',
];

const LANGUAGES_POOL = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Odia', 'Urdu', 'Sanskrit', 'French', 'German', 'Spanish', 'Italian', 'Japanese', 'Mandarin', 'Portuguese', 'Russian', 'Arabic'];

const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'];

/* ---------- Field configs per guide type ---------- */

const COMMON_FIELDS = ['emergencyContact', 'profileDescription', 'availableDays', 'preferredTimings', 'maxGroupSize'];

const TYPE_FIELDS = {
  government: ['govtOrg', 'orgName', 'fullName', 'mobile', 'email', 'dob', 'gender', 'aadhaar', 'guideId', 'license', 'experience', 'languages', 'areas', 'specialization', 'dailyCharges'],
  private: ['company', 'companyName', 'companyAddress', 'companyWebsite', 'fullName', 'mobile', 'email', 'aadhaar', 'employeeId', 'designation', 'experience', 'languages', 'areas', 'dailyCharges'],
  freelance: ['fullName', 'mobile', 'email', 'aadhaar', 'address', 'experience', 'languages', 'areas', 'specialization', 'dailyCharges', 'about', 'website', 'instagram', 'facebook', 'linkedin', 'youtube'],
  community: ['fullName', 'mobile', 'email', 'aadhaar', 'village', 'district', 'state', 'yearsInArea', 'languages', 'localAttractions', 'culturalKnowledge', 'dailyCharges'],
};

const TYPE_UPLOADS = {
  government: [
    { id: 'passportPhoto', label: 'Passport Photo', required: true },
    { id: 'aadhaarCard', label: 'Aadhaar Card', required: true },
    { id: 'govtGuideId', label: 'Government Guide ID', required: true },
    { id: 'govtCertificate', label: 'Government Guide Certificate', required: true },
  ],
  private: [
    { id: 'passportPhoto', label: 'Passport Photo', required: true },
    { id: 'aadhaarCard', label: 'Aadhaar Card', required: true },
    { id: 'companyId', label: 'Company ID', required: true },
    { id: 'employmentLetter', label: 'Employment Letter', required: true },
  ],
  freelance: [
    { id: 'passportPhoto', label: 'Passport Photo', required: true },
    { id: 'aadhaarCard', label: 'Aadhaar Card', required: true },
    { id: 'govtCertificate', label: 'Government Guide Certificate', required: false },
    { id: 'experienceCert', label: 'Experience Certificate', required: false },
    { id: 'firstAidCert', label: 'First Aid Certificate', required: false },
    { id: 'policeVerification', label: 'Police Verification', required: false },
    { id: 'portfolio', label: 'Portfolio', required: false },
  ],
  community: [
    { id: 'passportPhoto', label: 'Passport Photo', required: true },
    { id: 'aadhaarCard', label: 'Aadhaar Card', required: true },
    { id: 'panchayatRec', label: 'Panchayat Recommendation', required: false },
    { id: 'policeVerification', label: 'Police Verification', required: false },
    { id: 'tourismAssocCert', label: 'Tourism Association Certificate', required: false },
  ],
};

const COMMON_UPLOAD = { id: 'profilePicture', label: 'Profile Picture', required: true };

const FIELD_META = {
  fullName: { label: 'Full Name', type: 'text', icon: User, required: true, full: true },
  mobile: { label: 'Mobile Number', type: 'tel', icon: Phone, required: true, placeholder: '+91 98765 43210', validate: 'phone' },
  email: { label: 'Email', type: 'email', icon: Mail, required: true, validate: 'email' },
  dob: { label: 'Date of Birth', type: 'date', icon: Calendar, required: true },
  gender: { label: 'Gender', type: 'select', icon: User, required: true, options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
  aadhaar: { label: 'Aadhaar Number', type: 'text', icon: Hash, required: true, placeholder: 'XXXX XXXX XXXX', validate: 'aadhaar' },
  guideId: { label: 'Guide ID Number', type: 'text', icon: Hash, required: true },
  license: { label: 'License Number', type: 'text', icon: Hash, required: true },
  experience: { label: 'Experience (years)', type: 'number', icon: Award, required: true, validate: 'number' },
  specialization: { label: 'Specialization', type: 'text', icon: Award, required: true },
  dailyCharges: { label: 'Daily Charges (₹)', type: 'number', icon: Wallet, required: true, validate: 'number' },
  address: { label: 'Address', type: 'textarea', icon: MapPin, required: true, full: true },
  about: { label: 'About Yourself', type: 'textarea', icon: User, required: true, full: true },
  website: { label: 'Website', type: 'url', icon: Globe, required: false, full: true },
  instagram: { label: 'Instagram', type: 'url', icon: Link2, required: false },
  facebook: { label: 'Facebook', type: 'url', icon: Link2, required: false },
  linkedin: { label: 'LinkedIn', type: 'url', icon: Link2, required: false },
  youtube: { label: 'YouTube', type: 'url', icon: Link2, required: false },
  employeeId: { label: 'Employee ID', type: 'text', icon: Hash, required: true },
  designation: { label: 'Designation', type: 'text', icon: Briefcase, required: true },
  village: { label: 'Village / Town', type: 'text', icon: MapPin, required: true },
  district: { label: 'District', type: 'text', icon: MapPin, required: true },
  state: { label: 'State', type: 'select', icon: MapPin, required: true, options: INDIAN_STATES },
  yearsInArea: { label: 'Years Living in Area', type: 'number', icon: Calendar, required: true, validate: 'number' },
  localAttractions: { label: 'Local Attractions Guided', type: 'textarea', icon: MapPin, required: true, full: true },
  culturalKnowledge: { label: 'Cultural Knowledge', type: 'textarea', icon: Award, required: true, full: true },
  orgName: { label: 'Organization Name', type: 'text', icon: Building2, required: true, full: true, conditional: { field: 'govtOrg', value: 'Other Government Tourism Organization' } },
  companyName: { label: 'Company Name', type: 'text', icon: Building2, required: true, full: true, conditional: { field: 'company', value: 'Other Company' } },
  companyAddress: { label: 'Company Address', type: 'textarea', icon: MapPin, required: true, full: true, conditional: { field: 'company', value: 'Other Company' } },
  companyWebsite: { label: 'Company Website (Optional)', type: 'url', icon: Globe, required: false, full: true, conditional: { field: 'company', value: 'Other Company' } },
  emergencyContact: { label: 'Emergency Contact', type: 'tel', icon: Phone, required: true, placeholder: '+91 98765 43210', validate: 'phone' },
  profileDescription: { label: 'Profile Description', type: 'textarea', icon: User, required: true, full: true },
  availableDays: { label: 'Available Days', type: 'select', icon: Calendar, required: true, options: ['Weekdays', 'Weekends', 'All Days', 'Custom'] },
  preferredTimings: { label: 'Preferred Tour Timings', type: 'select', icon: Calendar, required: true, options: ['Morning', 'Afternoon', 'Evening', 'Full Day', 'Flexible'] },
  maxGroupSize: { label: 'Maximum Group Size', type: 'number', icon: UsersIcon, required: true, validate: 'number' },
};

/* ---------- Validation helpers ---------- */

const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
  phone: (v) => /^[+]?[\d\s-]{10,15}$/.test(v) || 'Enter a valid phone number',
  aadhaar: (v) => /^\d{4}\s?\d{4}\s?\d{4}$/.test(v) || 'Aadhaar must be 12 digits',
  number: (v) => (!isNaN(Number(v)) && Number(v) >= 0) || 'Enter a valid number',
};

/* ---------- Reusable UI bits ---------- */

function SearchableSelect({ label, icon: Icon, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
          {label}{required && <span className="text-error-500"> *</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input-field flex items-center gap-2 text-left"
      >
        {Icon && <Icon size={18} className="text-stone-400 shrink-0" />}
        <span className={`flex-1 truncate ${value ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}>
          {value || placeholder || 'Select...'}
        </span>
        <ChevronDown size={16} className={`text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full glass-card p-0 overflow-hidden max-h-60 flex flex-col">
          <div className="p-2 border-b border-stone-200/60 dark:border-stone-700/50">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-3 text-sm text-stone-400 text-center">No matches</p>
            ) : filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); setQuery(''); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors ${value === opt ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-stone-700 dark:text-stone-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageChips({ value, onChange }) {
  const [input, setInput] = useState('');
  const add = (lang) => {
    if (lang && !value.includes(lang)) onChange([...value, lang]);
    setInput('');
  };
  const remove = (lang) => onChange(value.filter((l) => l !== lang));
  const suggestions = LANGUAGES_POOL.filter((l) => l.toLowerCase().includes(input.toLowerCase()) && !value.includes(l)).slice(0, 5);

  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
        Languages Known <span className="text-error-500">*</span>
      </label>
      <div className="input-field flex flex-wrap items-center gap-2 min-h-[52px]">
        <Languages size={18} className="text-stone-400 shrink-0" />
        {value.map((lang) => (
          <span key={lang} className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 gap-1">
            {lang}
            <button type="button" onClick={() => remove(lang)} className="hover:text-error-500"><X size={12} /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(input.trim()); } }}
          placeholder={value.length ? '' : 'Type a language and press Enter'}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-sm"
        />
      </div>
      {input && suggestions.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-primary-100 dark:hover:bg-primary-500/20">
              <Plus size={11} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadField({ field, file, onFile }) {
  const inputRef = useRef(null);
  const preview = file?.preview;
  const isImage = preview && preview.startsWith('data:image');

  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
        {field.label}{field.required && <span className="text-error-500"> *</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={field.id === 'profilePicture' || field.id === 'passportPhoto' ? 'image/*' : 'image/*,.pdf'}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => onFile({ name: f.name, size: f.size, type: f.type, preview: reader.result });
          reader.readAsDataURL(f);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-primary-400 dark:hover:border-primary-500 transition-colors p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[110px]"
      >
        {preview ? (
          <div className="flex items-center gap-3 w-full">
            {isImage ? (
              <img src={preview} alt={field.label} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <FileText size={22} className="text-primary-500" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{file.name}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <span className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300"><Check size={12} /> Added</span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <Upload size={18} className="text-stone-400" />
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">Click to upload</p>
            <p className="text-xs text-stone-400">Image or PDF</p>
          </>
        )}
      </button>
    </div>
  );
}

function FieldInput({ fieldKey, meta, value, onChange, error }) {
  if (fieldKey === 'languages') return <LanguageChips value={value || []} onChange={(v) => onChange('languages', v)} />;
  if (fieldKey === 'govtOrg') return <SearchableSelect label="Government Organization" icon={Building2} value={value} onChange={(v) => onChange('govtOrg', v)} options={GOVT_ORGS} placeholder="Select organization" required />;
  if (fieldKey === 'company') return <SearchableSelect label="Company" icon={Building2} value={value} onChange={(v) => onChange('company', v)} options={PRIVATE_COMPANIES} placeholder="Select company" required />;
  if (fieldKey === 'areas') {
    return (
      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
          Areas Covered <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange('areas', e.target.value)}
          placeholder="e.g. Agra, Mathura, Fatehpur Sikri"
          className="input-field"
        />
      </div>
    );
  }

  const Icon = meta.icon;
  const label = (
    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
      {meta.label}{meta.required && <span className="text-error-500"> *</span>}
    </label>
  );

  if (meta.type === 'textarea') {
    return (
      <div>
        {label}
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={`Enter ${meta.label.toLowerCase()}`}
          className="input-field resize-none"
        />
        {error && <p className="text-xs text-error-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
      </div>
    );
  }

  if (meta.type === 'select') {
    return (
      <div>
        {label}
        <select value={value || ''} onChange={(e) => onChange(fieldKey, e.target.value)} className="input-field">
          <option value="">Select...</option>
          {meta.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {error && <p className="text-xs text-error-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
      </div>
    );
  }

  return (
    <div>
      {label}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />}
        <input
          type={meta.type}
          value={value || ''}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={meta.placeholder || `Enter ${meta.label.toLowerCase()}`}
          className={`input-field ${Icon ? 'pl-11' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-error-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
  );
}

/* ---------- Main page ---------- */

export default function GuideRegistration() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { addRequest } = useGuideRequests();
  const { isAuthenticated, isUser, isAdmin, user } = useAuth();
  const [step, setStep] = useState(1); // 1 = type select, 2 = form
  const [selectedType, setSelectedType] = useState(null);
  // Single form state object persists across type switches so values are preserved.
  const [form, setForm] = useState({});
  const [uploads, setUploads] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Admin guard: admins cannot register as guides
  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, navigate]);

  // Session expiry guard: track auth state while filling the form.
  // The mock session is in localStorage; if it disappears (user logs out in
  // another tab, or clears storage), show the session-expired modal.
  const [sessionExpired, setSessionExpired] = useState(false);
  const wasAuthedRef = useRef(isAuthenticated);
  useEffect(() => {
    if (wasAuthedRef.current && !isAuthenticated) {
      setSessionExpired(true);
    }
    wasAuthedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const visibleFields = useMemo(() => {
    if (!selectedType) return [];
    const typeFields = TYPE_FIELDS[selectedType] || [];
    return [...typeFields, ...COMMON_FIELDS].filter((key) => {
      const meta = FIELD_META[key];
      if (!meta) return false;
      if (meta.conditional) {
        return form[meta.conditional.field] === meta.conditional.value;
      }
      return true;
    });
  }, [selectedType, form]);

  const visibleUploads = useMemo(() => {
    if (!selectedType) return [];
    return [COMMON_UPLOAD, ...(TYPE_UPLOADS[selectedType] || [])];
  }, [selectedType]);

  // Unauthenticated visitor: show login prompt instead of the form.
  if (!isAuthenticated && !sessionExpired) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-primary-500" />
              </div>
              <h1 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Login Required</h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                You must log in to your Explore India account before registering as a guide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('/login?redirect=/guide-registration')} className="btn-primary text-sm">
                  Login <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/guides')} className="btn-secondary text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) return null;

  const setField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setUpload = (id, file) => setUploads((prev) => ({ ...prev, [id]: file }));

  const validate = () => {
    const errs = {};
    visibleFields.forEach((key) => {
      const meta = FIELD_META[key];
      if (!meta || !meta.required) return;
      const val = form[key];
      if (meta.conditional && form[meta.conditional.field] !== meta.conditional.value) return;
      if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        errs[key] = 'This field is required';
        return;
      }
      if (meta.validate && validators[meta.validate]) {
        const res = validators[meta.validate](val);
        if (res !== true) errs[key] = res;
      }
    });
    visibleUploads.forEach((u) => {
      if (u.required && !uploads[u.id]) errs[`upload_${u.id}`] = 'This document is required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    // Simulated submission — no backend, no persistence.
    setTimeout(() => {
      const typeMeta = GUIDE_TYPES.find((g) => g.id === selectedType);
      const org = form.govtOrg || form.company || '—';
      const newReq = addRequest({
        fullName: form.fullName,
        guideType: selectedType,
        guideTypeLabel: typeMeta?.label || 'Guide',
        organization: org,
        mobile: form.mobile,
        email: form.email,
        experience: form.experience,
        languages: form.languages || [],
        areasCovered: form.areas ? form.areas.split(',').map((s) => s.trim()).filter(Boolean) : [],
        specialization: form.specialization || '—',
        dailyCharges: form.dailyCharges,
        profilePhoto: uploads.profilePicture?.preview || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
        documents: Object.entries(uploads).map(([id, f]) => ({
          name: COMMON_UPLOAD.id === id ? 'Profile Picture' : id,
          type: f.preview?.startsWith('data:image') ? 'image' : 'doc',
          url: f.preview || '#',
        })),
      });
      setSubmitting(false);
      setShowSuccess(true);
      addNotification(
        'submitted',
        'Application Submitted',
        'Your guide registration has been submitted successfully. Our admin team will review your application.',
        'user'
      );
      addNotification(
        'new_registration',
        'New Guide Registration',
        `${newReq.fullName} submitted a new ${newReq.guideTypeLabel} application.`,
        'admin'
      );
      addNotification(
        'pending_approval',
        'Pending Approval',
        `A new guide application from ${newReq.fullName} is awaiting review.`,
        'admin'
      );
    }, 1600);
  };

  const resetAll = () => {
    setShowSuccess(false);
    setStep(1);
    setSelectedType(null);
    setForm({});
    setUploads({});
    setErrors({});
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Tour Guides', to: '/guides' }, { label: 'Become a Guide' }]} />

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Compass size={28} className="text-primary-500" /> Become a Guide
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Register as a certified guide and start welcoming travellers from across the world.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className={`text-sm font-semibold ${step >= s ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>
                {s === 1 ? 'Guide Type' : 'Registration Form'}
              </span>
              {s === 1 && <div className={`w-8 sm:w-16 h-0.5 ${step >= 2 ? 'bg-primary-500' : 'bg-stone-200 dark:bg-stone-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Guide Type Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {GUIDE_TYPES.map((t) => {
                const Icon = t.icon;
                const active = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`glass-card p-5 text-left transition-all duration-300 ${active ? 'ring-2 ring-primary-500 -translate-y-1' : 'hover:-translate-y-1'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white' : 'bg-primary-100 dark:bg-primary-500/20 text-primary-500'}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-stone-900 dark:text-white">{t.label}</h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? 'border-primary-500 bg-primary-500' : 'border-stone-300 dark:border-stone-600'}`}>
                        {active && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <Link to="/guides" className="btn-ghost text-sm">
                <ArrowLeft size={16} /> Back to Guides
              </Link>
              <button
                disabled={!selectedType}
                onClick={() => setStep(2)}
                className={`btn-primary text-sm ${!selectedType ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
            {/* Selected type banner */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const t = GUIDE_TYPES.find((g) => g.id === selectedType);
                  const Icon = t.icon;
                  return (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                        <Icon size={20} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Selected guide type</p>
                        <p className="font-bold text-stone-900 dark:text-white">{t.label}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button type="button" onClick={() => setStep(1)} className="btn-ghost text-sm">
                Change Type
              </button>
            </div>

            {/* Personal & Professional Fields */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-primary-500" /> Personal & Professional Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleFields.map((key) => {
                  const meta = FIELD_META[key];
                  if (!meta) return null;
                  return (
                    <div key={key} className={meta.full ? 'sm:col-span-2' : ''} data-error={errors[key] ? 'true' : undefined}>
                      <FieldInput fieldKey={key} meta={meta} value={form[key]} onChange={setField} error={errors[key]} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Uploads */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload size={18} className="text-primary-500" /> Documents & Photos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleUploads.map((u) => (
                  <div key={u.id} data-error={errors[`upload_${u.id}`] ? 'true' : undefined}>
                    <UploadField field={u} file={uploads[u.id]} onFile={(f) => setUpload(u.id, f)} />
                    {errors[`upload_${u.id}`] && <p className="text-xs text-error-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors[`upload_${u.id}`]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost text-sm">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" disabled={submitting} className="btn-primary text-sm">
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Registration <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} className="text-success-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Registration Submitted!</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                Your guide registration has been submitted successfully. Our admin team will review your documents. You will be notified once your application has been approved or rejected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/profile" className="btn-primary text-sm">
                  View My Application
                </Link>
                <button onClick={resetAll} className="btn-secondary text-sm">
                  Register Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Expired Modal */}
        {sessionExpired && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-error-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Session Expired</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                Your session has expired. Please log in again to continue.
              </p>
              <button onClick={() => navigate('/login?redirect=/guide-registration')} className="btn-primary text-sm">
                Login Again <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
