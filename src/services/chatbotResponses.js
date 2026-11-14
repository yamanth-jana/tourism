/**
 * Frontend dummy response generator for the AI Travel Assistant.
 *
 * Each function returns a string (or array of strings for multi-line).
 * When a Spring Boot backend is connected, replace `generateResponse`
 * with an async API call — the component layer won't need changes.
 */

import { INTENTS, matchIntent } from './intentMatcher';
import destinations from '../data/destinations';
import faqData from '../data/faqData';
import { getGuidesForLocation, GUIDE_TYPES } from '../data/guides';

const UNKNOWN_RESPONSE =
  "I'm still learning. This information will be available after connecting with the backend database.";

function pickPlaceName(entities) {
  return entities?.place?.name || 'this place';
}

function pickPlace(entities) {
  return entities?.place || null;
}

const GREETING_RESPONSES = {
  [INTENTS.GREETING_HELLO]:
    'Hello! I\'m your AI Travel Assistant for Explore India. Ask me about tourist places, travel info, hidden gems, or plan your next trip!',
  [INTENTS.GREETING_HI]:
    'Hi there! I can help you discover amazing destinations across India. What are you interested in — beaches, temples, hill stations, or historical sites?',
  [INTENTS.GREETING_MORNING]:
    'Good morning! Ready to explore India? Tell me what kind of destination you\'re looking for and I\'ll point you in the right direction.',
  [INTENTS.GREETING_EVENING]:
    'Good evening! How can I help you explore India today? Ask me about any place, travel tips, or nearby attractions.',
  [INTENTS.THANK_YOU]:
    'You\'re welcome! Feel free to ask me anything else about exploring India. I\'m always here to help.',
  [INTENTS.BYE]:
    'Goodbye! Have a wonderful trip exploring India. Come back anytime you need travel assistance!',
  [INTENTS.HELP]:
    'I can help you with:\n• Tourist information about places\n• Travel directions & transport\n• Visiting hours, entry fees & timings\n• Nearby attractions, hotels & restaurants\n• Reviews & ratings\n• Hidden gems & recommendations\n• Trip planning & travel tips\n\nJust ask me in natural language, or tap a suggestion chip below!',
};

function buildFaqResponse() {
  const items = faqData.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  return `Here are some frequently asked questions:\n\n${items}\n\nFeel free to ask me anything else!`;
}

function buildPlanTripResponse() {
  return [
    'I\'d love to help you plan a trip! Here\'s how we can start:',
    '',
    '1. Tell me your interests — beaches, temples, hill stations, historical sites, wildlife, or adventure.',
    '2. Tell me how many days you have.',
    '3. Tell me your starting point or preferred state.',
    '',
    'Based on that, I can recommend destinations, nearby attractions, hotels, and travel tips. You can also use the Smart Trip Planner — select State, District, Trip Type, and Days to generate a complete itinerary automatically!',
    '',
    'Visit the Trip Planner page to generate your itinerary now.',
  ].join('\n');
}

function buildPlanTripDaysResponse() {
  return [
    'Great! I can help you plan a multi-day trip. Here\'s what I recommend:',
    '',
    'For a 1-day trip: Pick one district and visit 3-4 top-rated places nearby.',
    'For a 2-day trip: Cover 5-6 places across two days with lunch and evening activities.',
    'For a 3-day trip: Explore 8-9 places with a mix of heritage, nature, and local culture.',
    'For a 5-day trip: A comprehensive tour covering 12-15 places with rest days.',
    '',
    'Use the Smart Trip Planner to select your State, District, Trip Type, and Days — it will automatically generate a day-by-day itinerary with nearby attractions grouped together!',
  ].join('\n');
}

function buildTravelTipsResponse() {
  return [
    'Here are some essential travel tips for exploring India:',
    '',
    '• Carry valid ID proof — many monuments require it for entry.',
    '• Dress modestly when visiting temples and religious sites.',
    '• Stay hydrated, especially during summer (April–June).',
    '• Book train tickets early via IRCTC — they sell out fast.',
    '• Use registered guides at monuments for authentic information.',
    '• Keep emergency numbers handy: Police 100, Ambulance 108, Tourist Helpline 1363.',
    '• Bargain respectfully at local markets.',
    '• Try local cuisine — each state has unique specialties!',
  ].join('\n');
}

