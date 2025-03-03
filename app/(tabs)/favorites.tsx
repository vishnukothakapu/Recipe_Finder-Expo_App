import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useRecipes } from '../../context/RecipeContext';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useRecipes();

  const renderFavoriteCard = ({ item }) => (
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
          <Heart size={22} color="#ff3b30" fill="#ff3b30" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Your Collection</Text>
        <Text style={styles.headerTitle}>Favorite Recipes</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Heart size={48} color="#ff3b30" />
          </View>
          <Text style={styles.emptyStateText}>No favorite recipes yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Save your favorite recipes here by tapping the heart icon
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCard}
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
  },
  list: {
    padding: 16,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});