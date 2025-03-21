import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

function Utilities() {
  const [searchQuery, setSearchQuery] = useState('');

  const facilities = [
    { id: 'hospital', name: 'Hospital', icon: '🏥' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'petrol', name: 'Petrol pump', icon: '⛽' },
    { id: 'police', name: 'Police station', icon: '🚓' }
  ];

  const suggestions = [
    {
      id: 1,
      name: 'City General Hospital',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Central Medical Center',
      image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Memorial Hospital',
      image: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=500&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for facilities nearby..."
              className="w-full p-2 pl-8 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-2 top-2">🔍</span>
            <button className="absolute right-2 top-2">🎤</button>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="p-2">🔔</button>
          <button className="p-2">👤</button>
        </div>
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>

      <div className="flex justify-around my-6">
        {facilities.map(facility => (
          <button
            key={facility.id}
            className="flex flex-col items-center p-4 bg-[#F3F9E3] rounded-lg hover:bg-[#E5F0D5] transition-colors"
          >
            <span className="text-2xl">{facility.icon}</span>
            <span className="mt-2">{facility.name}</span>
          </button>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded mb-6 hover:bg-blue-700 transition-colors">
        See hospitals nearby
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{suggestion.name}</h3>
              <p className="text-sm text-gray-600 mt-1">⭐️ 4.5 (500+ reviews)</p>
              <p className="text-sm text-gray-600">📍 2.5 km away</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Utilities;