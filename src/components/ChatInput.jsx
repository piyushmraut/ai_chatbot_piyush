
// src/components/ChatInput.jsx
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import VoiceInput from './VoiceInput';
import { useChat } from '../contexts/ChatContext';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState(''); // Add error state
  const { sendMessage, loading, getActiveConversation } = useChat();
  const activeConversation = getActiveConversation();
  const placeholder =
    activeConversation.type === 'image' ? 'Enter image prompt...' : 'Type your message here...';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    sendMessage(message);
    setMessage('');
    setVoiceError(''); // Clear error on send
  };

  const handleVoiceInput = (transcript) => {
    setMessage(transcript);
    setVoiceError(''); // Clear error on successful transcript
  };

  const handleVoiceError = (errorMsg) => {
    setVoiceError(errorMsg);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-4 w-full">
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setVoiceError(''); // Clear error when typing
        }}
        onFocus={() => setVoiceError('')} // Clear error on focus
        placeholder={placeholder}
        className="chat-input"
        disabled={loading}
      />
      <div className="absolute right-3 top-2 flex items-center space-x-2">
        <VoiceInput onTranscript={handleVoiceInput} onError={handleVoiceError} />
        <button
          type="submit"
          className={`icon-btn ${loading ? 'opacity-50' : ''}`}
          disabled={loading || !message.trim()}
          aria-label="Send message"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
      {voiceError && (
        <div className="absolute -top-10 right-0 rounded-md bg-red-100 p-2 text-xs text-red-600 dark:bg-red-900 dark:text-red-200">
          {voiceError}
        </div>
      )}
    </form>
  );
};

export default ChatInput;

// import { useState, useRef } from 'react';
// import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
// import VoiceInput from './VoiceInput';
// import { useChat } from '../contexts/ChatContext';
// import axios from 'axios';

// const ChatInput = () => {
//   const [message, setMessage] = useState('');
//   const [voiceError, setVoiceError] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null); // State for selected file
//   const fileInputRef = useRef(null);
//   const { sendMessage, loading, getActiveConversation } = useChat();
//   const activeConversation = getActiveConversation();
//   const isTextConversation = activeConversation.type === 'text';
//   const placeholder =
//     activeConversation.type === 'image' ? 'Enter image prompt...' : 'Type your message here...';

//   // Handle file selection and upload to Cloudinary
//   const handleFileSelect = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const allowedTypes = ['image/jpeg', 'image/png', 'text/plain'];
//     if (!allowedTypes.includes(file.type)) {
//       alert('Only images (JPEG, PNG) and text files (.txt) are supported.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
//         formData
//       );

//       const fileData = {
//         type: file.type.startsWith('image/') ? 'image' : 'text',
//         url: response.data.secure_url,
//         name: file.name,
//       };
//       setSelectedFile(fileData);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Failed to upload file. Please try again.');
//     }
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!message.trim() && !selectedFile) return;
//     sendMessage({ text: message, file: selectedFile });
//     setMessage('');
//     setSelectedFile(null);
//   };

//   const handleVoiceInput = (transcript) => {
//     setMessage(transcript);
//     setVoiceError('');
//   };

//   const handleVoiceError = (errorMsg) => {
//     setVoiceError(errorMsg);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="relative mb-4 w-full">
//       <div className="flex items-center">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => {
//             setMessage(e.target.value);
//             setVoiceError('');
//           }}
//           onFocus={() => setVoiceError('')}
//           placeholder={placeholder}
//           className="chat-input flex-1"
//           disabled={loading}
//         />
//         <div className="absolute right-3 top-2 flex items-center space-x-2">
//           {isTextConversation && (
//             <button
//               type="button"
//               onClick={() => fileInputRef.current.click()}
//               className={`icon-btn ${loading ? 'opacity-50' : ''}`}
//               disabled={loading}
//               aria-label="Attach file"
//             >
//               <FiPaperclip className="h-5 w-5" />
//             </button>
//           )}
//           <VoiceInput onTranscript={handleVoiceInput} onError={handleVoiceError} />
//           <button
//             type="submit"
//             className={`icon-btn ${loading ? 'opacity-50' : ''}`}
//             disabled={loading || (!message.trim() && !selectedFile)}
//             aria-label="Send message"
//           >
//             <FiSend className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//         accept="image/jpeg,image/png,text/plain"
//         onChange={handleFileSelect}
//       />
//       {selectedFile && (
//         <div className="mt-2 flex items-center">
//           <span className="text-sm text-gray-500">Attached: {selectedFile.name}</span>
//           <button
//             type="button"
//             onClick={() => setSelectedFile(null)}
//             className="ml-2 text-red-500"
//             aria-label="Remove file"
//           >
//             <FiX className="h-4 w-4" />
//           </button>
//         </div>
//       )}
//       {voiceError && (
//         <div className="absolute -top-10 right-0 rounded-md bg-red-100 p-2 text-xs text-red-600 dark:bg-red-900 dark:text-red-200">
//           {voiceError}
//         </div>
//       )}
//     </form>
//   );
// };

// export default ChatInput;