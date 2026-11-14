import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { guideRegistrationRequests as seedRequests } from '../data/guideRegistrations';
import { guidesApi, adminApi } from '../services/api';

const GuideRequestsContext = createContext(null);

let counter = seedRequests.length;

export function GuideRequestsProvider({ children }) {
  const [requests, setRequests] = useState(seedRequests);

  // Load latest registrations from backend
  useEffect(() => {
    async function loadRequests() {
      const res = await adminApi.getGuideRegistrations();
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
        setRequests(res.data);
      }
    }
    loadRequests();
  }, []);

  const addRequest = useCallback(async (data) => {
    const id = `gr-${++counter}`;
    const newReq = {
      id,
      fullName: data.fullName || 'New Applicant',
      guideType: data.guideType || 'freelance',
      guideTypeLabel: data.guideTypeLabel || 'Freelance Professional Guide',
      organization: data.organization || '—',
      mobile: data.mobile || '—',
      email: data.email || '—',
      experience: data.experience ? `${data.experience} years` : '—',
      languages: data.languages || [],
      areasCovered: data.areasCovered || [],
      specialization: data.specialization || '—',
      dailyCharges: data.dailyCharges ? `₹${data.dailyCharges}` : '—',
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'pending',
      profilePhoto: data.profilePhoto || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      documents: data.documents || [],
      adminComments: '',
    };
    setRequests((prev) => [newReq, ...prev]);

    // Send to backend
    try {
      await guidesApi.submitRegistration(newReq);
    } catch {}

    return newReq;
  }, []);

  const updateRequest = useCallback(async (id, updates) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));

    // Send status update to backend if status changed
    if (updates.status) {
      try {
        await adminApi.updateGuideRegistrationStatus(id, updates.status, updates.adminComments);
      } catch {}
    }
  }, []);

  const value = useMemo(() => ({ requests, addRequest, updateRequest }), [requests, addRequest, updateRequest]);

  return <GuideRequestsContext.Provider value={value}>{children}</GuideRequestsContext.Provider>;
}

export function useGuideRequests() {
  const ctx = useContext(GuideRequestsContext);
  if (!ctx) throw new Error('useGuideRequests must be used within GuideRequestsProvider');
  return ctx;
}
