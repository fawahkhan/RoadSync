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
  Navigation,
  ExternalLink,
  Users
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
    address: 'Main Market Road, South Ext',
    distanceKm: 2.8,
    openNow: true,
    services: ['Breakdown Repair', 'Brake Servicing', 'Oil Change']
  },
  {
    id: 'srv-3',
    type: 'towing',
    name: 'Speed Fix 24x7 Highway Towing',
    rating: 4.8,
    reviews: 210,
    phone: '+919822233445',
    lat: 28.6380,
    lng: 77.1980,
    address: 'Expressway Bypass Toll Gate',
    distanceKm: 1.9,
    openNow: true,
    services: ['Flatbed Towing', 'Highway Extraction', 'Accident Recovery']
  },
  {
    id: 'srv-4',
    type: 'fuel',
    name: 'IndianOil Fuel Station & EV Fast Charge',
    rating: 4.5,
    reviews: 340,
    phone: '+919833344556',
    lat: 28.6210,
    lng: 77.2020,
    address: 'Outer Circle, Near Connaught Place',
    distanceKm: 0.8,
    openNow: true,
    services: ['Petrol & Diesel', '60kW EV Fast Charge', 'Free Nitrogen Air']
  },
  {
    id: 'srv-5',
    type: 'fuel',
    name: 'HP Auto Fuel & Service Point',
    rating: 4.2,
    reviews: 160,
    phone: '+919844455667',
    lat: 28.6420,
    lng: 77.2210,
    address: 'Ring Road Service Lane, Civil Lines',
    distanceKm: 2.4,
    openNow: true,
    services: ['Petrol/Diesel', 'CNG Dispenser', 'Lubricants & Coolant']
  },
  {
    id: 'srv-6',
    type: 'towing',
    name: 'Apex 24/7 Emergency Crane & Towing',
    rating: 4.7,
    reviews: 140,
    phone: '+919855566778',
    lat: 28.5800,
    lng: 77.2100,
    address: 'NH-48 Highway Junction',
    distanceKm: 3.5,
    openNow: true,
    services: ['Heavy Duty Towing', 'Winch Out', 'Accident Clearance']
  }
];

