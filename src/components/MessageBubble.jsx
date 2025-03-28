import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import lightStyle from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
import darkStyle from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
import { useTheme } from '../contexts/ThemeContext';
import { typewriterEffect } from '../utils/typewriterEffect';
import { FiDownload } from 'react-icons/fi';

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const syntaxHighlighterStyle = theme === 'light' ? lightStyle : darkStyle;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-2">
      <SyntaxHighlighter
        style={syntaxHighlighterStyle}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0 }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const MessageBubble = ({ message, isTyping = false, onEditMessage, containerRef }) => {
  const { type, content, isUser } = message;
  const [displayText, setDisplayText] = useState('');
  const messageRef = useRef(null);

  // Handle typing effect for bot messages
  useEffect(() => {
    if (!isUser && type === 'text' && isTyping) {
      const cleanupTyping = typewriterEffect(content, setDisplayText);
      return cleanupTyping;
    } else {
      setDisplayText(content);
    }
  }, [content, isUser, type, isTyping]);

  // Scroll when displayText updates during typing
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText, containerRef]);

  // Scroll into view when message first appears
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${content}`;
    link.download = 'generated-image.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // <div ref={messageRef} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    //   <div className={isUser ? 'user-message' : 'bot-message'}>
    <div 
    ref={messageRef} 
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    style={{ animationDelay: `${message.id % 5 * 0.1}s` }}
  >
    <div className={`${isUser ? 'user-message' : 'bot-message'} transform transition-all duration-300 hover:scale-[1.02]`}>
        {type === 'text' ? (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline) {
                  const language = match ? match[1] : 'text';
                  return <CodeBlock language={language}>{children}</CodeBlock>;
                } else {
                  return (
                    <code className="bg-gray-100 dark:bg-gray-700 rounded px-1" {...props}>
                      {children}
                    </code>
                  );
                }
              },
            }}
          >
            {displayText}
          </ReactMarkdown>
        ) : type === 'image' ? (
          // <div className="relative">
          //   <img
          //     src={`data:image/jpeg;base64,${content}`}
          //     alt="Generated image"
          //     className="max-w-full rounded"
          //   />
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
    <img
      src={`data:image/jpeg;base64,${content}`}
      alt="Generated image"
      className="transform transition-transform duration-500 hover:scale-105"
    />
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full"
              aria-label="Download image"
            >
              <FiDownload className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        {isTyping && type === 'text' && displayText !== content && (
          <span className="ml-1 inline-block h-4 w-2 animate-cursor-blink bg-current"></span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

// import { useState, useEffect, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import lightStyle from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
// import darkStyle from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
// import { useTheme } from '../contexts/ThemeContext';
// import { typewriterEffect } from '../utils/typewriterEffect';
// import { FiDownload } from 'react-icons/fi';

// const CodeBlock = ({ language, children }) => {
//   const [copied, setCopied] = useState(false);
//   const { theme } = useTheme();
//   const syntaxHighlighterStyle = theme === 'light' ? lightStyle : darkStyle;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(children).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   return (
//     <div className="relative my-2">
//       <SyntaxHighlighter
//         style={syntaxHighlighterStyle}
//         language={language}
//         PreTag="div"
//         customStyle={{ margin: 0 }}
//       >
//         {String(children).replace(/\n$/, '')}
//       </SyntaxHighlighter>
//       <button
//         onClick={copyToClipboard}
//         className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm"
//       >
//         {copied ? 'Copied!' : 'Copy'}
//       </button>
//     </div>
//   );
// };

// const MessageBubble = ({ message, isTyping = false, onEditMessage, containerRef }) => {
//   const { type, content, isUser, file } = message;
//   const [displayText, setDisplayText] = useState('');
//   const messageRef = useRef(null);

//   useEffect(() => {
//     if (!isUser && type === 'text' && isTyping) {
//       const cleanupTyping = typewriterEffect(content, setDisplayText);
//       return cleanupTyping;
//     } else {
//       setDisplayText(content);
//     }
//   }, [content, isUser, type, isTyping]);

//   useEffect(() => {
//     if (containerRef?.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [displayText, containerRef]);

//   useEffect(() => {
//     if (messageRef.current) {
//       messageRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [message]);

//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = `data:image/jpeg;base64,${content}`;
//     link.download = 'generated-image.jpeg';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div ref={messageRef} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
//       <div className={isUser ? 'user-message' : 'bot-message'}>
//         {isUser ? (
//           <>
//             {file && file.type === 'image' && (
//               <img src={file.url} alt="Uploaded image" className="max-w-xs rounded mb-2" />
//             )}
//             <ReactMarkdown
//               components={{
//                 code({ node, inline, className, children, ...props }) {
//                   const match = /language-(\w+)/.exec(className || '');
//                   if (!inline) {
//                     const language = match ? match[1] : 'text';
//                     return <CodeBlock language={language}>{children}</CodeBlock>;
//                   }
//                   return (
//                     <code className="bg-gray-100 dark:bg-gray-700 rounded px-1" {...props}>
//                       {children}
//                     </code>
//                   );
//                 },
//               }}
//             >
//               {displayText}
//             </ReactMarkdown>
//             {file && file.type === 'text' && (
//               <p className="text-sm text-gray-500 mt-1">Attached: {file.name}</p>
//             )}
//           </>
//         ) : type === 'text' ? (
//           <ReactMarkdown
//             components={{
//               code({ node, inline, className, children, ...props }) {
//                 const match = /language-(\w+)/.exec(className || '');
//                 if (!inline) {
//                   const language = match ? match[1] : 'text';
//                   return <CodeBlock language={language}>{children}</CodeBlock>;
//                 }
//                 return (
//                   <code className="bg-gray-100 dark:bg-gray-700 rounded px-1" {...props}>
//                   {children}
//                 </code>
//                 );
//               },
//             }}
//           >
//             {displayText}
//           </ReactMarkdown>
//         ) : type === 'image' ? (
//           <div className="relative">
//             <img
//               src={`data:image/jpeg;base64,${content}`}
//               alt="Generated image"
//               className="max-w-full rounded"
//             />
//             <button
//               onClick={handleDownload}
//               className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full"
//               aria-label="Download image"
//             >
//               <FiDownload className="h-5 w-5" />
//             </button>
//           </div>
//         ) : null}
//         {isTyping && type === 'text' && displayText !== content && (
//           <span className="ml-1 inline-block h-4 w-2 animate-cursor-blink bg-current"></span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;