function buildPopularPlacesResponse() {
  const top = destinations.filter((d) => d.topRated).slice(0, 6);
  const list = top.map((d, i) => `${i + 1}. ${d.name} — ${d.city}, ${d.state} (★ ${d.rating})`).join('\n');
  return `Here are some of the most popular destinations on Explore India:\n\n${list}\n\nTap any destination card to see full details, photos, reviews, and more!`;
}

function buildRecommendationResponse(categoryLabel, filterFn) {
  const matches = destinations.filter(filterFn).slice(0, 5);
  if (matches.length === 0) return `I couldn't find any ${categoryLabel.toLowerCase()} right now. Try exploring the Categories page for more options!`;
  const list = matches.map((d, i) => `${i + 1}. ${d.name} — ${d.city}, ${d.state} (★ ${d.rating})`).join('\n');
  return `Here are some ${categoryLabel} I recommend:\n\n${list}\n\nWould you like more details about any of these?`;
}

/**
 * Build a response for a place-specific intent.
 * If we have full data on the place, use it; otherwise use a template.
 */
function buildPlaceResponse(intent, entities) {
  const place = pickPlace(entities);
  const name = pickPlaceName(entities);
  const hasFull = place && place.description;

  switch (intent) {
    case INTENTS.LOCATION:
      if (place) return `${name} is located in ${place.city}, ${place.state}${place.district ? ', in the ${place.district} district' : ''}. You can find it on the Explore page under ${place.state} → ${place.district || place.city}.`;
      return `${name} is a beautiful destination in India. Once connected to the backend database, I can provide exact location coordinates and address details.`;

    case INTENTS.WHY_FAMOUS:
      if (place) return `${name} is famous for ${place.shortDescription.toLowerCase()}${place.categoryName ? ` It's categorized as a ${place.categoryName} destination.` : ''}${place.topRated ? ' It\'s one of our top-rated places!' : ''}`;
      return `${name} is a renowned destination. I can provide detailed information about why it's famous once the backend database is connected.`;

    case INTENTS.TELL_ME_ABOUT:
      if (place) return `${name}: ${place.shortDescription}${place.rating ? ` It has a rating of ${place.rating} stars from ${place.reviewsCount?.toLocaleString() || 'many'} reviews.` : ''}${place.bestTimeToVisit ? ` The best time to visit is ${place.bestTimeToVisit}.` : ''}`;
      return `I'd love to tell you about ${name}! Detailed information will be available once the backend database is connected. For now, you can search for it on the Explore page.`;

    case INTENTS.HISTORY:
      if (hasFull && place.history) return `${name} — History:\n\n${place.history}`;
      if (place) return `${name} is located in ${place.city}, ${place.state}. Detailed historical background will be available after connecting with the backend database.`;
      return `The historical background of ${name} will be available after connecting with the backend database.`;

    case INTENTS.CULTURAL_SIGNIFICANCE:
      if (hasFull && place.culturalImportance) return `${name} — Cultural Significance:\n\n${place.culturalImportance}`;
      if (place) return `${name} holds cultural importance in ${place.state}. More detailed information about its cultural significance will be available after connecting with the backend database.`;
      return `The cultural significance of ${name} will be available after connecting with the backend database.`;

    case INTENTS.WHEN_BUILT:
      if (hasFull && place.history && /built|constructed|century|year/i.test(place.history)) {
        const match = place.history.match(/(built|constructed|established)[^.]*\d{3,4}[^.]*/i);
        if (match) return `${name}: ${match[0]}.`;
      }
      return `The construction date of ${name} will be available after connecting with the backend database.`;

    case INTENTS.WHO_BUILT:
      if (hasFull && place.history) {
        const match = place.history.match(/(built by|constructed by|commissioned by|ordered by)[^.]*([.])/i);
        if (match) return `${name} was ${match[0].trim()}`;
      }
      return `Information about who built ${name} will be available after connecting with the backend database.`;

    case INTENTS.WHY_VISIT:
      if (place) return `You should visit ${name} because ${place.shortDescription.toLowerCase()}${place.trending ? " It's currently trending among travelers!" : ''}${place.rating ? ` With a ${place.rating}-star rating, it's highly recommended by visitors.` : ''}`;
      return `${name} is a wonderful destination to visit. I can provide specific reasons to visit once the backend database is connected.`;

    // --- Travel ---
    case INTENTS.HOW_TO_REACH:
      return `To reach ${name}, you can travel by air, rail, or road. The nearest airport and railway station details will be available after connecting with the backend database. For now, check the destination's details page for coordinates.`;

    case INTENTS.DIRECTIONS:
      return `I can show you directions to ${name}! Once Google Maps integration is live, I'll open turn-by-turn navigation. For now, visit the destination's details page for location coordinates.`;

    case INTENTS.GOOGLE_MAPS:
      return `Google Maps integration is coming soon! Once connected, I'll be able to open ${name} directly in Google Maps with turn-by-turn directions. For now, you can find coordinates on the destination's details page.`;

    case INTENTS.NEAREST_RAILWAY:
      return `The nearest railway station to ${name} will be displayed here once the backend database is connected. Generally, major destinations are well-connected by Indian Railways.`;

    case INTENTS.NEAREST_AIRPORT:
      return `The nearest airport to ${name} will be available after connecting with the backend database. Most popular tourist destinations in India are within 100-200 km of a domestic airport.`;

    case INTENTS.NEAREST_BUS:
      return `The nearest bus station to ${name} will be available after connecting with the backend database. State transport corporations generally connect major tourist spots.`;

    case INTENTS.PARKING:
      return `Parking availability at ${name} will be listed once the backend database is connected. Most tourist destinations in India have designated parking areas, though they may charge a small fee.`;

    case INTENTS.PUBLIC_TRANSPORT:
      return `Public transport options to ${name} will be detailed after connecting with the backend database. Many destinations are accessible via local buses, auto-rickshaws, and taxis.`;

    // --- Visiting Info ---
    case INTENTS.OPENING_TIME:
      if (place?.openingTime && place.openingTime !== 'N/A') return `${name} opens at ${place.openingTime}.`;
      return `The opening time for ${name} will be available after connecting with the backend database. Most monuments in India open around 6:00 AM or 9:00 AM.`;

    case INTENTS.CLOSING_TIME:
      if (place?.closingTime && place.closingTime !== 'N/A') return `${name} closes at ${place.closingTime}.`;
      return `The closing time for ${name} will be available after connecting with the backend database. Most monuments in India close around 6:00 PM or 7:00 PM.`;

    case INTENTS.ENTRY_FEE:
      if (place?.entryFee && place.entryFee !== 'N/A') return `The entry fee for ${name} is ${place.entryFee}.`;
      return `The entry fee for ${name} will be available after connecting with the backend database. ASI monuments typically charge ₹20-40 for Indians and ₹250-600 for foreigners.`;

    case INTENTS.BEST_TIME:
      if (place?.bestTimeToVisit) return `The best time to visit ${name} is ${place.bestTimeToVisit}.`;
      return `The best time to visit ${name} will be available after connecting with the backend database. Generally, October to March is ideal for most Indian destinations.`;

    case INTENTS.VISITING_DURATION:
      return `The average visiting duration for ${name} will be available after connecting with the backend database. Most destinations take 1-3 hours to explore thoroughly.`;

    case INTENTS.FACILITIES:
      if (hasFull && place.facilities?.length) return `${name} offers these facilities: ${place.facilities.join(', ')}.`;
      return `Facility information for ${name} will be available after connecting with the backend database.`;

    case INTENTS.RESTAURANTS_NEARBY:
      if (hasFull && place.nearbyRestaurants?.length) {
        const list = place.nearbyRestaurants.map((r) => `• ${r.name} (★ ${r.rating}) — ${r.cuisine}`).join('\n');
        return `Here are some restaurants near ${name}:\n\n${list}`;
      }
      return `Restaurants near ${name} will be listed after connecting with the backend database. Most tourist areas have local eateries and restaurants nearby.`;

    case INTENTS.HOTELS_NEARBY:
      if (hasFull && place.nearbyHotels?.length) {
        const list = place.nearbyHotels.map((h) => `• ${h.name} (★ ${h.rating}) — ${h.price}`).join('\n');
        return `Here are some hotels near ${name}:\n\n${list}`;
      }
      return `Hotels near ${name} will be listed after connecting with the backend database. You can find options ranging from budget stays to luxury resorts.`;

    case INTENTS.EMERGENCY_CONTACTS:
      if (hasFull && place.emergencyContacts?.length) {
        const list = place.emergencyContacts.map((c) => `• ${c.name}: ${c.number}`).join('\n');
        return `Emergency contacts near ${name}:\n\n${list}`;
      }
      return `Emergency contacts near ${name} will be available after connecting with the backend database. National emergency numbers: Police 100, Ambulance 108, Tourist Helpline 1363.`;

    case INTENTS.WEATHER:
      return `Weather information for ${name} will be available after connecting with the backend database and a weather API integration.`;

    // --- Nearby ---
    case INTENTS.NEARBY_PLACES:
    case INTENTS.RECOMMEND_NEARBY:
      if (place) {
        const nearby = destinations.filter((d) => d.stateId === place.stateId && d.id !== place.id).slice(0, 5);
        if (nearby.length) {
          const list = nearby.map((d, i) => `${i + 1}. ${d.name} — ${d.city} (★ ${d.rating})`).join('\n');
          return `Here are nearby places to ${name}:\n\n${list}`;
        }
      }
      return `Nearby attractions to ${name} will be available after connecting with the backend database.`;

    case INTENTS.NEARBY_TEMPLES:
      return buildRecommendationResponse('temples nearby', (d) => d.category === 'temples');

    case INTENTS.NEARBY_BEACHES:
      return buildRecommendationResponse('beaches nearby', (d) => d.category === 'beaches');

    case INTENTS.NEARBY_WATERFALLS:
      return buildRecommendationResponse('waterfalls nearby', (d) => d.category === 'waterfalls');

    case INTENTS.NEARBY_MUSEUMS:
      return buildRecommendationResponse('museums nearby', (d) => d.category === 'museums');

    case INTENTS.NEARBY_HIDDEN_GEMS:
      return buildRecommendationResponse('hidden gems nearby', (d) => d.hidden || d.category === 'hidden-gems');

    // --- Reviews ---
    case INTENTS.SHOW_REVIEWS:
      if (place) return `You can see reviews for ${name} on its details page. It has a ${place.rating}-star rating from ${place.reviewsCount?.toLocaleString() || 'many'} reviews. Scroll to the Reviews section on the destination page to read what travelers are saying!`;
      return `Reviews for ${name} will be available after connecting with the backend database.`;

    case INTENTS.AVERAGE_RATING:
      if (place) return `${name} has an average rating of ${place.rating} stars from ${place.reviewsCount?.toLocaleString() || 'many'} reviews.`;
      return `The average rating for ${name} will be available after connecting with the backend database.`;

    case INTENTS.ADD_REVIEW:
      return `Yes! You can add a review for any destination. Go to the destination's details page, scroll to the Reviews section, and share your experience with a rating and photos. (Note: You may need to log in to post a review.)`;

    case INTENTS.UPLOAD_PHOTOS:
      return `Yes, you can upload photos with your review! When writing a review on a destination's details page, you'll have the option to attach photos from your visit.`;

    case INTENTS.REPORT_FAKE:
      return `To report fake or incorrect content, use the Report button on the destination's details page. Our moderation team will review your report and take appropriate action. You can also use the Report page for general issues.`;

    // --- Hidden Gems ---
    case INTENTS.SHOW_HIDDEN_GEMS:
      return 'Hidden gems are off-the-beaten-path destinations that most tourists miss! You can explore them on the Hidden Gems page. You\'ll find secret beaches, forgotten ruins, serene waterfalls, and more. Would you like me to recommend some?';

    case INTENTS.UPLOAD_HIDDEN_PLACE:
      return 'You can upload a hidden place via the Upload Place page. Fill in the name, location, category, description, and photos. Your submission will be reviewed by our team before going live. Thank you for contributing to the community!';

    case INTENTS.APPROVAL_PROCESS:
      return 'When you upload a hidden place, it goes through a review process:\n\n1. You submit the place via the Upload Place page.\n2. Our moderation team verifies the details.\n3. Approved places appear on the Hidden Gems page.\n4. You\'ll be notified once approved (after backend integration).';

    case INTENTS.WHO_VERIFIES:
      return 'Our moderation team verifies all uploaded content. They check for accuracy, authenticity, and quality before publishing. This ensures Explore India maintains high-quality, reliable information for all travelers.';

    // --- Account ---
    case INTENTS.REGISTER:
      return 'To register, go to the Register page and create an account with your email and password. Once registered, you can save favorites, write reviews, upload hidden gems, and personalize your experience.';

    case INTENTS.LOGIN:
      return 'To log in, go to the Login page and enter your email and password. Once logged in, you can access your favorites, reviews, and profile.';

    case INTENTS.EDIT_PROFILE:
      return 'You can edit your profile on the Profile page. Once logged in, you can update your name, profile picture, and preferences. (Full profile editing will be available after backend integration.)';

    case INTENTS.SAVE_FAVORITES:
      return 'To save favorites, click the heart icon on any destination card or details page. Your saved places will appear on the Favorites page. You can access it anytime from the navbar.';

    // --- Recommendation ---
    case INTENTS.RECOMMEND_SIMILAR:
      if (place) {
        const similar = destinations.filter((d) => d.category === place.category && d.id !== place.id).slice(0, 5);
        if (similar.length) {
          const list = similar.map((d, i) => `${i + 1}. ${d.name} — ${d.city}, ${d.state} (★ ${d.rating})`).join('\n');
          return `Here are places similar to ${name}:\n\n${list}`;
        }
      }
      return buildRecommendationResponse('similar places', () => true);

    case INTENTS.SUGGEST_TEMPLES:
      return buildRecommendationResponse('temples', (d) => d.category === 'temples');

    case INTENTS.SUGGEST_BEACHES:
      return buildRecommendationResponse('beaches', (d) => d.category === 'beaches');

    case INTENTS.SUGGEST_CULTURAL:
      return buildRecommendationResponse('cultural and heritage places', (d) => d.category === 'heritage' || d.category === 'historical');

    case INTENTS.SUGGEST_FAMILY:
      return buildRecommendationResponse('family-friendly destinations', (d) => d.rating >= 4.5 && (d.category === 'beaches' || d.category === 'hill-stations' || d.category === 'heritage'));

    default:
      return UNKNOWN_RESPONSE;
  }
}

