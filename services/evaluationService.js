export const evaluateVideo = async (videoUri, targetSign) => {
  if (!videoUri) {
    return { success: false, message: 'No sign detected' };
  }

  return {
    success: true,
    result: 'Incorrect',
    confidence: 73,
    targetSign,
  };
};