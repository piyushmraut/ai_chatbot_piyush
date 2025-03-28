import { useCallback } from 'react';

const useImagePigAPI = () => {
  const generateImage = useCallback(async (prompt) => {
    try {
      const response = await fetch('https://api.imagepig.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': import.meta.env.VITE_IMAGEPIG_API_KEY,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return json.image_data; // Base64-encoded image data
    } catch (err) {
      console.error('ImagePig API error:', err);
      return null;
    }
  }, []);

  return { generateImage };
};

export default useImagePigAPI;