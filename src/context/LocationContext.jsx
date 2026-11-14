import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const selectLocation = useCallback((state, district) => {
    setSelectedState(state);
    setSelectedDistrict(district);
  }, []);

  const clearLocation = useCallback(() => {
    setSelectedState(null);
    setSelectedDistrict(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedState,
      selectedDistrict,
      selectLocation,
      clearLocation,
    }),
    [selectedState, selectedDistrict, selectLocation, clearLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    return { selectedState: null, selectedDistrict: null, selectLocation: () => {}, clearLocation: () => {} };
  }
  return ctx;
}

export default LocationContext;
