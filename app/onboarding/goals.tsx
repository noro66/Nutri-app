import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss', description: 'Lose weight in a healthy way' },
    { value: 'weight_gain', label: 'Weight Gain', description: 'Gain muscle mass and weight' },
    { value: 'maintain', label: 'Maintain Weight', description: 'Keep current weight and stay healthy' },
    { value: 'muscle_gain', label: 'Build Muscle', description: 'Increase muscle mass and strength' },
    { value: 'general_health', label: 'General Health', description: 'Improve overall health and wellness' },
  ];

  const handleNext = async () => {
    if (!selectedGoal) {
      Alert.alert('Error', 'Please select a fitness goal');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('onboarding_goal', selectedGoal);
      router.push('/onboarding/dietary');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your goal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            What's your fitness goal?
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            We'll tailor your nutrition plan to help you achieve this goal
          </Text>

          <RadioButton.Group onValueChange={setSelectedGoal} value={selectedGoal}>
            {goals.map((goal) => (
              <View key={goal.value} style={styles.goalItem}>
                <RadioButton.Item
                  label={goal.label}
                  value={goal.value}
                  labelStyle={styles.goalLabel}
                />
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleNext}
            loading={isLoading}
            disabled={isLoading || !selectedGoal}
            style={styles.button}
          >
            Continue
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
  goalItem: {
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 5,
  },
  goalLabel: {
    fontWeight: 'bold',
  },
  goalDescription: {
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
