import { useState } from 'react';

export default function SmartParking() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-8">Smart Parking System</h1>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-center text-blue-800 mb-6">
          Find Parking in One Click
        </h2>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Parking lot" 
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select location</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check out</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          
          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}