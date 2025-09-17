# Nutri-App

A React Native nutrition planning application built with Expo and TypeScript that provides personalized meal plans based on user preferences and fitness goals.

## ✨ Features

- 🔐 **User Authentication**: Simulated login/signup system with local storage persistence
- 📋 **4-Step Onboarding Flow**: 
  - Name collection
  - Biometric data (age, height, weight, gender)
  - Fitness goal selection
  - Dietary preferences
- 🍽️ **Daily Meal Planning**: Mock nutrition service that generates complete daily meal plans (breakfast, lunch, dinner, snack)
- 📅 **Weekly Planning**: Generate and manage weekly meal plans with 7-day views
- 🔄 **Meal Regeneration**: Regenerate individual meals or entire daily plans
- 📊 **Nutrition Tracking**: Displays calories, protein, carbs, and fat content for meals
- 📱 **Material Design UI**: Clean interface using React Native Paper components
- 💾 **Offline Storage**: AsyncStorage for user data and meal plan persistence

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: Expo Router with file-based routing
- **Storage**: AsyncStorage for local data persistence
- **Authentication**: Simulated auth system (email/password validation)

## 📱 App Structure

```
Authentication Flow:
Login/Signup → Onboarding (4 steps) → Main App (Tabs)

Main App Tabs:
- Dashboard: Daily meal plans with regeneration options
- Weekly: 7-day meal planning view  
- Profile: User information and health metrics
```

## 🏗️ Project Architecture

```
app/
├── _layout.tsx              # Root layout with auth and theme providers
├── auth/                    # Authentication screens
│   ├── login.tsx           # Email/password login
│   └── signup.tsx          # User registration
├── onboarding/             # 4-step onboarding flow
│   ├── _layout.tsx         # Onboarding layout
│   ├── name.tsx            # Name collection step
│   ├── biometrics.tsx      # Age, height, weight, gender
│   ├── goals.tsx           # Fitness goals selection
│   └── dietary.tsx         # Dietary preferences
├── (tabs)/                 # Main app navigation
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Daily meal plan dashboard
│   ├── weekly.tsx          # Weekly meal planning
│   └── explore.tsx         # User profile and settings
└── meal-detail.tsx         # Individual meal details view

lib/
├── auth-context.tsx        # Authentication state management
├── nutrition-service.ts    # Mock meal plan generation service
└── weekly-planning-service.ts # Weekly meal planning logic
```

## 🔧 Current Implementation

### Authentication System
- **Local Storage**: Uses AsyncStorage to simulate user sessions
- **Validation**: Email format and 6+ character password requirements
- **State Management**: React Context for auth state across the app

### Onboarding Process
1. **Name Collection**: Basic user identification
2. **Biometrics**: Age, height (cm), weight (kg), gender selection
3. **Goals**: Fitness objectives (weight loss, muscle gain, maintenance)
4. **Dietary Preferences**: Vegetarian, vegan, gluten-free options

### Meal Planning Service
- **Mock Data**: Pre-defined meal database with nutritional information
- **Dietary Filtering**: Meals filtered based on user preferences
- **Nutrition Calculation**: Automatic calorie, protein, carb, and fat totals
- **Randomization**: Different meal combinations on each generation

### Data Storage
- User profiles stored in AsyncStorage
- Meal plans cached locally
- Onboarding completion status tracked
- Weekly plans persist between app sessions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Expo Go app (for testing)

### Installation
```bash
git clone https://github.com/noro66/Nutri-app.git
cd Nutri-app
npm install
npx expo start
```

### Usage Flow
1. **Sign Up/Login**: Create account with email/password
2. **Complete Onboarding**: Provide personal information through 4 steps
3. **View Daily Plan**: See generated meal plan on dashboard
4. **Regenerate Meals**: Tap refresh to get new meal suggestions
5. **Weekly Planning**: Switch to weekly tab for 7-day overview
6. **Profile Management**: View BMI and health metrics

## 📊 Meal Plan Features

### Meal Types Included
- **Breakfast**: Protein oatmeal, avocado toast, etc.
- **Lunch**: Grilled chicken salad, quinoa bowls, etc.
- **Dinner**: Salmon with vegetables, lentil curry, etc.
- **Snacks**: Greek yogurt, hummus with vegetables, etc.

### Nutrition Information
- Detailed calorie counts per meal
- Macronutrient breakdown (protein, carbs, fat)
- Ingredient lists and preparation instructions
- Daily nutrition totals and averages

## 🔮 Technical Notes

- **Mock Services**: Nutrition data is simulated (ready for real API integration)
- **Offline First**: All data stored locally using AsyncStorage
- **TypeScript**: Full type safety throughout the application
- **Material Design**: Consistent UI following Material Design principles
- **Performance**: Optimized with React Native best practices

## 🚧 Future Enhancement Opportunities

- Real nutrition API integration (Spoonacular, Edamam, etc.)
- Firebase authentication and cloud sync
- Push notifications for meal reminders
- Grocery list generation from meal plans
- Progress tracking and analytics
- Social features and meal sharing
- Recipe customization and favorites

## 👨‍💻 Development

This app demonstrates a complete React Native nutrition planning workflow with authentication, onboarding, and meal planning features using modern React Native development practices.

**Note**: Currently uses mock data and simulated authentication - production deployment would require real API integration and secure authentication services.
