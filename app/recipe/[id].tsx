import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Youtube, ArrowBigLeft, Home, HomeIcon } from 'lucide-react-native';
import { useRecipes } from '../../context/RecipeContext';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const { toggleFavorite, isFavorite } = useRecipes();

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setRecipe(data.meals[0]);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3b30" />
      </View>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ingredient,measure});
    }
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <View style={styles.overlay} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(recipe)}>
          <Heart
            size={28}
            color={isFavorite(recipe.idMeal) ? '#ff3b30' : '#fff'}
            fill={isFavorite(recipe.idMeal) ? '#ff3b30' : 'none'}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.category}>{recipe.strCategory}</Text>
          <Text style={styles.title}>{recipe.strMeal}</Text>
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineText}>{recipe.strArea} Cuisine</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {ingredients.map(({ingredient,measure},index) => (
              <View key={index} style={styles.ingredientItem}>
               
                  <Text style={styles.ingredientName}>{ingredient}</Text>
                  <Text style={styles.ingredientMeasure}>{measure}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.strInstructions}</Text>
        </View>

        {recipe.strYoutube && (
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={() => Linking.openURL(recipe.strYoutube)}>
            <Youtube size={24} color="#fff" />
            <Text style={styles.youtubeButtonText}>Watch Video Tutorial</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: 400,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  category: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cuisineTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  cuisineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 20,
  },
  ingredientsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  ingredientName: {
    fontSize: 16,
    color: '#1c1c1e',
    flex: 1,
  },

  ingredientMeasure: {
    fontSize: 16,
    color: '#1c1c1e',
    textAlign: 'right',
    width: 80,
  },

  instructions: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 10,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10ac84',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  youtubeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});