/**
 * Frontend-only keyword-based intent matcher.
 * Maps natural-language queries to intent identifiers using synonym groups.
 *
 * Designed so a Spring Boot NLP service can later replace this module
 * with a single function sharing the same return shape:
 *   { intent: string, entities: { place?: string, category?: string } }
 */

const INTENTS = {
  LOCATION: 'location',
  HISTORY: 'history',
  CULTURAL_SIGNIFICANCE: 'cultural_significance',
  WHY_FAMOUS: 'why_famous',
  TELL_ME_ABOUT: 'tell_me_about',
  WHEN_BUILT: 'when_built',
  WHO_BUILT: 'who_built',
  WHY_VISIT: 'why_visit',
  HOW_TO_REACH: 'how_to_reach',
  DIRECTIONS: 'directions',
  GOOGLE_MAPS: 'google_maps',
  NEAREST_RAILWAY: 'nearest_railway',
  NEAREST_AIRPORT: 'nearest_airport',
  NEAREST_BUS: 'nearest_bus',
  PARKING: 'parking',
  PUBLIC_TRANSPORT: 'public_transport',
  OPENING_TIME: 'opening_time',
  CLOSING_TIME: 'closing_time',
  ENTRY_FEE: 'entry_fee',
  BEST_TIME: 'best_time',
  VISITING_DURATION: 'visiting_duration',
  FACILITIES: 'facilities',
  RESTAURANTS_NEARBY: 'restaurants_nearby',
  HOTELS_NEARBY: 'hotels_nearby',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  WEATHER: 'weather',
  NEARBY_PLACES: 'nearby_places',
  NEARBY_TEMPLES: 'nearby_temples',
  NEARBY_BEACHES: 'nearby_beaches',
  NEARBY_WATERFALLS: 'nearby_waterfalls',
  NEARBY_MUSEUMS: 'nearby_museums',
  NEARBY_HIDDEN_GEMS: 'nearby_hidden_gems',
  NEARBY_GUIDES: 'nearby_guides',
  SHOW_REVIEWS: 'show_reviews',
  AVERAGE_RATING: 'average_rating',
  ADD_REVIEW: 'add_review',
  UPLOAD_PHOTOS: 'upload_photos',
  REPORT_FAKE: 'report_fake',
  SHOW_HIDDEN_GEMS: 'show_hidden_gems',
  UPLOAD_HIDDEN_PLACE: 'upload_hidden_place',
  APPROVAL_PROCESS: 'approval_process',
  WHO_VERIFIES: 'who_verifies',
  REGISTER: 'register',
  LOGIN: 'login',
  EDIT_PROFILE: 'edit_profile',
  SAVE_FAVORITES: 'save_favorites',
  RECOMMEND_SIMILAR: 'recommend_similar',
  RECOMMEND_NEARBY: 'recommend_nearby',
  SUGGEST_TEMPLES: 'suggest_temples',
  SUGGEST_BEACHES: 'suggest_beaches',
  SUGGEST_CULTURAL: 'suggest_cultural',
  SUGGEST_FAMILY: 'suggest_family',
  GREETING_HELLO: 'greeting_hello',
  GREETING_HI: 'greeting_hi',
  GREETING_MORNING: 'greeting_morning',
  GREETING_EVENING: 'greeting_evening',
  THANK_YOU: 'thank_you',
  BYE: 'bye',
  HELP: 'help',
  FAQ: 'faq',
  PLAN_TRIP: 'plan_trip',
  PLAN_TRIP_DAYS: 'plan_trip_days',
  SUGGEST_FAMOUS_PLACES: 'suggest_famous_places',
  TRAVEL_TIPS: 'travel_tips',
  POPULAR_PLACES: 'popular_places',
  // Booking
  HOW_TO_BOOK: 'how_to_book',
  SHOW_MY_BOOKINGS: 'show_my_bookings',
  CANCEL_BOOKING: 'cancel_booking',
  GUIDE_NEEDED: 'guide_needed',
  VISITOR_LIMIT: 'visitor_limit',
  BOOKING_STATUS: 'booking_status',
  BOOKING_FEES: 'booking_fees',
  MODIFY_BOOKING: 'modify_booking',
  UNKNOWN: 'unknown',
};

/**
 * Each rule: keywords that, if ALL present (or ANY if `mode: 'any'`),
 * trigger the intent.  `mode` defaults to `'any'`.
 */
const RULES = [
  // --- Tourist Information ---
  { intent: INTENTS.LOCATION, keywords: ['where', 'location', 'located', 'address', 'take me to', 'show me .* location', 'find'], mode: 'any' },
  { intent: INTENTS.WHY_FAMOUS, keywords: ['famous', 'popular', 'well known', 'why is it', 'why is this', 'known for', 'special about'], mode: 'any' },
  { intent: INTENTS.TELL_ME_ABOUT, keywords: ['tell me about', 'about', 'describe', 'what is', 'what do you know about', 'information about', 'info about'], mode: 'any' },
  { intent: INTENTS.HISTORY, keywords: ['history', 'historical background', 'origin', 'past of', 'story of', 'how old'], mode: 'any' },
  { intent: INTENTS.CULTURAL_SIGNIFICANCE, keywords: ['cultural', 'significance', 'importance', 'why is it important', 'sacred', 'spiritual importance'], mode: 'any' },
  { intent: INTENTS.WHEN_BUILT, keywords: ['when was', 'built', 'constructed', 'established', 'year built', 'how old is'], mode: 'any' },
  { intent: INTENTS.WHO_BUILT, keywords: ['who built', 'built by', 'constructed by', 'commissioned by', 'created by', 'who made'], mode: 'any' },
  { intent: INTENTS.WHY_VISIT, keywords: ['why should i visit', 'why visit', 'reason to visit', 'worth visiting', 'should i go'], mode: 'any' },

  // --- Travel Information ---
  { intent: INTENTS.HOW_TO_REACH, keywords: ['how (can i|do i) reach', 'how to get', 'how to reach', 'how to go', 'how do i get to', 'reach'], mode: 'any' },
  { intent: INTENTS.DIRECTIONS, keywords: ['direction', 'directions', 'route', 'navigate', 'show me the way', 'get directions'], mode: 'any' },
  { intent: INTENTS.GOOGLE_MAPS, keywords: ['google maps', 'open maps', 'show map', 'maps', 'open google map'], mode: 'any' },
  { intent: INTENTS.NEAREST_RAILWAY, keywords: ['nearest railway', 'railway station', 'train station', 'closest railway', 'nearest train'], mode: 'any' },
  { intent: INTENTS.NEAREST_AIRPORT, keywords: ['nearest airport', 'closest airport', 'airport near', 'flight'], mode: 'any' },
  { intent: INTENTS.NEAREST_BUS, keywords: ['nearest bus', 'bus station', 'bus stop', 'closest bus', 'bus stand'], mode: 'any' },
  { intent: INTENTS.PARKING, keywords: ['parking', 'park my car', 'parking available', 'parking space'], mode: 'any' },
  { intent: INTENTS.PUBLIC_TRANSPORT, keywords: ['public transport', 'bus service', 'metro', 'transport available', 'local transport'], mode: 'any' },

  // --- Visiting Information ---
  { intent: INTENTS.OPENING_TIME, keywords: ['opening time', 'open time', 'when does it open', 'opening hours', 'opens at', 'timing'], mode: 'any' },
  { intent: INTENTS.CLOSING_TIME, keywords: ['closing time', 'close time', 'when does it close', 'closing hours', 'closes at'], mode: 'any' },
  { intent: INTENTS.ENTRY_FEE, keywords: ['entry fee', 'ticket price', 'admission', 'entrance fee', 'ticket cost', 'how much does it cost', 'cost to visit'], mode: 'any' },
  { intent: INTENTS.BEST_TIME, keywords: ['best time to visit', 'best time', 'best season', 'ideal time', 'when to visit', 'best month'], mode: 'any' },
  { intent: INTENTS.VISITING_DURATION, keywords: ['average visiting duration', 'how long to spend', 'time needed', 'how much time', 'duration of visit', 'how long does it take'], mode: 'any' },
  { intent: INTENTS.FACILITIES, keywords: ['facilities', 'amenities', 'available facilities', 'what facilities', 'restroom', 'washroom', 'toilet'], mode: 'any' },
  { intent: INTENTS.RESTAURANTS_NEARBY, keywords: ['restaurant', 'food near', 'eat near', 'dining', 'places to eat', 'nearby restaurant'], mode: 'any' },
  { intent: INTENTS.HOTELS_NEARBY, keywords: ['hotel', 'stay near', 'accommodation', 'lodging', 'nearby hotel', 'place to stay'], mode: 'any' },
  { intent: INTENTS.EMERGENCY_CONTACTS, keywords: ['emergency', 'emergency contact', 'police number', 'ambulance', 'helpline', 'emergency number'], mode: 'any' },
  { intent: INTENTS.WEATHER, keywords: ['weather', 'temperature', 'climate', 'forecast'], mode: 'any' },

  // --- Nearby Attractions ---
  { intent: INTENTS.NEARBY_PLACES, keywords: ['nearby (tourist )?places', 'nearby attraction', 'places to visit near', 'around', 'what else is near'], mode: 'any' },
  { intent: INTENTS.NEARBY_TEMPLES, keywords: ['nearby temple', 'temples near', 'temple around'], mode: 'any' },
  { intent: INTENTS.NEARBY_BEACHES, keywords: ['nearby beach', 'beaches near', 'beach around'], mode: 'any' },
  { intent: INTENTS.NEARBY_WATERFALLS, keywords: ['nearby waterfall', 'waterfalls near', 'waterfall around'], mode: 'any' },
  { intent: INTENTS.NEARBY_MUSEUMS, keywords: ['nearby museum', 'museums near', 'museum around'], mode: 'any' },
  { intent: INTENTS.NEARBY_HIDDEN_GEMS, keywords: ['nearby hidden gem', 'hidden gems near', 'secret places near'], mode: 'any' },
  { intent: INTENTS.NEARBY_GUIDES, keywords: ['nearby guide', 'local guide', 'show guide', 'find guide', 'book guide', 'tour guide', 'guides near', 'available guide'], mode: 'any' },

  // --- Reviews ---
  { intent: INTENTS.SHOW_REVIEWS, keywords: ['show review', 'reviews', 'what do people say', 'user review', 'read review'], mode: 'any' },
  { intent: INTENTS.AVERAGE_RATING, keywords: ['average rating', 'rating', 'how is the rating', 'what is the rating', 'star rating', 'rated'], mode: 'any' },
  { intent: INTENTS.ADD_REVIEW, keywords: ['add (a )?review', 'write a review', 'leave a review', 'post review', 'can i review'], mode: 'any' },
  { intent: INTENTS.UPLOAD_PHOTOS, keywords: ['upload photo', 'add photo', 'share photo', 'can i upload', 'post picture'], mode: 'any' },
  { intent: INTENTS.REPORT_FAKE, keywords: ['report fake', 'report incorrect', 'report content', 'flag content', 'report wrong'], mode: 'any' },

  // --- Hidden Gems ---
  { intent: INTENTS.SHOW_HIDDEN_GEMS, keywords: ['show hidden gem', 'hidden gems', 'hidden places', 'secret places', 'lesser known', 'offbeat'], mode: 'any' },
  { intent: INTENTS.UPLOAD_HIDDEN_PLACE, keywords: ['upload hidden', 'add hidden place', 'submit hidden', 'upload place', 'upload a place', 'contribute'], mode: 'any' },
  { intent: INTENTS.APPROVAL_PROCESS, keywords: ['approval', 'how does approval', 'review process', 'how long does approval', 'when will my upload'], mode: 'any' },
  { intent: INTENTS.WHO_VERIFIES, keywords: ['who verif', 'verifies upload', 'who approves', 'moderation team', 'who reviews'], mode: 'any' },

  // --- Account ---
  { intent: INTENTS.REGISTER, keywords: ['register', 'sign up', 'create account', 'new account', 'how to register'], mode: 'any' },
  { intent: INTENTS.LOGIN, keywords: ['login', 'log in', 'sign in', 'how to login', 'how to sign in'], mode: 'any' },
  { intent: INTENTS.EDIT_PROFILE, keywords: ['edit profile', 'update profile', 'change profile', 'how to edit profile', 'my profile'], mode: 'any' },
  { intent: INTENTS.SAVE_FAVORITES, keywords: ['save favorite', 'add to favorite', 'bookmark', 'how to save', 'how do i save favorite'], mode: 'any' },

  // --- Recommendation ---
  { intent: INTENTS.RECOMMEND_SIMILAR, keywords: ['recommend similar', 'similar places', 'places like', 'more like this', 'similar to'], mode: 'any' },
  { intent: INTENTS.RECOMMEND_NEARBY, keywords: ['recommend nearby', 'suggest nearby', 'places near me', 'nearby recommendation'], mode: 'any' },
  { intent: INTENTS.SUGGEST_TEMPLES, keywords: ['suggest temple', 'recommend temple', 'best temple', 'famous temple', 'temples to visit'], mode: 'any' },
  { intent: INTENTS.SUGGEST_BEACHES, keywords: ['suggest beach', 'recommend beach', 'best beach', 'famous beach', 'beaches to visit'], mode: 'any' },
  { intent: INTENTS.SUGGEST_CULTURAL, keywords: ['suggest cultural', 'cultural places', 'heritage place', 'recommend cultural', 'historical places to visit'], mode: 'any' },
  { intent: INTENTS.SUGGEST_FAMILY, keywords: ['family friendly', 'family places', 'places for family', 'kids friendly', 'suitable for family'], mode: 'any' },

  // --- General / Greetings ---
  { intent: INTENTS.GREETING_HELLO, keywords: ['hello', 'hey there', 'hey'], mode: 'any' },
  { intent: INTENTS.GREETING_HI, keywords: ['^hi$', '^hi ', ' hi ', 'hi!'], mode: 'any' },
  { intent: INTENTS.GREETING_MORNING, keywords: ['good morning', 'gm', 'morning'], mode: 'any' },
  { intent: INTENTS.GREETING_EVENING, keywords: ['good evening', 'evening'], mode: 'any' },
  { intent: INTENTS.THANK_YOU, keywords: ['thank you', 'thanks', 'thank', 'thx', 'appreciate'], mode: 'any' },
  { intent: INTENTS.BYE, keywords: ['bye', 'goodbye', 'see you', 'farewell', 'see ya'], mode: 'any' },
  { intent: INTENTS.HELP, keywords: ['help', 'what can you do', 'how do you work', 'assist', 'support'], mode: 'any' },
  { intent: INTENTS.FAQ, keywords: ['faq', 'frequently asked', 'common question'], mode: 'any' },
  { intent: INTENTS.PLAN_TRIP, keywords: ['plan (my )?trip', 'plan a trip', 'trip plan', 'itinerary', 'plan my journey'], mode: 'any' },
  { intent: INTENTS.PLAN_TRIP_DAYS, keywords: ['plan a \\d+ day trip', '\\d+ day trip', 'plan a 2 day trip', 'plan a 3 day trip', 'plan a 1 day trip', 'plan a 5 day trip', '2 day trip', '3 day trip', '5 day trip', '1 day trip', 'weekend trip plan'], mode: 'any' },
  { intent: INTENTS.SUGGEST_FAMOUS_PLACES, keywords: ['suggest famous place', 'famous place', 'famous destination', 'best place to visit', 'must visit place', 'famous tourist'], mode: 'any' },
  { intent: INTENTS.TRAVEL_TIPS, keywords: ['travel tip', 'tips for', 'advice for', 'pro tip', 'things to know'], mode: 'any' },
  { intent: INTENTS.POPULAR_PLACES, keywords: ['popular place', 'popular destination', 'best place', 'top place', 'must visit', 'top destination'], mode: 'any' },

  // --- Booking ---
  { intent: INTENTS.HOW_TO_BOOK, keywords: ['how (do i|to) book', 'book a visit', 'how to book a visit', 'booking process', 'how to book a tour', 'book visit', 'book now'], mode: 'any' },
  { intent: INTENTS.SHOW_MY_BOOKINGS, keywords: ['show my booking', 'my booking', 'view booking', 'list booking', 'see my booking', 'booking history'], mode: 'any' },
  { intent: INTENTS.CANCEL_BOOKING, keywords: ['cancel booking', 'cancel my booking', 'cancel visit', 'cancel a booking', 'cancellation', 'cancel ticket'], mode: 'any' },
  { intent: INTENTS.GUIDE_NEEDED, keywords: ['do i need a guide', 'guide required', 'need a guide', 'is guide', 'guide necessary', 'should i hire a guide'], mode: 'any' },
  { intent: INTENTS.VISITOR_LIMIT, keywords: ['how many visitor', 'visitor limit', 'max visitor', 'maximum visitor', 'number of visitor', 'group size', 'how many people'], mode: 'any' },
  { intent: INTENTS.BOOKING_STATUS, keywords: ['booking status', 'my booking status', 'is my booking confirmed', 'booking confirmed', 'check booking status'], mode: 'any' },
  { intent: INTENTS.BOOKING_FEES, keywords: ['booking fee', 'booking charge', 'cost to book', 'booking cost', 'is booking free', 'any fee for booking'], mode: 'any' },
  { intent: INTENTS.MODIFY_BOOKING, keywords: ['modify booking', 'change booking', 'edit booking', 'update booking', 'reschedule booking', 'change date'], mode: 'any' },
];

