import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, Calendar, MapPin, Map as MapIcon, Sparkles, ArrowRight, ArrowLeft,
  RotateCcw, Clock, Wallet, CloudSun, Sun, Plus, X, TrendingUp,
  Navigation, Star, Download, Printer, Share2, Trash2,
  AlertCircle, Eye, History,
} from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import TripPlannerCard from '../components/booking/TripPlannerCard';
import states from '../data/states';
import { districts } from '../data/districts';
import { tripTypes, dayOptions } from '../data/tripPlannerPlaces';
import { generateTrip, getReplacementSuggestions, getSuggestedAdditions } from '../services/tripRecommendation';
import { tripPlansApi } from '../services/api';

const WIZARD_STEPS = ['state', 'district', 'type', 'days'];
const STORAGE_KEY = 'explore-india-saved-trips';

// ── Toast component ──
function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white shadow-xl">
        <AlertCircle size={18} className="text-accent-400 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ── Saved trips helpers (localStorage) ──
function loadSavedTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistSavedTrips(trips) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); } catch {}
}

export default function TripPlanner() {
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);
  const [trip, setTrip] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null);
  const [showReplaceModal, setShowReplaceModal] = useState(null);
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => { setSavedTrips(loadSavedTrips()); }, []);

  const stateDistricts = useMemo(() => {
    if (!selectedState) return [];
    return districts[selectedState.id] || [];
  }, [selectedState]);

  // ── Validation + Generate ──
  const handleGenerate = useCallback(() => {
    console.log('[TripPlanner] handleGenerate() called');
    console.log('[TripPlanner] selectedState:', selectedState);
    console.log('[TripPlanner] selectedDistrict:', selectedDistrict);
    console.log('[TripPlanner] selectedTripType:', selectedTripType);
    console.log('[TripPlanner] selectedDays:', selectedDays);

    if (!selectedState) { console.warn('[TripPlanner] Blocked: selectedState is null'); setToast('Please select a State.'); return; }
    if (!selectedDistrict) { console.warn('[TripPlanner] Blocked: selectedDistrict is null'); setToast('Please select a District.'); return; }
    if (!selectedTripType) { console.warn('[TripPlanner] Blocked: selectedTripType is null'); setToast('Please select Trip Type.'); return; }
    if (!selectedDays) { console.warn('[TripPlanner] Blocked: selectedDays is null'); setToast('Please select Number of Days.'); return; }

    try {
      const generated = generateTrip(selectedState.id, selectedDistrict.id, selectedTripType, selectedDays);
      console.log('[TripPlanner] generatedTrip:', generated);
      console.log('[TripPlanner] generatedTrip keys:', generated ? Object.keys(generated) : 'null');
      console.log('[TripPlanner] generatedTrip.days:', generated?.days);
      console.log('[TripPlanner] generatedTrip.summary:', generated?.summary);

      if (!generated) {
        console.warn(`[TripPlanner] No itinerary found because district id '${selectedDistrict.id}' does not exist in tripPlannerPlaces.`);
        setToast('No itinerary available for this selection. Try a different district.');
        return;
      }

      // Validate structure — fill in safe defaults for any missing property
      const safeTrip = {
        days: generated.days ?? [],
        summary: generated.summary ?? {},
        recommendations: generated.recommendations ?? [],
        originalDays: generated.originalDays ?? generated.days ?? [],
        tripTypeName: generated.tripTypeName ?? 'Custom Trip',
        numDays: generated.numDays ?? selectedDays,
        districtId: generated.districtId ?? selectedDistrict.id,
      };

      console.log('[TripPlanner] Calling setTrip(safeTrip) — trip should render now');
      setTrip(safeTrip);
    } catch (err) {
      console.error('[TripPlanner] EXACT error generating trip:', err);
      console.error('[TripPlanner] Error name:', err.name);
      console.error('[TripPlanner] Error message:', err.message);
      console.error('[TripPlanner] Error stack:', err.stack);
      setToast(`Error: ${err.message}`);
    }
  }, [selectedState, selectedDistrict, selectedTripType, selectedDays]);

  const handleReset = () => {
    if (!trip) return;
    setTrip({ ...trip, days: JSON.parse(JSON.stringify(trip.originalDays)) });
  };

  const handleSave = () => {
    if (!trip) return;
    const trips = loadSavedTrips();
    const newTrip = {
      ...trip,
      savedAt: new Date().toISOString(),
      stateName: selectedState?.name || '',
      districtName: selectedDistrict?.name || '',
    };
    trips.unshift(newTrip);
    persistSavedTrips(trips);
    setSavedTrips(trips);
    tripPlansApi.saveTrip(newTrip).catch(() => {});
    setToast('Trip saved successfully! Find it in Saved Trips.');
  };

  const handleDeleteSavedTrip = (idx) => {
    const trips = loadSavedTrips();
    trips.splice(idx, 1);
    persistSavedTrips(trips);
    setSavedTrips(trips);
  };

  const handleStartOver = () => {
    setTrip(null);
    setWizardStep(0);
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedTripType(null);
    setSelectedDays(null);
  };

  // ── Download / Print / Share ──
  const handleDownload = () => { setToast('PDF download will be available after backend integration.'); };
  const handlePrint = () => { window.print(); };
  const handleShare = async () => {
    if (!trip) return;
    const text = `Check out my ${trip?.tripTypeName ?? 'trip'} to ${selectedDistrict?.name}, ${selectedState?.name} — ${trip?.numDays ?? 1} day(s), ${trip?.summary?.totalPlaces ?? 0} places!`;
    if (navigator.share) { try { await navigator.share({ title: 'Explore India Trip', text }); } catch {} }
    else { navigator.clipboard?.writeText(text); setToast('Trip details copied to clipboard!'); }
  };

  // ── Edit handlers ──
  const handleRemovePlace = (dayIdx, placeIdx) => {
    setTrip((prev) => {
      const updated = { ...prev, days: [...prev.days] };
      updated.days[dayIdx] = { ...updated.days[dayIdx], places: updated.days[dayIdx].places.filter((_, i) => i !== placeIdx) };
      return updated;
    });
  };

  const handleMoveUp = (dayIdx, placeIdx) => {
    setTrip((prev) => {
      const updated = { ...prev, days: [...prev.days] };
      const places = [...updated.days[dayIdx].places];
      if (placeIdx > 0) { [places[placeIdx - 1], places[placeIdx]] = [places[placeIdx], places[placeIdx - 1]]; }
      updated.days[dayIdx] = { ...updated.days[dayIdx], places };
      return updated;
    });
  };

  const handleMoveDown = (dayIdx, placeIdx) => {
    setTrip((prev) => {
      const updated = { ...prev, days: [...prev.days] };
      const places = [...updated.days[dayIdx].places];
      if (placeIdx < places.length - 1) { [places[placeIdx], places[placeIdx + 1]] = [places[placeIdx + 1], places[placeIdx]]; }
      updated.days[dayIdx] = { ...updated.days[dayIdx], places };
      return updated;
    });
  };

  const handleMoveToDay = (fromDayIdx, placeIdx, toDayIdx) => {
    setTrip((prev) => {
      const updated = { ...prev, days: prev.days.map((d) => ({ ...d, places: [...d.places] })) };
      const [moved] = updated.days[fromDayIdx].places.splice(placeIdx, 1);
      updated.days[toDayIdx].places.push(moved);
      return updated;
    });
  };

  const handleAddSuggested = (dayIdx) => { setShowAddModal(dayIdx); };

  const handleSelectAddition = (place) => {
    if (showAddModal === null) return;
    setTrip((prev) => {
      const updated = { ...prev, days: [...prev.days] };
      updated.days[showAddModal] = { ...updated.days[showAddModal], places: [...updated.days[showAddModal].places, { ...place, time: '2:00 PM' }] };
      return updated;
    });
    setShowAddModal(null);
  };

  const handleReplacePlace = (dayIdx, placeIdx) => {
    setShowReplaceModal({ dayIdx, placeIdx, placeId: trip.days[dayIdx].places[placeIdx].id });
  };

  const handleSelectReplacement = (place) => {
    if (!showReplaceModal) return;
    const { dayIdx, placeIdx } = showReplaceModal;
    setTrip((prev) => {
      const updated = { ...prev, days: [...prev.days] };
      const places = [...updated.days[dayIdx].places];
      places[placeIdx] = { ...place, time: places[placeIdx].time };
      updated.days[dayIdx] = { ...updated.days[dayIdx], places };
      return updated;
    });
    setShowReplaceModal(null);
  };

  const currentPlaceIds = useMemo(() => {
    if (!trip) return [];
    return (trip?.days ?? []).flatMap((d) => (d?.places ?? []).map((p) => p.id));
  }, [trip]);

  const additionSuggestions = useMemo(() => {
    if (!trip) return [];
    return getSuggestedAdditions(trip.districtId, currentPlaceIds);
  }, [trip, currentPlaceIds]);

  const replacementSuggestions = useMemo(() => {
    if (!showReplaceModal || !trip) return [];
    return getReplacementSuggestions(trip.districtId, showReplaceModal.placeId, currentPlaceIds);
  }, [showReplaceModal, trip, currentPlaceIds]);

  // ── Render ──

  if (trip) {
    return (
      <>
        <TripItineraryView
          trip={trip}
          onReset={handleReset}
          onSave={handleSave}
          onStartOver={handleStartOver}
          onRemovePlace={handleRemovePlace}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onMoveToDay={handleMoveToDay}
          onAddSuggested={handleAddSuggested}
          onReplacePlace={handleReplacePlace}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          additionSuggestions={additionSuggestions}
          handleSelectAddition={handleSelectAddition}
          showReplaceModal={showReplaceModal}
          setShowReplaceModal={setShowReplaceModal}
          replacementSuggestions={replacementSuggestions}
          handleSelectReplacement={handleSelectReplacement}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onShare={handleShare}
          onShowSaved={() => setShowSavedTrips(true)}
          savedTripsCount={savedTrips.length}
        />
        <Toast message={toast} onClose={() => setToast(null)} />
        {showSavedTrips && (
          <SavedTripsModal
            trips={savedTrips}
            onClose={() => setShowSavedTrips(false)}
            onDelete={handleDeleteSavedTrip}
          />
        )}
      </>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Plan My Trip' }]} />

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">
            <Sparkles size={16} /> Smart Trip Planner
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-2">Plan Your Perfect Trip</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
            Select your destination and trip type — we'll generate a smart itinerary with the best places to visit.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          {WIZARD_STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                idx <= wizardStep ? 'bg-primary-500 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
              }`}>
                {idx < wizardStep ? '\u2713' : idx + 1}
              </div>
              {idx < WIZARD_STEPS.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-colors ${idx < wizardStep ? 'bg-primary-500' : 'bg-stone-200 dark:bg-stone-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          {wizardStep === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Step 1: Select a State</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">Choose the Indian state you want to explore</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {states.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => { setSelectedState(state); setSelectedDistrict(null); setWizardStep(1); }}
                    className="glass-card p-4 text-left hover:border-primary-300 transition-all group"
                  >
                    <img src={state.image} alt={state.name} className="w-full h-20 rounded-xl object-cover mb-2 group-hover:scale-105 transition-transform" loading="lazy"
                      onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f5f5f4" width="400" height="200"/%3E%3C/svg%3E'; }}
                    />
                    <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{state.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{state.touristPlaces} places</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Step 2: Select a District in {selectedState.name}</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">Choose the district for localized recommendations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stateDistricts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => { setSelectedDistrict(district); setWizardStep(2); }}
                    className="glass-card p-3 flex items-center gap-3 text-left hover:border-primary-300 transition-all"
                  >
                    <img src={district.image} alt={district.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy"
                      onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect fill="%23f5f5f4" width="56" height="56"/%3E%3C/svg%3E'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{district.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{district.touristPlaces} tourist places</p>
                    </div>
                    <ArrowRight size={18} className="text-stone-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Step 3: Select Trip Type</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">What kind of experience are you looking for?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tripTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedTripType(type.id); setWizardStep(3); }}
                    className={`glass-card p-4 text-center transition-all ${selectedTripType === type.id ? 'border-primary-500 ring-2 ring-primary-500/30' : 'hover:border-primary-300'}`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Step 4: How Many Days?</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">Choose your trip duration</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {dayOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedDays(opt.id)}
                    className={`glass-card p-4 text-center transition-all ${selectedDays === opt.id ? 'border-primary-500 ring-2 ring-primary-500/30' : 'hover:border-primary-300'}`}
                  >
                    <Calendar size={20} className={`mx-auto mb-1 ${selectedDays === opt.id ? 'text-primary-500' : 'text-stone-400'}`} />
                    <p className={`text-sm font-semibold ${selectedDays === opt.id ? 'text-primary-600 dark:text-primary-400' : 'text-stone-900 dark:text-white'}`}>{opt.label}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedDays}
                className="w-full btn-primary justify-center disabled:opacity-50"
              >
                <Sparkles size={18} /> Generate Smart Trip
              </button>
            </div>
          )}

          {/* Navigation */}
          {wizardStep > 0 && (
            <button
              onClick={() => setWizardStep(wizardStep - 1)}
              className="mt-4 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// ══════════════════════════════════════════
// TRIP ITINERARY VIEW
// ══════════════════════════════════════════
function TripItineraryView({
  trip, onReset, onSave, onStartOver, onRemovePlace, onMoveUp, onMoveDown,
  onMoveToDay, onAddSuggested, onReplacePlace, showAddModal, setShowAddModal,
  additionSuggestions, handleSelectAddition, showReplaceModal, setShowReplaceModal,
  replacementSuggestions, handleSelectReplacement, selectedState, selectedDistrict,
  onDownload, onPrint, onShare, onShowSaved, savedTripsCount,
}) {
  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Plan My Trip' }, { label: trip?.tripTypeName ?? 'My Trip' }]} />

        {/* Header */}
        <div className="glass-card p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">{trip?.tripTypeName ?? 'My Trip'}</h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <MapPin size={14} /> {selectedDistrict?.name ?? 'Unknown'}, {selectedState?.name ?? 'India'} · {trip?.numDays ?? 1} Day{(trip?.numDays ?? 1) > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onReset} className="btn-secondary text-sm"><RotateCcw size={16} /> Reset</button>
            <button onClick={onSave} className="btn-primary text-sm"><Save size={16} /> Save Trip</button>
            {savedTripsCount > 0 && (
              <button onClick={onShowSaved} className="btn-secondary text-sm"><History size={16} /> Saved ({savedTripsCount})</button>
            )}
            <button onClick={onStartOver} className="btn-secondary text-sm">New Trip</button>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="glass-card p-5 mb-6">
          <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" /> Trip Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <SummaryItem icon={MapPin} label="Places" value={trip?.summary?.totalPlaces ?? 0} color="primary" />
            <SummaryItem icon={Navigation} label="Distance" value={`${trip?.summary?.totalDistance ?? 0} km`} color="secondary" />
            <SummaryItem icon={Clock} label="Travel Time" value={`${trip?.summary?.totalTravelTime ?? 0} min`} color="accent" />
            <SummaryItem icon={Sun} label="Start / End" value={`${trip?.summary?.startTime ?? '9:00'} - ${trip?.summary?.endTime ?? '18:00'}`} color="primary" />
            <SummaryItem icon={Wallet} label="Est. Budget" value={trip?.summary?.estimatedBudget ?? '₹1000'} color="success" />
            <SummaryItem icon={CloudSun} label="Best Season" value={trip?.summary?.bestSeason ?? 'Year-round'} color="secondary" />
          </div>
          <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-700/50 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <CloudSun size={16} className="text-primary-500" />
            <span>Weather: {trip?.summary?.weather ?? 'Pleasant'}</span>
          </div>
        </div>

        {/* Action buttons: Download / Print / Share */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={onDownload} className="btn-secondary text-sm"><Download size={16} /> Download PDF</button>
          <button onClick={onPrint} className="btn-secondary text-sm"><Printer size={16} /> Print Trip</button>
          <button onClick={onShare} className="btn-secondary text-sm"><Share2 size={16} /> Share Trip</button>
        </div>

        {/* Days */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {(trip?.days ?? []).map((day, dayIndex) => (
            <TripPlannerCard
              key={dayIndex}
              day={day?.day ?? dayIndex + 1}
              places={day?.places ?? []}
              dayIndex={dayIndex}
              totalDays={(trip?.days ?? []).length}
              onRemovePlace={onRemovePlace}
              onReplacePlace={onReplacePlace}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onMoveToDay={onMoveToDay}
              onAddSuggested={onAddSuggested}
            />
          ))}
        </div>

        {/* Place Details section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Recommended Places Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(trip?.days ?? []).flatMap((d) => d?.places ?? []).filter((p) => !p.isMeal && !p.isActivity).map((place) => (
              <PlaceDetailCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        {/* Google Maps Placeholder */}
        <div className="glass-card rounded-3xl h-56 flex flex-col items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center mb-3">
            <MapIcon size={28} className="text-secondary-500" />
          </div>
          <p className="text-stone-600 dark:text-stone-400 font-semibold text-sm">Google Maps Integration</p>
          <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">Map view will be available with Google Maps API</p>
        </div>

        {/* Add Place Modal */}
        {showAddModal !== null && (
          <Modal onClose={() => setShowAddModal(null)} title={`Add Place to Day ${showAddModal + 1}`}>
            {additionSuggestions.length > 0 ? (
              additionSuggestions.map((place) => (
                <PlaceOption key={place.id} place={place} onSelect={() => handleSelectAddition(place)} />
              ))
            ) : (
              <p className="text-center text-stone-500 dark:text-stone-400 py-8">No more places available in this district.</p>
            )}
          </Modal>
        )}

        {/* Replace Place Modal */}
        {showReplaceModal && (
          <Modal onClose={() => setShowReplaceModal(null)} title="Replace with a Suggested Place">
            {replacementSuggestions.length > 0 ? (
              replacementSuggestions.map((place) => (
                <PlaceOption key={place.id} place={place} onSelect={() => handleSelectReplacement(place)} />
              ))
            ) : (
              <p className="text-center text-stone-500 dark:text-stone-400 py-8">No replacement suggestions available in this district.</p>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}

// ── Place Detail Card ──
function PlaceDetailCard({ place }) {
  return (
    <div className="glass-card overflow-hidden card-hover">
      <div className="relative h-32 overflow-hidden">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" loading="lazy"
          onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f5f5f4" width="400" height="200"/%3E%3C/svg%3E'; }}
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-0.5">
          <Star size={11} className="fill-accent-400 text-accent-400" /> {place.rating}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-stone-900 dark:text-white text-sm mb-1 truncate">{place.name}</h4>
        <div className="flex flex-wrap gap-1 mb-2">
          {place.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="badge bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-[10px] capitalize">{cat}</span>
          ))}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">{place.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 dark:text-stone-400 mb-3">
          <div className="flex items-center gap-1"><Clock size={12} className="text-primary-500" /> {place.visitDuration || 60} min</div>
          <div className="flex items-center gap-1"><Sun size={12} className="text-primary-500" /> {place.bestSeason || 'Oct-Mar'}</div>
        </div>
        <Link to={`/place/${place.id}`} className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
          <Eye size={14} /> View Details
        </Link>
      </div>
    </div>
  );
}

// ── Summary Item ──
function SummaryItem({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600 dark:text-secondary-400',
    accent: 'bg-accent-100 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400',
    success: 'bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400',
  };
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-xl ${colors[color]} flex items-center justify-center shrink-0`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
        <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

// ── Modal ──
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <MapIcon size={20} className="text-primary-500" /> {title}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">{children}</div>
      </div>
    </div>
  );
}

// ── Place Option (for modals) ──
function PlaceOption({ place, onSelect }) {
  return (
    <button onClick={onSelect} className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left group">
      <img src={place.image} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy"
        onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect fill="%23f5f5f4" width="56" height="56"/%3E%3C/svg%3E'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{place.name}</p>
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-0.5"><Star size={11} className="fill-accent-400 text-accent-400" /> {place.rating}</span>
          <span>· {place.distance}km away</span>
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5">{place.description}</p>
      </div>
      <Plus size={18} className="text-primary-500 shrink-0 group-hover:scale-110 transition-transform" />
    </button>
  );
}

// ── Saved Trips Modal ──
function SavedTripsModal({ trips, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-lg max-h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <History size={20} className="text-primary-500" /> Saved Trips ({trips.length})
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {trips.length > 0 ? (
            trips.map((t, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{t.tripTypeName}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{t.districtName}, {t.stateName} · {t.numDays} day(s) · {t.summary.totalPlaces} places</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Saved: {new Date(t.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <button onClick={() => onDelete(idx)} className="p-2 rounded-lg text-stone-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-stone-500 dark:text-stone-400 py-8">No saved trips yet. Generate and save a trip to see it here!</p>
          )}
        </div>
      </div>
    </div>
  );
}
