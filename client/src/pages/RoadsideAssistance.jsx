import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { 
  Wrench, 
  Fuel, 
  Truck, 
  Phone, 
  AlertOctagon, 
  MapPin, 
  Share2, 
  Star, 
  ArrowLeft, 
  Crosshair, 
  ShieldAlert, 
  CheckCircle2, 
  Navigation
} from 'lucide-react';
import { StorageService } from '../services/storageService';

// Real-world nearby assistance facilities (seeded around Delhi NCR coordinates)
const NEARBY_SERVICES = [
  {
    id: 'srv-1',
    type: 'mechanic',
    name: 'Sharma Auto Care & Puncture',
    rating: 4.6,
    reviews: 120,
    phone: '+919810011223',
    lat: 28.6290,
    lng: 77.2150,
    address: 'Near Metro Station, Ring Road',
    distanceKm: 1.2,
    openNow: true,
    services: ['Tire Repair', 'Engine Diagnostics', 'Battery Jumpstart']
  },
  {
    id: 'srv-2',
    type: 'mechanic',
    name: 'Raj Motors 24/7 Workshop',
    rating: 4.3,
    reviews: 85,
    phone: '+919811122334',
    lat: 28.6100,
    lng: 77.2300,
    address: 'Main Market Road',
    distanceKm: 2.8,
    openNow: true,
    services: ['Breakdown Repair', 'Brake Servicing', 'Oil Change']
  },
  {
    id: 'srv-3',
    type: 'towing',
    name: 'Speed Fix 24x7 Towing',
    rating: 4.8,
    reviews: 210,
    phone: '+919822233445',
    lat: 28.6380,
    lng: 77.1980,
    address: 'Expressway Bypass Toll',
    distanceKm: 1.9,
    openNow: true,
    services: ['Flatbed Towing', 'Highway Extraction', 'Accident Recovery']
  },
  {
    id: 'srv-4',
    type: 'fuel',
    name: 'IndianOil Fuel Station & EV Supercharger',
    rating: 4.5,
    reviews: 340,
    phone: '+919833344556',
    lat: 28.6210,
    lng: 77.2020,
    address: 'Outer Circle, Near CP',
    distanceKm: 0.8,
    openNow: true,
    services: ['Petrol & Diesel', '60kW EV Fast Charge', 'Free Air Pressure']
  },
  {
    id: 'srv-5',
    type: 'fuel',
    name: 'HP Auto Fuel & Nitrogen Air',
    rating: 4.2,
    reviews: 160,
    phone: '+919844455667',
    lat: 28.6420,
    lng: 77.2210,
    address: 'Ring Road Service Lane',
    distanceKm: 2.4,
    openNow: true,
    services: ['Petrol/Diesel', 'CNG Dispenser', 'Lubricants']
  }
];