/**
 * Generate a response string for a matched intent.
 *
 * @param {{ intent: string, entities: object }} match — output of intentMatcher.matchIntent
 * @returns {string}
 */

const BOOKING_RESPONSES = {
  [INTENTS.HOW_TO_BOOK]: 'To book a visit, go to any destination\'s details page and click the "Book Visit" button. Fill in your visit date, time slot, number of visitors, and contact details. You can also choose a guide and language preference. Once confirmed, you\'ll receive a booking ID. Visit the My Bookings page to manage all your bookings.',
  [INTENTS.SHOW_MY_BOOKINGS]: 'You can view all your bookings on the My Bookings page. It shows upcoming, completed, and cancelled bookings with details like booking ID, visit date, time slot, and status. Click "View Details" on any booking for full information.',
  [INTENTS.CANCEL_BOOKING]: 'Yes, you can cancel a booking from the My Bookings page. Find your upcoming booking and click the "Cancel" button. Cancellations can be made up to 24 hours before your scheduled visit. (This is a UI placeholder — backend integration pending.)',
  [INTENTS.GUIDE_NEEDED]: 'A guide is optional but recommended for historical and cultural sites. Guides provide valuable context about the history, architecture, and significance of the place. You can request a guide when booking your visit, and choose your preferred language. Browse available guides on the Tour Guides page.',
  [INTENTS.VISITOR_LIMIT]: 'You can book for 1 to 20 visitors per booking. For larger groups, please make multiple bookings or contact support. Some destinations may have specific group size restrictions which will be shown on the booking form.',
  [INTENTS.BOOKING_STATUS]: 'All confirmed bookings show a "Confirmed" status. You can check your booking status on the My Bookings page, where bookings are categorized as Upcoming, Completed, or Cancelled. Each booking has a unique booking ID for reference.',
  [INTENTS.BOOKING_FEES]: 'Booking on Explore India is free! You only pay the destination\'s entry fee, which is displayed on the booking form. Some monuments may have different fees for Indians and foreigners. Guide fees, if selected, are separate and shown during booking.',
  [INTENTS.MODIFY_BOOKING]: 'To modify a booking, go to My Bookings, find your upcoming booking, and click "View Details". You can cancel the existing booking and create a new one with updated details. (Direct editing will be available after backend integration.)',
};

