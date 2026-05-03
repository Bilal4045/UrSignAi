import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@daily_progress_count';
const DAILY_GOAL = 10; 

export const getDailyProgress = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    const count = value !== null ? parseInt(value) : 0;
    const percentage = (count / DAILY_GOAL) * 100;

    return {
      count: count,
      goal: DAILY_GOAL,
      percentage: Math.min(percentage, 100), 
    };
  } catch (e) {
    return { count: 0, goal: DAILY_GOAL, percentage: 0 };
  }
};

export const markLessonAsLearned = async () => {
  try {
    const current = await getDailyProgress();
    const newCount = current.count + 1;
    await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
    return newCount;
  } catch (e) {
    console.error("Error saving progress", e);
  }
};