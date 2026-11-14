import { destinations } from '../data/destinations';
import { additionalDestinations } from '../data/additionalDestinations';
import { hiddenGems } from '../data/hiddenGems';
import categories from '../data/categories';
import states from '../data/states';
import { districts } from '../data/districts';
import { guidesData } from '../data/guides';
import { hotelsAndRestaurants } from '../data/hotelsAndRestaurants';
import { tripPlaces } from '../data/tripPlannerPlaces';

// Popular Searches configuration
export const POPULAR_SEARCHES = [
  'Temples',
  'Beaches',
  'Waterfalls',
  'Hill Stations',
  'Historical Places',
];

// Smart Alias & Synonym map for fast query expansion
const ALIAS_MAP = {
  temp: ['temple', 'temples', 'kanaka durga temple', 'tirupati', 'temple city', 'meenakshi', 'golden temple'],
  temple: ['temples', 'kanaka durga', 'tirupati', 'jagannath', 'kashi vishwanath'],
  viz: ['visakhapatnam', 'vizag', 'rk beach', 'kailasagiri', 'araku valley', 'rushikonda beach'],
  vizag: ['visakhapatnam', 'rk beach', 'kailasagiri', 'araku valley'],
  vskp: ['visakhapatnam', 'vizag'],
  water: ['waterfall', 'waterfalls', 'ethipothala falls', 'dudhsagar falls', 'talakona waterfalls', 'chitrakote falls', 'jog falls'],
  waterfall: ['waterfalls', 'ethipothala', 'dudhsagar', 'talakona', 'chitrakote'],
  taj: ['taj mahal', 'agra', 'taj khema', 'oberoi amarvilas'],
  goa: ['goa', 'gokarna beaches', 'calangute', 'dudhsagar', 'baga beach'],
  hill: ['hill stations', 'araku valley', 'khajjiar', 'munnar', 'ooty', 'shimla', 'darjeeling'],
  hills: ['hill stations', 'araku valley', 'khajjiar', 'munnar'],
  beach: ['beaches', 'gokarna beaches', 'rushikonda beach', 'yarada beach', 'marina beach', 'calangute beach'],
  beaches: ['gokarna', 'rushikonda', 'yarada', 'marina', 'calangute', 'radhanagar'],
  fort: ['historical places', 'amber fort', 'nahargarh fort', 'kondapalli fort', 'golconda fort', 'red fort'],
  palace: ['historical places', 'hawa mahal', 'rambagh palace', 'city palace', 'mysore palace'],
  gem: ['hidden gems', 'khajjiar', 'gokarna', 'talakona'],
  food: ['local food', 'restaurants', 'paradise biryani', 'chokhi dhani', 'pinch of spice', 'karavalli'],
};

// Build normalized unified search index
let cachedSearchIndex = null;

