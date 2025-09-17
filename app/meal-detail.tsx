import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MealDetailScreen() {
  const { mealData } = useLocalSearchParams();
  const router = useRouter();

  // Parse meal data from params
  const meal = mealData ? JSON.parse(mealData as string) : null;

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge">Meal not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => router.back()}
          icon="arrow-left"
          style={styles.backButton}
        >
          Back
        </Button>
        <Text variant="headlineSmall" style={styles.mealName}>
          {meal.name}
        </Text>
        <Chip mode="outlined" style={styles.mealTypeChip}>
          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
        </Chip>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {meal.description}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Nutrition Facts
          </Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Ionicons name="flame" size={20} color="#FF6B35" />
              <Text style={styles.nutritionValue}>{meal.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="fitness" size={20} color="#4CAF50" />
              <Text style={styles.nutritionValue}>{meal.protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="leaf" size={20} color="#FFC107" />
              <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Ionicons name="water" size={20} color="#2196F3" />
              <Text style={styles.nutritionValue}>{meal.fat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Ingredients
          </Text>
          {meal.ingredients.map((ingredient: string, index: number) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Instructions
          </Text>
          {meal.instructions.map((instruction: string, index: number) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    paddingTop: 60,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  mealName: {
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  mealTypeChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#4CAF50',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    opacity: 0.8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    alignItems: 'center',
    minWidth: '20%',
    marginVertical: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    marginLeft: 8,
    fontSize: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 40,
  },
});
