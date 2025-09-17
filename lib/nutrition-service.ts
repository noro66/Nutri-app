interface MealPlan {
  id: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  goal: string;
  dietaryPreferences: string[];
}

class NutritionService {
  private generateMockMeal(type: 'breakfast' | 'lunch' | 'dinner' | 'snack', preferences: string[]): Meal {
    const meals = {
      breakfast: [
        {
          name: 'Protein Oatmeal Bowl',
          description: 'Creamy oats with protein powder, berries, and nuts',
          calories: 350,
          protein: 25,
          carbs: 45,
          fat: 8,
          ingredients: ['Oats', 'Protein powder', 'Blueberries', 'Almonds', 'Cinnamon'],
          instructions: ['Cook oats with water', 'Mix in protein powder', 'Top with berries and nuts']
        },
        {
          name: 'Avocado Toast',
          description: 'Whole grain toast with mashed avocado and eggs',
          calories: 420,
          protein: 18,
          carbs: 35,
          fat: 24,
          ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Salt', 'Pepper'],
          instructions: ['Toast bread', 'Mash avocado', 'Fry eggs', 'Assemble']
        }
      ],
      lunch: [
        {
          name: 'Grilled Chicken Salad',
          description: 'Fresh greens with grilled chicken and vinaigrette',
          calories: 450,
          protein: 35,
          carbs: 20,
          fat: 25,
          ingredients: ['Chicken breast', 'Mixed greens', 'Tomatoes', 'Cucumber', 'Olive oil'],
          instructions: ['Grill chicken', 'Prepare salad', 'Make dressing', 'Combine']
        },
        {
          name: 'Quinoa Buddha Bowl',
          description: 'Quinoa with roasted vegetables and tahini dressing',
          calories: 480,
          protein: 18,
          carbs: 65,
          fat: 16,
          ingredients: ['Quinoa', 'Sweet potato', 'Broccoli', 'Chickpeas', 'Tahini'],
          instructions: ['Cook quinoa', 'Roast vegetables', 'Make dressing', 'Assemble bowl']
        }
      ],
      dinner: [
        {
          name: 'Salmon with Vegetables',
          description: 'Baked salmon with roasted seasonal vegetables',
          calories: 520,
          protein: 40,
          carbs: 25,
          fat: 30,
          ingredients: ['Salmon fillet', 'Asparagus', 'Bell peppers', 'Olive oil', 'Herbs'],
          instructions: ['Season salmon', 'Prepare vegetables', 'Bake together', 'Serve hot']
        },
        {
          name: 'Lentil Curry',
          description: 'Spicy red lentil curry with vegetables',
          calories: 380,
          protein: 20,
          carbs: 55,
          fat: 8,
          ingredients: ['Red lentils', 'Coconut milk', 'Onions', 'Tomatoes', 'Spices'],
          instructions: ['Sauté onions', 'Add lentils and liquid', 'Simmer', 'Season to taste']
        }
      ],
      snack: [
        {
          name: 'Greek Yogurt with Berries',
          description: 'Creamy yogurt topped with fresh berries',
          calories: 180,
          protein: 15,
          carbs: 20,
          fat: 5,
          ingredients: ['Greek yogurt', 'Mixed berries', 'Honey'],
          instructions: ['Add berries to yogurt', 'Drizzle with honey']
        },
        {
          name: 'Hummus with Vegetables',
          description: 'Fresh vegetables with homemade hummus',
          calories: 220,
          protein: 8,
          carbs: 25,
          fat: 12,
          ingredients: ['Chickpeas', 'Tahini', 'Carrots', 'Celery', 'Bell peppers'],
          instructions: ['Make hummus', 'Cut vegetables', 'Serve together']
        }
      ]
    };

    // Filter meals based on dietary preferences
    let availableMeals = meals[type];

    if (preferences.includes('vegetarian') || preferences.includes('vegan')) {
      availableMeals = availableMeals.filter(meal =>
        !meal.ingredients.some(ingredient =>
          ['chicken', 'salmon', 'eggs'].some(meat =>
            ingredient.toLowerCase().includes(meat)
          )
        )
      );
    }

    const selectedMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];

    return {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type,
      ...selectedMeal
    };
  }

  async generateMealPlan(userProfile: UserProfile): Promise<MealPlan> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const preferences = userProfile.dietaryPreferences || [];
      const today = new Date().toISOString().split('T')[0];

      const meals = [
        this.generateMockMeal('breakfast', preferences),
        this.generateMockMeal('lunch', preferences),
        this.generateMockMeal('dinner', preferences),
        this.generateMockMeal('snack', preferences),
      ];

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

      return {
        id: `plan_${Date.now()}`,
        date: today,
        meals,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      };
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan. Please try again.');
    }
  }

  async regenerateMeal(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', preferences: string[]): Promise<Meal> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return this.generateMockMeal(mealType, preferences);
    } catch (error) {
      console.error('Error regenerating meal:', error);
      throw new Error('Failed to regenerate meal. Please try again.');
    }
  }
}

export const nutritionService = new NutritionService();
export type { MealPlan, Meal, UserProfile };
