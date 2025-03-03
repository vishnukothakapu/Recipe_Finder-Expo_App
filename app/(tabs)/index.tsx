import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { Heart, Search } from 'lucide-react-native';
import { useRecipes } from '../../context/RecipeContext';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
   const [categories, setCategories] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useRecipes();

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

    const fetchRecipes = async (search = '', category = '') => {
      try {
        setLoading(true);
        let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

        if (search) {
          url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`;
        } else if (category) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
const fetchCategories = async () => {
  try {
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    const data = await response.json();
    setCategories(data.categories || []);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
  const handleSearch = (text) => {
    setSearchQuery(text);
    setSelectedCategory(null);
    fetchRecipes(text);
  };
    const handleCategoryPress = (category) => {
      setSelectedCategory(category);
      setSearchQuery('');
      fetchRecipes('', category);
    };


  const renderRecipeCard = ({ item }) => (
    <View style={styles.card}>
      <Link href={`/recipe/${item.idMeal}`} asChild>
        <TouchableOpacity style={styles.cardContent}>
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
          <View style={styles.overlay} />
          <View style={styles.cardInfo}>
            <Text style={styles.category}>{item.strCategory}</Text>
            <Text style={styles.title} numberOfLines={2}>{item.strMeal}</Text>
            <View style={styles.cuisineTag}>
              <Text style={styles.cuisineText}>{item.strArea} Cuisine</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item)}>
        <View style={styles.favoriteIconBg}>
          <Heart
            size={22}
            color={isFavorite(item.idMeal) ? '#ff3b30' : '#ffffff'}
            fill={isFavorite(item.idMeal) ? '#ff3b30' : 'none'}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello 👋🏻</Text>
        <Text style={styles.headerTitle}>
          What would you like to cook today?
        </Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.idCategory}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.strCategory &&
                    styles.categorySelected,
                ]}
                onPress={() => handleCategoryPress(item.strCategory)}
              >
                <Image
                  source={{ uri: item.strCategoryThumb }}
                  style={styles.categoryImage}
                />
                <View style={styles.categoryOverlay} />
                <Text style={styles.categoryText}>{item.strCategory}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#10ac84" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1c1c1e',
  },
  list: {
    padding: 16,
  },
  categoryList: {
    paddingVertical: 16,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  categoryItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    borderRadius: 12,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  categoryText: {
    position: 'absolute',
    zIndex: 2,
    bottom: 8,
    left: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  categorySelected: {
    backgroundColor: '#f0f0f0',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  category: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cuisineTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cuisineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  favoriteIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});