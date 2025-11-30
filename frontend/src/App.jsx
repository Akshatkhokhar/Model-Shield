import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import BackendStatus from './components/BackendStatus.jsx';
import Footer from './components/Footer.jsx';
import ChatView from './pages/ChatView.jsx';
import ShieldDashboard from './pages/ShieldDashboard.jsx';
import Landing from './pages/Landing.jsx';
import ChatInterface from './components/ChatInterface.jsx';

function App() {
  const [globalChatOpen, setGlobalChatOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">

        {/* Simple Navigation Header */}
        <nav className="bg-white/80 backdrop-blur p-4 shadow-sm border-b border-gray-200">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Model Shield</h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Chat
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Dashboard
              </NavLink>
              <BackendStatus />
            </div>
          </div>
        </nav>

        {/* Define Routes */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/dashboard" element={<ShieldDashboard />} />
          </Routes>
          {/* Local page footer */}
          <Footer />
        </div>

        {/* Global Floating Chat Button */}
        <button
          onClick={() => setGlobalChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl px-5 py-3 font-semibold"
          title="Open quick prompt check"
        >
          Check Prompt
        </button>

        {/* Global Chat Modal */}
        <ChatInterface open={globalChatOpen} onClose={() => setGlobalChatOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
