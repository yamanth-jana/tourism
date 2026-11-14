/**
 * Local guides data for Explore India — structured by state and district.
 *
 * Shape designed for future Spring Boot + MySQL integration:
 *   guides table: id, name, photo, languages[], experience, rating, reviews,
 *                 specialties[], guideType, availability, pricePerHour, pricePerDay,
 *                 bio, stateId, stateName, districtId, districtName, contactPhone
 *
 * Until the backend is connected, this module acts as the data source.
 * A single helper, getGuidesForLocation(stateId, districtId), returns guides
 * for the selected district first, then nearby districts in the same state.
 */

export const GUIDE_TYPES = [
  { id: 'temple', label: 'Temple Guide', icon: '🏰' },
  { id: 'heritage', label: 'Heritage Guide', icon: '🏛️' },
  { id: 'adventure', label: 'Adventure Guide', icon: '🧗' },
  { id: 'wildlife', label: 'Wildlife Guide', icon: '🦌' },
  { id: 'trekking', label: 'Trekking Guide', icon: '🥾' },
  { id: 'beach', label: 'Beach Guide', icon: '🏖️' },
  { id: 'food', label: 'Food Tour Guide', icon: '🍽️' },
  { id: 'cultural', label: 'Cultural Guide', icon: '🎭' },
];

export const AVAILABILITY = {
  available: { label: 'Available', dot: '🟢', color: 'success' },
  busy: { label: 'Busy', dot: '🟡', color: 'accent' },
  offline: { label: 'Offline', dot: '🔴', color: 'error' },
};

const P = 'https://images.pexels.com/photos';