export function getSearchIndex() {
  if (cachedSearchIndex) return cachedSearchIndex;

  const items = [];
  const seenIds = new Set();

  // 1. Tourist Places (from destinations)
  destinations.forEach((d) => {
    if (seenIds.has(d.id)) return;
    seenIds.add(d.id);
    items.push({
      id: d.id,
      name: d.name,
      type: 'place',
      typeLabel: 'Known Place',
      category: d.category || 'heritage',
      categoryName: d.categoryName || 'Cultural Heritage',
      state: d.state || '',
      stateId: d.stateId || (d.state ? d.state.toLowerCase().replace(/\s+/g, '-') : ''),
      district: d.district || d.city || '',
      districtId: d.districtId || (d.district ? d.district.toLowerCase().replace(/\s+/g, '-') : ''),
      city: d.city || '',
      rating: d.rating || 4.5,
      price: d.entryFee || 'Free entry',
      priceValue: d.entryFee && d.entryFee.includes('₹') ? parseInt(d.entryFee.replace(/[^0-9]/g, '')) || 0 : 0,
      image: d.image || '',
      description: d.shortDescription || d.description || '',
      url: `/place/${d.id}`,
      searchKeywords: `${d.name} ${d.state} ${d.district} ${d.city} ${d.categoryName} ${d.shortDescription}`,
    });
  });

  // 2. Additional Destinations
  additionalDestinations.forEach((d) => {
    if (seenIds.has(d.id)) return;
    seenIds.add(d.id);
    items.push({
      id: d.id,
      name: d.name,
      type: 'place',
      typeLabel: 'Known Place',
      category: d.category || 'general',
      categoryName: d.categoryName || d.category || 'Tourist Place',
      state: d.state || '',
      stateId: d.stateId || '',
      district: d.district || d.city || '',
      districtId: d.districtId || '',
      city: d.city || '',
      rating: d.rating || 4.5,
      price: 'Free entry',
      priceValue: 0,
      image: d.image || '',
      description: d.shortDescription || '',
      url: `/explore/${d.stateId || 'all'}/${d.districtId || 'all'}/${d.category || 'all'}`,
      searchKeywords: `${d.name} ${d.state} ${d.district} ${d.city} ${d.categoryName} ${d.shortDescription}`,
    });
  });

  // 3. Trip Planner Places
  Object.entries(tripPlaces).forEach(([distKey, placesList]) => {
    placesList.forEach((p) => {
      if (seenIds.has(p.id)) return;
      seenIds.add(p.id);
      items.push({
        id: p.id,
        name: p.name,
        type: 'place',
        typeLabel: 'Known Place',
        category: p.categories ? p.categories[0] : 'general',
        categoryName: p.categories ? p.categories[0].toUpperCase() : 'Tourist Place',
        state: 'Andhra Pradesh', // default mapped state
        stateId: 'andhra-pradesh',
        district: distKey.charAt(0).toUpperCase() + distKey.slice(1),
        districtId: distKey,
        rating: p.rating || 4.5,
        price: 'Free',
        priceValue: 0,
        image: p.image || '',
        description: p.description || '',
        url: `/explore/andhra-pradesh/${distKey}`,
        searchKeywords: `${p.name} ${distKey} ${p.categories ? p.categories.join(' ') : ''} ${p.description}`,
      });
    });
  });

  // 4. Hidden Gems
  hiddenGems.forEach((g) => {
    if (seenIds.has(g.id)) return;
    seenIds.add(g.id);
    items.push({
      id: g.id,
      name: g.name,
      type: 'hidden_gem',
      typeLabel: 'Hidden Gem',
      category: g.category ? g.category.toLowerCase().replace(/\s+/g, '-') : 'hidden-gems',
      categoryName: g.category || 'Hidden Gem',
      state: g.state || '',
      stateId: g.state ? g.state.toLowerCase().replace(/\s+/g, '-') : '',
      district: g.district || '',
      districtId: g.district ? g.district.toLowerCase().replace(/\s+/g, '-') : '',
      rating: g.rating || 4.7,
      price: 'Free',
      priceValue: 0,
      image: g.image || '',
      description: g.description || '',
      url: `/hidden-gems`,
      searchKeywords: `${g.name} ${g.state} ${g.district} ${g.category} ${g.description} hidden gem`,
    });
  });

  // 5. Categories
  categories.forEach((c) => {
    if (seenIds.has(`cat-${c.id}`)) return;
    seenIds.add(`cat-${c.id}`);
    items.push({
      id: `cat-${c.id}`,
      name: c.name,
      type: 'category',
      typeLabel: 'Category',
      category: c.id,
      categoryName: c.name,
      state: 'All India',
      stateId: 'all',
      district: 'All Districts',
      districtId: 'all',
      rating: 4.9,
      price: '',
      priceValue: 0,
      image: c.image || '',
      description: `Explore ${c.count}+ destinations under ${c.name}`,
      url: `/categories`,
      searchKeywords: `${c.name} category tourism destinations ${c.id}`,
    });
  });

  // 6. States
  states.forEach((s) => {
    if (seenIds.has(`state-${s.id}`)) return;
    seenIds.add(`state-${s.id}`);
    items.push({
      id: `state-${s.id}`,
      name: s.name,
      type: 'state',
      typeLabel: 'State',
      category: 'state',
      categoryName: 'State Tourism',
      state: s.name,
      stateId: s.id,
      district: 'All Districts',
      districtId: 'all',
      rating: 4.8,
      price: '',
      priceValue: 0,
      image: s.image || '',
      description: `${s.touristPlaces} tourist attractions in ${s.name} (${s.region} India)`,
      url: `/explore/${s.id}`,
      searchKeywords: `${s.name} state ${s.capital} ${s.region} India`,
    });
  });

  // 7. Districts
  Object.entries(districts).forEach(([stateKey, distList]) => {
    const matchedState = states.find((st) => st.id === stateKey);
    const stateName = matchedState ? matchedState.name : stateKey.replace(/-/g, ' ');

    distList.forEach((d) => {
      const distUniqueId = `dist-${stateKey}-${d.id}`;
      if (seenIds.has(distUniqueId)) return;
      seenIds.add(distUniqueId);
      items.push({
        id: distUniqueId,
        name: d.name,
        type: 'district',
        typeLabel: 'District',
        category: 'district',
        categoryName: 'District Tourism',
        state: stateName,
        stateId: stateKey,
        district: d.name,
        districtId: d.id,
        rating: 4.7,
        price: '',
        priceValue: 0,
        image: d.image || '',
        description: `Explore ${d.touristPlaces} places in ${d.name} district, ${stateName}`,
        url: `/explore/${stateKey}/${d.id}`,
        searchKeywords: `${d.name} district ${stateName}`,
      });
    });
  });

  // 8. Guides
  guidesData.forEach((g) => {
    if (seenIds.has(`guide-${g.id}`)) return;
    seenIds.add(`guide-${g.id}`);
    items.push({
      id: `guide-${g.id}`,
      name: g.name,
      type: 'guide',
      typeLabel: 'Tour Guide',
      category: 'guide',
      categoryName: 'Certified Guide',
      state: g.stateName || '',
      stateId: g.stateId || '',
      district: g.districtName || '',
      districtId: g.districtId || '',
      rating: g.rating || 4.9,
      price: `₹${g.pricePerDay || 1500}/day`,
      priceValue: g.pricePerDay || 1500,
      image: g.photo || '',
      description: `${g.experience} yrs exp • Speaks ${g.languages ? g.languages.join(', ') : ''}`,
      url: `/guides`,
      searchKeywords: `${g.name} guide ${g.stateName} ${g.districtName} ${g.specialties ? g.specialties.join(' ') : ''} ${g.languages ? g.languages.join(' ') : ''}`,
    });
  });

  // 9. Hotels & Restaurants
  hotelsAndRestaurants.forEach((hr) => {
    if (seenIds.has(hr.id)) return;
    seenIds.add(hr.id);
    items.push({
      id: hr.id,
      name: hr.name,
      type: hr.type, // 'hotel' or 'restaurant'
      typeLabel: hr.type === 'hotel' ? 'Hotel' : 'Restaurant',
      category: hr.category,
      categoryName: hr.category,
      state: hr.state,
      stateId: hr.stateId,
      district: hr.district,
      districtId: hr.districtId,
      rating: hr.rating,
      price: hr.price,
      priceValue: hr.priceValue,
      image: hr.image,
      description: hr.description,
      url: `/search?q=${encodeURIComponent(hr.name)}`,
      searchKeywords: `${hr.name} ${hr.state} ${hr.district} ${hr.category} ${hr.description}`,
    });
  });

  cachedSearchIndex = items;
  return items;
}

