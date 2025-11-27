import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import BackendStatus from './components/BackendStatus.jsx';
import Footer from './components/Footer.jsx';
import ChatView from './pages/ChatView.jsx';
import ShieldDashboard from './pages/ShieldDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        
        {/* Simple Navigation Header */}
        <nav className="bg-gray-800/80 backdrop-blur p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-teal-400">Model Shield 🔥</h1>
            <div className="flex items-center gap-3 sm:gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-teal-400'}`
                }
              >
                Chat
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-teal-400'}`
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
            <Route path="/" element={<ChatView />} />
            <Route path="/dashboard" element={<ShieldDashboard />} />
          </Routes>
          {/* Local page footer */}
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
