/**
 * Speech recognition utility for Web Speech API
 */
export default class SpeechRecognitionUtil {
    constructor(onResultCallback, onErrorCallback) {
      this.recognition = null;
      this.isListening = false;
      this.onResultCallback = onResultCallback;
      this.onErrorCallback = onErrorCallback;
      
      this.initRecognition();
    }
    
    initRecognition() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        this.onErrorCallback('Speech recognition is not supported in this browser.');
        return;
      }
      
      // Use the appropriate constructor
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.onResultCallback(transcript);
      };
      
      this.recognition.onerror = (event) => {
        this.onErrorCallback(`Error occurred in recognition: ${event.error}`);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
    
    start() {
      if (!this.recognition) {
        this.initRecognition();
        if (!this.recognition) return;
      }
      
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (error) {
        this.onErrorCallback(`Could not start speech recognition: ${error.message}`);
      }
    }
    
    stop() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  }