// src/components/VoiceInput.jsx
import { useState, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import SpeechRecognitionUtil from '../utils/speechRecognition';

const VoiceInput = ({ onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    const recognition = new SpeechRecognitionUtil(
      (transcript) => {
        onTranscript(transcript);
        setIsListening(false);
      },
      (errorMsg) => {
        onError(errorMsg);
        setIsListening(false);
      }
    );
    setSpeechRecognition(recognition);
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript, onError]);

  const toggleListening = () => {
    if (!speechRecognition) return;
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`icon-btn ${isListening ? 'text-red-500' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        disabled={!speechRecognition}
      >
        {isListening ? <FiMicOff className="h-5 w-5" /> : <FiMic className="h-5 w-5" />}
      </button>
      {isListening && (
        <div className="absolute -top-10 right-0 rounded-md bg-green-100 p-2 text-xs text-green-600 dark:bg-green-900 dark:text-green-200">
          
        </div>
      )}
    </div>
  );
};

export default VoiceInput;