import { useState } from 'react';
import { FiPlus, FiCamera, FiMessageSquare, FiTrash2, FiEdit, FiCheck, FiX, FiMenu } from 'react-icons/fi';
import { useChat } from '../contexts/ChatContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
  } = useChat();

  const handleEditTitle = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (id) => {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const getConversationPreview = (conversation) => {
    if (conversation.messages.length === 0) {
      return 'No messages yet';
    }
    const firstUserMessage = conversation.messages.find((msg) => msg.isUser);
    const message = firstUserMessage || conversation.messages[0];
    return message.content.length > 30
      ? `${message.content.substring(0, 30)}...`
      : message.content;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-20 md:hidden"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <FiMenu className="h-6 w-6" />
      </button>

      {/* <div
        className={`sidebar fixed inset-y-0 left-0 z-10 transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      > */}
      <div className={`sidebar fixed inset-y-0 left-0 z-10 transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
  isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
}`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">ChatterBox💬</h2>
          <ThemeToggle />
        </div>

        <button
          onClick={() => createNewConversation('text')}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FiPlus className="h-5 w-5" />
          New Chat
        </button>

        <button
          onClick={() => createNewConversation('image')}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FiCamera className="h-5 w-5" />
          Generate Image
        </button>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 font-medium text-gray-500 dark:text-gray-400">Conversations</h3>

          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-md p-2 transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {editingId === conversation.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveTitle(conversation.id)}
                      className="ml-2 text-green-500 hover:text-green-600"
                    >
                      <FiCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="ml-1 text-red-500 hover:text-red-600"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setActiveConversationId(conversation.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start">
                      {conversation.type === 'image' ? (
                        <FiCamera className="mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <FiMessageSquare className="mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate font-medium">{conversation.title}</h4>
                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                          {getConversationPreview(conversation)}
                        </p>
                      </div>
                    </div>

                    <div className="absolute right-2 top-2 hidden space-x-1 group-hover:flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(conversation.id, conversation.title);
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      >
                        <FiEdit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                      >
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;