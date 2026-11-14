// Explore India Centralized REST API Service Layer

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'explore-india-token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, don't set Content-Type header so browser sets multipart boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
      return { ok: false, status: res.status, error: errorMsg, data: null };
    }

    return { ok: true, status: res.status, data: data?.data ?? data };
  } catch (err) {
    console.warn(`[API] Error calling ${endpoint}:`, err);
    return { ok: false, error: err.message || 'Network request failed', data: null };
  }
}

// ── Auth APIs ──
export const authApi = {
  login: async (email, password, role) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (res.ok && res.data?.token) {
      setToken(res.data.token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.ok && res.data?.token) {
      setToken(res.data.token);
    }
    return res;
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  logout: () => {
    setToken(null);
  },
};

// ── Places & Destinations APIs ──
export const placesApi = {
  getPlaces: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/places${query ? `?${query}` : ''}`);
  },

  getPlaceById: async (id) => {
    return apiRequest(`/places/${id}`);
  },
};

// ── States & Districts APIs ──
export const statesApi = {
  getStates: async () => {
    return apiRequest('/states');
  },

  getDistricts: async (stateId) => {
    return apiRequest(stateId ? `/states/${stateId}/districts` : '/districts');
  },
};

// ── Categories APIs ──
export const categoriesApi = {
  getCategories: async () => {
    return apiRequest('/categories');
  },
};

// ── Hidden Gems APIs ──
export const hiddenGemsApi = {
  getHiddenGems: async () => {
    return apiRequest('/hidden-gems');
  },

  submitHiddenGem: async (gemData) => {
    return apiRequest('/hidden-gems', {
      method: 'POST',
      body: JSON.stringify(gemData),
    });
  },
};

// ── Favorites APIs ──
export const favoritesApi = {
  getFavorites: async () => {
    return apiRequest('/favorites');
  },

  addFavorite: async (placeId) => {
    return apiRequest(`/favorites/${placeId}`, {
      method: 'POST',
    });
  },

  removeFavorite: async (placeId) => {
    return apiRequest(`/favorites/${placeId}`, {
      method: 'DELETE',
    });
  },
};

// ── Reviews APIs ──
export const reviewsApi = {
  getReviewsByPlace: async (placeId) => {
    return apiRequest(`/places/${placeId}/reviews`);
  },

  getAllReviews: async () => {
    return apiRequest('/reviews');
  },

  addReview: async (placeId, reviewData) => {
    return apiRequest(`/places/${placeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  markHelpful: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  },
};

// ── Bookings APIs ──
export const bookingsApi = {
  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async () => {
    return apiRequest('/bookings/my');
  },

  getBookingById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  cancelBooking: async (id) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  },
};

// ── Guides APIs ──
export const guidesApi = {
  getGuides: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/guides${query ? `?${query}` : ''}`);
  },

  getGuideById: async (id) => {
    return apiRequest(`/guides/${id}`);
  },

  submitRegistration: async (formData) => {
    return apiRequest('/guide-registrations', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  getMyRegistrations: async () => {
    return apiRequest('/guide-registrations/my');
  },
};

// ── Trip Planner APIs ──
export const tripPlansApi = {
  saveTrip: async (tripData) => {
    return apiRequest('/trip-plans', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  getMyTrips: async () => {
    return apiRequest('/trip-plans/my');
  },

  deleteTrip: async (id) => {
    return apiRequest(`/trip-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// ── Notifications APIs ──
export const notificationsApi = {
  getNotifications: async () => {
    return apiRequest('/notifications');
  },

  markRead: async (id) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

// ── Reports & Place Uploads APIs ──
export const reportsApi = {
  submitReport: async (reportData) => {
    return apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },
};

export const placeSubmissionsApi = {
  submitPlace: async (submissionData) => {
    return apiRequest('/place-submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },
};

// ── Contact & Newsletter APIs ──
export const contactApi = {
  sendMessage: async (messageData) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  subscribeNewsletter: async (email) => {
    return apiRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ── Chatbot API ──
export const chatbotApi = {
  sendMessage: async (message, conversationId) => {
    return apiRequest('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  },
};

// ── Admin APIs ──
export const adminApi = {
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard/stats');
  },

  getBookings: async () => {
    return apiRequest('/admin/bookings');
  },

  updateBookingStatus: async (id, status) => {
    return apiRequest(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getGuideRegistrations: async () => {
    return apiRequest('/admin/guide-registrations');
  },

  updateGuideRegistrationStatus: async (id, status, adminComments) => {
    return apiRequest(`/admin/guide-registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminComments }),
    });
  },

  getReports: async () => {
    return apiRequest('/admin/reports');
  },

  updateReportStatus: async (id, status) => {
    return apiRequest(`/admin/reports/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getPlaceSubmissions: async () => {
    return apiRequest('/admin/place-submissions');
  },

  updatePlaceSubmissionStatus: async (id, status) => {
    return apiRequest(`/admin/place-submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  updateUserStatus: async (id, status) => {
    return apiRequest(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

export default {
  auth: authApi,
  places: placesApi,
  states: statesApi,
  categories: categoriesApi,
  hiddenGems: hiddenGemsApi,
  favorites: favoritesApi,
  reviews: reviewsApi,
  bookings: bookingsApi,
  guides: guidesApi,
  tripPlans: tripPlansApi,
  notifications: notificationsApi,
  reports: reportsApi,
  placeSubmissions: placeSubmissionsApi,
  contact: contactApi,
  chatbot: chatbotApi,
  admin: adminApi,
};
