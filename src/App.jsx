import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <ChatArea />
            </main>
          </div>
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;