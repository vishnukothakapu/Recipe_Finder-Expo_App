import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (recipe) => {
    setFavorites((currentFavorites) => {
      const isFavorited = currentFavorites.some(
        (item) => item.idMeal === recipe.idMeal
      );
      const newFavorites = isFavorited
        ? currentFavorites.filter((item) => item.idMeal !== recipe.idMeal)
        : [...currentFavorites, recipe];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.idMeal === id);
  };

  return (
    <RecipeContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}