/**
 * Mock guide registration request data for the Admin Dashboard "Guide Registration
 * Requests" section and the Profile "My Guide Application" tab. Frontend-only —
 * simulates the pending/verified/rejected/needs-info workflow without a backend.
 */

export const REGISTRATION_STATUS = {
  pending: { label: 'Pending Review', color: 'bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300', dot: 'bg-accent-500' },
  verified: { label: 'Verified', color: 'bg-success-100 dark:bg-success-500/20 text-success-700 dark:text-success-300', dot: 'bg-success-500' },
  rejected: { label: 'Rejected', color: 'bg-error-100 dark:bg-error-500/20 text-error-700 dark:text-error-300', dot: 'bg-error-500' },
  needs_info: { label: 'Need More Information', color: 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300', dot: 'bg-primary-500' },
};

export const REG_GUIDE_TYPES = [
  { id: 'government', label: 'Government Certified Guide' },
  { id: 'private', label: 'Private Tourism Organization Guide' },
  { id: 'freelance', label: 'Freelance Professional Guide' },
  { id: 'community', label: 'Local Community Guide' },
];

export const VERIFICATION_BADGES = {
  government: 'Government Certified Guide',
  private: 'Verified Company Guide',
  freelance: 'Verified Freelance Guide',
  community: 'Verified Local Community Guide',
};

const P = 'https://images.pexels.com/photos';

export const guideRegistrationRequests = [
  {
    id: 'gr-001',
    fullName: 'Arjun Sharma',
    guideType: 'government',
    guideTypeLabel: 'Government Certified Guide',
    organization: 'Ministry of Tourism (Government of India)',
    mobile: '+91 98765 43210',
    email: 'arjun.sharma@example.com',
    experience: '8 years',
    languages: ['Hindi', 'English', 'French'],
    areasCovered: ['Agra', 'Mathura', 'Fatehpur Sikri'],
    specialization: 'Mughal History & Architecture',
    dailyCharges: '₹3,500',
    submittedDate: '2025-07-28',
    status: 'pending',
    profilePhoto: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200`,
    documents: [
      { name: 'Passport Photo', type: 'image', url: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Aadhaar Card', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Government Guide ID', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Government Guide Certificate', type: 'doc', url: '#' },
    ],
    adminComments: '',
  },
  {
    id: 'gr-002',
    fullName: 'Priya Menon',
    guideType: 'private',
    guideTypeLabel: 'Private Tourism Organization Guide',
    organization: 'Kerala Tourism Development Corporation',
    mobile: '+91 91234 56780',
    email: 'priya.menon@example.com',
    experience: '6 years',
    languages: ['Malayalam', 'English', 'Hindi'],
    areasCovered: ['Kochi', 'Munnar', 'Alappuzha'],
    specialization: 'Backwater & Cultural Tours',
    dailyCharges: '₹3,000',
    submittedDate: '2025-07-26',
    status: 'pending',
    profilePhoto: `${P}/3826678/pexels-photo-3826678.jpeg?auto=compress&cs=tinysrgb&w=200`,
    documents: [
      { name: 'Passport Photo', type: 'image', url: `${P}/3826678/pexels-photo-3826678.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Aadhaar Card', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Company ID', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Employment Letter', type: 'doc', url: '#' },
    ],
    adminComments: '',
  },
  {
    id: 'gr-003',
    fullName: 'Rohan Desai',
    guideType: 'freelance',
    guideTypeLabel: 'Freelance Professional Guide',
    organization: '—',
    mobile: '+91 99887 76655',
    email: 'rohan.desai@example.com',
    experience: '5 years',
    languages: ['Marathi', 'Hindi', 'English', 'German'],
    areasCovered: ['Mumbai', 'Pune', 'Lonavala'],
    specialization: 'Colonial Heritage & Food Walks',
    dailyCharges: '₹2,800',
    submittedDate: '2025-07-24',
    status: 'needs_info',
    profilePhoto: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200`,
    documents: [
      { name: 'Passport Photo', type: 'image', url: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Aadhaar Card', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Experience Certificate', type: 'doc', url: '#' },
    ],
    adminComments: 'Please upload a clearer copy of your Experience Certificate and add your First Aid Certificate.',
  },
  {
    id: 'gr-004',
    fullName: 'Kavya Reddy',
    guideType: 'community',
    guideTypeLabel: 'Local Community Guide',
    organization: '—',
    mobile: '+91 90011 22334',
    email: 'kavya.reddy@example.com',
    experience: '3 years',
    languages: ['Telugu', 'Hindi', 'English'],
    areasCovered: ['Araku Valley', 'Borra Caves'],
    specialization: 'Tribal Culture & Nature Trails',
    dailyCharges: '₹1,800',
    submittedDate: '2025-07-20',
    status: 'rejected',
    profilePhoto: `${P}/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200`,
    documents: [
      { name: 'Passport Photo', type: 'image', url: `${P}/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Aadhaar Card', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Panchayat Recommendation', type: 'doc', url: '#' },
    ],
    adminComments: 'Aadhaar card image is blurred. Please re-upload a clear copy and provide a valid Panchayat recommendation letter.',
  },
  {
    id: 'gr-005',
    fullName: 'Sanjay Iyer',
    guideType: 'government',
    guideTypeLabel: 'Government Certified Guide',
    organization: 'Archaeological Survey of India (ASI)',
    mobile: '+91 98300 11223',
    email: 'sanjay.iyer@example.com',
    experience: '12 years',
    languages: ['Tamil', 'English', 'Hindi', 'Spanish'],
    areasCovered: ['Mahabalipuram', 'Chennai', 'Kanchipuram'],
    specialization: 'Dravidian Temple Architecture',
    dailyCharges: '₹4,000',
    submittedDate: '2025-07-18',
    status: 'verified',
    profilePhoto: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200`,
    documents: [
      { name: 'Passport Photo', type: 'image', url: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Aadhaar Card', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Government Guide ID', type: 'image', url: `${P}/5474039/pexels-photo-5474039.jpeg?auto=compress&cs=tinysrgb&w=400` },
      { name: 'Government Guide Certificate', type: 'doc', url: '#' },
    ],
    adminComments: 'All documents verified. Welcome aboard!',
  },
];

export default guideRegistrationRequests;