/**
 * Filter items by raw query string and filter constraints
 */
export function searchItems(rawQuery = '', filters = {}) {
  const index = getSearchIndex();
  const query = rawQuery.trim().toLowerCase();

  const {
    state = 'all',
    district = 'all',
    category = 'all',
    type = 'all',
    minRating = 0,
    maxPrice = null,
  } = filters;

  if (!query && state === 'all' && district === 'all' && category === 'all' && type === 'all' && minRating === 0 && !maxPrice) {
    return [];
  }

  // Generate expanded tokens using Alias dictionary
  let expandedTerms = [query];
  if (query) {
    Object.entries(ALIAS_MAP).forEach(([aliasKey, targetTerms]) => {
      if (query.startsWith(aliasKey) || aliasKey.startsWith(query) || query.includes(aliasKey)) {
        expandedTerms.push(...targetTerms);
      }
    });
  }

  const results = [];

  for (const item of index) {
    // 1. Filter checks
    if (type !== 'all') {
      if (type === 'places' && item.type !== 'place') continue;
      if (type === 'hidden_gems' && item.type !== 'hidden_gem') continue;
      if (type === 'hotels' && item.type !== 'hotel') continue;
      if (type === 'restaurants' && item.type !== 'restaurant') continue;
      if (type === 'guides' && item.type !== 'guide') continue;
      if (type === 'categories' && item.type !== 'category') continue;
      if (type === 'states' && item.type !== 'state') continue;
      if (type === 'districts' && item.type !== 'district') continue;
      if (type !== 'places' && type !== 'hidden_gems' && type !== 'hotels' && type !== 'restaurants' && type !== 'guides' && type !== 'categories' && type !== 'states' && type !== 'districts' && item.type !== type) {
        continue;
      }
    }

    if (state !== 'all') {
      const stateMatch = item.stateId === state || item.state.toLowerCase() === state.toLowerCase();
      if (!stateMatch && item.type !== 'category') continue;
    }

    if (district !== 'all') {
      const distMatch = item.districtId === district || item.district.toLowerCase() === district.toLowerCase();
      if (!distMatch && item.type !== 'category' && item.type !== 'state') continue;
    }

    if (category !== 'all') {
      const catMatch = item.category === category || item.categoryName.toLowerCase() === category.toLowerCase();
      if (!catMatch) continue;
    }

    if (minRating > 0 && item.rating < minRating) {
      continue;
    }

    if (maxPrice !== null && maxPrice > 0 && item.priceValue > 0 && item.priceValue > maxPrice) {
      continue;
    }

    // 2. Query Match logic
    if (!query) {
      results.push({ item, score: 10 });
      continue;
    }

    const itemNameLower = item.name.toLowerCase();
    const itemKwLower = item.searchKeywords.toLowerCase();

    let score = 0;

    // Exact or StartsWith name match
    if (itemNameLower === query) {
      score += 100;
    } else if (itemNameLower.startsWith(query)) {
      score += 80;
    } else if (itemNameLower.includes(query)) {
      score += 60;
    } else if (itemKwLower.includes(query)) {
      score += 40;
    } else {
      // Check expanded alias terms
      const aliasHit = expandedTerms.some((term) => itemNameLower.includes(term) || itemKwLower.includes(term));
      if (aliasHit) {
        score += 30;
      }
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort by match score descending, then rating
  results.sort((a, b) => b.score - a.score || (b.item.rating || 0) - (a.item.rating || 0));

  return results.map((r) => r.item);
}

/**
 * Spring Boot API ready asynchronous search facade wrapper
 */
export async function performSearchApi(query, filters = {}) {
  // Can switch to fetch('/api/v1/search?q=...') when backend is deployed
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(searchItems(query, filters));
    }, 10);
  });
}

