import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/smart-parking" element={<PageWrapper><SmartParking /></PageWrapper>} />
        <Route path="/track-emissions" element={<PageWrapper><TrackEmissions /></PageWrapper>} />
        <Route path="/report-crime" element={<PageWrapper><ReportCrime /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/routes" element={<PageWrapper><RoutesPage /></PageWrapper>} />
        <Route path="/utilities" element={<PageWrapper><Utilities /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><ChatBot /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col h-full"
    >
      {children}
    </motion.div>
  );
}

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
                <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
                  <Sidebar />
                  <div className="ml-72 flex-1 flex flex-col h-screen overflow-hidden relative">
                    <Header />
                    <main className="flex-1 flex flex-col overflow-y-auto min-h-0 relative bg-background/50">
                      <AnimatedRoutes />
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