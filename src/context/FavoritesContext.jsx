import React, { createContext, useState, useContext, useEffect } from 'react';

export const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('darmax_favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('darmax_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
