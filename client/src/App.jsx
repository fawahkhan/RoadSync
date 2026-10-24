import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileShell from './components/MobileShell';
import Home from './pages/Home';
import HazardRadar from './pages/HazardRadar';
import TripSplitter from './pages/TripSplitter';
import RoadsideAssistance from './pages/RoadsideAssistance';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MobileShell>
              <Home />
            </MobileShell>
          } 
        />
        <Route 
          path="/radar" 
          element={
            <MobileShell fullBleed={true}>
              <HazardRadar />
            </MobileShell>
          } 
        />
        <Route 
          path="/trips" 
          element={
            <MobileShell>
              <TripSplitter />
            </MobileShell>
          } 
        />
        <Route 
          path="/sos" 
          element={
            <MobileShell>
              <RoadsideAssistance />
            </MobileShell>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <MobileShell>
              <Profile />
            </MobileShell>
          } 
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}