import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ListFilter as Filter, MapPin, Star, Award, Languages, Clock, X, Compass, Users, UserPlus, Lock, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import GuideCard from '../components/booking/GuideCard';
import states from '../data/states';
import districtsData from '../data/districts';
import guidesData, { getGuidesForLocation, GUIDE_TYPES, getAllLanguages, AVAILABILITY } from '../data/guides';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

export default function Guides() {
  const navigate = useNavigate();
  const { selectedState, selectedDistrict, selectLocation } = useLocation();
  const { isAuthenticated, isUser } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLang, setFilterLang] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterAvail, setFilterAvail] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const stateDistricts = selectedState ? districtsData[selectedState.id] || [] : [];

  // When the global location changes, sync the district filter
  useEffect(() => {
    if (selectedDistrict) {
      setFilterDistrict(selectedDistrict.id);
    } else if (selectedState) {
      setFilterDistrict('all');
    }
  }, [selectedDistrict, selectedState]);

  // Base list: guides for the selected state (district first, then nearby)
  const baseGuides = useMemo(() => {
    if (!selectedState) return guidesData;
    return getGuidesForLocation(selectedState.id, selectedDistrict?.id);
  }, [selectedState, selectedDistrict]);

  const allLanguages = useMemo(() => getAllLanguages(), []);

  const filtered = useMemo(() => {
    return baseGuides.filter((g) => {
      if (search) {
        const q = search.toLowerCase();
        if (!g.name.toLowerCase().includes(q) &&
            !g.districtName.toLowerCase().includes(q) &&
            !g.stateName.toLowerCase().includes(q) &&
            !g.specialties.join(' ').toLowerCase().includes(q) &&
            !g.languages.join(' ').toLowerCase().includes(q)) return false;
      }
      if (filterDistrict !== 'all' && g.districtId !== filterDistrict) return false;
      if (filterType !== 'all' && g.guideType !== filterType) return false;
      if (filterLang !== 'all' && !g.languages.includes(filterLang)) return false;
      if (filterAvail !== 'all' && g.availability !== filterAvail) return false;
      if (filterRating !== 'all') {
        const min = parseFloat(filterRating);
        if (g.rating < min) return false;
      }
      if (filterExperience !== 'all') {
        const [min, max] = filterExperience.split('-').map(Number);
        if (g.experience < min || g.experience > max) return false;
      }
      return true;
    });
  }, [baseGuides, search, filterDistrict, filterType, filterLang, filterAvail, filterRating, filterExperience]);

  const activeFilterCount = [filterDistrict !== 'all', filterType !== 'all', filterLang !== 'all', filterRating !== 'all', filterExperience !== 'all', filterAvail !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setFilterDistrict('all');
    setFilterType('all');
    setFilterLang('all');
    setFilterRating('all');
    setFilterExperience('all');
    setFilterAvail('all');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Tour Guides' }]} />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users size={28} className="text-primary-500" /> Tour Guides
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Find certified local guides for your visit — automatically filtered by your selected location.
            </p>
          </div>
          <button
            onClick={() => {
              if (isAuthenticated && isUser) navigate('/guide-registration');
              else setShowLoginPrompt(true);
            }}
            className="btn-primary text-sm shrink-0"
          >
            <UserPlus size={18} /> Become a Guide
          </button>
        </div>

        {/* Location Selector */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Compass size={18} className="text-primary-500" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">Select Your Location</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">State</label>
              <select
                value={selectedState?.id || ''}
                onChange={(e) => {
                  const state = states.find((s) => s.id === e.target.value);
                  selectLocation(state, null);
                }}
                className="input-field"
              >
                <option value="">All India</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">District</label>
              <select
                value={selectedDistrict?.id || ''}
                onChange={(e) => {
                  const district = stateDistricts.find((d) => d.id === e.target.value) || null;
                  selectLocation(selectedState, district);
                }}
                disabled={!selectedState}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Districts</option>
                {stateDistricts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedState && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 flex items-center gap-1">
              <MapPin size={12} className="text-primary-500" />
              {selectedDistrict
                ? `Showing guides from ${selectedDistrict.name} first, then nearby districts in ${selectedState.name}.`
                : `Showing all guides from ${selectedState.name}.`}
            </p>
          )}
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guides by name, specialty, or language..."
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Filter size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/50 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">District</label>
                  <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">All</option>
                    {stateDistricts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Guide Type</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">All Types</option>
                    {GUIDE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Language</label>
                  <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">All Languages</option>
                    {allLanguages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Rating</label>
                  <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">Any Rating</option>
                    <option value="4.5">4.5+ stars</option>
                    <option value="4.0">4.0+ stars</option>
                    <option value="3.5">3.5+ stars</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Experience</label>
                  <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">Any</option>
                    <option value="0-5">0-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-20">11+ years</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 dark:text-stone-400 mb-1 block">Availability</label>
                  <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)} className="input-field text-sm py-2">
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="mt-3 flex items-center gap-1 text-xs text-error-500 hover:text-error-600 font-medium">
                  <X size={14} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          Showing <span className="font-bold text-stone-900 dark:text-white">{filtered.length}</span> guide{filtered.length !== 1 ? 's' : ''}
          {selectedState && <span> in {selectedState.name}</span>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filtered.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Search size={48} className="mx-auto text-stone-400 mb-4" />
            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">No guides found</h3>
            <p className="text-stone-500 dark:text-stone-400 mb-4">
              {selectedState
                ? `No guides match your filters in ${selectedState.name}. Try adjusting filters or selecting a different district.`
                : 'Try adjusting your search or filters, or select a state to see local guides.'}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            )}
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLoginPrompt(false)}>
          <div className="glass-card p-8 max-w-md w-full text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Login Required</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              You must log in to your Explore India account before registering as a guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login?redirect=/guide-registration')}
                className="btn-primary text-sm"
              >
                Login <ArrowRight size={16} />
              </button>
              <button onClick={() => setShowLoginPrompt(false)} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
