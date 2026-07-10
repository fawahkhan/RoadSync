import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const containerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };
const center = { lat: 40.7128, lng: -74.0060 };

function Utilities() {
  const [searchQuery, setSearchQuery] = useState('');
  const facilities = [
    { id: 'hospital', name: 'Hospital', icon: '🏥' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'petrol', name: 'Petrol Pump', icon: '⛽' },
    { id: 'police', name: 'Police', icon: '🚓' },
  ];
  const suggestions = [
    { id: 1, name: 'City General Hospital', rating: '4.5', distance: '2.5 km', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=500&auto=format&fit=crop' },
    { id: 2, name: 'Central Medical Center', rating: '4.3', distance: '3.1 km', image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=500&auto=format&fit=crop' },
    { id: 3, name: 'Memorial Hospital', rating: '4.7', distance: '1.8 km', image: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=500&auto=format&fit=crop' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Public Utilities</h1>
          <p className="text-gray-500">Find hospitals, pharmacies, petrol stations, and more near you.</p>
        </div>
        <div className="relative w-72">
          <input type="text" placeholder="Search facilities..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <span className="absolute left-3 top-3 text-sm">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {facilities.map(f => (
          <button key={f.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-400 hover:shadow-sm transition-all text-left">
            <span className="text-2xl">{f.icon}</span>
            <span className="text-sm font-medium text-gray-900">{f.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[400px]">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby</h2>
          <div className="space-y-4">
            {suggestions.map(s => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex hover:shadow-sm transition-shadow cursor-pointer">
                <img src={s.image} alt={s.name} className="w-28 h-24 object-cover flex-shrink-0" />
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 text-sm">{s.name}</h3>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>⭐ {s.rating}</span>
                    <span>📍 {s.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Utilities;