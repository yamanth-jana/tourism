import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Upload, Star, Settings, User, MapPin, Camera, CreditCard as Edit, Calendar, Map, Trash2, ShieldCheck, FileText, MessageSquare, RefreshCw, Award } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import destinations from '../data/destinations';
import reviews from '../data/reviews';
import hiddenGems from '../data/hiddenGems';
import DestinationCard from '../components/common/DestinationCard';
import BookingCard from '../components/booking/BookingCard';
import bookingsData from '../data/bookings';
import { REGISTRATION_STATUS, VERIFICATION_BADGES } from '../data/guideRegistrations';
import { useAuth } from '../context/AuthContext';
import { useGuideRequests } from '../context/GuideRequestsContext';

const STORAGE_KEY = 'explore-india-saved-trips';

function SavedTripsList() {
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTrips(raw ? JSON.parse(raw) : []);
    } catch { setTrips([]); }
  }, []);

  const handleDelete = (idx) => {
    const updated = trips.filter((_, i) => i !== idx);
    setTrips(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (trips.length === 0) {
    return <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">No saved trips yet. Generate a trip in the Trip Planner and save it!</p>;
  }

  return (
    <div className="space-y-3 mb-4">
      {trips.map((t, idx) => (
        <div key={idx} className="p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{t.tripTypeName}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{t.districtName || t.stateName || ''} · {t.numDays} day(s) · {t.summary?.totalPlaces || 0} places</p>
          </div>
          <button onClick={() => handleDelete(idx)} className="p-2 rounded-lg text-stone-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors shrink-0">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

const tabs = [
  { id: 'favorites', label: 'Favorite Places', icon: Heart },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'trip-planner', label: 'Trip Planner', icon: Map },
  { id: 'history', label: 'Booking History', icon: Bookmark },
  { id: 'saved', label: 'Saved Places', icon: Bookmark },
  { id: 'uploaded', label: 'Uploaded Places', icon: Upload },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'guide-app', label: 'My Guide Application', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Profile() {
  const { favorites } = useFavorites();
  const { user, role } = useAuth();
  const { requests } = useGuideRequests();
  const [activeTab, setActiveTab] = useState('favorites');

  const favoriteDestinations = destinations.filter((d) => favorites.includes(d.id));
  const savedDestinations = destinations.slice(2, 5);
  const uploadedPlaces = hiddenGems.filter((g) => g.submittedBy === 'Priya Nair');
  const userReviews = reviews.slice(0, 3);

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative rounded-4xl overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800" />
          <div className="glass-card px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Profile"
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-stone-900 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-stone-900 dark:text-white">{user?.name || 'Priya Nair'}</h1>
                  <span className={`badge ${role === 'admin' ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300' : 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300'}`}>
                    {role === 'admin' ? <><ShieldCheck size={11} /> Administrator</> : <><User size={11} /> User</>}
                  </span>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <MapPin size={14} /> Mumbai, Maharashtra
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-lg">
                  Travel enthusiast and photography lover. Exploring India one hidden gem at a time.
                </p>
              </div>
              <button className="btn-secondary text-sm">
                <Edit size={16} /> Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div>
                <div className="text-2xl font-bold text-stone-900 dark:text-white">{favoriteDestinations.length}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Favorites</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900 dark:text-white">{userReviews.length}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900 dark:text-white">{uploadedPlaces.length}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">Uploaded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'favorites' && (
          <div className="animate-fade-in">
            {favoriteDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteDestinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Heart size={48} className="mx-auto text-stone-400 mb-4" />
                <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                  No favorites yet
                </h3>
                <p className="text-stone-500 dark:text-stone-400 mb-6">
                  Start exploring and add places to your favorites!
                </p>
                <Link to="/explore" className="btn-primary">
                  Explore Destinations
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-900 dark:text-white">Upcoming Bookings</h3>
              <Link to="/bookings" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                View All
              </Link>
            </div>
            {bookingsData.filter((b) => b.status === 'upcoming').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {activeTab === 'trip-planner' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 dark:text-white">My Trip Plans</h3>
              <Link to="/trip-planner" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Open Trip Planner
              </Link>
            </div>
            <SavedTripsList />
            <div className="glass-card p-6 text-center mt-4">
              <Map size={32} className="mx-auto text-primary-500 mb-3" />
              <p className="text-stone-600 dark:text-stone-400 mb-4">Create custom itineraries for your trips across India.</p>
              <Link to="/trip-planner" className="btn-primary text-sm">Plan a Trip</Link>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-4">
            <h3 className="font-bold text-stone-900 dark:text-white mb-2">Booking History</h3>
            {bookingsData.filter((b) => b.status !== 'upcoming').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'uploaded' && (
          <div className="animate-fade-in">
            {uploadedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedPlaces.map((gem) => (
                  <div key={gem.id} className="glass-card overflow-hidden">
                    <img src={gem.image} alt={gem.name} className="w-full h-48 object-cover" loading="lazy" onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22192%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22400%22 height=%22192%22/%3E%3C/svg%3E'; }} />
                    <div className="p-4">
                      <h3 className="font-bold text-stone-900 dark:text-white">{gem.name}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">{gem.state}</p>
                      <span className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300 mt-2">
                        Published
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Upload size={48} className="mx-auto text-stone-400 mb-4" />
                <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                  No uploads yet
                </h3>
                <p className="text-stone-500 dark:text-stone-400 mb-6">
                  Share a hidden place with the community!
                </p>
                <Link to="/upload-place" className="btn-primary">
                  <Upload size={18} /> Upload a Place
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-4">
            {userReviews.map((review) => (
              <div key={review.id} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{review.placeName}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= review.rating ? 'fill-accent-400 text-accent-400' : 'text-stone-300 dark:text-stone-600'}
                      />
                    ))}
                  </div>
                </div>
                <h5 className="font-semibold text-stone-800 dark:text-stone-200 mb-1">{review.title}</h5>
                <p className="text-sm text-stone-600 dark:text-stone-400">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guide-app' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 dark:text-white">My Guide Application</h3>
              <Link to="/guide-registration" className="btn-primary text-sm">
                <ShieldCheck size={16} /> New Registration
              </Link>
            </div>
            {requests.length > 0 ? (
              requests.map((req) => {
                const statusCfg = REGISTRATION_STATUS[req.status] || REGISTRATION_STATUS.pending;
                const canEdit = req.status === 'rejected' || req.status === 'needs_info';
                return (
                  <div key={req.id} className="glass-card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <img src={req.profilePhoto} alt={req.fullName} className="w-16 h-16 rounded-2xl object-cover shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-stone-900 dark:text-white">{req.fullName}</h4>
                          <span className={`badge ${statusCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} /> {statusCfg.label}
                          </span>
                          {req.status === 'verified' && (
                            <span className="badge bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300 gap-1">
                              <ShieldCheck size={12} /> {VERIFICATION_BADGES[req.guideType]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{req.guideTypeLabel}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-stone-600 dark:text-stone-400">
                          <div className="flex items-center gap-1.5"><Calendar size={12} className="text-stone-400" /> Submitted {req.submittedDate}</div>
                          <div className="flex items-center gap-1.5"><Award size={12} className="text-stone-400" /> {req.experience}</div>
                          <div className="flex items-center gap-1.5 col-span-2"><FileText size={12} className="text-stone-400" /> {req.documents.length} documents uploaded</div>
                        </div>

                        {req.adminComments && (
                          <div className="mt-3 rounded-2xl bg-primary-50/60 dark:bg-primary-500/10 p-3">
                            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1 flex items-center gap-1">
                              <MessageSquare size={12} /> Admin Comments
                            </p>
                            <p className="text-xs text-stone-700 dark:text-stone-300">{req.adminComments}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          {canEdit ? (
                            <Link to="/guide-registration" className="px-4 py-2 rounded-full bg-primary-500 text-white text-sm font-semibold flex items-center gap-1 hover:bg-primary-600 transition-colors">
                              <Edit size={15} /> Edit & Resubmit
                            </Link>
                          ) : req.status === 'verified' ? (
                            <span className="px-4 py-2 rounded-full bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300 text-sm font-semibold flex items-center gap-1">
                              <ShieldCheck size={15} /> Profile Live
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300 text-sm font-semibold flex items-center gap-1">
                              <RefreshCw size={15} /> Under Review
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card p-12 text-center">
                <ShieldCheck size={48} className="mx-auto text-stone-400 mb-4" />
                <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">No guide application yet</h3>
                <p className="text-stone-500 dark:text-stone-400 mb-6">Register as a guide and start welcoming travellers!</p>
                <Link to="/guide-registration" className="btn-primary">Become a Guide</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in glass-card p-6 sm:p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-primary-500" />
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Account Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Full Name</label>
                <input type="text" defaultValue="Priya Nair" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Email</label>
                <input type="email" defaultValue="priya.nair@email.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Bio</label>
                <textarea rows={3} defaultValue="Travel enthusiast and photography lover." className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Location</label>
                <input type="text" defaultValue="Mumbai, Maharashtra" className="input-field" />
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
