// import { useRef, useEffect, useState } from 'react';
// import MessageBubble from './MessageBubble';
// import ChatInput from './ChatInput';
// import { useChat } from '../contexts/ChatContext';

// const ChatArea = () => {
//   const { getActiveConversation, loading, activeConversationId, updateMessage } = useChat();
//   const containerRef = useRef(null);
//   const prevMessagesRef = useRef(null);
//   const prevConversationIdRef = useRef(activeConversationId);
//   const [typingMessageId, setTypingMessageId] = useState(null);

//   const activeConversation = getActiveConversation();
//   const messages = activeConversation?.messages || [];

//   // Scroll to bottom on conversation change or new message
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [messages, activeConversationId]);

//   // Handle typing effect for new bot messages
//   useEffect(() => {
//     if (activeConversationId !== prevConversationIdRef.current) {
//       setTypingMessageId(null);
//       prevMessagesRef.current = messages;
//       prevConversationIdRef.current = activeConversationId;
//       return;
//     }

//     const prevMessages = prevMessagesRef.current;
//     if (prevMessages && messages.length > prevMessages.length) {
//       const newMessage = messages[messages.length - 1];
//       if (!newMessage.isUser && newMessage.type === 'text') {
//         setTypingMessageId(newMessage.id);
//         const typingDuration = newMessage.content.length * 30;
//         const timer = setTimeout(() => setTypingMessageId(null), typingDuration);
//         return () => clearTimeout(timer);
//       }
//     }
//     prevMessagesRef.current = messages;
//   }, [messages, activeConversationId]);

//   const handleEditMessage = (messageId, newContent) => {
//     updateMessage(activeConversationId, messageId, newContent);
//   };

//   return (
//     <div className="flex h-full flex-col">
//       <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
//         {messages.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center">
//             <h2 className="mb-4 text-2xl font-semibold">
//               {activeConversation.type === 'image' ? 'Generate an Image' : 'Welcome to Chatbot'}
//             </h2>
//             <p className="mb-8 text-center text-gray-500 dark:text-gray-400">
//               {activeConversation.type === 'image'
//                 ? 'Enter a prompt to generate an image.'
//                 : 'Start a conversation by typing a message below.'}
//             </p>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <MessageBubble
//               key={message.id}
//               message={message}
//               isTyping={message.id === typingMessageId}
//               onEditMessage={handleEditMessage}
//               containerRef={containerRef} // Pass containerRef to MessageBubble
//             />
//           ))
//         )}
//         {loading && (
//           <div className="flex justify-center">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-gray-500"></div>
//           </div>
//         )}
//       </div>
//       <div className="border-t border-gray-200 p-4 dark:border-gray-700">
//         <ChatInput />
//       </div>
//     </div>
//   );
// };

// export default ChatArea;

import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import { FiMessageSquare,FiCamera } from 'react-icons/fi';
import ChatInput from './ChatInput';
import { useChat } from '../contexts/ChatContext';
import PricingModal from './PricingModal'; // Import the new component

const ChatArea = () => {
  const { getActiveConversation, loading, activeConversationId, updateMessage } = useChat();
  const containerRef = useRef(null);
  const prevMessagesRef = useRef(null);
  const prevConversationIdRef = useRef(activeConversationId);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const activeConversation = getActiveConversation();
  const messages = activeConversation?.messages || [];

  // Scroll to bottom on conversation change or new message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  // Handle typing effect for new bot messages
  useEffect(() => {
    if (activeConversationId !== prevConversationIdRef.current) {
      setTypingMessageId(null);
      prevMessagesRef.current = messages;
      prevConversationIdRef.current = activeConversationId;
      return;
    }

    const prevMessages = prevMessagesRef.current;
    if (prevMessages && messages.length > prevMessages.length) {
      const newMessage = messages[messages.length - 1];
      if (!newMessage.isUser && newMessage.type === 'text') {
        setTypingMessageId(newMessage.id);
        const typingDuration = newMessage.content.length * 30;
        const timer = setTimeout(() => setTypingMessageId(null), typingDuration);
        return () => clearTimeout(timer);
      }
    }
    prevMessagesRef.current = messages;
  }, [messages, activeConversationId]);

  // Trigger pricing modal after 3 image messages
  useEffect(() => {
    const imageMessages = messages.filter((msg) => msg.type === 'image' && !msg.isUser);
    if (imageMessages.length === 3 && !hasShownModal) {
      setShowModal(true);
      setHasShownModal(true);
    }
  }, [messages, hasShownModal]);

  // Reset modal state when switching conversations
  useEffect(() => {
    setHasShownModal(false);
    setShowModal(false);
  }, [activeConversationId]);

  const handleEditMessage = (messageId, newContent) => {
    updateMessage(activeConversationId, messageId, newContent);
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          // <div className="flex h-full flex-col items-center justify-center">
          //   <h2 className="mb-4 text-2xl font-semibold">
          //     {activeConversation.type === 'image' ? 'Generate an Image' : 'Welcome to Chatbot'}
          //   </h2>
          //   <p className="mb-8 text-center text-gray-500 dark:text-gray-400">
          //     {activeConversation.type === 'image'
          //       ? 'Enter a prompt to generate an image.'
          //       : 'Start a conversation by typing a message below.'}
          //   </p>
          // </div>
          // src/components/ChatArea.jsx
<div className="flex h-full flex-col items-center justify-center">
  <div className="mb-6 animate-float">
    {activeConversation.type === 'image' ? (
      <FiCamera className="h-16 w-16 text-blue-500" />
    ) : (
      <FiMessageSquare className="h-16 w-16 text-blue-500" />
    )}
  </div>
  <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500">
    {activeConversation.type === 'image' ? 'Generate an Image' : 'Welcome to Chatbot'}
  </h2>
  <p className="mb-8 text-center text-gray-500 dark:text-gray-400 max-w-md">
    {activeConversation.type === 'image'
      ? 'Describe what you want to see and we\'ll create it for you.'
      : 'Start chatting with our AI assistant. Ask anything!'}
  </p>
</div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isTyping={message.id === typingMessageId}
              onEditMessage={handleEditMessage}
              containerRef={containerRef}
            />
          ))
        )}
        {loading && (
          // <div className="flex justify-center">
          //   <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-gray-500"></div>
          // </div>
          <div className="flex justify-center py-4">
    <div className="flex space-x-2">
      <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500"></div>
    </div>
  </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <ChatInput />
      </div>
      {/* Render the PricingModal when showModal is true */}
      {showModal && <PricingModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ChatArea;