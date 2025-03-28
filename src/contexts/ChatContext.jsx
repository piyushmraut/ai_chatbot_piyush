import { createContext, useContext, useState, useEffect } from 'react';
import useGeminiAPI from '../hooks/useGeminiAPI';
import useImagePigAPI from '../hooks/useImagePigAPI';

const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('chat-conversations');
    return saved
      ? JSON.parse(saved)
      : [{ id: 'default', title: 'New Chat', type: 'text', messages: [] }];
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    const saved = localStorage.getItem('active-conversation-id');
    return saved || 'default';
  });

  const [loading, setLoading] = useState(false);

  const { generateResponse } = useGeminiAPI();
  const { generateImage } = useImagePigAPI();

  useEffect(() => {
    localStorage.setItem('chat-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('active-conversation-id', activeConversationId);
  }, [activeConversationId]);

  const getActiveConversation = () => {
    return conversations.find((conv) => conv.id === activeConversationId) || conversations[0];
  };

  const createNewConversation = (type = 'text') => {
    const newId = Date.now().toString();
    const title = type === 'text' ? 'New Chat' : 'Image Generation';
    const newConversation = {
      id: newId,
      title,
      type,
      messages: [],
    };

    setConversations((prev) => [...prev, newConversation]);
    setActiveConversationId(newId);
    return newId;
  };

  const sendMessage = async (content, conversationId = activeConversationId) => {
    const activeConversation = conversations.find((conv) => conv.id === conversationId);
    if (!activeConversation) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'text',
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );

    setLoading(true);
    try {
      if (activeConversation.type === 'text') {
        const response = await generateResponse(content, activeConversation.messages);
        if (response) {
          const botMessage = {
            id: Date.now().toString(),
            type: 'text',
            content: response,
            isUser: false,
            timestamp: new Date().toISOString(),
          };
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? { ...conv, messages: [...conv.messages, botMessage] }
                : conv
            )
          );
        }
      } else if (activeConversation.type === 'image') {
        const imageData = await generateImage(content);
        if (imageData) {
          const botMessage = {
            id: Date.now().toString(),
            type: 'image',
            content: imageData,
            isUser: false,
            timestamp: new Date().toISOString(),
          };
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? { ...conv, messages: [...conv.messages, botMessage] }
                : conv
            )
          );
        }
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = {
        id: Date.now().toString(),
        type: 'text',
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = (conversationId, messageId, newContent) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, content: newContent } : msg
              ),
            }
          : conv
      )
    );
    // Trigger a new response generation
    sendMessage(newContent, conversationId);
  };

  const updateConversationTitle = (id, title) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, title } : conv))
    );
  };

  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (id === activeConversationId) {
      const remaining = conversations.filter((conv) => conv.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        getActiveConversation,
        sendMessage,
        createNewConversation,
        updateConversationTitle,
        deleteConversation,
        loading,
        error: null,
        updateMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// import { createContext, useContext, useState, useEffect } from 'react';
// import useGeminiAPI from '../hooks/useGeminiAPI';
// import useImagePigAPI from '../hooks/useImagePigAPI';
// import axios from 'axios';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [conversations, setConversations] = useState(() => {
//     const saved = localStorage.getItem('chat-conversations');
//     return saved
//       ? JSON.parse(saved)
//       : [{ id: 'default', title: 'New Chat', type: 'text', messages: [] }];
//   });

//   const [activeConversationId, setActiveConversationId] = useState(() => {
//     const saved = localStorage.getItem('active-conversation-id');
//     return saved || 'default';
//   });

//   const [loading, setLoading] = useState(false);

//   const { generateResponse } = useGeminiAPI();
//   const { generateImage } = useImagePigAPI();

//   useEffect(() => {
//     localStorage.setItem('chat-conversations', JSON.stringify(conversations));
//   }, [conversations]);

//   useEffect(() => {
//     localStorage.setItem('active-conversation-id', activeConversationId);
//   }, [activeConversationId]);

//   const getActiveConversation = () => {
//     return conversations.find((conv) => conv.id === activeConversationId) || conversations[0];
//   };

//   const createNewConversation = (type = 'text') => {
//     const newId = Date.now().toString();
//     const title = type === 'text' ? 'New Chat' : 'Image Generation';
//     const newConversation = {
//       id: newId,
//       title,
//       type,
//       messages: [],
//     };
//     setConversations((prev) => [...prev, newConversation]);
//     setActiveConversationId(newId);
//     return newId;
//   };

//   // const sendMessage = async ({ text, file }, conversationId = activeConversationId) => {
//   //   const activeConversation = conversations.find((conv) => conv.id === conversationId);
//   //   if (!activeConversation) return;

//   //   // Add user message
//   //   const userMessage = {
//   //     id: Date.now().toString(),
//   //     type: 'text',
//   //     content: text,
//   //     isUser: true,
//   //     timestamp: new Date().toISOString(),
//   //     file: file ? { type: file.type, url: file.url, name: file.name } : null,
//   //   };
//   //   setConversations((prev) =>
//   //     prev.map((conv) =>
//   //       conv.id === conversationId
//   //         ? { ...conv, messages: [...conv.messages, userMessage] }
//   //         : conv
//   //     )
//   //   );

//   //   setLoading(true);
//   //   try {
//   //     if (activeConversation.type === 'text') {
//   //       let currentPrompt;
//   //       if (file) {
//   //         if (file.type === 'image') {
//   //           // Fetch image data as base64
//   //           const response = await axios.get(file.url, { responseType: 'arraybuffer' });
//   //           const base64Data = btoa(
//   //             new Uint8Array(response.data)
//   //               .reduce((data, byte) => data + String.fromCharCode(byte), '')
//   //           );
            
//   //           const mimeType = file.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
//   //           currentPrompt = [
//   //             { text },
//   //             { inlineData: { data: base64Data, mimeType } },
//   //           ];
//   //         } else if (file.type === 'text') {
//   //           // Fetch text file content
//   //           const response = await axios.get(file.url);
//   //           const fileContent = response.data;
//   //           currentPrompt = `Based on the following document:\n\n${fileContent}\n\nUser query: ${text}`;
//   //         }
//   //       } else {
//   //         currentPrompt = text;
//   //       }

//   //       // Format chat history
//   //       const formattedHistory = activeConversation.messages.map(async (msg) => {
//   //         const parts = [];
//   //         if (msg.content) {
//   //           parts.push({ text: msg.content });
//   //         }
//   //         if (msg.file && msg.file.type === 'image') {
//   //           const response = await axios.get(msg.file.url, { responseType: 'arraybuffer' });
//   //           // const base64Data = Buffer.from(response.data, 'binary').toString('base64');
//   //           const base64Data = btoa(
//   //             new Uint8Array(response.data)
//   //               .reduce((data, byte) => data + String.fromCharCode(byte), '')
//   //           );
            
//   //           const mimeType = msg.file.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
//   //           parts.push({ inlineData: { data: base64Data, mimeType } });
//   //         }
//   //         return {
//   //           role: msg.isUser ? 'user' : 'model',
//   //           parts,
//   //         };
//   //       });

//   //       const resolvedHistory = await Promise.all(formattedHistory);

//   //       const response = await generateResponse(currentPrompt, resolvedHistory);
//   //       if (response) {
//   //         const botMessage = {
//   //           id: Date.now().toString(),
//   //           type: 'text',
//   //           content: response,
//   //           isUser: false,
//   //           timestamp: new Date().toISOString(),
//   //         };
//   //         setConversations((prev) =>
//   //           prev.map((conv) =>
//   //             conv.id === conversationId
//   //               ? { ...conv, messages: [...conv.messages, botMessage] }
//   //               : conv
//   //           )
//   //         );
//   //       }
//   //     } else if (activeConversation.type === 'image') {
//   //       const imageData = await generateImage(text);
//   //       if (imageData) {
//   //         const botMessage = {
//   //           id: Date.now().toString(),
//   //           type: 'image',
//   //           content: imageData,
//   //           isUser: false,
//   //           timestamp: new Date().toISOString(),
//   //         };
//   //         setConversations((prev) =>
//   //           prev.map((conv) =>
//   //             conv.id === conversationId
//   //               ? { ...conv, messages: [...conv.messages, botMessage] }
//   //               : conv
//   //           )
//   //         );
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error('Error:', err);
//   //     const errorMessage = {
//   //       id: Date.now().toString(),
//   //       type: 'text',
//   //       content: 'Sorry, I encountered an error. Please try again.',
//   //       isUser: false,
//   //       timestamp: new Date().toISOString(),
//   //     };
//   //     setConversations((prev) =>
//   //       prev.map((conv) =>
//   //         conv.id === conversationId
//   //           ? { ...conv, messages: [...conv.messages, errorMessage] }
//   //           : conv
//   //       )
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const sendMessage = async ({ text, file }, conversationId = activeConversationId) => {
//     const activeConversation = conversations.find((conv) => conv.id === conversationId);
//     if (!activeConversation) return;

//     // Add user message
//     const userMessage = {
//       id: Date.now().toString(),
//       type: 'text',
//       content: text,
//       isUser: true,
//       timestamp: new Date().toISOString(),
//       file: file ? { type: file.type, url: file.url, name: file.name } : null,
//     };
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? { ...conv, messages: [...conv.messages, userMessage] }
//           : conv
//       )
//     );

//     setLoading(true);
//     try {
//       if (activeConversation.type === 'text') {
//         let currentPrompt;
//         if (file) {
//           if (file.type === 'image') {
//             // Fetch image data as base64
//             const response = await axios.get(file.url, { responseType: 'arraybuffer' });
//             const base64Data = btoa(
//               new Uint8Array(response.data)
//                 .reduce((data, byte) => data + String.fromCharCode(byte), '')
//             );
            
//             const mimeType = file.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
//             currentPrompt = [
//               { text },
//               { inlineData: { data: base64Data, mimeType } },
//             ];
//           } else if (file.type === 'text') {
//             // Fetch text file content
//             const response = await axios.get(file.url);
//             const fileContent = response.data;
//             currentPrompt = `Based on the following document:\n\n${fileContent}\n\nUser query: ${text}`;
//           }
//         } else {
//           currentPrompt = text;
//         }

//         // Format chat history
//         const formattedHistory = activeConversation.messages.map(async (msg) => {
//           const parts = [];
//           if (msg.content) {
//             parts.push({ text: msg.content });
//           }
//           if (msg.file && msg.file.type === 'image') {
//             const response = await axios.get(msg.file.url, { responseType: 'arraybuffer' });
//             // const base64Data = Buffer.from(response.data, 'binary').toString('base64');
//             const base64Data = btoa(
//               new Uint8Array(response.data)
//                 .reduce((data, byte) => data + String.fromCharCode(byte), '')
//             );
            
//             const mimeType = msg.file.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
//             parts.push({ inlineData: { data: base64Data, mimeType } });
//           }
//           return {
//             role: msg.isUser ? 'user' : 'model',
//             parts,
//           };
//         });

//         const resolvedHistory = await Promise.all(formattedHistory);

//         const response = await generateResponse(currentPrompt, resolvedHistory);
//         if (response) {
//           const botMessage = {
//             id: Date.now().toString(),
//             type: 'text',
//             content: response,
//             isUser: false,
//             timestamp: new Date().toISOString(),
//           };
//           setConversations((prev) =>
//             prev.map((conv) =>
//               conv.id === conversationId
//                 ? { ...conv, messages: [...conv.messages, botMessage] }
//                 : conv
//             )
//           );
//         }
//       } else if (activeConversation.type === 'image') {
//         const imageData = await generateImage(text);
//         if (imageData) {
//           const botMessage = {
//             id: Date.now().toString(),
//             type: 'image',
//             content: imageData,
//             isUser: false,
//             timestamp: new Date().toISOString(),
//           };
//           setConversations((prev) =>
//             prev.map((conv) =>
//               conv.id === conversationId
//                 ? { ...conv, messages: [...conv.messages, botMessage] }
//                 : conv
//             )
//           );
//         }
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       const errorMessage = {
//         id: Date.now().toString(),
//         type: 'text',
//         content: 'Sorry, I encountered an error. Please try again.',
//         isUser: false,
//         timestamp: new Date().toISOString(),
//       };
//       setConversations((prev) =>
//         prev.map((conv) =>
//           conv.id === conversationId
//             ? { ...conv, messages: [...conv.messages, errorMessage] }
//             : conv
//         )
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateMessage = (conversationId, messageId, newContent) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: conv.messages.map((msg) =>
//                 msg.id === messageId ? { ...msg, content: newContent } : msg
//               ),
//             }
//           : conv
//       )
//     );
//     sendMessage({ text: newContent, file: null }, conversationId);
//   };

//   const updateConversationTitle = (id, title) => {
//     setConversations((prev) =>
//       prev.map((conv) => (conv.id === id ? { ...conv, title } : conv))
//     );
//   };

//   const deleteConversation = (id) => {
//     setConversations((prev) => prev.filter((conv) => conv.id !== id));
//     if (id === activeConversationId) {
//       const remaining = conversations.filter((conv) => conv.id !== id);
//       if (remaining.length > 0) {
//         setActiveConversationId(remaining[0].id);
//       } else {
//         createNewConversation();
//       }
//     }
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         conversations,
//         activeConversationId,
//         setActiveConversationId,
//         getActiveConversation,
//         sendMessage,
//         createNewConversation,
//         updateConversationTitle,
//         deleteConversation,
//         loading,
//         error: null,
//         updateMessage,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };