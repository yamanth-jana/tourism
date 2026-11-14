import { tripPlaces, tripTypes } from '../data/tripPlannerPlaces';

// Smart recommendation engine — scores places based on trip type prefs, popularity,
// rating, historical importance, travel convenience (distance), and category diversity.
// Groups nearby attractions together and orders by logical travel sequence.

const MAX_PLACES_PER_DAY = {
  1: 4,
  2: 3,
  3: 3,
  5: 3,
};

// Lunch/dining/food suggestions inserted mid-day
const FOOD_SUGGESTION = {
  id: 'food-suggestion',
  name: 'Lunch Break — Local Cuisine',
  image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
  categories: ['food', 'cultural'],
  isMeal: true,
  time: '1:00 PM',
  description: 'Recommended local dining spot for authentic regional cuisine.',
};

const EVENING_SUGGESTION = {
  id: 'evening-suggestion',
  name: 'Evening View Point',
  image: 'https://images.pexels.com/photos/12716176/pexels-photo-12716176.jpeg?auto=compress&cs=tinysrgb&w=400',
  categories: ['photography', 'nature'],
  isActivity: true,
  time: '5:30 PM',
  description: 'Scenic sunset viewpoint to wrap up the day.',
};

function calculateDistance(coords1, coords2) {
  if (!coords1 || !coords2 || coords1.lat == null || coords2.lat == null) return 0;
  const R = 6371;
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scorePlace(place, tripTypePrefs, dayIndex) {
  let score = 0;

  const cats = place.categories || [];
  const matchedCategories = cats.filter((c) => tripTypePrefs.includes(c));
  score += matchedCategories.length * 25;

  score += (place.popularity ?? 0) * 0.3;
  score += ((place.rating ?? 3) - 3) * 15;
  score += (place.historicalImportance ?? 0) * 0.15;

  if (dayIndex === 0) {
    score += Math.max(0, (20 - (place.distance ?? 0)) * 0.5);
  }

  if (tripTypePrefs.includes('hidden') && cats.includes('hidden')) {
    score += 20;
  }

  return score;
}

function groupByProximity(places) {
  if (places.length <= 1) return places;
  const sorted = [...places].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  const groups = [];
  const used = new Set();

  for (const place of sorted) {
    if (used.has(place.id)) continue;
    const group = [place];
    used.add(place.id);
    for (const other of sorted) {
      if (used.has(other.id)) continue;
      const dist = calculateDistance(place.coordinates, other.coordinates);
      if (dist < 15) {
        group.push(other);
        used.add(other.id);
      }
    }
    groups.push(group);
  }

  return groups.flat();
}

function orderForTravel(places) {
  if (places.length <= 2) return places;
  const sorted = [...places].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  const start = sorted[0];
  const ordered = [start];
  const remaining = sorted.slice(1);

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateDistance(ordered[ordered.length - 1].coordinates, remaining[i].coordinates);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    ordered.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }

  return ordered;
}

function assignTimeSlots(places) {
  const startHour = 8;
  return places.map((place, idx) => {
    if (place.isMeal || place.isActivity) return place;
    const hour = startHour + idx * 2.5;
    const h = Math.floor(hour);
    const m = hour % 1 >= 0.5 ? 30 : 0;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return {
      ...place,
      time: `${displayH}:${m === 0 ? '00' : '30'} ${period}`,
    };
  });
}

function calculateDayStats(places) {
  let totalDistance = 0;
  let totalTravelTime = 0;
  let totalVisitDuration = 0;

  const realPlaces = places.filter((p) => !p.isMeal && !p.isActivity);

  for (let i = 0; i < realPlaces.length - 1; i++) {
    const dist = calculateDistance(realPlaces[i].coordinates, realPlaces[i + 1].coordinates);
    totalDistance += dist;
    totalTravelTime += (dist / 30) * 60; // avg 30 km/h
  }

  totalVisitDuration = realPlaces.reduce((acc, p) => acc + (p.visitDuration || 60), 0);

  return {
    distance: Math.round(totalDistance * 10) / 10,
    travelTime: Math.round(totalTravelTime),
    visitDuration: totalVisitDuration,
    placesCount: realPlaces.length,
  };
}

export function generateTrip(stateId, districtId, tripTypeId, numDays) {
  const places = tripPlaces[districtId] || [];
  if (places.length === 0) return null;

  const tripType = tripTypes.find((t) => t.id === tripTypeId);
  const prefs = tripType ? tripType.categoryPrefs : [];

  // Score all places
  const scored = places.map((p) => ({
    ...p,
    score: scorePlace(p, prefs, 0),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Determine places per day
  const maxPerDay = MAX_PLACES_PER_DAY[numDays] || 3;
  const totalPlacesNeeded = Math.min(scored.length, maxPerDay * numDays);
  const selectedPlaces = scored.slice(0, totalPlacesNeeded);

  // Group by proximity for day assignment
  const proximityOrdered = groupByProximity(selectedPlaces);

  // Distribute across days
  const days = [];
  let placeIdx = 0;

  for (let day = 1; day <= numDays; day++) {
    const dayPlaces = [];
    const count = Math.min(maxPerDay, proximityOrdered.length - placeIdx);

    for (let i = 0; i < count; i++) {
      dayPlaces.push(proximityOrdered[placeIdx]);
      placeIdx++;
    }

    // Order places within the day for logical travel
    const ordered = orderForTravel(dayPlaces);

    // Insert lunch suggestion mid-day if more than 2 places
    if (ordered.length > 2) {
      const midIdx = Math.ceil(ordered.length / 2);
      ordered.splice(midIdx, 0, { ...FOOD_SUGGESTION });
    }

    // Add evening suggestion on the last day or first day
    if (day === 1 && ordered.length >= 2) {
      ordered.push({ ...EVENING_SUGGESTION });
    }

    const timedPlaces = assignTimeSlots(ordered);
    const stats = calculateDayStats(timedPlaces);

    days.push({
      day,
      places: timedPlaces,
      stats,
    });
  }

  // Calculate trip summary
  const allRealPlaces = days.flatMap((d) => d.places.filter((p) => !p.isMeal && !p.isActivity));
  const totalDistance = days.reduce((acc, d) => acc + d.stats.distance, 0);
  const totalTravelTime = days.reduce((acc, d) => acc + d.stats.travelTime, 0);

  // Best season — most common among selected places
  const seasons = allRealPlaces.map((p) => p.bestSeason).filter(Boolean);
  const seasonCounts = {};
  seasons.forEach((s) => {
    const key = s.split('-')[0].trim();
    seasonCounts[key] = (seasonCounts[key] || 0) + 1;
  });
  const bestSeason = Object.entries(seasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Oct-Mar';

  // Estimated budget (placeholder — entry fees + transport + food)
  const estimatedBudget = `₹${(allRealPlaces.length * 500 + numDays * 800 + Math.round(totalDistance * 15)).toLocaleString('en-IN')} - ₹${(allRealPlaces.length * 800 + numDays * 1200 + Math.round(totalDistance * 20)).toLocaleString('en-IN')}`;

  const summary = {
    totalPlaces: allRealPlaces.length,
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalTravelTime: Math.round(totalTravelTime),
    startTime: '8:00 AM',
    endTime: '7:00 PM',
    estimatedBudget,
    bestSeason,
    weather: 'Pleasant — ' + (bestSeason.includes('Oct') || bestSeason.includes('Nov') || bestSeason.includes('Dec') || bestSeason.includes('Jan') || bestSeason.includes('Feb') ? 'Cool & dry' : bestSeason.includes('Mar') || bestSeason.includes('Apr') || bestSeason.includes('May') ? 'Warm & sunny' : 'Monsoon season — carry umbrella'),
  };

  return {
    id: `trip-${Date.now()}`,
    stateId,
    districtId,
    tripTypeId,
    tripTypeName: tripType?.label || 'Custom Tour',
    numDays,
    days,
    summary,
    originalDays: JSON.parse(JSON.stringify(days)), // deep clone for reset
  };
}

export function getReplacementSuggestions(districtId, removedPlaceId, currentTripPlaceIds) {
  const places = tripPlaces[districtId] || [];
  const usedIds = new Set(currentTripPlaceIds);
  return places
    .filter((p) => p.id !== removedPlaceId && !usedIds.has(p.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
}

export function getSuggestedAdditions(districtId, currentTripPlaceIds) {
  const places = tripPlaces[districtId] || [];
  const usedIds = new Set(currentTripPlaceIds);
  return places
    .filter((p) => !usedIds.has(p.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);
}

export default { generateTrip, getReplacementSuggestions, getSuggestedAdditions };