export const guidesData = [
  // --- Andhra Pradesh ---
  {
    id: 'guide-ap-vskp-1', name: 'Ravi Kumar', stateId: 'andhra-pradesh', stateName: 'Andhra Pradesh',
    districtId: 'visakhapatnam', districtName: 'Visakhapatnam',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Telugu', 'English', 'Hindi'], experience: 12, rating: 4.9, reviews: 342,
    specialties: ['Temples', 'Beaches', 'Naval Museum'], guideType: 'temple',
    availability: 'available', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Certified local guide with deep knowledge of Visakhapatnam temples, beaches, and naval history.',
    contactPhone: '+91 90000 10001',
  },
  {
    id: 'guide-ap-vskp-2', name: 'Lakshmi Prasad', stateId: 'andhra-pradesh', stateName: 'Andhra Pradesh',
    districtId: 'visakhapatnam', districtName: 'Visakhapatnam',
    photo: `${P}/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Telugu', 'English'], experience: 8, rating: 4.7, reviews: 156,
    specialties: ['Araku Valley', 'Trekking', 'Waterfalls'], guideType: 'trekking',
    availability: 'busy', pricePerHour: 350, pricePerDay: 2800,
    bio: 'Adventure specialist covering Araku Valley, Borra Caves, and Eastern Ghats treks.',
    contactPhone: '+91 90000 10002',
  },
  {
    id: 'guide-ap-vskp-3', name: 'Suresh Naidu', stateId: 'andhra-pradesh', stateName: 'Andhra Pradesh',
    districtId: 'visakhapatnam', districtName: 'Visakhapatnam',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Telugu', 'English', 'Hindi'], experience: 10, rating: 4.8, reviews: 198,
    specialties: ['Beaches', 'Water Sports', 'Coastal Cuisine'], guideType: 'beach',
    availability: 'available', pricePerHour: 250, pricePerDay: 2000,
    bio: 'Beach and coastal food expert covering Rushikonda, Ramakrishna, and Bheemili beaches.',
    contactPhone: '+91 90000 10003',
  },
  {
    id: 'guide-ap-chittoor-1', name: 'Venkatesh Rao', stateId: 'andhra-pradesh', stateName: 'Andhra Pradesh',
    districtId: 'chittoor', districtName: 'Chittoor',
    photo: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Telugu', 'English', 'Tamil', 'Hindi'], experience: 15, rating: 5.0, reviews: 512,
    specialties: ['Tirumala Temple', 'Heritage', 'Pilgrimage Tours'], guideType: 'temple',
    availability: 'available', pricePerHour: 400, pricePerDay: 3500,
    bio: 'Senior temple guide specializing in Tirumala Venkateswara Swamy Temple and nearby pilgrimage sites.',
    contactPhone: '+91 90000 10004',
  },
  {
    id: 'guide-ap-krishna-1', name: 'Krishna Murthy', stateId: 'andhra-pradesh', stateName: 'Andhra Pradesh',
    districtId: 'krishna', districtName: 'Krishna',
    photo: `${P}/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Telugu', 'English'], experience: 9, rating: 4.6, reviews: 142,
    specialties: ['Vijayawada Temples', 'Riverfront', 'Cultural Tours'], guideType: 'cultural',
    availability: 'busy', pricePerHour: 280, pricePerDay: 2200,
    bio: 'Cultural guide for Vijayawada Kanaka Durga Temple and Krishna riverfront heritage.',
    contactPhone: '+91 90000 10005',
  },

  // --- Kerala ---
  {
    id: 'guide-kl-ern-1', name: 'Anand Menon', stateId: 'kerala', stateName: 'Kerala',
    districtId: 'ernakulam', districtName: 'Ernakulam',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Malayalam', 'English', 'Hindi'], experience: 11, rating: 4.9, reviews: 287,
    specialties: ['Backwaters', 'Fort Kochi', 'Cultural Tours'], guideType: 'cultural',
    availability: 'available', pricePerHour: 350, pricePerDay: 3000,
    bio: 'Kerala backwaters and Fort Kochi heritage specialist with deep cultural knowledge.',
    contactPhone: '+91 91000 20001',
  },
  {
    id: 'guide-kl-idk-1', name: 'Joseph Mathew', stateId: 'kerala', stateName: 'Kerala',
    districtId: 'idukki', districtName: 'Idukki',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Malayalam', 'English'], experience: 8, rating: 4.8, reviews: 176,
    specialties: ['Munnar Tea Gardens', 'Wildlife', 'Trekking'], guideType: 'wildlife',
    availability: 'available', pricePerHour: 320, pricePerDay: 2600,
    bio: 'Munnar hills and Eravikulam wildlife sanctuary guide for nature and trekking tours.',
    contactPhone: '+91 91000 20002',
  },
  {
    id: 'guide-kl-alp-1', name: 'Thomas Varghese', stateId: 'kerala', stateName: 'Kerala',
    districtId: 'alappuzha', districtName: 'Alappuzha',
    photo: `${P}/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Malayalam', 'English', 'Hindi'], experience: 13, rating: 4.9, reviews: 324,
    specialties: ['Houseboats', 'Backwaters', 'Beaches'], guideType: 'beach',
    availability: 'busy', pricePerHour: 380, pricePerDay: 3200,
    bio: 'Alappuzha backwater houseboat and beach tours expert with 13 years of experience.',
    contactPhone: '+91 91000 20003',
  },

  // --- Tamil Nadu ---
  {
    id: 'guide-tn-mdr-1', name: 'Meera Iyer', stateId: 'tamil-nadu', stateName: 'Tamil Nadu',
    districtId: 'madurai', districtName: 'Madurai',
    photo: `${P}/3826678/pexels-photo-3826678.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Tamil', 'English', 'Hindi'], experience: 9, rating: 4.9, reviews: 289,
    specialties: ['Meenakshi Temple', 'Dravidian Architecture', 'Cultural Tours'], guideType: 'temple',
    availability: 'available', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Expert in Dravidian temple architecture and Madurai cultural heritage tours.',
    contactPhone: '+91 92000 30001',
  },
  {
    id: 'guide-tn-chn-1', name: 'Karthik Subramanian', stateId: 'tamil-nadu', stateName: 'Tamil Nadu',
    districtId: 'chennai', districtName: 'Chennai',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Tamil', 'English', 'Telugu'], experience: 7, rating: 4.7, reviews: 168,
    specialties: ['Marina Beach', 'Museums', 'Food Tours'], guideType: 'food',
    availability: 'available', pricePerHour: 280, pricePerDay: 2200,
    bio: 'Chennai food and cultural guide covering Marina Beach, museums, and South Indian cuisine.',
    contactPhone: '+91 92000 30002',
  },

  // --- Rajasthan ---
  {
    id: 'guide-rj-jp-1', name: 'Vikram Singh', stateId: 'rajasthan', stateName: 'Rajasthan',
    districtId: 'jaipur', districtName: 'Jaipur',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Hindi', 'English', 'French'], experience: 8, rating: 4.8, reviews: 218,
    specialties: ['Forts & Palaces', 'Heritage', 'Bazaars'], guideType: 'heritage',
    availability: 'available', pricePerHour: 350, pricePerDay: 2800,
    bio: 'Rajasthan-born guide passionate about Rajput history, forts, and local culture.',
    contactPhone: '+91 93000 40001',
  },
  {
    id: 'guide-rj-udr-1', name: 'Mohan Lal', stateId: 'rajasthan', stateName: 'Rajasthan',
    districtId: 'udaipur', districtName: 'Udaipur',
    photo: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Hindi', 'English', 'German'], experience: 10, rating: 4.9, reviews: 234,
    specialties: ['Lake Palaces', 'Heritage Walks', 'Cultural Tours'], guideType: 'heritage',
    availability: 'busy', pricePerHour: 380, pricePerDay: 3000,
    bio: 'Udaipur lake palace and heritage walk specialist with deep knowledge of Mewar history.',
    contactPhone: '+91 93000 40002',
  },

  // --- Uttar Pradesh ---
  {
    id: 'guide-up-agra-1', name: 'Rajesh Kumar', stateId: 'uttar-pradesh', stateName: 'Uttar Pradesh',
    districtId: 'agra', districtName: 'Agra',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['English', 'Hindi', 'Spanish'], experience: 12, rating: 4.9, reviews: 342,
    specialties: ['Taj Mahal', 'Mughal Architecture', 'Heritage'], guideType: 'heritage',
    availability: 'available', pricePerHour: 400, pricePerDay: 3500,
    bio: 'Certified ASI guide with deep knowledge of Mughal history and architecture.',
    contactPhone: '+91 94000 50001',
  },
  {
    id: 'guide-up-varanasi-1', name: 'Pandit Ramesh', stateId: 'uttar-pradesh', stateName: 'Uttar Pradesh',
    districtId: 'varanasi', districtName: 'Varanasi',
    photo: `${P}/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Hindi', 'English', 'Sanskrit'], experience: 14, rating: 4.9, reviews: 298,
    specialties: ['Ghats', 'Temples', 'Spiritual Tours'], guideType: 'temple',
    availability: 'available', pricePerHour: 350, pricePerDay: 2800,
    bio: 'Varanasi spiritual guide covering ghats, temples, and Ganga Aarti ceremonies.',
    contactPhone: '+91 94000 50002',
  },

  // --- Karnataka ---
  {
    id: 'guide-ka-mys-1', name: 'Anil Reddy', stateId: 'karnataka', stateName: 'Karnataka',
    districtId: 'mysuru', districtName: 'Mysuru',
    photo: `${P}/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Kannada', 'English', 'Hindi'], experience: 10, rating: 4.7, reviews: 187,
    specialties: ['Mysore Palace', 'Heritage', 'Wildlife'], guideType: 'heritage',
    availability: 'busy', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Mysore palace and heritage specialist covering Karnataka cultural sites.',
    contactPhone: '+91 95000 60001',
  },
  {
    id: 'guide-ka-hampi-1', name: 'Deepak Gowda', stateId: 'karnataka', stateName: 'Karnataka',
    districtId: 'hampi', districtName: 'Bellary',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Kannada', 'English', 'Telugu'], experience: 9, rating: 4.8, reviews: 203,
    specialties: ['Hampi Ruins', 'Vijayanagara Empire', 'Heritage'], guideType: 'heritage',
    availability: 'available', pricePerHour: 320, pricePerDay: 2600,
    bio: 'Hampi ruins and Vijayanagara empire heritage guide with archaeological expertise.',
    contactPhone: '+91 95000 60002',
  },

  // --- Goa ---
  {
    id: 'guide-ga-ng-1', name: 'Sergio Dsouza', stateId: 'goa', stateName: 'Goa',
    districtId: 'north-goa', districtName: 'North Goa',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Konkani', 'English', 'Hindi', 'Portuguese'], experience: 11, rating: 4.8, reviews: 256,
    specialties: ['Beaches', 'Portuguese Heritage', 'Food Tours'], guideType: 'beach',
    availability: 'available', pricePerHour: 350, pricePerDay: 3000,
    bio: 'Goan beach and Portuguese heritage guide covering North Goa beaches and cuisine.',
    contactPhone: '+91 96000 70001',
  },

  // --- Punjab ---
  {
    id: 'guide-pb-asr-1', name: 'Gurpreet Kaur', stateId: 'punjab', stateName: 'Punjab',
    districtId: 'amritsar', districtName: 'Amritsar',
    photo: `${P}/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Punjabi', 'Hindi', 'English'], experience: 6, rating: 4.8, reviews: 156,
    specialties: ['Golden Temple', 'Sikh Heritage', 'Food Tours'], guideType: 'temple',
    availability: 'available', pricePerHour: 250, pricePerDay: 2000,
    bio: 'Amritsar local guide specializing in Sikh history and Golden Temple tours.',
    contactPhone: '+91 97000 80001',
  },

  // --- Maharashtra ---
  {
    id: 'guide-mh-mum-1', name: 'Amit Patel', stateId: 'maharashtra', stateName: 'Maharashtra',
    districtId: 'mumbai-suburban', districtName: 'Mumbai Suburban',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Marathi', 'Hindi', 'English'], experience: 9, rating: 4.7, reviews: 189,
    specialties: ['Colonial Heritage', 'Bollywood', 'Food Tours'], guideType: 'cultural',
    availability: 'available', pricePerHour: 320, pricePerDay: 2800,
    bio: 'Mumbai city guide covering colonial heritage, Bollywood, and street food tours.',
    contactPhone: '+91 98000 90001',
  },

  // --- West Bengal ---
  {
    id: 'guide-wb-kol-1', name: 'Soumitra Banerjee', stateId: 'west-bengal', stateName: 'West Bengal',
    districtId: 'kolkata', districtName: 'Kolkata',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Bengali', 'Hindi', 'English'], experience: 12, rating: 4.8, reviews: 234,
    specialties: ['Colonial Architecture', 'Museums', 'Cultural Tours'], guideType: 'cultural',
    availability: 'available', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Kolkata heritage guide specializing in colonial architecture and cultural walks.',
    contactPhone: '+91 99001 10001',
  },
  {
    id: 'guide-wb-dar-1', name: 'Tashi Norbu', stateId: 'west-bengal', stateName: 'West Bengal',
    districtId: 'darjeeling', districtName: 'Darjeeling',
    photo: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Nepali', 'Hindi', 'English', 'Tibetan'], experience: 7, rating: 4.7, reviews: 134,
    specialties: ['Himalayan Treks', 'Tea Gardens', 'Toy Train'], guideType: 'trekking',
    availability: 'available', pricePerHour: 380, pricePerDay: 3200,
    bio: 'Mountain guide for Darjeeling Himalayan treks, tea gardens, and toy train heritage.',
    contactPhone: '+91 99001 10002',
  },

  // --- Uttarakhand ---
  {
    id: 'guide-uk-rud-1', name: 'Hemant Rawat', stateId: 'uttarakhand', stateName: 'Uttarakhand',
    districtId: 'rudraprayag', districtName: 'Rudraprayag',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Garhwali', 'Hindi', 'English'], experience: 10, rating: 4.9, reviews: 178,
    specialties: ['Char Dham', 'Trekking', 'Pilgrimage'], guideType: 'trekking',
    availability: 'busy', pricePerHour: 400, pricePerDay: 3500,
    bio: 'Char Dham pilgrimage and Himalayan trekking guide for Rudraprayag and Kedarnath routes.',
    contactPhone: '+91 99111 20001',
  },

  // --- Himachal Pradesh ---
  {
    id: 'guide-hp-kullu-1', name: 'Devendra Thakur', stateId: 'himachal-pradesh', stateName: 'Himachal Pradesh',
    districtId: 'kullu', districtName: 'Kullu',
    photo: `${P}/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Hindi', 'Pahari', 'English'], experience: 8, rating: 4.8, reviews: 167,
    specialties: ['Adventure Sports', 'Trekking', 'Valleys'], guideType: 'adventure',
    availability: 'available', pricePerHour: 350, pricePerDay: 3000,
    bio: 'Kullu Valley adventure and trekking guide covering Manali, Solang, and Parvati Valley.',
    contactPhone: '+91 99222 30001',
  },

  // --- Gujarat ---
  {
    id: 'guide-gj-ahm-1', name: 'Hardik Patel', stateId: 'gujarat', stateName: 'Gujarat',
    districtId: 'ahmedabad', districtName: 'Ahmedabad',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Gujarati', 'Hindi', 'English'], experience: 9, rating: 4.7, reviews: 145,
    specialties: ['Heritage Walks', 'Sabarmati', 'Textiles'], guideType: 'heritage',
    availability: 'available', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Ahmedabad heritage walk guide covering old city, Sabarmati Ashram, and textile museums.',
    contactPhone: '+91 99333 40001',
  },

  // --- Madhya Pradesh ---
  {
    id: 'guide-mp-bpl-1', name: 'Suresh Choudhary', stateId: 'madhya-pradesh', stateName: 'Madhya Pradesh',
    districtId: 'bhopal', districtName: 'Bhopal',
    photo: `${P}/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Hindi', 'English'], experience: 11, rating: 4.8, reviews: 198,
    specialties: ['Sanchi Stupa', 'Bhimbetka', 'Wildlife'], guideType: 'wildlife',
    availability: 'available', pricePerHour: 320, pricePerDay: 2700,
    bio: 'Bhopal region guide covering Sanchi Stupa, Bhimbetka caves, and Satpura wildlife.',
    contactPhone: '+91 99444 50001',
  },

  // --- Odisha ---
  {
    id: 'guide-od-puri-1', name: 'Bibhuti Das', stateId: 'odisha', stateName: 'Odisha',
    districtId: 'puri', districtName: 'Puri',
    photo: `${P}/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300`,
    languages: ['Odia', 'Hindi', 'English'], experience: 10, rating: 4.8, reviews: 212,
    specialties: ['Jagannath Temple', 'Beaches', 'Konark'], guideType: 'temple',
    availability: 'available', pricePerHour: 300, pricePerDay: 2500,
    bio: 'Puri Jagannath Temple and Konark Sun Temple guide with deep spiritual heritage knowledge.',
    contactPhone: '+91 99555 60001',
  },
];

/**
 * Returns guides for a location, ordered: selected district first,
 * then nearby districts in the same state.
 *
 * @param {string} stateId
 * @param {string} districtId
 * @returns {Array}
 */
export function getGuidesForLocation(stateId, districtId) {
  if (!stateId) return [];
  const inState = guidesData.filter((g) => g.stateId === stateId);
  if (!districtId) return inState;
  const inDistrict = inState.filter((g) => g.districtId === districtId);
  const nearby = inState.filter((g) => g.districtId !== districtId);
  return [...inDistrict, ...nearby];
}

/**
 * Returns guides for a specific place, based on its state and district.
 * Used by PlaceDetails to show "Nearby Guides" automatically.
 *
 * @param {string} stateId
 * @param {string} districtId
 * @param {number} limit
 * @returns {Array}
 */
export function getNearbyGuidesForPlace(stateId, districtId, limit = 3) {
  return getGuidesForLocation(stateId, districtId).slice(0, limit);
}

/**
 * Returns all unique languages across guides, for filter UI.
 */
export function getAllLanguages() {
  const set = new Set();
  guidesData.forEach((g) => g.languages.forEach((l) => set.add(l)));
  return [...set].sort();
}

export default guidesData;
