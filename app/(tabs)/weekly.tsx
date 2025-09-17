import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../lib/auth-context';
import { UserProfile } from '../../lib/nutrition-service';
import { weeklyPlanningService, WeeklyMealPlan } from '../../lib/weekly-planning-service';

export default function WeeklyPlanScreen() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadWeeklyPlan();
  }, []);

  const loadWeeklyPlan = async () => {
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

        // Try to load existing weekly plan
        const existingPlan = await weeklyPlanningService.getWeeklyMealPlan();
        if (existingPlan) {
          setWeeklyPlan(existingPlan);
        } else {
          // Generate new weekly plan
          await generateWeeklyPlan(userProfile);
        }
      }
    } catch (error) {
      console.error('Error loading weekly plan:', error);
      Alert.alert('Error', 'Failed to load weekly plan');
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyPlan = async (profile: UserProfile) => {
    try {
      setLoading(true);
      const newPlan = await weeklyPlanningService.generateWeeklyMealPlan(profile);
      setWeeklyPlan(newPlan);
    } catch (error) {
      console.error('Error generating weekly plan:', error);
      Alert.alert('Error', 'Failed to generate weekly plan');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!userProfile) return;

    setRefreshing(true);
    try {
      await generateWeeklyPlan(userProfile);
    } catch (error) {
      console.error('Error refreshing weekly plan:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  if (loading && !weeklyPlan) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Generating your weekly meal plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Weekly Meal Plan
        </Text>
        {weeklyPlan && (
          <View style={styles.weekInfo}>
            <Text style={styles.weekRange}>
              {formatDate(weeklyPlan.weekStart)} - {formatDate(weeklyPlan.weekEnd)}
            </Text>
            <Text style={styles.avgCalories}>
              Avg: {weeklyPlan.avgCaloriesPerDay} cal/day
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {weeklyPlan ? (
          <View style={styles.content}>
            {weeklyPlan.days.map((day) => (
              <Card key={day.date} style={[
                styles.dayCard,
                isToday(day.date) && styles.todayCard
              ]}>
                <Card.Content>
                  <View style={styles.dayHeader}>
                    <View>
                      <Text variant="titleLarge" style={styles.dayName}>
                        {day.dayName}
                      </Text>
                      <Text variant="bodyMedium" style={styles.dayDate}>
                        {formatDate(day.date)}
                      </Text>
                    </View>
                    {isToday(day.date) && (
                      <Chip mode="flat" style={styles.todayChip}>
                        Today
                      </Chip>
                    )}
                  </View>

                  <View style={styles.dayNutrition}>
                    <Text style={styles.nutritionText}>
                      🔥 {day.mealPlan.totalCalories} cal
                    </Text>
                    <Text style={styles.nutritionText}>
                      💪 {day.mealPlan.totalProtein}g protein
                    </Text>
                    <Text style={styles.nutritionText}>
                      🌾 {day.mealPlan.totalCarbs}g carbs
                    </Text>
                    <Text style={styles.nutritionText}>
                      🥑 {day.mealPlan.totalFat}g fat
                    </Text>
                  </View>

                  <View style={styles.mealsPreview}>
                    {day.mealPlan.meals.map((meal) => (
                      <View key={meal.id} style={styles.mealPreview}>
                        <Text style={styles.mealType}>
                          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}:
                        </Text>
                        <Text style={styles.mealName} numberOfLines={1}>
                          {meal.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card.Content>
              </Card>
            ))}

            <View style={styles.weekSummary}>
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.summaryTitle}>
                    Week Summary
                  </Text>
                  <Text style={styles.summaryText}>
                    Total Calories: {weeklyPlan.totalCaloriesWeek.toLocaleString()}
                  </Text>
                  <Text style={styles.summaryText}>
                    Average per Day: {weeklyPlan.avgCaloriesPerDay} calories
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text variant="bodyLarge">No weekly plan available</Text>
            <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
              Generate Weekly Plan
            </Button>
          </View>
        )}
      </ScrollView>
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
  headerText: {
    color: 'white',
    marginBottom: 10,
  },
  weekInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekRange: {
    color: 'white',
    fontSize: 16,
  },
  avgCalories: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  dayCard: {
    marginBottom: 15,
    elevation: 2,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayName: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  dayDate: {
    opacity: 0.7,
  },
  todayChip: {
    backgroundColor: '#4CAF50',
  },
  dayNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  nutritionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mealsPreview: {
    gap: 8,
  },
  mealPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 70,
  },
  mealName: {
    fontSize: 12,
    flex: 1,
    opacity: 0.8,
  },
  weekSummary: {
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: '#4CAF50',
  },
  summaryTitle: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
  },
});
