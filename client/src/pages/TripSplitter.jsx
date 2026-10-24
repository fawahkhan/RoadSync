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
  Minus,
  CheckCircle2,
  TrendingUp,
  Sparkles
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
      // Fallback
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
        const rad = Math.PI / 180;
        const dLat = (lat2 - lat1) * rad;
        const dLng = (lng2 - lng1) * rad;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLng/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distanceKm = Math.round(6371 * c * 1.25);
        durationMinutes = Math.round(distanceKm * 1.1);
      }

      // Cost Calculation Engine
      const pricePerUnit = FUEL_PRICES[fuelType] || 96.72;
      const fuelNeeded = distanceKm / (mileage || 15);
      const calculatedFuelCost = Math.round(fuelNeeded * pricePerUnit);
      
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
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
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
      `👥 *Fair Split (${trip.passengers} riders):* *₹${trip.perPersonCost} each*`,
      ...trip.participants.map(p => `• ${p.name}: ₹${p.amount}`),
      `━━━━━━━━━━━━━━━━━━━━`,
      `*Calculated via RoadSync v2*`
    ];

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  return (
    <div className="flex flex-col select-none text-slate-100 space-y-5">
      
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 rounded-lg bg-[#162032] text-slate-300 hover:text-white active:scale-95 transition-all md:hidden"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Trip & Fair Cost Splitter</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Accurate OSRM highway routing, toll estimation & carpool split
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex bg-[#141C2B] p-1 rounded-2xl border border-[#1E2B40] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'plan'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Plan Trip
          </button>
          <button
            onClick={() => setActiveTab('my-trips')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-trips'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Trips ({savedTrips.length})
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PLAN TRIP VIEW (Responsive 2-Column Split Studio)        */}
      {/* ============================================================== */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Inputs & Specs */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Origin & Destination Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3.5 shadow-xl relative">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin size={14} className="text-[#10B981]" />
                <span>Route Endpoints</span>
              </h2>

              {/* From Input */}
              <div className="relative">
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                  Starting Point (Origin)
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
                    className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] transition-colors"
                  />
                </div>

                {/* Suggestions dropdown */}
                {searchFocused === 'from' && fromSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-16 z-30 bg-[#162032] border border-[#1E2B40] rounded-xl shadow-2xl overflow-hidden">
                    {fromSuggestions.map(item => (
                      <div
                        key={item.place_id}
                        onClick={() => handleSelectSuggestion(item, 'from')}
                        className="p-3 text-xs text-slate-200 hover:bg-[#1E2B40] cursor-pointer border-b border-[#1E2B40]/50 line-clamp-1"
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-end -my-2 mr-3 z-10 relative">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="p-2 rounded-full bg-[#1E2B40] hover:bg-[#2A3A54] text-slate-300 border border-[#2D3E5B] active:scale-90 transition-transform shadow-md"
                  title="Swap Origin & Destination"
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>

              {/* To Input */}
              <div className="relative">
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                  Destination (Arrival)
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
                    className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] transition-colors"
                  />
                </div>

                {/* Suggestions dropdown */}
                {searchFocused === 'to' && toSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-16 z-30 bg-[#162032] border border-[#1E2B40] rounded-xl shadow-2xl overflow-hidden">
                    {toSuggestions.map(item => (
                      <div
                        key={item.place_id}
                        onClick={() => handleSelectSuggestion(item, 'to')}
                        className="p-3 text-xs text-slate-200 hover:bg-[#1E2B40] cursor-pointer border-b border-[#1E2B40]/50 line-clamp-1"
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3 shadow-xl">
              <label className="text-xs font-bold uppercase tracking-wider text-white block">
                Travel Mode
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'car', label: 'Car', icon: Car, desc: 'Highway Cruiser' },
                  { id: 'bike', label: 'Motorbike', icon: Bike, desc: 'Two-Wheeler' },
                  { id: 'ev', label: 'Electric EV', icon: Zap, desc: 'Zero Emission' },
                ].map(mode => {
                  const isSelected = travelMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTravelMode(mode.id)}
                      className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] shadow-lg shadow-emerald-500/10'
                          : 'bg-[#162032] border-[#1E2B40] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-bold text-white">{mode.label}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">{mode.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle & Fuel Specs */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3.5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Fuel size={14} className="text-[#10B981]" />
                <span>Vehicle & Fuel Economics</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Fuel / Power Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                  >
                    <option value="Petrol">Petrol (₹{FUEL_PRICES.Petrol}/L)</option>
                    <option value="Diesel">Diesel (₹{FUEL_PRICES.Diesel}/L)</option>
                    <option value="CNG">CNG (₹{FUEL_PRICES.CNG}/kg)</option>
                    <option value="Electric">Electric (₹{FUEL_PRICES.Electric}/kWh)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Vehicle Mileage</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={mileage}
                      onChange={(e) => setMileage(parseFloat(e.target.value) || 15)}
                      className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                    />
                    <span className="absolute right-3 top-2 text-[11px] text-slate-400">
                      {travelMode === 'ev' ? 'km/kWh' : 'km/L'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expressway Tolls Toggle */}
              <div className="pt-2 border-t border-[#1E2B40]/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Include Expressway Tolls</span>
                  <span className="text-[10px] text-slate-400">Calculated via NHAI toll rate benchmarks</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeTolls}
                  onChange={(e) => setIncludeTolls(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Passenger Count & Names */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Riders & Passengers
                  </h3>
                  <p className="text-[10px] text-slate-400">Split evenly between all vehicle occupants</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2.5 bg-[#162032] border border-[#1E2B40] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-7 h-7 rounded-lg bg-[#1E2B40] hover:bg-[#2A3A54] text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold text-white px-1.5">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(10, passengers + 1))}
                    className="w-7 h-7 rounded-lg bg-[#1E2B40] hover:bg-[#2A3A54] text-white flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Dynamic Name Inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E2B40]/60">
                {passengerNames.map((name, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const updated = [...passengerNames];
                      updated[idx] = e.target.value;
                      setPassengerNames(updated);
                    }}
                    placeholder={`Rider ${idx + 1}`}
                    className="bg-[#162032] border border-[#1E2B40] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                  />
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateTrip}
              disabled={calculating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-emerald-400 hover:to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {calculating ? (
                <span>Routing through OSRM Engine...</span>
              ) : (
                <>
                  <Navigation size={18} />
                  <span>Calculate Highway Route & Cost Split</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Interactive Route Map & Calculated Split Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            {tripResult ? (
              <div className="space-y-4">
                
                {/* Route Map Preview Canvas */}
                <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden relative border border-[#1E2B40] shadow-2xl">
                  <div ref={routeMapRef} className="w-full h-full" />
                  
                  {/* Floating duration chip */}
                  <div className="absolute top-3.5 right-3.5 z-[1000] px-3.5 py-1.5 rounded-full bg-[#0B0F17]/90 backdrop-blur-md border border-[#1E2B40] text-xs font-bold text-white shadow-xl flex items-center gap-2">
                    <Clock size={14} className="text-[#10B981]" />
                    <span>~{tripResult.durationText}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-emerald-400">{tripResult.distanceKm} km</span>
                  </div>
                </div>

                {/* Total Cost Breakdown Card */}
                <div className="p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Estimated Trip Total
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        ₹{tripResult.totalCost.toLocaleString()}
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Per Person Share</span>
                      <span className="text-xl sm:text-2xl font-black text-[#10B981]">
                        ₹{tripResult.perPersonCost}
                      </span>
                      <span className="text-[10px] text-slate-500 block">({tripResult.passengers} riders)</span>
                    </div>
                  </div>

                  {/* 3 Metric Mini-cards */}
                  <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#1E2B40]/70 text-center">
                    <div className="p-2.5 rounded-2xl bg-[#162032]">
                      <span className="text-[10px] text-slate-400 block font-medium">Fuel Required</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        ₹{tripResult.fuelCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#162032]">
                      <span className="text-[10px] text-slate-400 block font-medium">Highway Tolls</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        ₹{tripResult.tolls.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#162032]">
                      <span className="text-[10px] text-slate-400 block font-medium">Travel Time</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">
                        {tripResult.durationText}
                      </span>
                    </div>
                  </div>

                  {/* Individual Riders List */}
                  <div className="space-y-2 pt-2 border-t border-[#1E2B40]/70">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Rider Cost Allocation
                    </h3>
                    <div className="space-y-1.5">
                      {tripResult.participants.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#162032] border border-[#1E2B40]/60">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold text-xs flex items-center justify-center">
                              {p.name[0]}
                            </div>
                            <span className="font-semibold text-slate-200">
                              {p.name} {p.isUser && '(You)'}
                            </span>
                          </div>
                          <span className="font-bold text-white text-sm">
                            ₹{p.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions: WhatsApp Share */}
                  <button
                    onClick={() => shareViaWhatsApp(tripResult)}
                    className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} />
                    <span>Share Digital Receipt via WhatsApp</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Informational Studio Card before calculation */
              <div className="p-6 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-5 shadow-xl text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    Fair Highway Carpool Engine
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Enter your route endpoints and vehicle parameters on the left to compute live highway distance via OSRM, current fuel benchmarks, and toll rates.
                  </p>
                </div>

                {/* Benchmark benchmarks table */}
                <div className="p-4 rounded-2xl bg-[#162032] border border-[#1E2B40] text-left space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Current Fuel Reference (Delhi NCR)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Petrol:</span>
                      <span className="font-bold text-white">₹96.72 /L</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Diesel:</span>
                      <span className="font-bold text-white">₹89.62 /L</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CNG:</span>
                      <span className="font-bold text-white">₹76.59 /kg</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>EV Fast Charge:</span>
                      <span className="font-bold text-emerald-400">₹9.50 /kWh</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MY TRIPS HISTORY VIEW (Responsive Multi-Column Grid)     */}
      {/* ============================================================== */}
      {activeTab === 'my-trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Saved Trip Itineraries ({savedTrips.length})
            </h2>
            <button
              onClick={() => setActiveTab('plan')}
              className="text-xs font-semibold text-[#10B981] hover:underline"
            >
              + Plan New Route
            </button>
          </div>

          {savedTrips.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-3 bg-[#131B2A] rounded-3xl border border-[#1E2B40] p-6">
              <History size={36} className="mx-auto text-slate-500 opacity-60" />
              <p>No trips saved yet.</p>
              <button
                onClick={() => setActiveTab('plan')}
                className="px-4 py-2 rounded-xl bg-[#10B981] text-white font-bold"
              >
                Plan Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTrips.map(trip => (
                <div
                  key={trip.id}
                  className="p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3 shadow-xl hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#162032] text-emerald-400 border border-emerald-500/30">
                        {trip.mode} • {trip.fuelType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {trip.distanceKm} km (~{trip.durationText})
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {trip.from} ➔ {trip.to}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {trip.passengers} riders • ₹{trip.perPersonCost} each
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2B40]/60 text-center text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Fuel</span>
                        <span className="font-bold text-slate-200">₹{trip.fuelCost}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Tolls</span>
                        <span className="font-bold text-slate-200">₹{trip.tolls}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 block text-[9px] font-bold">Total</span>
                        <span className="font-bold text-[#10B981]">₹{trip.totalCost}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => shareViaWhatsApp(trip)}
                    className="w-full py-2.5 rounded-xl bg-[#162032] hover:bg-[#1E2B40] border border-[#1E2B40] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
                  >
                    <Share2 size={14} className="text-[#10B981]" />
                    <span>Re-share on WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