// Cache compiled regex patterns
const compiledRules = RULES.map((rule) => ({
  ...rule,
  patterns: rule.keywords.map((kw) => new RegExp(kw, 'i')),
}));

/**
 * Extracts a place name from the query by checking against known destinations.
 * @param {string} query
 * @param {Array} destinations — flat list from src/data/destinations.js
 * @returns {string|null}
 */
function extractPlaceName(query, destinations) {
  if (!destinations || !destinations.length) return null;
  for (const dest of destinations) {
    if (query.toLowerCase().includes(dest.name.toLowerCase())) {
      return dest;
    }
  }
  return null;
}

/**
 * Main entry point — matches a user query to an intent.
 *
 * @param {string} rawQuery — user's natural-language input
 * @param {{ destinations?: Array }} ctx — optional context (destinations list)
 * @returns {{ intent: string, entities: { place?: object|null } }}
 */
export function matchIntent(rawQuery, ctx = {}) {
  const query = rawQuery.trim();
  if (!query) return { intent: INTENTS.UNKNOWN, entities: {} };

  const place = extractPlaceName(query, ctx.destinations || []);

  // Check rules — first match wins (rules are ordered by specificity)
  for (const rule of compiledRules) {
    const matched = rule.mode === 'all'
      ? rule.patterns.every((re) => re.test(query))
      : rule.patterns.some((re) => re.test(query));
    if (matched) {
      return { intent: rule.intent, entities: { place: place || null } };
    }
  }

  return { intent: INTENTS.UNKNOWN, entities: { place: place || null } };
}

export { INTENTS };
export default { matchIntent, INTENTS };
