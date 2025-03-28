/**
 * Creates a typewriter effect for displaying text
 * @param {string} text - The text to display
 * @param {function} setText - Function to update the state
 * @param {number} speed - Typing speed in milliseconds
 * @returns {function} Cleanup function to stop the typing effect
 */
export const typewriterEffect = (text, setText, speed = 10) => {
    let i = 0;
    setText('');
    
    const typing = setInterval(() => {
      if (i < text.length) {
        setText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);
    
    // Return a cleanup function to stop the interval
    return () => clearInterval(typing);
  };