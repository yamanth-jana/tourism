import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { favoritesApi } from '../services/api';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('explore-india-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch initial favorites from backend
  useEffect(() => {
    async function loadFavorites() {
      const res = await favoritesApi.getFavorites();
      if (res.ok && Array.isArray(res.data)) {
        setFavorites(res.data);
      }
    }
    loadFavorites();
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        favoritesApi.removeFavorite(id).catch(() => {});
        const updated = prev.filter((f) => f !== id);
        try { localStorage.setItem('explore-india-favorites', JSON.stringify(updated)); } catch {}
        return updated;
      } else {
        favoritesApi.addFavorite(id).catch(() => {});
        const updated = [...prev, id];
        try { localStorage.setItem('explore-india-favorites', JSON.stringify(updated)); } catch {}
        return updated;
      }
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
