import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

function Routes() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  
  const transportModes = [
    { id: 'car', icon: '🚗', mode: 'DRIVING' },
    { id: 'motorcycle', icon: '🏍', mode: 'DRIVING' },
    { id: 'bus', icon: '🚌', mode: 'TRANSIT' },
    { id: 'walk', icon: '🚶', mode: 'WALKING' },
    { id: 'bicycle', icon: '🚲', mode: 'BICYCLING' }
  ];

  const [selectedMode, setSelectedMode] = useState(transportModes[0]);

  const calculateRoute = () => {
    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: selectedMode.mode
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          alert("Unable to fetch directions. Please check your input.");
        }
      }
    );
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Routes</h1>
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
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Choose Your Location"
            className="flex-1 p-2 border rounded"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <button className="p-2 bg-blue-100 rounded-full">📍</button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Destination"
            className="flex-1 p-2 border rounded"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button 
            className="p-2 bg-blue-100 rounded-full"
            onClick={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
          >
            🔄
          </button>
        </div>

        <button
          onClick={calculateRoute}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Get Directions
        </button>

        <div className="flex justify-around mt-4">
          {transportModes.map(mode => (
            <button
              key={mode.id}
              className={`p-3 rounded-full transition-colors ${
                selectedMode.id === mode.id 
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode.icon}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Traffic Signals Ahead: 8</p>
          <p>Tolls: 1</p>
          <p>Speed limit: 80 km/hr</p>
        </div>
      </div>
    </div>
  );
}

export default Routes;
