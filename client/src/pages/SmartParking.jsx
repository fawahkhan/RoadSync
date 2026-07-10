import { useState } from 'react';
import { Car } from 'lucide-react';

export default function SmartParking() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Smart Parking</h1>
      <p className="text-text-secondary mb-8">Find and book parking spots near you in seconds.</p>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Parking lot"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Car size={20} className="text-teal-600" /> Find a spot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Location</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Check in</label>
                <input
                  type="time"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Check out</label>
                <input
                  type="time"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <button className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}