import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  ChevronRight,
  ArrowLeft,
  Building,
  Grid,
  X,
  Loader2,
} from 'lucide-react';
import * as Icons from 'lucide-react';

import StateCard from '../components/common/StateCard';
import DestinationCard from '../components/common/DestinationCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLocation } from '../context/LocationContext';

import {
  placesApi,
  statesApi,
  categoriesApi,
} from '../services/api';

// --------------------------------------------------
// UI-only helpers
// --------------------------------------------------

const regions = [
  'All',
  'North',
  'South',
  'East',
  'West',
  'Central',
  'Northeast',
];

// Backend does not currently have a region field,
// so we map the existing states to their UI regions.
const stateRegions = {
  AP: 'South',
  TS: 'South',
  KA: 'South',
  TN: 'South',
  KL: 'South',

  MH: 'West',
  GA: 'West',

  RJ: 'North',
  UP: 'North',
  DL: 'North',
};

const categoryColors = {
  heritage: 'from-amber-500 to-orange-700',
  nature: 'from-green-500 to-emerald-700',
  religious: 'from-purple-500 to-indigo-700',
  beaches: 'from-cyan-500 to-blue-700',
  wildlife: 'from-lime-500 to-green-700',
  adventure: 'from-red-500 to-orange-700',
  'hill-stations': 'from-sky-500 to-indigo-700',
  culture: 'from-pink-500 to-rose-700',
};

const iconMap = {
  landmark: 'Landmark',
  trees: 'Trees',
  church: 'Church',
  waves: 'Waves',
  'paw-print': 'PawPrint',
  mountain: 'Mountain',
  'mountain-snow': 'MountainSnow',
  users: 'Users',
};

const fallbackImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e7e5e4%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';


// --------------------------------------------------
// Component
// --------------------------------------------------

export default function Explore() {
  const { stateId, districtId, categoryId } = useParams();

  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const { selectLocation } = useLocation();

  // ----------------------------------------------
  // Backend data
  // ----------------------------------------------

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [error, setError] = useState('');

  // ----------------------------------------------
  // Load states
  // ----------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadStates = async () => {
      setLoadingStates(true);
      setError('');

      const res = await statesApi.getStates();

      if (!mounted) return;

      if (res.ok) {
        const backendStates = Array.isArray(res.data) ? res.data : [];

        const mappedStates = backendStates.map((state) => ({
          ...state,
          image: state.imageUrl || fallbackImage,
          region: stateRegions[state.id] || 'South',
        }));

        setStates(mappedStates);
      } else {
        setError(res.error || 'Failed to load states');
      }

      setLoadingStates(false);
    };

    loadStates();

    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------------------------
  // Load districts whenever state changes
  // ----------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadDistricts = async () => {
      if (!stateId) {
        setDistricts([]);
        return;
      }

      setLoadingDistricts(true);
      setError('');

      
const res = await statesApi.getDistricts(stateId);

if (!mounted) return;

if (res.ok) {
  const backendDistricts = Array.isArray(res.data)
    ? res.data
    : [];

  setDistricts(
    backendDistricts.map((district) => ({
      ...district,
      image: district.imageUrl || fallbackImage,
      bannerImage: district.bannerUrl || fallbackImage,
      touristPlaces: 0,
    }))
  );
} else {
  setError(res.error || 'Failed to load districts');
  setDistricts([]);
}

setLoadingDistricts(false);
};

loadDistricts();

return () => {
  mounted = false;
};
}, [stateId]);

// ----------------------------------------------
// Load categories
// ----------------------------------------------

