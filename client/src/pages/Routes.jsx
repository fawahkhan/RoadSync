import { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const containerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };
const center = { lat: 40.7128, lng: -74.0060 };

function Routes() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const transportModes = [
    { id: 'car', label: '🚗 Drive', mode: 'DRIVING' },
    { id: 'bus', label: '🚌 Transit', mode: 'TRANSIT' },
    { id: 'walk', label: '🚶 Walk', mode: 'WALKING' },
    { id: 'bicycle', label: '🚲 Bike', mode: 'BICYCLING' },
  ];
  const [selectedMode, setSelectedMode] = useState(transportModes[0]);

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none";

  const calculateRoute = () => {
    if (!origin || !destination) return;
    const service = new window.google.maps.DirectionsService();
    service.route({ origin, destination, travelMode: selectedMode.mode }, (result, status) => {
      if (status === 'OK') setDirections(result);
      else alert("Unable to fetch directions. Please check your input.");
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Routes</h1>
      <p className="text-gray-500 mb-8">Plan your journey with real-time directions and traffic info.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">From</label>
              <input type="text" className={inputCls} placeholder="Starting point" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div className="flex justify-center">
              <button className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors text-lg" onClick={() => { setOrigin(destination); setDestination(origin); }}>⇅</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">To</label>
              <input type="text" className={inputCls} placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {transportModes.map(m => (
                <button key={m.id} onClick={() => setSelectedMode(m)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${selectedMode.id === m.id ? 'bg-teal-50 text-teal-600 border border-teal-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                  {m.label}
                </button>
              ))}
            </div>

            <button onClick={calculateRoute} className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm">
              Get Directions
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Route Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Traffic Signals</span><span className="font-medium text-gray-900">8</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tolls</span><span className="font-medium text-gray-900">1</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Speed Limit</span><span className="font-medium text-gray-900">80 km/hr</span></div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden h-[500px]">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default Routes;
