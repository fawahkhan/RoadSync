import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { 
  Car, 
  Bike, 
  Zap, 
  MapPin, 
  ArrowUpDown, 
  Users, 
  Fuel, 
  Share2, 
  Clock, 
  Navigation, 
  Check, 
  History, 
  ArrowLeft,
  Calendar,
  IndianRupee,
  Plus,
  Minus
} from 'lucide-react';
import { StorageService } from '../services/storageService';

// Fuel price benchmarks (India average)
const FUEL_PRICES = {
  Petrol: 96.72,
  Diesel: 89.62,
  Electric: 9.50, // per kWh
  CNG: 76.59
};

const DEFAULT_MILEAGES = {
  car: { Petrol: 15, Diesel: 18, Electric: 6.5, CNG: 22 },
  bike: { Petrol: 45, Diesel: 45, Electric: 25, CNG: 50 },
  ev: { Petrol: 15, Diesel: 18, Electric: 7.0, CNG: 22 }
};

export default function TripSplitter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'my-trips'
  const [savedTrips, setSavedTrips] = useState([]);

  // Form State
  const [fromLocation, setFromLocation] = useState('Delhi (My Location)');
  const [toLocation, setToLocation] = useState('Jaipur, Rajasthan');
  const [fromCoords, setFromCoords] = useState([28.6139, 77.2090]); // Delhi
  const [toCoords, setToCoords] = useState([26.9124, 75.7873]); // Jaipur
  const [travelMode, setTravelMode] = useState('car'); // 'car' | 'bike' | 'ev'
  const [fuelType, setFuelType] = useState('Petrol');
  const [mileage, setMileage] = useState(15);
  const [passengers, setPassengers] = useState(4);
  const [passengerNames, setPassengerNames] = useState(['You', 'Rohit', 'Ananya', 'Karan']);
  const [includeTolls, setIncludeTolls] = useState(true);
  const [tollCost, setTollCost] = useState(550);
  const [isCustomToll, setIsCustomToll] = useState(false);

  // Computed Trip Result
  const [tripResult, setTripResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Autocomplete suggestions
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(null);

  // Map references
  const routeMapRef = useRef(null);
  const routeMapInstance = useRef(null);
  const routePolylineRef = useRef(null);
  const routeMarkersRef = useRef([]);

  useEffect(() => {
    setSavedTrips(StorageService.getTrips());
  }, []);

  // Update default mileage when mode or fuel type changes
  useEffect(() => {
    const defaultM = DEFAULT_MILEAGES[travelMode]?.[fuelType] || 15;
    setMileage(defaultM);
  }, [travelMode, fuelType]);

  // Sync passenger names array length with passenger count
  useEffect(() => {
    setPassengerNames(prev => {
      const names = [...prev];
      if (passengers > names.length) {
        for (let i = names.length; i < passengers; i++) {
          names.push(`Rider ${i + 1}`);
        }
      } else if (passengers < names.length) {
        return names.slice(0, passengers);
      }
      return names;
    });
  }, [passengers]);

  // Geocoding helper with Nominatim
  async function searchLocation(query, type) {
    if (!query || query.length < 3) {
      if (type === 'from') setFromSuggestions([]);
      if (type === 'to') setToSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=4&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (type === 'from') setFromSuggestions(data);
      if (type === 'to') setToSuggestions(data);
    } catch {
      // Fallback: silence or offline
    }
  }

  function handleSelectSuggestion(item, type) {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (type === 'from') {
      setFromLocation(item.display_name.split(',')[0]);
      setFromCoords([lat, lon]);
      setFromSuggestions([]);
    } else {
      setToLocation(item.display_name.split(',')[0]);
      setToCoords([lat, lon]);
      setToSuggestions([]);
    }
    setSearchFocused(null);
  }

  function handleSwapLocations() {
    const tempLoc = fromLocation;
    const tempCoords = fromCoords;
    setFromLocation(toLocation);
    setFromCoords(toCoords);
    setToLocation(tempLoc);
    setToCoords(tempCoords);
  }

  // Calculate Real Route using OSRM
  async function calculateTrip() {
    setCalculating(true);
    try {
      const [lat1, lng1] = fromCoords;
      const [lat2, lng2] = toCoords;

      let distanceKm = 280;
      let durationMinutes = 315;
      let coordinates = null;

      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const data = await res.json();

        if (data.routes && data.routes[0]) {
          distanceKm = Math.round(data.routes[0].distance / 1000);
          durationMinutes = Math.round(data.routes[0].duration / 60);
          coordinates = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        }
      } catch (err) {
        console.log('Using calculated distance estimation fallback:', err);
        // Fallback straight-line approx
        const rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad;
        const dLng = (lng2 - lng1) * rad;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLng/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distanceKm = Math.round(6371 * c * 1.25); // road factor
        durationMinutes = Math.round(distanceKm * 1.1);
      }

      // Cost Calculation Engine
      const pricePerUnit = FUEL_PRICES[fuelType] || 96.72;
      const fuelNeeded = distanceKm / (mileage || 15);
      const calculatedFuelCost = Math.round(fuelNeeded * pricePerUnit);
      
      // Toll estimation (approx ₹2 per km on national highways)
      const calculatedTolls = includeTolls ? (isCustomToll ? tollCost : Math.round(distanceKm * 1.95)) : 0;
      const totalCost = calculatedFuelCost + calculatedTolls;
      const perPerson = Math.ceil(totalCost / Math.max(1, passengers));

      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;
      const durationText = `${durationHours}h ${remainingMinutes}m`;

      const participants = passengerNames.map((name, i) => ({
        name,
        amount: perPerson,
        isUser: i === 0
      }));

      const computed = {
        id: 'trip-' + Date.now(),
        from: fromLocation,
        to: toLocation,
        fromCoords,
        toCoords,
        distanceKm,
        durationText,
        mode: travelMode,
        fuelType,
        mileage,
        passengers,
        fuelCost: calculatedFuelCost,
        tolls: calculatedTolls,
        totalCost,
        perPersonCost: perPerson,
        participants,
        coordinates,
        createdAt: new Date().toISOString()
      };

      setTripResult(computed);
      StorageService.saveTrip(computed);
      setSavedTrips(StorageService.getTrips());
    } finally {
      setCalculating(false);
    }
  }

  // Draw Route Map when Trip Result is available
  useEffect(() => {
    if (!tripResult || !routeMapRef.current) return;

    if (!routeMapInstance.current) {
      const map = L.map(routeMapRef.current, {
        center: tripResult.fromCoords,
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      routeMapInstance.current = map;
    }

    const map = routeMapInstance.current;

    // Clear old route
    if (routePolylineRef.current) routePolylineRef.current.remove();
    routeMarkersRef.current.forEach(m => m.remove());
    routeMarkersRef.current = [];

    // Draw route path
    const pathCoords = tripResult.coordinates || [tripResult.fromCoords, tripResult.toCoords];
    const polyline = L.polyline(pathCoords, {
      color: '#10B981',
      weight: 5,
      opacity: 0.9,
      smoothFactor: 1
    }).addTo(map);
    routePolylineRef.current = polyline;

    // From Marker (Blue)
    const fromIcon = L.divIcon({
      className: 'route-pin-from',
      html: `
        <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
          A
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    const m1 = L.marker(tripResult.fromCoords, { icon: fromIcon }).addTo(map);

    // To Marker (Red)
    const toIcon = L.divIcon({
      className: 'route-pin-to',
      html: `
        <div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
          B
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    const m2 = L.marker(tripResult.toCoords, { icon: toIcon }).addTo(map);

    routeMarkersRef.current = [m1, m2];
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }, [tripResult]);

  // Share via WhatsApp with preformatted bill
  function shareViaWhatsApp(trip) {
    const lines = [
      `🚗 *RoadSync Trip & Fair Cost Split*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📍 *Route:* ${trip.from} ➔ ${trip.to}`,
      `📏 *Distance:* ${trip.distanceKm} km (~${trip.durationText})`,
      `⛽ *Fuel Cost:* ₹${trip.fuelCost.toLocaleString()}`,
      `🛣️ *Tolls:* ₹${trip.tolls.toLocaleString()}`,
      `💰 *Total Cost:* ₹${trip.totalCost.toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👥 *Fair Split (${trip.passengers} people):* ₹${trip.perPersonCost.toLocaleString()} each\n`,
      ...trip.participants.map(p => `• ${p.name}: ₹${p.amount}`),
      `\nCalculated on *RoadSync* — Safer Roads, Smarter Journeys!`
    ];

    const message = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] select-none text-slate-100">
      {/* Top Header */}
      <div className="z-20 bg-[#0B0F17] px-4 pt-3 pb-2 border-b border-[#1E2B40] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => tripResult ? setTripResult(null) : navigate('/')} 
            className="p-1.5 rounded-lg bg-[#162032] text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              {tripResult ? 'Trip Preview' : 'Trip & Cost Splitter'}
            </h1>
            <p className="text-[11px] text-slate-400">
              {tripResult ? `${tripResult.distanceKm} km route computed` : 'Plan route, fuel cost and fair carpool split'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Plan Trip vs My Trips (Only when not in result view) */}
      {!tripResult && (
        <div className="px-4 py-2 bg-[#0B0F17]">
          <div className="flex bg-[#141C2B] p-1 rounded-2xl border border-[#1E2B40]">
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'plan'
                  ? 'bg-[#10B981] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Plan Trip
            </button>
            <button
              onClick={() => setActiveTab('my-trips')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-trips'
                  ? 'bg-[#10B981] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Trips ({savedTrips.length})
            </button>
          </div>
        </div>
      )}

      {/* TRIP RESULT VIEW (Screens 6 & 7 in Mockup) */}
      {tripResult ? (
        <div className="flex-1 flex flex-col">
          {/* Map Route Canvas */}
          <div className="w-full h-64 relative border-b border-[#1E2B40]">
            <div ref={routeMapRef} className="w-full h-full" />
            <div className="absolute top-3 right-3 z-[1000] px-3 py-1.5 rounded-full bg-[#111827]/90 border border-[#1E2B40] text-xs font-semibold text-white shadow-lg flex items-center gap-1.5">
              <Clock size={13} className="text-[#10B981]" />
              <span>~{tripResult.durationText} ({tripResult.distanceKm} km)</span>
            </div>
          </div>

          {/* Breakdown Content Card */}
          <div className="p-4 space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <Car size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {tripResult.from} ➔ {tripResult.to}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {tripResult.distanceKm} km • {tripResult.durationText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2B40]/70 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fuel Cost</span>
                  <span className="text-sm font-bold text-slate-200">
                    ₹{tripResult.fuelCost.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tolls</span>
                  <span className="text-sm font-bold text-slate-200">
                    ₹{tripResult.tolls.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Total Cost</span>
                  <span className="text-sm font-bold text-[#10B981]">
                    ₹{tripResult.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">
                    Cost Split ({tripResult.passengers} people)
                  </h3>
                  <p className="text-[10px] text-slate-400">Fair equal per-person share</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#10B981]">
                    ₹{tripResult.perPersonCost}
                  </span>
                  <span className="text-[10px] text-slate-400 block">each</span>
                </div>
              </div>

              {/* Rider List */}
              <div className="space-y-2 pt-1 border-t border-[#1E2B40]/60">
                {tripResult.participants.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1B2538] flex items-center justify-center text-[11px] font-bold text-slate-300">
                        {p.name[0]}
                      </div>
                      <span className="font-medium text-slate-200">
                        {p.name} {p.isUser && '(You)'}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-100">
                      ₹{p.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTripResult(null)}
                className="flex-1 py-3 rounded-2xl bg-[#162032] border border-[#1E2B40] text-xs font-bold text-slate-200 hover:bg-[#1E2B40] active:scale-95 transition-all"
              >
                Edit Trip
              </button>

              <button
                onClick={() => shareViaWhatsApp(tripResult)}
                className="flex-2 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'plan' ? (
        /* PLAN TRIP FORM (Screen 5 in Mockup) */
        <div className="p-4 space-y-4 flex-1">
          {/* Origin & Destination Card */}
          <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] space-y-3 relative">
            {/* From Input */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                From
              </label>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute left-3 top-3"></div>
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => {
                    setFromLocation(e.target.value);
                    searchLocation(e.target.value, 'from');
                  }}
                  onFocus={() => setSearchFocused('from')}
                  placeholder="Starting Point..."
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              {/* Suggestions dropdown */}
              {searchFocused === 'from' && fromSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-14 z-30 bg-[#162032] border border-[#1E2B40] rounded-xl shadow-xl overflow-hidden">
                  {fromSuggestions.map(item => (
                    <div
                      key={item.place_id}
                      onClick={() => handleSelectSuggestion(item, 'from')}
                      className="p-2.5 text-xs text-slate-200 hover:bg-[#1E2B40] cursor-pointer border-b border-[#1E2B40]/50 line-clamp-1"
                    >
                      {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-end -my-2 mr-2 z-10 relative">
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-1.5 rounded-full bg-[#1E2B40] hover:bg-[#2A3A54] text-slate-300 border border-[#2D3E5B] active:scale-90 transition-transform"
              >
                <ArrowUpDown size={14} />
              </button>
            </div>

            {/* To Input */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                To
              </label>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute left-3 top-3"></div>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    searchLocation(e.target.value, 'to');
                  }}
                  onFocus={() => setSearchFocused('to')}
                  placeholder="Destination..."
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              {/* Suggestions dropdown */}
              {searchFocused === 'to' && toSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-14 z-30 bg-[#162032] border border-[#1E2B40] rounded-xl shadow-xl overflow-hidden">
                  {toSuggestions.map(item => (
                    <div
                      key={item.place_id}
                      onClick={() => handleSelectSuggestion(item, 'to')}
                      className="p-2.5 text-xs text-slate-200 hover:bg-[#1E2B40] cursor-pointer border-b border-[#1E2B40]/50 line-clamp-1"
                    >
                      {item.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'car', label: 'Car', icon: Car },
                { id: 'bike', label: 'Bike', icon: Bike },
                { id: 'ev', label: 'EV', icon: Zap },
              ].map(mode => {
                const isSelected = travelMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTravelMode(mode.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                        : 'bg-[#141C2B] border-[#1E2B40] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-bold">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle & Fuel Details */}
          <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Fuel size={14} className="text-[#10B981]" />
              <span>Vehicle & Fuel Specs</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden"
                >
                  <option value="Petrol">Petrol (₹96.7/L)</option>
                  <option value="Diesel">Diesel (₹89.6/L)</option>
                  <option value="Electric">Electric (₹9.5/kWh)</option>
                  <option value="CNG">CNG (₹76.6/kg)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Mileage ({fuelType === 'Electric' ? 'km/kWh' : 'km/l'})
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={mileage}
                  onChange={(e) => setMileage(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Toll checkbox */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1E2B40]/60">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTolls}
                  onChange={(e) => setIncludeTolls(e.target.checked)}
                  className="rounded-sm accent-[#10B981] w-4 h-4"
                />
                <span>Include Expressway Tolls</span>
              </label>
              {includeTolls && (
                <span className="text-[11px] text-slate-400">~₹1.9/km</span>
              )}
            </div>
          </div>

          {/* Passenger Stepper */}
          <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users size={14} className="text-[#10B981]" />
                <span>Passengers (Fair Split)</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Divide total fuel + tolls evenly</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-8 h-8 rounded-xl bg-[#162032] border border-[#1E2B40] flex items-center justify-center text-slate-200 active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="text-base font-bold text-white w-4 text-center">
                {passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers(Math.min(12, passengers + 1))}
                className="w-8 h-8 rounded-xl bg-[#162032] border border-[#1E2B40] flex items-center justify-center text-slate-200 active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Calculate Trip Button */}
          <button
            type="button"
            disabled={calculating}
            onClick={calculateTrip}
            className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {calculating ? (
              <span className="animate-pulse">Computing optimal route...</span>
            ) : (
              <>
                <Navigation size={18} />
                <span>Calculate Trip</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* MY TRIPS TAB */
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {savedTrips.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No saved trips yet. Plan your first trip above!
            </div>
          ) : (
            savedTrips.map(t => (
              <div
                key={t.id}
                onClick={() => setTripResult(t)}
                className="p-3.5 rounded-2xl bg-[#141C2B] border border-[#1E2B40] hover:border-[#10B981]/50 cursor-pointer transition-all active:scale-[0.99] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                      <Car size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {t.from} ➔ {t.to}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {t.distanceKm} km • {t.durationText}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#10B981]">
                      ₹{t.perPersonCost}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ person</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1E2B40]/60 text-[11px] text-slate-400">
                  <span>{t.passengers} passengers</span>
                  <span className="text-slate-300 font-semibold">Total ₹{t.totalCost}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