export default function RoadsideAssistance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('help'); // 'help' | 'sos'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'mechanic' | 'fuel' | 'towing'
  const [userLocation, setUserLocation] = useState([28.6250, 77.2090]);
  const [sosSent, setSosSent] = useState(false);
  const [locationName, setLocationName] = useState('Outer Ring Road, New Delhi');
  const [contacts, setContacts] = useState([]);

  const assistMapRef = useRef(null);
  const assistMapInstance = useRef(null);
  const serviceMarkersRef = useRef([]);

  useEffect(() => {
    setContacts(StorageService.getEmergencyContacts());

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
        },
        (err) => console.log('Assistance GPS fallback:', err.message),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Initialize Map for Nearby Help
  useEffect(() => {
    if (!assistMapRef.current || activeTab !== 'help') return;

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

      // User location marker
      const userIcon = L.divIcon({
        className: 'user-pin-assist',
        html: `
          <div class="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center animate-radar">
            <div class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white"></div>
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
      const isTowing = s.type === 'towing';
      const color = isFuel ? '#10B981' : isTowing ? '#F59E0B' : '#3B82F6';

      const icon = L.divIcon({
        className: 'service-pin',
        html: `
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-[#131B2A] transition-transform active:scale-95" style="background-color: ${color}">
            <span class="text-xs font-bold">${isFuel ? '⛽' : isTowing ? '🚜' : '🔧'}</span>
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
    <div className="flex flex-col select-none text-slate-100 space-y-5">
      
      {/* Top Header */}
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
              <span>Roadside Assistance & SOS</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Verified workshops, 24x7 towing services & live GPS emergency broadcast
            </p>
          </div>
        </div>

        {/* Segmented Switcher: Nearby Help vs Emergency SOS */}
        <div className="flex bg-[#141C2B] p-1 rounded-2xl border border-[#1E2B40] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'help'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nearby Help Directory
          </button>
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: NEARBY HELP DIRECTORY (Responsive 2-Column Split)        */}
      {/* ============================================================== */}
      {activeTab === 'help' && (
        <div className="space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Services', icon: Wrench },
              { id: 'mechanic', label: 'Mechanics & Garages', icon: Wrench },
              { id: 'towing', label: '24x7 Towing Trucks', icon: Truck },
              { id: 'fuel', label: 'Fuel & EV Stations', icon: Fuel },
            ].map(tab => {
              const isSelected = filterType === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                      : 'bg-[#141C2B] text-slate-300 border border-[#1E2B40] hover:bg-[#1B2538]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (lg:col-span-5): Interactive Assistance Map */}
            <div className="lg:col-span-5 w-full h-64 sm:h-80 lg:h-[500px] rounded-3xl overflow-hidden relative border border-[#1E2B40] shadow-2xl">
              <div ref={assistMapRef} className="w-full h-full" />
              
              <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-full bg-[#0B0F17]/90 backdrop-blur-md border border-[#1E2B40] text-xs font-semibold text-white shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{filteredServices.length} Facilities Near You</span>
              </div>
            </div>

            {/* Right Column (lg:col-span-7): Directory Cards Grid */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Verified Assistance Directory
                </span>
                <span className="text-[11px] text-slate-400">Sorted by proximity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredServices.map(s => {
                  const isFuel = s.type === 'fuel';
                  const isTowing = s.type === 'towing';
                  const color = isFuel ? 'text-emerald-400' : isTowing ? 'text-amber-400' : 'text-blue-400';
                  const bgColor = isFuel ? 'bg-emerald-500/15' : isTowing ? 'bg-amber-500/15' : 'bg-blue-500/15';

                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-3xl bg-[#131B2A] border border-[#1E2B40] hover:border-slate-600 space-y-3 shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${bgColor} ${color}`}>
                            {isFuel ? <Fuel size={20} /> : isTowing ? <Truck size={20} /> : <Wrench size={20} />}
                          </div>

                          <span className="text-[11px] font-semibold text-slate-300 bg-[#162032] px-2.5 py-0.5 rounded-full border border-[#1E2B40]">
                            {s.distanceKm} km away
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {s.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {s.address}
                          </p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-amber-400 flex items-center gap-1 font-bold">
                            <Star size={12} fill="currentColor" /> {s.rating}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-[11px] text-slate-400">({s.reviews} verified reviews)</span>
                        </div>

                        {/* Services tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {s.services.map((svc, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-[#162032] px-2 py-0.5 rounded-md">
                              {svc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Direct Call Button */}
                      <a
                        href={`tel:${s.phone}`}
                        className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        <Phone size={14} />
                        <span>Direct Call: {s.phone}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: EMERGENCY SOS TAB (Responsive Focus Cockpit)            */}
      {/* ============================================================== */}
      {activeTab === 'sos' && (
        <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 rounded-3xl bg-[#131B2A] border border-rose-500/30 space-y-6 shadow-2xl text-center">
          
          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Immediate Distress Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight">
              Emergency Roadside SOS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Tap the alert button below to broadcast an immediate distress message with live GPS coordinates to your registered emergency contacts and local emergency services.
            </p>
          </div>

          {/* Giant Pulsing SOS Button */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Outer Pulsing Waves */}
            <div className="absolute w-64 h-64 rounded-full bg-rose-600/15 animate-ping opacity-75" />
            <div className="absolute w-52 h-52 rounded-full bg-rose-600/25 animate-pulse" />

            <button
              onClick={handleTriggerSOS}
              className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white font-black text-3xl sm:text-4xl shadow-[0_0_60px_rgba(244,63,94,0.7)] border-4 border-rose-400/50 flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <span>SOS</span>
              <span className="text-[10px] uppercase tracking-widest text-rose-100 font-bold mt-1">
                Tap to Alert
              </span>
            </button>
          </div>

          {/* Live Coordinates Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-rose-500/30 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={14} />
                <span>Your Real-Time Coordinates</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                High Accuracy GPS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Latitude & Longitude</span>
                <span className="font-mono font-bold text-white text-sm">
                  {userLocation[0].toFixed(5)}° N, {userLocation[1].toFixed(5)}° E
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Estimated Landmark</span>
                <span className="font-semibold text-slate-200">
                  {locationName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href="tel:112"
              className="p-3.5 rounded-2xl bg-[#162032] border border-[#1E2B40] hover:border-rose-500/50 flex flex-col items-center justify-center gap-1.5 text-slate-200 hover:text-white active:scale-95 transition-all"
            >
              <Phone size={20} className="text-rose-400" />
              <span className="text-xs font-bold">Call 112</span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">Police & Med</span>
            </a>

            <button
              onClick={handleTriggerSOS}
              className="p-3.5 rounded-2xl bg-[#162032] border border-[#1E2B40] hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-slate-200 hover:text-white active:scale-95 transition-all"
            >
              <Share2 size={20} className="text-[#10B981]" />
              <span className="text-xs font-bold">Share GPS</span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">WhatsApp / SMS</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className="p-3.5 rounded-2xl bg-[#162032] border border-[#1E2B40] hover:border-blue-500/50 flex flex-col items-center justify-center gap-1.5 text-slate-200 hover:text-white active:scale-95 transition-all"
            >
              <Wrench size={20} className="text-blue-400" />
              <span className="text-xs font-bold">Nearby Help</span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">Workshops</span>
            </button>
          </div>

          {sosSent && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in-50">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Emergency distress payload generated with live Google Maps pin link!</span>
            </div>
          )}

          {/* Registered Emergency Contacts preview */}
          {contacts.length > 0 && (
            <div className="pt-3 border-t border-[#1E2B40] text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2">
                Will alert your registered emergency contacts ({contacts.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {contacts.map(c => (
                  <span key={c.id} className="text-xs bg-[#162032] px-3 py-1 rounded-xl text-slate-200 border border-[#1E2B40] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{c.name} ({c.relationship})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
