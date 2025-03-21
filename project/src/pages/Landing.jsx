import { Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#E8FFE8] flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation2 className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-blue-600">RoadSync</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-gray-600 hover:text-blue-600">Sign In</Link>
            <Link 
              to="/auth" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 flex-1">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Navigate Smart,<br />
              Stay Safe,<br />
              Go Green
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Find safe parking spots, report crimes, and connect with essential public services—all in one place. 
              Drive smarter, park safer, and help build a better future by reducing CO₂ emissions and make a real impact!
            </p>
            <div className="flex gap-4">
              <Link 
                to="/auth" 
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Smart Parking
              </Link>
              <Link 
                to="/auth" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
              >
                CO₂ Emission Tracker
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Smart City Traffic Management" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}