export function generateResponse(match, ctx = {}) {
  const { intent, entities } = match;
  const { selectedState, selectedDistrict } = ctx;

  // Greetings & general
  const greeting = GREETING_RESPONSES[intent];
  if (greeting) return greeting;

  if (intent === INTENTS.FAQ) return buildFaqResponse();
  if (intent === INTENTS.PLAN_TRIP) return buildPlanTripResponse();
  if (intent === INTENTS.PLAN_TRIP_DAYS) return buildPlanTripDaysResponse();
  if (intent === INTENTS.SUGGEST_FAMOUS_PLACES) return buildPopularPlacesResponse();
  if (intent === INTENTS.TRAVEL_TIPS) return buildTravelTipsResponse();
  if (intent === INTENTS.POPULAR_PLACES) return buildPopularPlacesResponse();
  if (intent === INTENTS.NEARBY_GUIDES) return buildNearbyGuidesResponse(selectedState, selectedDistrict);

  // Booking-related
  const bookingResp = BOOKING_RESPONSES[intent];
  if (bookingResp) return bookingResp;

  // Place-specific or intent-specific
  const placeResponse = buildPlaceResponse(intent, entities);
  if (placeResponse) return placeResponse;

  return UNKNOWN_RESPONSE;
}

/**
 * Builds a location-aware response for nearby guides.
 * Returns guides for the selected district first, then nearby districts.
 */
