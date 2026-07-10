
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SmartParking from './pages/SmartParking';
import TrackEmissions from './pages/TrackEmissions';
import ReportCrime from './pages/ReportCrime';
import Profile from './pages/Profile';
import RoutesPage from './pages/Routes';
import Utilities from './pages/Utilities';
import About from './pages/About';
import ChatBot from './pages/ChatBot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
                  <Sidebar />
                  <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
                    <Header />
                    <main className="flex-1 flex flex-col overflow-y-auto min-h-0 relative bg-gray-50">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/smart-parking" element={<SmartParking />} />
                        <Route path="/track-emissions" element={<TrackEmissions />} />
                        <Route path="/report-crime" element={<ReportCrime />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/routes" element={<RoutesPage />} />
                        <Route path="/utilities" element={<Utilities />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/chat" element={<ChatBot />} />
                      </Routes>
                    </main>
                  </div> 
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;