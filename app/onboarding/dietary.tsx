import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../lib/auth-context';

export default function DietaryScreen() {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAuth();

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, but dairy and eggs are okay' },
    { value: 'vegan', label: 'Vegan', description: 'No animal products at all' },
    { value: 'pescatarian', label: 'Pescatarian', description: 'Fish and seafood okay, but no other meat' },
    { value: 'keto', label: 'Ketogenic', description: 'Low carb, high fat diet' },
    { value: 'paleo', label: 'Paleo', description: 'Whole foods, no processed foods' },
    { value: 'gluten_free', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
    { value: 'dairy_free', label: 'Dairy-Free', description: 'No milk or dairy products' },
    { value: 'none', label: 'No Restrictions', description: 'I eat everything' },
  ];

  const togglePreference = (value: string) => {
    if (value === 'none') {
      setPreferences(['none']);
    } else {
      setPreferences(prev => {
        const filtered = prev.filter(p => p !== 'none');
        if (filtered.includes(value)) {
          return filtered.filter(p => p !== value);
        } else {
          return [...filtered, value];
        }
      });
    }
  };

  const handleComplete = async () => {
    if (preferences.length === 0) {
      Alert.alert('Error', 'Please select at least one dietary preference');
      return;
    }

    setIsLoading(true);
    try {
      // Get all onboarding data
      const keys = [
        'onboarding_name',
        'onboarding_age',
        'onboarding_height',
        'onboarding_weight',
        'onboarding_gender',
        'onboarding_goal',
      ];

      const values = await AsyncStorage.multiGet(keys);
      const onboardingData = Object.fromEntries(values);

      // Add dietary preferences
      onboardingData.dietary_preferences = JSON.stringify(preferences);

      // Save complete profile
      await AsyncStorage.setItem('user_profile', JSON.stringify(onboardingData));
      await AsyncStorage.setItem('onboarding_completed', JSON.stringify(true));

      // Update auth context
      setHasCompletedOnboarding(true);

      // Navigation will be handled by root layout
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Dietary Preferences
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Let us know about any dietary restrictions or preferences
          </Text>

          {dietaryOptions.map((option) => (
            <View key={option.value} style={styles.optionItem}>
              <Checkbox.Item
                label={option.label}
                status={preferences.includes(option.value) ? 'checked' : 'unchecked'}
                onPress={() => togglePreference(option.value)}
                labelStyle={styles.optionLabel}
              />
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          ))}

          <Button
            mode="contained"
            onPress={handleComplete}
            loading={isLoading}
            disabled={isLoading || preferences.length === 0}
            style={styles.button}
          >
            Complete Setup
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 20,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#4CAF50',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  optionItem: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 5,
  },
  optionLabel: {
    fontWeight: 'bold',
  },
  optionDescription: {
    marginLeft: 50,
    marginTop: -5,
    marginBottom: 10,
    fontSize: 12,
    opacity: 0.7,
  },
  button: {
    marginTop: 20,
  },
});