useEffect(() => {
  let mounted = true;

  const loadCategories = async () => {
    setLoadingCategories(true);
    setError('');

    const res = await categoriesApi.getCategories();

    if (!mounted) return;

    if (res.ok) {
      const backendCategories = Array.isArray(res.data)
        ? res.data
        : [];

      setCategories(
        backendCategories.map((category) => ({
          ...category,
          image: category.imageUrl || fallbackImage,
          color:
            categoryColors[category.slug] ||
            'from-primary-500 to-primary-700',
        }))
      );
    } else {
      setError(res.error || 'Failed to load categories');
      setCategories([]);
    }

    setLoadingCategories(false);
  };

  loadCategories();

  return () => {
    mounted = false;
  };
}, []);

// ----------------------------------------------
// Load places
//
// At category level we load places from backend.
// At district level we load places to determine
// which categories actually contain places.
// ----------------------------------------------

useEffect(() => {
  let mounted = true;

  const loadPlaces = async () => {
    if (!stateId || !districtId) {
      setPlaces([]);
      return;
    }

    setLoadingPlaces(true);
    setError('');

    const params = {
      state: stateId,
      district: districtId,
      size: 100,
      sortBy: 'rating',
      sortDir: 'desc',
    };

    const res = await placesApi.getPlaces(params);

    if (!mounted) return;

    if (res.ok) {
      const page = res.data || {};

      const content = Array.isArray(page.content)
        ? page.content
        : [];

      setPlaces(content);
    } else {
      setError(res.error || 'Failed to load tourist places');
      setPlaces([]);
    }

    setLoadingPlaces(false);
  };

  loadPlaces();

  return () => {
    mounted = false;
  };
}, [stateId, districtId]);

// ----------------------------------------------
// Selected state / district / category
// ----------------------------------------------

const selectedState = states.find(
  (state) => state.id === stateId
);

const selectedDistrict = districts.find(
  (district) => district.id === districtId
);

const selectedCategory = categories.find(
  (category) => category.id === categoryId
);

// ----------------------------------------------
// Update location context
// ----------------------------------------------

useEffect(() => {
  selectLocation(
    selectedState || null,
    selectedDistrict || null
  );
}, [
  selectedState,
  selectedDistrict,
  selectLocation,
]);

// ----------------------------------------------
// District tourist-place counts
// ----------------------------------------------

useEffect(() => {
  if (!stateId || districts.length === 0) return;

  let mounted = true;

  const loadDistrictCounts = async () => {
    const results = await Promise.all(
      districts.map(async (district) => {
        const res = await placesApi.getPlaces({
          state: stateId,
          district: district.id,
          size: 1,
        });

        if (!res.ok) {
          return {
            id: district.id,
            count: 0,
          };
        }

        return {
          id: district.id,
          count: res.data?.totalElements || 0,
        };
      })
    );

    if (!mounted) return;

    setDistricts((current) =>
      current.map((district) => {
        const result = results.find(
          (item) => item.id === district.id
        );

        return {
          ...district,
          touristPlaces: result?.count || 0,
        };
      })
    );
  };

  loadDistrictCounts();

  return () => {
    mounted = false;
  };
}, [stateId, districts.length]);

// ----------------------------------------------
// Categories available in selected district
// ----------------------------------------------

const availableCategories = useMemo(() => {
  if (!stateId || !districtId) return [];

  const usedCategoryIds = [
    ...new Set(
      places
        .map((place) => place.category?.id)
        .filter(Boolean)
    ),
  ];

  return categories.filter((category) =>
    usedCategoryIds.includes(category.id)
  );
}, [places, categories, stateId, districtId]);

// ----------------------------------------------
// Places for selected category
// ----------------------------------------------

const filteredPlaces = useMemo(() => {
  if (!categoryId) return [];

  let result = places.filter(
    (place) =>
      place.category?.id === categoryId
  );

  if (search.trim()) {
    const q = search.toLowerCase();

    result = result.filter((place) =>
      [
        place.name,
        place.city,
        place.shortDescription,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(q)
        )
    );
  }

  result = [...result];

  if (sortBy === 'rating') {
    result.sort(
      (a, b) =>
        (b.rating || 0) - (a.rating || 0)
    );
  } else if (sortBy === 'reviews') {
    result.sort(
      (a, b) =>
        (b.reviewsCount || 0) -
        (a.reviewsCount || 0)
    );
  } else if (sortBy === 'name') {
    result.sort((a, b) =>
      (a.name || '').localeCompare(
        b.name || ''
      )
    );
  }

  return result;
}, [places, categoryId, search, sortBy]);