/**
 * Recent Searches LocalStorage Helpers
 */
const RECENT_SEARCHES_KEY = 'explore_india_recent_searches';

export function getRecentSearches() {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(term) {
  if (!term || !term.trim()) return;
  const clean = term.trim();
  try {
    let recent = getRecentSearches();
    recent = recent.filter((item) => item.toLowerCase() !== clean.toLowerCase());
    recent.unshift(clean);
    recent = recent.slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
  } catch (err) {
    console.error('Failed to save recent search:', err);
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (err) {
    console.error('Failed to clear recent searches:', err);
  }
}

/**
 * Substring highlight calculation helper for suggestion labels
 */
export function getHighlightedTextParts(text = '', query = '') {
  if (!query || !text) return [{ text, match: false }];

  const parts = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();

  let startIndex = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, startIndex);

  while (matchIndex !== -1) {
    if (matchIndex > startIndex) {
      parts.push({
        text: text.substring(startIndex, matchIndex),
        match: false,
      });
    }
    parts.push({
      text: text.substring(matchIndex, matchIndex + lowerQuery.length),
      match: true,
    });
    startIndex = matchIndex + lowerQuery.length;
    matchIndex = lowerText.indexOf(lowerQuery, startIndex);
  }

  if (startIndex < text.length) {
    parts.push({
      text: text.substring(startIndex),
      match: false,
    });
  }

  return parts;
}
