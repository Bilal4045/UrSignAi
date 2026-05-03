// services/chatbotService.js

export const sendMessageToBot = async (userMessage) => {
  try {
    // Simulate network processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ==========================================
    // TOMORROW: Connect your RAG database/API here
    // ==========================================
    // const response = await fetch('YOUR_RAG_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query: userMessage })
    // });
    // const data = await response.json();
    // return data.reply; 

    // TODAY: Return the placeholder response
    return "Chatbot is not integrated yet. RAG system coming soon!";
    
  } catch (error) {
    console.error("Chatbot Service Error: ", error);
    return "Sorry, I am facing a connection error at the moment.";
  }
};