// ----------------------------------------------
// Convert backend place to existing card format
// ----------------------------------------------

const mapDestination = (place) => ({
  ...place,

  image:
    place.imageUrl ||
    fallbackImage,

  stateId:
    place.state?.id ||
    stateId,

  state:
    place.state?.name ||
    selectedState?.name,

  districtId:
    place.district?.id ||
    districtId,

  district:
    place.district?.name ||
    selectedDistrict?.name,

  category:
    place.category?.id ||
    categoryId,

  categoryName:
    place.category?.name ||
    selectedCategory?.name,

  shortDescription:
    place.shortDescription ||
    '',

  reviewsCount:
    place.reviewsCount || 0,

  rating:
    place.rating || 0,
});

  // ----------------------------------------------
  // Loading screen
  // ----------------------------------------------

  const showLoading =
    (!stateId && loadingStates) ||
    (stateId && !districtId && loadingDistricts) ||
    (stateId &&
      districtId &&
      !categoryId &&
      (loadingCategories || loadingPlaces));

  if (showLoading) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-max px-4 text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-primary-500 mb-4"
          />

          <p className="text-stone-600 dark:text-stone-400">
            Loading Explore India...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------
  // Error
  // ----------------------------------------------

  if (error && !states.length && !stateId) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">
            Unable to load Explore India
          </h1>

          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==================================================
  // LEVEL 0: ALL STATES
  // ==================================================

  if (!stateId) {
    const filteredStates = states.filter((state) => {
      const matchesSearch =
        state.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesRegion =
        regionFilter === 'All' ||
        state.region === regionFilter;

      return matchesSearch && matchesRegion;
    });

    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">
              Explore India
            </p>

            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-4">
              All Indian States
            </h1>

            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Journey through India's diverse states and union territories.
              Select a state to explore its districts, categories, and tourist places.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">

            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search states..."
                className="input-field pl-12"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">

              <Filter
                size={18}
                className="text-stone-400 shrink-0"
              />

              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() =>
                    setRegionFilter(region)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    regionFilter === region
                      ? 'bg-primary-500 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {region}
                </button>
              ))}

            </div>
          </div>

          {filteredStates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {filteredStates.map((state) => (
                <StateCard
                  key={state.id}
                  state={state}
                />
              ))}

            </div>
          ) : (
            <div className="glass-card p-12 text-center">

              <Search
                size={48}
                className="mx-auto text-stone-400 mb-4"
              />

              <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                No states found
              </h3>

              <p className="text-stone-500 dark:text-stone-400">
                Try adjusting your search or filter.
              </p>

            </div>
          )}

        </div>
      </div>
    );
  }

  // ==================================================
  // LEVEL 1: DISTRICTS
  // ==================================================

  if (stateId && !districtId) {
    if (!selectedState) {
      return (
        <div className="pt-32 pb-16 container-max px-4 text-center">

          <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">
            State Not Found
          </h1>

          <p className="text-stone-600 dark:text-stone-400 mb-6">
            The state you're looking for doesn't exist.
          </p>

          <Link
            to="/explore"
            className="btn-primary"
          >
            Back to Explore
          </Link>

        </div>
      );
    }

    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">

          <Breadcrumb
            items={[
              {
                label: 'Explore',
                to: '/explore',
              },
              {
                label: selectedState.name,
              },
            ]}
          />

          <div className="relative h-64 rounded-4xl overflow-hidden mb-8">

            <img
              src={
                selectedState.image ||
                fallbackImage
              }
              alt={selectedState.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8">

              <p className="text-white/70 text-sm mb-1">
                {selectedState.region} India
              </p>

              <h1 className="text-4xl font-bold text-white mb-2">
                {selectedState.name}
              </h1>

              <div className="flex items-center gap-4 text-white/80 text-sm">

                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Capital: {selectedState.capital}
                </span>

                <span>
                  {districts.length} Districts
                </span>

              </div>

            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">

            <Link
              to="/explore"
              className="btn-ghost text-sm"
            >
              <ArrowLeft size={16} />
              Back to States
            </Link>

          </div>

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
              Districts of {selectedState.name}
            </h2>

            <p className="text-stone-600 dark:text-stone-400">
              Select a district to explore its tourist places by category.
            </p>

          </div>

          {districts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {districts.map((district) => (
                <Link
                  key={district.id}
                  to={`/explore/${stateId}/${district.id}`}
                  className="group relative overflow-hidden rounded-3xl card-hover"
                >

                  <div className="relative h-56">

                    <img
                      src={district.image || fallbackImage}
                      alt={district.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-5">

                    <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
                      <Building size={14} />
                      <span>District</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">
                      {district.name}
                    </h3>

                    <div className="flex items-center justify-between">

                      <span className="text-sm text-white/70">
                        {district.touristPlaces || 0} Tourist Places
                      </span>

                      <span className="flex items-center gap-1 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        Explore
                        <ChevronRight size={14} />
                      </span>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          ) : (
            <div className="glass-card p-12 text-center">

              <Building
                size={48}
                className="mx-auto text-stone-400 mb-4"
              />

              <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                Districts coming soon
              </h3>

              <p className="text-stone-500 dark:text-stone-400">
                We're adding districts for {selectedState.name}. Check back soon!
              </p>

            </div>
          )}

        </div>
      </div>
    );
  }

  // ==================================================
  // LEVEL 2: CATEGORIES
  // ==================================================

  if (stateId && districtId && !categoryId) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">

          <Breadcrumb
            items={[
              {
                label: 'Explore',
                to: '/explore',
              },
              {
                label: selectedState?.name,
                to: `/explore/${stateId}`,
              },
              {
                label:
                  selectedDistrict?.name ||
                  districtId,
              },
            ]}
          />

          <div className="relative h-48 rounded-4xl overflow-hidden mb-8">

            <img
              src={
                selectedDistrict?.image ||
                fallbackImage
              }
              alt={selectedDistrict?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6">

              <div className="flex items-center gap-1.5 text-white/70 text-sm mb-1">
                <MapPin size={14} />
                {selectedState?.name}
              </div>

              <h1 className="text-3xl font-bold text-white">
                {selectedDistrict?.name} District
              </h1>

            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">

            <Link
              to={`/explore/${stateId}`}
              className="btn-ghost text-sm"
            >
              <ArrowLeft size={16} />
              Back to Districts
            </Link>

          </div>

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
              Choose a Category
            </h2>

            <p className="text-stone-600 dark:text-stone-400">
              Browse tourist places in {selectedDistrict?.name} by category.
            </p>

          </div>

          {availableCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

              {availableCategories.map((cat) => {

                const iconName =
                  iconMap[cat.icon] ||
                  'Sparkles';

                const Icon =
                  Icons[iconName] ||
                  Icons.Sparkles;

                const count = places.filter(
                  (place) =>
                    place.category?.id ===
                    cat.id
                ).length;

                return (
                  <Link
                    key={cat.id}
                    to={`/explore/${stateId}/${districtId}/${cat.id}`}
                    className="group relative overflow-hidden rounded-3xl card-hover"
                  >

                    <div className="relative h-44">

                      <img
                        src={
                          cat.image ||
                          fallbackImage
                        }
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = fallbackImage;
                        }}
                      />

                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          cat.color ||
                          'from-primary-500 to-primary-700'
                        } opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
                      />

                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">

                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">

                        <Icon size={24} />

                      </div>

                      <h3 className="text-base font-bold">
                        {cat.name}
                      </h3>

                      <p className="text-xs text-white/80">
                        {count}{' '}
                        {count === 1
                          ? 'place'
                          : 'places'}
                      </p>

                    </div>

                  </Link>
                );
              })}

            </div>
          ) : (
            <div className="glass-card p-12 text-center">

              <Grid
                size={48}
                className="mx-auto text-stone-400 mb-4"
              />

              <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                No categories available
              </h3>

              <p className="text-stone-500 dark:text-stone-400">
                We're adding tourist places for {selectedDistrict?.name}. Check back soon!
              </p>

            </div>
          )}

        </div>
      </div>
    );
  }

  // ==================================================
  // LEVEL 3: TOURIST PLACES
  // ==================================================

  const breadcrumbItems = [
    {
      label: 'Explore',
      to: '/explore',
    },
    {
      label: selectedState?.name,
      to: `/explore/${stateId}`,
    },
    {
      label:
        selectedDistrict?.name ||
        districtId,
      to: `/explore/${stateId}/${districtId}`,
    },
    {
      label:
        selectedCategory?.name ||
        categoryId,
    },
  ];

  const mappedPlaces =
    filteredPlaces.map(mapDestination);

  return (
    <div className="pt-24 pb-16">

      <div className="container-max px-4 sm:px-6 lg:px-8">

        <Breadcrumb
          items={breadcrumbItems}
        />

        <div className="glass-card p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                selectedCategory?.color ||
                'from-primary-500 to-primary-700'
              } flex items-center justify-center shrink-0`}
            >

              {(() => {

                const iconName =
                  iconMap[
                    selectedCategory?.icon
                  ] || 'Sparkles';

                const Icon =
                  Icons[iconName] ||
                  Icons.Sparkles;

                return (
                  <Icon
                    size={28}
                    className="text-white"
                  />
                );

              })()}

            </div>

            <div>

              <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                {selectedCategory?.name}
              </h1>

              <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <MapPin size={14} />
                {selectedDistrict?.name},{' '}
                {selectedState?.name}
              </p>

            </div>

          </div>

          <Link
            to={`/explore/${stateId}/${districtId}`}
            className="btn-ghost text-sm"
          >
            <ArrowLeft size={16} />
            Change Category
          </Link>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">

          <div className="flex-1 relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={`Search ${
                selectedCategory?.name?.toLowerCase() ||
                'places'
              } in ${
                selectedDistrict?.name ||
                'district'
              }...`}
              className="input-field pl-12"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                <X size={18} />
              </button>
            )}

          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="px-4 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-300 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option value="rating">
              Sort by Rating
            </option>

            <option value="reviews">
              Sort by Reviews
            </option>

            <option value="name">
              Sort by Name
            </option>
          </select>

        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
          Showing{' '}
          <span className="font-bold text-stone-900 dark:text-white">
            {mappedPlaces.length}
          </span>{' '}
          {mappedPlaces.length === 1
            ? 'place'
            : 'places'}
        </p>

        {mappedPlaces.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {mappedPlaces.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}

          </div>

        ) : (

          <div className="glass-card p-12 text-center">

            <MapPin
              size={48}
              className="mx-auto text-stone-400 mb-4"
            />

            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
              No places found
            </h3>

            <p className="text-stone-500 dark:text-stone-400 mb-6">

              {search
                ? `No ${
                    selectedCategory?.name?.toLowerCase() ||
                    'places'
                  } match your search "${search}".`
                : `No ${
                    selectedCategory?.name?.toLowerCase() ||
                    'places'
                  } found in ${
                    selectedDistrict?.name ||
                    'this district'
                  } yet.`}

            </p>

            {!search && (
              <Link
                to={`/explore/${stateId}/${districtId}`}
                className="btn-primary"
              >
                Browse Other Categories
              </Link>
            )}

          </div>

        )}

      </div>

    </div>
  );
}