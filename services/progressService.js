import AsyncStorage from '@react-native-async-storage/async-storage';

const COUNT_KEY = '@daily_progress_count';
const WATCHED_VIDEOS_KEY = '@watched_videos_list';
const DAILY_GOAL = 10; 

export const getDailyProgress = async () => {
  try {
    const value = await AsyncStorage.getItem(COUNT_KEY);
    const count = value !== null ? parseInt(value) : 0;
    
    // Get the actual list of IDs
    const watchedValue = await AsyncStorage.getItem(WATCHED_VIDEOS_KEY);
    const watchedIds = watchedValue ? JSON.parse(watchedValue) : [];

    return {
      count: count,
      goal: DAILY_GOAL,
      percentage: Math.min((count / DAILY_GOAL) * 100, 100),
      watchedIds: watchedIds // Now we return the IDs too!
    };
  } catch (e) {
    return { count: 0, goal: DAILY_GOAL, percentage: 0, watchedIds: [] };
  }
};

export const markLessonAsLearned = async (videoId) => {
  try {
    const current = await getDailyProgress();
    
    // Check if already watched to avoid double counting
    if (!current.watchedIds.includes(videoId)) {
      const newCount = current.count + 1;
      const newList = [...current.watchedIds, videoId];

      await AsyncStorage.setItem(COUNT_KEY, newCount.toString());
      await AsyncStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(newList));
      return { newCount, newList };
    }
    return { newCount: current.count, newList: current.watchedIds };
  } catch (e) {
    console.error("Error saving progress", e);
  }
};