import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GuideRequestsProvider } from './context/GuideRequestsContext';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import ErrorBoundary from './components/common/ErrorBoundary';

const Explore = lazy(() => import('./pages/Explore'));
const Categories = lazy(() => import('./pages/Categories'));
const HiddenGems = lazy(() => import('./pages/HiddenGems'));
const PlaceDetails = lazy(() => import('./pages/PlaceDetails'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const UploadPlace = lazy(() => import('./pages/UploadPlace'));
const Profile = lazy(() => import('./pages/Profile'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Report = lazy(() => import('./pages/Report'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Bookings = lazy(() => import('./pages/Bookings'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));
const TripPlanner = lazy(() => import('./pages/TripPlanner'));
const Guides = lazy(() => import('./pages/Guides'));
const GuideRegistration = lazy(() => import('./pages/GuideRegistration'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AccessDenied = lazy(() => import('./pages/AccessDenied'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
    </div>
  );
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated || !isAdmin) return <AccessDenied />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <LocationProvider>
            <GuideRequestsProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <ErrorBoundary>
                    <Routes>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Suspense fallback={<PageLoader />}><Explore /></Suspense>} />
                        <Route path="/explore/:stateId" element={<Suspense fallback={<PageLoader />}><Explore /></Suspense>} />
                        <Route path="/explore/:stateId/:districtId" element={<Suspense fallback={<PageLoader />}><Explore /></Suspense>} />
                        <Route path="/explore/:stateId/:districtId/:categoryId" element={<Suspense fallback={<PageLoader />}><Explore /></Suspense>} />
                        <Route path="/categories" element={<Suspense fallback={<PageLoader />}><Categories /></Suspense>} />
                        <Route path="/hidden-gems" element={<Suspense fallback={<PageLoader />}><HiddenGems /></Suspense>} />
                        <Route path="/place/:id" element={<Suspense fallback={<PageLoader />}><PlaceDetails /></Suspense>} />
                        <Route path="/search" element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
                        <Route path="/upload-place" element={<Suspense fallback={<PageLoader />}><UploadPlace /></Suspense>} />
                        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
                        <Route path="/favorites" element={<Suspense fallback={<PageLoader />}><Favorites /></Suspense>} />
                        <Route path="/reviews" element={<Suspense fallback={<PageLoader />}><Reviews /></Suspense>} />
                        <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
                        <Route path="/admin-login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
                        <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
                        <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
                        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                        <Route path="/report" element={<Suspense fallback={<PageLoader />}><Report /></Suspense>} />
                        <Route path="/booking/:id" element={<Suspense fallback={<PageLoader />}><BookingPage /></Suspense>} />
                        <Route path="/booking" element={<Suspense fallback={<PageLoader />}><BookingPage /></Suspense>} />
                        <Route path="/bookings" element={<Suspense fallback={<PageLoader />}><Bookings /></Suspense>} />
                        <Route path="/bookings/:id" element={<Suspense fallback={<PageLoader />}><BookingDetails /></Suspense>} />
                        <Route path="/trip-planner" element={<Suspense fallback={<PageLoader />}><TripPlanner /></Suspense>} />
                        <Route path="/guides" element={<Suspense fallback={<PageLoader />}><Guides /></Suspense>} />
                        <Route path="/guide-registration" element={<Suspense fallback={<PageLoader />}><GuideRegistration /></Suspense>} />
                        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminDashboard /></AdminRoute></Suspense>} />
                        <Route path="/access-denied" element={<Suspense fallback={<PageLoader />}><AccessDenied /></Suspense>} />
                        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
                      </Route>
                    </Routes>
                  </ErrorBoundary>
                </BrowserRouter>
              </NotificationProvider>
            </GuideRequestsProvider>
          </LocationProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
