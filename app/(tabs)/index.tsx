import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../lib/auth-context';
import { nutritionService, MealPlan, Meal, UserProfile } from '../../lib/nutrition-service';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        const userProfile: UserProfile = {
          name: profile.onboarding_name || 'User',
          age: parseInt(profile.onboarding_age) || 25,
          height: parseFloat(profile.onboarding_height) || 170,
          weight: parseFloat(profile.onboarding_weight) || 70,
          gender: profile.onboarding_gender || 'other',
          goal: profile.onboarding_goal || 'general_health',
          dietaryPreferences: profile.dietary_preferences ? JSON.parse(profile.dietary_preferences) : ['none'],
        };
        setUserProfile(userProfile);

        // Check if we have a saved meal plan for today
        const savedPlan = await AsyncStorage.getItem('current_meal_plan');
        if (savedPlan) {
          const plan = JSON.parse(savedPlan);
          const today = new Date().toISOString().split('T')[0];
          if (plan.date === today) {
            setMealPlan(plan);
            setLoading(false);
            return;
          }
        }

        // Generate new meal plan
        await generateNewMealPlan(userProfile);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const generateNewMealPlan = async (profile: UserProfile) => {
    try {
      setLoading(true);
      const newPlan = await nutritionService.generateMealPlan(profile);
      setMealPlan(newPlan);
      await AsyncStorage.setItem('current_meal_plan', JSON.stringify(newPlan));
    } catch (error) {
      console.error('Error generating meal plan:', error);
      Alert.alert('Error', 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!userProfile) return;

    setRefreshing(true);
    try {
      await generateNewMealPlan(userProfile);
    } catch (error) {
      console.error('Error refreshing meal plan:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const regenerateMeal = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!userProfile || !mealPlan) return;

    try {
      const newMeal = await nutritionService.regenerateMeal(mealType, userProfile.dietaryPreferences);
      const updatedMeals = mealPlan.meals.map(meal =>
        meal.type === mealType ? newMeal : meal
      );

      const updatedPlan = {
        ...mealPlan,
        meals: updatedMeals,
        totalCalories: updatedMeals.reduce((sum, meal) => sum + meal.calories, 0),
        totalProtein: updatedMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: updatedMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: updatedMeals.reduce((sum, meal) => sum + meal.fat, 0),
      };

      setMealPlan(updatedPlan);
      await AsyncStorage.setItem('current_meal_plan', JSON.stringify(updatedPlan));
    } catch (error) {
      console.error('Error regenerating meal:', error);
      Alert.alert('Error', 'Failed to regenerate meal');
    }
  };

  const navigateToMealDetail = (meal: Meal) => {
    router.push({
      pathname: '/meal-detail',
      params: { mealData: JSON.stringify(meal) }
    });
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <TouchableOpacity onPress={() => navigateToMealDetail(item)}>
      <Card style={styles.mealCard}>
        <Card.Content>
          <View style={styles.mealHeader}>
            <Text variant="titleMedium" style={styles.mealType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text variant="bodySmall" style={styles.calories}>
              {item.calories} cal
            </Text>
          </View>

          <Text variant="titleLarge" style={styles.mealName}>
            {item.name}
          </Text>

          <Text variant="bodyMedium" style={styles.description}>
            {item.description}
          </Text>

          <View style={styles.macros}>
            <Text style={styles.macro}>P: {item.protein}g</Text>
            <Text style={styles.macro}>C: {item.carbs}g</Text>
            <Text style={styles.macro}>F: {item.fat}g</Text>
          </View>

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={(e) => {
                e.stopPropagation();
                regenerateMeal(item.type);
              }}
              style={styles.regenerateButton}
              compact
            >
              Regenerate
            </Button>
            <Button
              mode="text"
              onPress={() => navigateToMealDetail(item)}
              compact
            >
              View Details
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading && !mealPlan) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Generating your personalized meal plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Welcome back, {userProfile?.name || 'User'}!
        </Text>
        {mealPlan && (
          <View style={styles.summary}>
            <Text variant="titleMedium" style={styles.summaryTitle}>Today's Nutrition</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>🔥 {mealPlan.totalCalories} cal</Text>
              <Text style={styles.summaryItem}>💪 {mealPlan.totalProtein}g protein</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>🌾 {mealPlan.totalCarbs}g carbs</Text>
              <Text style={styles.summaryItem}>🥑 {mealPlan.totalFat}g fat</Text>
            </View>
          </View>
        )}
      </View>

      {mealPlan ? (
        <FlatList
          data={mealPlan.meals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text variant="bodyLarge">No meal plan available</Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            Generate Meal Plan
          </Button>
        </View>
      )}

      <FAB
        icon="logout"
        style={styles.fab}
        onPress={logout}
        label="Logout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  welcomeText: {
    color: 'white',
    marginBottom: 10,
  },
  summary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
  },
  summaryTitle: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  summaryItem: {
    color: 'white',
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  mealCard: {
    marginBottom: 15,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealType: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  calories: {
    color: '#666',
  },
  mealName: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
    opacity: 0.8,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  macro: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regenerateButton: {
    flex: 1,
    marginRight: 8,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