function buildNearbyGuidesResponse(selectedState, selectedDistrict) {
  if (!selectedState) {
    return "I'd love to show you nearby guides! Please select a state and district first (visit the Explore page or the Guides page), and I'll recommend certified local guides for that area.";
  }
  const guides = getGuidesForLocation(selectedState.id, selectedDistrict?.id);
  if (guides.length === 0) {
    return `No guides are currently listed for ${selectedState.name}. We're expanding our guide network — please check back soon, or try a different state.`;
  }
  const top = guides.slice(0, 4);
  const locationLabel = selectedDistrict ? `${selectedDistrict.name}, ${selectedState.name}` : selectedState.name;
  const lines = [`Here are certified local guides for ${locationLabel}:`, ''];
  top.forEach((g, idx) => {
    const type = GUIDE_TYPES.find((t) => t.id === g.guideType);
    const availLabel = g.availability === 'available' ? 'Available' : g.availability === 'busy' ? 'Busy' : 'Offline';
    lines.push(`${idx + 1}. ${g.name} — ${type ? type.label : 'Guide'} (Rating ${g.rating}, ${g.experience}y exp)`);
    lines.push(`   Languages: ${g.languages.join(', ')}`);
    lines.push(`   Price: ₹${g.pricePerHour}/hr · ₹${g.pricePerDay}/day · Status: ${availLabel}`);
  });
  lines.push('');
  lines.push(`Visit the Guides page to see all ${guides.length} guides and book one directly.`);
  return lines.join('\n');
}

/**
 * Async stub — simulates a backend API call.
 * Replace this with a real fetch() to a Spring Boot REST API later.
 *
 * @param {string} query
 * @param {{ destinations?: Array }} ctx
 * @returns {Promise<{ text: string, intent: string }>}
 */
export async function fetchChatbotResponse(query, ctx = {}) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

  const match = matchIntent(query, ctx);
  const text = generateResponse(match);
  return { text, intent: match.intent };
}

export default { generateResponse, fetchChatbotResponse, INTENTS };
