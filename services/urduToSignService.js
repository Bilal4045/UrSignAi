// services/urduToSignService.js

export const fetchSignVideo = async (urduText) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ==========================================
    // TOMORROW: Uncomment this for your DB
    // ==========================================
    // const response = await fetch(`YOUR_API_ENDPOINT?word=${urduText}`);
    // const data = await response.json();
    // return { success: true, videoUrl: data.video_link };

    // TODAY: Always return not found.
    return { 
      success: false, 
      message: "Sign not found in database for this word." 
    };

  } catch (error) {
    console.error("Video Fetch Service Error: ", error);
    throw new Error("Failed to fetch sign video");
  }
};

export const convertAudioToText = async (audioUri) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ==========================================
    // TOMORROW: Send audioUri to your Python API
    // ==========================================
    // const formData = new FormData();
    // formData.append('audio', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' });
    // const response = await fetch('YOUR_API/speech-to-text', { method: 'POST', body: formData });
    // const data = await response.json();
    // return data.urduText; 

    // TODAY: Return placeholder
    return "آواز کی شناخت کا ماڈل منسلک نہیں ہے"; 
    
  } catch (error) {
    console.error("Speech to text error: ", error);
    throw new Error("Failed to recognize voice.");
  }
};