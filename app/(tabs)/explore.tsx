import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../lib/auth-context';
import { UserProfile } from '../../lib/nutrition-service';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
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
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (!userProfile) return 0;
    const heightInM = userProfile.height / 100;
    return (userProfile.weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#2196F3' };
    if (bmi < 25) return { category: 'Normal weight', color: '#4CAF50' };
    if (bmi < 30) return { category: 'Overweight', color: '#FF9800' };
    return { category: 'Obese', color: '#F44336' };
  };

  const formatGoal = (goal: string) => {
    return goal.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPreferences = (preferences: string[]) => {
    if (preferences.includes('none')) return 'No restrictions';
    return preferences.map(pref =>
      pref.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  };

  if (loading || !userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Your Profile
        </Text>
        <Text variant="bodyMedium" style={styles.emailText}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Personal Information
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{userProfile.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{userProfile.age} years</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Height:</Text>
              <Text style={styles.value}>{userProfile.height} cm</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Weight:</Text>
              <Text style={styles.value}>{userProfile.weight} kg</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Health Metrics
            </Text>

            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>Body Mass Index (BMI)</Text>
              <Text style={[styles.bmiValue, { color: bmiInfo.color }]}>
                {bmi}
              </Text>
              <Text style={[styles.bmiCategory, { color: bmiInfo.color }]}>
                {bmiInfo.category}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Goals & Preferences
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Fitness Goal:</Text>
              <Text style={styles.value}>{formatGoal(userProfile.goal)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Dietary Preferences:</Text>
              <Text style={styles.value}>{formatPreferences(userProfile.dietaryPreferences)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Account Actions
            </Text>

            <Button
              mode="outlined"
              onPress={logout}
              style={styles.logoutButton}
              icon="logout"
            >
              Sign Out
            </Button>
          </Card.Content>
        </Card>
      </View>
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
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    marginBottom: 5,
  },
  emailText: {
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#4CAF50',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  bmiContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  bmiLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 10,
  },
});