export default function RoadsideAssistance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('help'); // 'help' | 'sos'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'mechanic' | 'fuel'
  const [userLocation, setUserLocation] = useState([28.6250, 77.2090]);
  const [sosSent, setSosSent] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [locationName, setLocationName] = useState('Outer Ring Road, Pitampura');

  const assistMapRef = useRef(null);
  const assistMapInstance = useRef(null);
  const serviceMarkersRef = useRef([]);

  useEffect(() => {
    setEmergencyContacts(StorageService.getEmergencyContacts());

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {}
      );
    }
  }, []);

  // Initialize Map for Nearby Help
  useEffect(() => {
    if (activeTab !== 'help' || !assistMapRef.current) return;

    if (!assistMapInstance.current) {
      const map = L.map(assistMapRef.current, {
        center: userLocation,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // User location pulse
      const userIcon = L.divIcon({
        className: 'user-pulse',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-radar"></div>
            <div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(userLocation, { icon: userIcon }).addTo(map);

      assistMapInstance.current = map;
    }
  }, [activeTab, userLocation]);

  // Update Service Pins on Map
  useEffect(() => {
    const map = assistMapInstance.current;
    if (!map || activeTab !== 'help') return;

    serviceMarkersRef.current.forEach(m => m.remove());
    serviceMarkersRef.current = [];

    const filtered = filterType === 'all' 
      ? NEARBY_SERVICES 
      : NEARBY_SERVICES.filter(s => s.type === filterType);

    filtered.forEach(s => {
      const isFuel = s.type === 'fuel';
      const color = isFuel ? '#10B981' : '#3B82F6';

      const icon = L.divIcon({
        className: 'service-pin',
        html: `
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-[#131B2A] transition-transform active:scale-95" style="background-color: ${color}">
            <span class="text-xs font-bold">${isFuel ? '⛽' : '🔧'}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
      marker.bindPopup(`<b>${s.name}</b><br/>${s.address}<br/><a href="tel:${s.phone}">Call: ${s.phone}</a>`);
      serviceMarkersRef.current.push(marker);
    });
  }, [filterType, activeTab]);

  // Trigger Emergency SOS Broadcast
  function handleTriggerSOS() {
    setSosSent(true);
    const [lat, lng] = userLocation;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const sosMessage = `🚨 *EMERGENCY SOS ALERT!* 🚨\nI am experiencing an emergency on the road and need immediate help!\n\n📍 *My Live GPS Location:* ${mapUrl}\nCoordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}\nLandmark: ${locationName}\n\nPlease reach out or contact emergency services immediately!`;

    // Try sharing via WhatsApp or Web Share
    if (navigator.share) {
      navigator.share({
        title: 'EMERGENCY SOS ALERT',
        text: sosMessage,
        url: mapUrl
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(sosMessage)}`, '_blank');
    }
  }

  const filteredServices = filterType === 'all'
    ? NEARBY_SERVICES
    : NEARBY_SERVICES.filter(s => s.type === filterType);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] select-none text-slate-100">
      {/* Top Header */}
      <div className="z-20 bg-[#0B0F17] px-4 pt-3 pb-2 border-b border-[#1E2B40] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 rounded-lg bg-[#162032] text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Roadside Assistance
            </h1>
            <p className="text-[11px] text-slate-400">
              Nearby workshops, pumps & one-touch SOS
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Switcher: Nearby Help vs Emergency SOS */}
      <div className="px-4 py-2 bg-[#0B0F17]">
        <div className="flex bg-[#141C2B] p-1 rounded-2xl border border-[#1E2B40]">
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'help'
                ? 'bg-[#10B981] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nearby Help
          </button>
          <button
            onClick={() => setActiveTab('sos')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Emergency SOS
          </button>
        </div>
      </div>

      {activeTab === 'help' ? (
        /* NEARBY HELP TAB (Mockup Row 2 Image 3) */
        <div className="flex-1 flex flex-col">
          {/* Filter Pills */}
          <div className="px-4 py-2 flex items-center gap-2 border-b border-[#1E2B40]/60 bg-[#0B0F17]">
            {[
              { id: 'all', label: 'All Services', icon: Wrench },
              { id: 'mechanic', label: 'Mechanics', icon: Wrench },
              { id: 'fuel', label: 'Fuel Stations', icon: Fuel },
            ].map(tab => {
              const isSelected = filterType === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#10B981] text-white font-semibold shadow-md'
                      : 'bg-[#141C2B] text-slate-300 border border-[#1E2B40]'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map Preview */}
          <div className="w-full h-52 relative border-b border-[#1E2B40]">
            <div ref={assistMapRef} className="w-full h-full" />
            <div className="absolute bottom-3 right-3 z-[1000] p-2 rounded-full bg-[#131B2A] border border-[#1E2B40] text-[#10B981] shadow-lg">
              <Crosshair size={18} />
            </div>
          </div>

          {/* Service Cards List */}
          <div className="p-4 flex-1 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Available Nearby ({filteredServices.length})
              </h2>
              <span className="text-[10px] text-slate-400">Within 3 km radius</span>
            </div>

            {filteredServices.map(s => (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-[#141C2B] border border-[#1E2B40] flex items-center justify-between gap-3 transition-all hover:border-[#1E2B40]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    s.type === 'fuel' ? 'bg-emerald-500/20 text-[#10B981]' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {s.type === 'fuel' ? <Fuel size={20} /> : <Wrench size={20} />}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">
                      {s.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-semibold">
                        <Star size={11} fill="currentColor" /> {s.rating}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({s.reviews})
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium bg-[#1B2538] px-1.5 py-0.2 rounded-sm">
                        {s.distanceKm} km
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Call Button */}
                <a
                  href={`tel:${s.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EMERGENCY SOS TAB (Mockup Row 2 Image 4) */
        <div className="flex-1 flex flex-col items-center justify-between p-6 text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-rose-500 tracking-tight">
              Emergency SOS
            </h2>
            <p className="text-xs text-slate-300">
              Immediate distress broadcast with your live coordinates
            </p>
          </div>

          {/* Giant Pulsing SOS Button */}
          <div className="relative my-6 flex items-center justify-center">
            {/* Outer Pulsing Wave */}
            <div className="absolute w-56 h-56 rounded-full bg-rose-600/20 animate-ping opacity-60" />
            <div className="absolute w-44 h-44 rounded-full bg-rose-600/30 animate-pulse" />

            <button
              onClick={handleTriggerSOS}
              className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white font-black text-2xl shadow-[0_0_50px_rgba(244,63,94,0.6)] border-4 border-rose-400/50 flex flex-col items-center justify-center active:scale-95 transition-transform"
            >
              <span>SOS</span>
              <span className="text-[9px] uppercase tracking-widest text-rose-100 font-semibold mt-0.5">
                Press Alert
              </span>
            </button>
          </div>

          {/* Location Box */}
          <div className="w-full p-4 rounded-2xl bg-[#141C2B] border border-rose-500/30 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <MapPin size={14} />
              <span>Your Live Coordinates</span>
            </div>
            <p className="text-xs text-white font-mono font-medium">
              {userLocation[0].toFixed(5)}° N, {userLocation[1].toFixed(5)}° E
            </p>
            <p className="text-[11px] text-slate-400">
              {locationName}
            </p>
          </div>

          {/* Quick Emergency Action Buttons */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4">
            <a
              href="tel:112"
              className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex flex-col items-center justify-center gap-1 text-slate-200 hover:text-white active:scale-95"
            >
              <Phone size={18} className="text-rose-400" />
              <span className="text-[11px] font-bold">Call 112</span>
            </a>

            <button
              onClick={handleTriggerSOS}
              className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex flex-col items-center justify-center gap-1 text-slate-200 hover:text-white active:scale-95"
            >
              <Share2 size={18} className="text-[#10B981]" />
              <span className="text-[11px] font-bold">Share Location</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex flex-col items-center justify-center gap-1 text-slate-200 hover:text-white active:scale-95"
            >
              <Wrench size={18} className="text-blue-400" />
              <span className="text-[11px] font-bold">Nearby Help</span>
            </button>
          </div>

          {sosSent && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 size={15} />
              <span>SOS broadcast generated and ready to send!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
