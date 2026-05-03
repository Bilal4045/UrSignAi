import { saveVideo, deleteVideo } from './videoService';
import { evaluateVideo } from './evaluationService';

export const submitPractice = async (videoUri, targetSign) => {
  const savedUri = await saveVideo(videoUri);
  return await evaluateVideo(savedUri, targetSign);
};

export const restartPractice = async () => {
  await deleteVideo();
};