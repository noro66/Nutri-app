import AsyncStorage from '@react-native-async-storage/async-storage';
import { nutritionService, MealPlan, UserProfile } from './nutrition-service';

interface WeeklyMealPlan {
  id: string;
  weekStart: string;
  weekEnd: string;
  days: DayMealPlan[];
  totalCaloriesWeek: number;
  avgCaloriesPerDay: number;
}

interface DayMealPlan {
  date: string;
  dayName: string;
  mealPlan: MealPlan;
}

class WeeklyPlanningService {
  private getDaysOfWeek(startDate: Date): Date[] {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  private getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  async generateWeeklyMealPlan(userProfile: UserProfile): Promise<WeeklyMealPlan> {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

      const daysOfWeek = this.getDaysOfWeek(startOfWeek);
      const dayPlans: DayMealPlan[] = [];

      for (const day of daysOfWeek) {
        const mealPlan = await nutritionService.generateMealPlan(userProfile);
        mealPlan.date = day.toISOString().split('T')[0];

        dayPlans.push({
          date: mealPlan.date,
          dayName: this.getDayName(day),
          mealPlan,
        });
      }

      const totalCaloriesWeek = dayPlans.reduce(
        (sum, day) => sum + day.mealPlan.totalCalories,
        0
      );

      const weeklyPlan: WeeklyMealPlan = {
        id: `weekly_${Date.now()}`,
        weekStart: daysOfWeek[0].toISOString().split('T')[0],
        weekEnd: daysOfWeek[6].toISOString().split('T')[0],
        days: dayPlans,
        totalCaloriesWeek,
        avgCaloriesPerDay: Math.round(totalCaloriesWeek / 7),
      };

      // Save to storage
      await AsyncStorage.setItem('weekly_meal_plan', JSON.stringify(weeklyPlan));

      return weeklyPlan;
    } catch (error) {
      console.error('Error generating weekly meal plan:', error);
      throw new Error('Failed to generate weekly meal plan');
    }
  }

  async getWeeklyMealPlan(): Promise<WeeklyMealPlan | null> {
    try {
      const savedPlan = await AsyncStorage.getItem('weekly_meal_plan');
      if (!savedPlan) return null;

      const plan = JSON.parse(savedPlan);
      const today = new Date().toISOString().split('T')[0];

      // Check if the plan is still current (within the week)
      if (today >= plan.weekStart && today <= plan.weekEnd) {
        return plan;
      }

      return null;
    } catch (error) {
      console.error('Error getting weekly meal plan:', error);
      return null;
    }
  }

  async updateDayInWeeklyPlan(date: string, newMealPlan: MealPlan): Promise<void> {
    try {
      const weeklyPlan = await this.getWeeklyMealPlan();
      if (!weeklyPlan) return;

      const dayIndex = weeklyPlan.days.findIndex(day => day.date === date);
      if (dayIndex !== -1) {
        weeklyPlan.days[dayIndex].mealPlan = newMealPlan;

        // Recalculate totals
        weeklyPlan.totalCaloriesWeek = weeklyPlan.days.reduce(
          (sum, day) => sum + day.mealPlan.totalCalories,
          0
        );
        weeklyPlan.avgCaloriesPerDay = Math.round(weeklyPlan.totalCaloriesWeek / 7);

        await AsyncStorage.setItem('weekly_meal_plan', JSON.stringify(weeklyPlan));
      }
    } catch (error) {
      console.error('Error updating day in weekly plan:', error);
    }
  }
}

export const weeklyPlanningService = new WeeklyPlanningService();
export type { WeeklyMealPlan, DayMealPlan };
