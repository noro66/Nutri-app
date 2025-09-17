});
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BiometricsScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const handleNext = async () => {
    if (!age || !height || !weight || !gender) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum < 13 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age between 13 and 120');
      return;
    }

    if (heightNum < 100 || heightNum > 250) {
      Alert.alert('Error', 'Please enter a valid height in cm (100-250)');
      return;
    }

    if (weightNum < 30 || weightNum > 300) {
      Alert.alert('Error', 'Please enter a valid weight in kg (30-300)');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.multiSet([
        ['onboarding_age', age],
        ['onboarding_height', height],
        ['onboarding_weight', weight],
        ['onboarding_gender', gender],
      ]);
      router.push('/onboarding/goals');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Tell us about yourself
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            This helps us create personalized nutrition plans
          </Text>

          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Gender
          </Text>
          <SegmentedButtons
            value={gender}
            onValueChange={setGender}
            buttons={genderOptions}
            style={styles.segmentedButtons}
          />

          <Button
            mode="contained"
            onPress={handleNext}
            loading={isLoading}
            disabled={isLoading || !age || !height || !weight || !gender}
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
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#4CAF50',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
