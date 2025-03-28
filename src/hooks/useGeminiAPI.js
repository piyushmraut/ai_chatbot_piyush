import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const generateResponse = useCallback(async (prompt, chatHistory = []) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the model (updated to gemini-1.5-flash)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Format the chat history for the API
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Start a chat session
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });

      // Send the message and get a response
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const text = response.text();
      
      setLoading(false);
      return text;
    } catch (err) {
      setError(`Error with Gemini API: ${err.message}`);
      setLoading(false);
      return null;
    }
  }, [genAI]);

  return { generateResponse, loading, error };
};

export default useGeminiAPI;