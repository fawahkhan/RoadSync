
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-50">
                  <Sidebar />
                  <div className="ml-64 flex-1">
                    <Header />
                    <div className='flex-1'>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/smart-parking" element={<SmartParking />} />
                        <Route path="/track-emissions" element={<TrackEmissions />} />
                        <Route path="/report-crime" element={<ReportCrime />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/routes" element={<RoutesPage />} />
                        <Route path="/utilities" element={<Utilities />} />

                      </Routes>
                    </div>
                    <Footer/>
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