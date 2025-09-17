import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="name" />
      <Stack.Screen name="biometrics" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="dietary" />
    </Stack>
  );
}
