import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Ticket, Calendar, Heart, Share2, Flag, Star,
  Lightbulb, Building, History, Crown, Camera, Video, Map,
  Phone, UtensilsCrossed, Hotel, Navigation, ThumbsUp, Info,
  CalendarCheck, Accessibility, Clock3, Compass, Users,
} from 'lucide-react';
import destinations from '../data/destinations';
import reviews from '../data/reviews';
import states from '../data/states';
import districtsData from '../data/districts';
import { getNearbyGuidesForPlace } from '../data/guides';
import RatingStars from '../components/common/RatingStars';
import DestinationCard from '../components/common/DestinationCard';
import GuideCard from '../components/booking/GuideCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { useFavorites } from '../context/FavoritesContext';
import { useLocation } from '../context/LocationContext';
import { placesApi } from '../services/api';

export default function PlaceDetails() {
  const { id } = useParams();
  const staticDestination = destinations.find((d) => d.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { selectLocation } = useLocation();
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [apiDestination, setApiDestination] = useState(null);
  const [loadingDestination, setLoadingDestination] = useState(false);
  const [destinationError, setDestinationError] = useState('');

  // Fetch database places when the ID is not present in the static data.
  useEffect(() => {
    if (staticDestination) {
      setApiDestination(null);
      setDestinationError('');
      setLoadingDestination(false);
      return undefined;
    }

    let cancelled = false;

    const loadDestination = async () => {
      setLoadingDestination(true);
      setDestinationError('');

      try {
        const response = await placesApi.getPlaceById(id);

        if (cancelled) return;

        if (!response.ok || !response.data) {
          setApiDestination(null);
          setDestinationError(response.error || 'Unable to load this destination.');
          return;
        }

        const place = response.data;
        const stateId = place.state?.id || place.stateId || '';
        const districtId = place.district?.id || place.districtId || '';
        const stateName = place.state?.name || '';
        const districtName = place.district?.name || '';
        const image = place.imageUrl || '';

        setApiDestination({
          ...place,
          id: place.id,
          name: place.name,
          image,
          gallery: image ? [image] : [],
          category: place.category?.id || place.categoryId || '',
          categoryName: place.category?.name || 'Tourist Place',
          stateId,
          state: stateName,
          districtId,
          district: districtName,
          city: place.city || districtName || stateName || '',
          shortDescription: place.shortDescription || '',
          description: place.fullDescription || place.shortDescription || 'Detailed information about this destination will be available soon.',
          history: place.history || '',
          culturalImportance: place.culturalImportance || '',
          architecture: place.architecture || '',
          interestingFacts: Array.isArray(place.interestingFacts) ? place.interestingFacts : [],
          travelTips: Array.isArray(place.travelTips) ? place.travelTips : [],
          facilities: Array.isArray(place.facilities) ? place.facilities : [],
          nearbyAttractions: Array.isArray(place.nearbyAttractions) ? place.nearbyAttractions : [],
          nearbyHotels: Array.isArray(place.nearbyHotels) ? place.nearbyHotels : [],
          nearbyRestaurants: Array.isArray(place.nearbyRestaurants) ? place.nearbyRestaurants : [],
          emergencyContacts: Array.isArray(place.emergencyContacts) ? place.emergencyContacts : [],
          coordinates:
            place.latitude != null && place.longitude != null
              ? { lat: place.latitude, lng: place.longitude }
              : null,
          openingTime: place.timings || 'N/A',
          closingTime: 'N/A',
          entryFee: place.entryFee || 'N/A',
          bestTimeToVisit: place.bestTimeToVisit || 'Year-round',
          rating: place.rating ?? 4.5,
          reviewsCount: place.reviewsCount ?? 0,
          trending: Boolean(place.trending),
          topRated: Boolean(place.topRated),
        });
      } catch (error) {
        if (!cancelled) {
          setApiDestination(null);
          setDestinationError(error.message || 'Unable to load this destination.');
        }
      } finally {
        if (!cancelled) setLoadingDestination(false);
      }
    };

    loadDestination();

    return () => {
      cancelled = true;
    };
  }, [id, staticDestination]);

  const destination = staticDestination || apiDestination;

  // Automatically set the global location context when viewing a place.
  useEffect(() => {
    if (destination?.stateId) {
      const state = states.find((s) => s.id === destination.stateId) || null;
      const district = destination.districtId
        ? (districtsData[destination.stateId] || []).find((d) => d.id === destination.districtId) || null
        : null;
      selectLocation(state, district);
    }
  }, [destination?.id, destination?.stateId, destination?.districtId, selectLocation]);

  if (loadingDestination) {
    return (
      <div className="pt-32 pb-16 container-max px-4 text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
        <p className="mt-4 text-stone-600 dark:text-stone-400">
          Loading destination details...
        </p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="pt-32 pb-16 container-max px-4 text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">
          Destination Not Found
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          {destinationError || "The place you're looking for doesn't exist or has been removed."}
        </p>
        <Link to="/explore" className="btn-primary">
          Back to Explore
        </Link>
      </div>
    );
  }

  const fav = isFavorite(destination.id);
  const placeReviews = reviews.filter((r) => r.placeId === destination.id);
  const relatedPlaces = destinations
    .filter((d) => d.category === destination.category && d.id !== destination.id)
    .slice(0, 4);
  const suggestedPlaces = destinations
    .filter((d) => d.stateId === destination.stateId && d.id !== destination.id)
    .slice(0, 4);

  // Defensive field access — lightweight destinations may lack these
  const gallery = destination.gallery || [destination.image];
  const description = destination.description || destination.shortDescription || 'Detailed information about this destination will be available soon.';
  const history = destination.history || 'Historical background for this destination will be added soon.';
  const culturalImportance = destination.culturalImportance || 'Cultural significance details will be added soon.';
  const architecture = destination.architecture || 'Architectural details will be added soon.';
  const interestingFacts = destination.interestingFacts || [];
  const travelTips = destination.travelTips || [];
  const facilities = destination.facilities || [];
  const nearbyAttractions = destination.nearbyAttractions || [];
  const nearbyHotels = destination.nearbyHotels || [];
  const nearbyRestaurants = destination.nearbyRestaurants || [];
  const emergencyContacts = destination.emergencyContacts || [];
  const coordinates = destination.coordinates || null;
  const openingTime = destination.openingTime || 'N/A';
  const closingTime = destination.closingTime || 'N/A';
  const entryFee = destination.entryFee || 'N/A';
  const bestTimeToVisit = destination.bestTimeToVisit || 'Year-round';

  const tabs = [
    { id: 'description', label: 'Description', icon: Lightbulb },
    { id: 'history', label: 'History', icon: History },
    { id: 'culture', label: 'Cultural Importance', icon: Crown },
    { id: 'architecture', label: 'Architecture', icon: Building },
    { id: 'facts', label: 'Interesting Facts', icon: Star },
  ];

  return (
    <div className="pt-20 pb-16">
      {/* Hero Image */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={destination.image || ''}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22600%22%3E%3Crect fill=%22%23e7e5e4%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container-max">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge bg-primary-500 text-white">
                {destination.categoryName}
              </span>
              {destination.trending && (
                <span className="badge bg-accent-500 text-white">Trending</span>
              )}
              {destination.topRated && (
                <span className="badge bg-success-500 text-white">Top Rated</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {destination.city}, {destination.state}
              </span>
              <RatingStars rating={destination.rating} size={16} showValue reviewsCount={destination.reviewsCount} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-max px-4 sm:px-6 lg:px-8 mt-4">
        <Breadcrumb
          items={[
            { label: 'Explore', to: '/explore' },
            ...(destination.stateId ? [{ label: destination.state, to: `/explore/${destination.stateId}` }] : []),
            ...(destination.districtId ? [{ label: destination.district, to: `/explore/${destination.stateId}/${destination.districtId}` }] : []),
            ...(destination.districtId && destination.category ? [{ label: destination.categoryName, to: `/explore/${destination.stateId}/${destination.districtId}/${destination.category}` }] : []),
            { label: destination.name },
          ]}
        />
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => toggleFavorite(destination.id)}
            className={`btn-secondary text-sm ${fav ? 'text-error-500 border-error-300' : ''}`}
          >
            <Heart size={18} className={fav ? 'fill-error-500' : ''} />
            {fav ? 'Favorited' : 'Add to Favorites'}
          </button>
          <button className="btn-secondary text-sm">
            <Share2 size={18} /> Share
          </button>
          <Link to={`/report?place=${destination.id}`} className="btn-ghost text-sm text-error-600 dark:text-error-400">
            <Flag size={18} /> Report
          </Link>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Clock, label: 'Opening', value: openingTime },
            { icon: Clock, label: 'Closing', value: closingTime },
            { icon: Ticket, label: 'Entry Fee', value: entryFee },
            { icon: Calendar, label: 'Best Time', value: bestTimeToVisit },
          ].map((info, idx) => (
            <div key={idx} className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                <info.icon size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400">{info.label}</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Camera size={24} /> Photo Gallery
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-3xl overflow-hidden h-72 sm:h-96">
              <img
                src={gallery[activeImage] || destination.image}
                alt={`${destination.name} ${activeImage + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22800%22 height=%22400%22/%3E%3C/svg%3E'; }}
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`rounded-2xl overflow-hidden h-32 lg:h-44 transition-all ${
                    activeImage === idx
                      ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-stone-950'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22120%22 height=%22120%22/%3E%3C/svg%3E'; }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Gallery Placeholder */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Video size={24} /> Video Gallery
          </h2>
          <div className="glass-card rounded-3xl h-64 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mb-4">
              <Video size={32} className="text-primary-500" />
            </div>
            <p className="text-stone-600 dark:text-stone-400 font-semibold">Video Coming Soon</p>
            <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">
              We're working on bringing you cinematic videos of {destination.name}
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card p-6 sm:p-8 animate-fade-in">
            {activeTab === 'description' && (
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-lg">
                {description}
              </p>
            )}
            {activeTab === 'history' && (
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{history}</p>
            )}
            {activeTab === 'culture' && (
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{culturalImportance}</p>
            )}
            {activeTab === 'architecture' && (
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{architecture}</p>
            )}
            {activeTab === 'facts' && (
              interestingFacts.length > 0 ? (
                <ul className="space-y-3">
                  {interestingFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                      <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <Info size={18} /> Interesting facts will be added soon.
                </p>
              )
            )}
          </div>
        </div>

        {/* Visit Planning Section */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <CalendarCheck size={24} className="text-primary-500" /> Visit Planning
            </h2>
            <Link
              to={`/booking/${destination.id}`}
              className="btn-primary text-sm"
            >
              <CalendarCheck size={18} /> Book Visit
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Clock3, label: 'Est. Visit Duration', value: destination.estimatedDuration || '1-3 hours' },
              { icon: Compass, label: 'Parking', value: destination.parking || 'Available' },
              { icon: Accessibility, label: 'Wheelchair Access', value: destination.wheelchairAccess || 'Limited' },
              { icon: Clock, label: 'Best Visiting Hours', value: destination.bestVisitingHours || `${openingTime} - ${closingTime}` },
            ].map((info, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
                  <info.icon size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-500 dark:text-stone-400">{info.label}</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50">
              <UtensilsCrossed size={18} className="text-primary-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400">Nearby Restaurants</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                  {nearbyRestaurants.length > 0 ? `${nearbyRestaurants.length} options` : 'Available nearby'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50">
              <Hotel size={18} className="text-primary-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400">Nearby Hotels</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                  {nearbyHotels.length > 0 ? `${nearbyHotels.length} options` : 'Available nearby'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50">
              <Navigation size={18} className="text-primary-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400">Nearby Attractions</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                  {nearbyAttractions.length > 0 ? `${nearbyAttractions.length} places` : 'Available nearby'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-error-50 dark:bg-error-500/10 mt-4">
            <Phone size={18} className="text-error-500 shrink-0" />
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Emergency Contact</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">Police: 100 | Ambulance: 108 | Tourist Helpline: 1363</p>
            </div>
          </div>
        </div>

        {/* Travel Tips & Facilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb size={22} className="text-primary-500" /> Travel Tips
            </h3>
            {travelTips.length > 0 ? (
              <ul className="space-y-2">
                {travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="text-primary-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Info size={16} /> Travel tips will be added soon.
              </p>
            )}
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Building size={22} className="text-primary-500" /> Facilities
            </h3>
            {facilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility, idx) => (
                  <span key={idx} className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300">
                    {facility}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Info size={16} /> Facility information will be added soon.
              </p>
            )}
          </div>
        </div>

        {/* Nearby Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Nearby Attractions */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Navigation size={22} className="text-primary-500" /> Nearby Attractions
            </h3>
            {nearbyAttractions.length > 0 ? (
              <div className="space-y-3">
                {nearbyAttractions.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <img src={attr.image} alt={attr.name} className="w-14 h-14 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2256%22 height=%2256%22/%3E%3C/svg%3E'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                        {attr.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <MapPin size={12} /> {attr.distance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Info size={16} /> Nearby attractions will be added soon.
              </p>
            )}
          </div>

          {/* Nearby Hotels */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Hotel size={22} className="text-primary-500" /> Nearby Hotels
            </h3>
            {nearbyHotels.length > 0 ? (
              <div className="space-y-3">
                {nearbyHotels.map((hotel, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <img src={hotel.image} alt={hotel.name} className="w-14 h-14 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2256%22 height=%2256%22/%3E%3C/svg%3E'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                        {hotel.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={hotel.rating} size={12} showValue />
                        <span className="text-xs text-stone-500 dark:text-stone-400">{hotel.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Info size={16} /> Nearby hotels will be added soon.
              </p>
            )}
          </div>

          {/* Nearby Restaurants */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <UtensilsCrossed size={22} className="text-primary-500" /> Nearby Restaurants
            </h3>
            {nearbyRestaurants.length > 0 ? (
              <div className="space-y-3">
                {nearbyRestaurants.map((rest, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <img src={rest.image} alt={rest.name} className="w-14 h-14 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2256%22 height=%2256%22/%3E%3C/svg%3E'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                        {rest.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rest.rating} size={12} showValue />
                        <span className="text-xs text-stone-500 dark:text-stone-400">{rest.cuisine}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Info size={16} /> Nearby restaurants will be added soon.
              </p>
            )}
          </div>
        </div>

        {/* Nearby Local Guides — automatically shown based on place location */}
        {(() => {
          const nearbyGuides = destination?.stateId
            ? getNearbyGuidesForPlace(destination.stateId, destination.districtId, 3)
            : [];
          if (nearbyGuides.length === 0) return null;
          return (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
                <Users size={24} className="text-primary-500" /> Nearby Local Guides
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                Certified guides available for {destination.name} — automatically recommended based on this place's location.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/guides" className="btn-ghost text-sm">
                  View All Guides <Compass size={16} className="inline ml-1" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Emergency Contacts */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone size={22} className="text-error-500" /> Emergency Contacts
          </h3>
          {emergencyContacts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-error-50 dark:bg-error-500/10">
                  <div className="w-10 h-10 rounded-full bg-error-500 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">{contact.name}</p>
                    <p className="text-lg font-bold text-error-600 dark:text-error-400">{contact.number}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Police', number: '100' },
                { name: 'Ambulance', number: '108' },
                { name: 'Tourist Helpline', number: '1363' },
              ].map((contact, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-error-50 dark:bg-error-500/10">
                  <div className="w-10 h-10 rounded-full bg-error-500 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">{contact.name}</p>
                    <p className="text-lg font-bold text-error-600 dark:text-error-400">{contact.number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Maps Placeholder */}
        <div className="glass-card rounded-3xl h-72 flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-500/20 flex items-center justify-center mb-4">
            <Map size={32} className="text-secondary-500" />
          </div>
          <p className="text-stone-600 dark:text-stone-400 font-semibold">Google Maps Integration</p>
          <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">
            Coordinates: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'Not available'}
          </p>
          <p className="text-xs text-stone-400 mt-2">
            Map will be integrated with Google Maps API
          </p>
        </div>

        {/* User Reviews */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              User Reviews
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">{destination.rating}</div>
                <RatingStars rating={destination.rating} size={14} />
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {(destination.reviewsCount || 0).toLocaleString()} reviews
                </div>
              </div>
            </div>
          </div>

          {placeReviews.length > 0 ? (
            <div className="space-y-4">
              {placeReviews.map((review) => (
                <div key={review.id} className="glass-card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E'; }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 dark:text-white">{review.userName}</h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400">{review.date}</span>
                      </div>
                      <RatingStars rating={review.rating} size={14} />
                    </div>
                  </div>
                  <h5 className="font-semibold text-stone-800 dark:text-stone-200 mb-1">{review.title}</h5>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.photos.map((photo, idx) => (
                        <img key={idx} src={photo} alt={`Review ${idx + 1}`} className="w-20 h-20 rounded-xl object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23e7e5e4%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E'; }} />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400 hover:text-primary-500 transition-colors">
                      <ThumbsUp size={14} /> Helpful ({review.helpful})
                    </button>
                    <span className="text-sm text-stone-400">❤️ {review.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-stone-500 dark:text-stone-400">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Suggested & Related Places */}
        {suggestedPlaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
              Suggested Places in {destination.state}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedPlaces.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        )}

        {relatedPlaces.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
              Related Places
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPlaces.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
