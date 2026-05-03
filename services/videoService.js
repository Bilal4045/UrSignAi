// CHANGE THIS LINE:
import * as FileSystem from 'expo-file-system/legacy'; 

const VIDEO_PATH = `${FileSystem.documentDirectory}current_practice.mp4`;

export const saveVideo = async (tempUri) => {
  try {
    // Delete previous if exists
    await FileSystem.deleteAsync(VIDEO_PATH, { idempotent: true });

    // Move to permanent storage
    await FileSystem.moveAsync({
      from: tempUri,
      to: VIDEO_PATH,
    });

    return VIDEO_PATH;
  } catch (error) {
    console.error("Save Video Error:", error);
    return tempUri;
  }
};

export const deleteVideo = async () => {
  try {
    await FileSystem.deleteAsync(VIDEO_PATH, { idempotent: true });
    console.log("Video deleted successfully");
  } catch (error) {
    console.error("Delete Video Error:", error);
  }
};