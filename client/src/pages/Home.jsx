import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Car, 
  Wrench, 
  Search, 
  Bell, 
  ChevronRight, 
  MapPin, 
  ShieldAlert, 
  Users,
  Compass,
  CheckCircle2,
  Navigation,
  Fuel,
  Phone,
  Flame,
  ArrowRight,
  TrendingUp,
  Radio
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [recentHazards, setRecentHazards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProfile(StorageService.getProfile());
    const list = StorageService.getHazards();
    setRecentHazards(list.slice(0, 4));
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/trips');
    }
  }

  const QUICK_DESTINATIONS = [
    'IGI Airport, Delhi',
    'Cyber Hub, Gurugram',
    'Noida Sector 62',
    'Chandigarh Highway'
  ];

  return (
    <div className="flex flex-col select-none text-slate-100 space-y-6 md:space-y-8">
      {/* Mobile-Only Top Header (Hidden on Desktop because desktop Navbar exists) */}
      <div className="flex md:hidden items-center justify-between pt-2 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Road<span className="text-[#10B981]">Sync</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-[#131B2A] text-emerald-400 border border-emerald-500/30">
            v2
          </span>
        </div>

        <button 
          onClick={() => navigate('/radar')}
          className="relative p-2 rounded-xl bg-[#141C2B] border border-[#1E2B40] text-slate-300 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#111A29] via-[#0E1522] to-[#0B0F17] border border-[#1E2B40] p-5 sm:p-8 overflow-hidden shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Highway Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Safer roads, smarter routes, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                and fair cost sharing.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Navigate community-reported road hazards, calculate turn-by-turn carpool fuel and toll expenses, and access one-tap emergency roadside assistance.
            </p>
          </div>

          {/* Quick Route Search Bar */}
          <div className="w-full md:w-80 lg:w-96 shrink-0 space-y-2.5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where are you driving today?"
                className="w-full bg-[#141C2B]/90 backdrop-blur-md border border-[#1E2B40] hover:border-emerald-500/50 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] shadow-lg transition-colors cursor-pointer"
                onClick={() => navigate('/trips')}
              />
            </form>

            {/* Quick Destination Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Popular:</span>
              {QUICK_DESTINATIONS.map((dest, i) => (
                <button
                  key={i}
                  onClick={() => navigate('/trips')}
                  className="px-2 py-0.5 rounded-lg bg-[#141C2B] hover:bg-[#1C263A] border border-[#1E2B40] text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  {dest.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Community Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#1E2B40]/70">
          <div className="p-3 rounded-2xl bg-[#141C2B]/60 border border-[#1E2B40]/60">
            <span className="text-xs text-slate-400 block font-medium">Active Drivers</span>
            <span className="text-lg sm:text-xl font-black text-white">1,420+</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#141C2B]/60 border border-[#1E2B40]/60">
            <span className="text-xs text-slate-400 block font-medium">Road Hazards</span>
            <span className="text-lg sm:text-xl font-black text-rose-400">18 Active</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#141C2B]/60 border border-[#1E2B40]/60">
            <span className="text-xs text-slate-400 block font-medium">Trips Calculated</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">₹4.2L Split</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#141C2B]/60 border border-[#1E2B40]/60">
            <span className="text-xs text-slate-400 block font-medium">Assistance Hubs</span>
            <span className="text-lg sm:text-xl font-black text-blue-400">24x7 Ready</span>
          </div>
        </div>
      </div>

      {/* 3 Core Feature Cards Grid (Responsive 1-col on mobile, 3-col on tablet/desktop) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Core Utility Suite</span>
          </h2>
          <span className="text-xs text-slate-400">Select a tool to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Card 1: Live Hazard Radar */}
          <div
            onClick={() => navigate('/radar')}
            className="group relative p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] hover:border-rose-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Live Radar
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                  Live Hazard Radar
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  View crowd-sourced potholes, accidents, barricades and waterlogging on a high-contrast dark map.
                </p>
              </div>

              {/* Bullet points */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E2B40]/60 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Pulsing GPS radar beacon</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Community upvote consensus</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1E2B40]/70 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:text-white">
              <span>Open Radar Map</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Trip & Cost Splitter */}
          <div
            onClick={() => navigate('/trips')}
            className="group relative p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] hover:border-emerald-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  OSRM Routing
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Trip & Fair Cost Splitter
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Turn-by-turn road polyline routing, fuel consumption & toll cost estimation with WhatsApp shareable receipt.
                </p>
              </div>

              {/* Bullet points */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E2B40]/60 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Accurate highway mileage modeling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>1-Click WhatsApp debt breakdown</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1E2B40]/70 flex items-center justify-between text-xs font-semibold text-[#10B981] group-hover:text-white">
              <span>Calculate Trip Cost</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Roadside Assistance */}
          <div
            onClick={() => navigate('/sos')}
            className="group relative p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] hover:border-blue-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Wrench size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  SOS Ready
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  Roadside Assistance & SOS
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Instant directory of nearby mechanics, 24x7 towing trucks, and one-tap emergency distress broadcast with live GPS.
                </p>
              </div>

              {/* Bullet points */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E2B40]/60 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Direct click-to-call mechanics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>One-click Google Maps pin dispatch</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1E2B40]/70 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-white">
              <span>View Emergency Help</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split Dashboard: Live Road Alerts & Emergency Quick Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Road Alerts Feed */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Live Community Road Alerts</span>
            </h2>
            <button 
              onClick={() => navigate('/radar')}
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              <span>Explore Interactive Map</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentHazards.map(h => (
              <div
                key={h.id}
                onClick={() => navigate('/radar')}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#131B2A] border border-[#1E2B40] hover:border-emerald-500/40 cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/25 shrink-0">
                    {h.category}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {h.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-slate-500 shrink-0" />
                      <span>{h.locationName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-md bg-[#1B2538]">
                    {h.upvotes} upvotes
                  </span>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Emergency Speed Dial & Helpline Hub */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={15} className="text-rose-500" />
              <span>Emergency Speed Dial</span>
            </h2>
            <button 
              onClick={() => navigate('/sos')}
              className="text-xs font-semibold text-rose-400 hover:underline"
            >
              Open SOS →
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-4 shadow-xl">
            <p className="text-xs text-slate-400">
              Direct emergency helplines accessible 24 hours a day across Indian national and state highways:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
              {/* Helpline 1: 112 */}
              <a
                href="tel:112"
                className="p-3 rounded-2xl bg-[#182236] border border-[#22334F] hover:border-rose-500/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    112
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">National Emergency</span>
                    <span className="text-[10px] text-slate-400">Police, Fire & Ambulance</span>
                  </div>
                </div>
                <Phone size={15} className="text-rose-400 group-hover:scale-110 transition-transform mr-1" />
              </a>

              {/* Helpline 2: 1033 */}
              <a
                href="tel:1033"
                className="p-3 rounded-2xl bg-[#182236] border border-[#22334F] hover:border-amber-500/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    1033
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">NHAI Highway Helpline</span>
                    <span className="text-[10px] text-slate-400">Towing & Highway Crane</span>
                  </div>
                </div>
                <Phone size={15} className="text-amber-400 group-hover:scale-110 transition-transform mr-1" />
              </a>

              {/* Helpline 3: 1073 */}
              <a
                href="tel:1073"
                className="p-3 rounded-2xl bg-[#182236] border border-[#22334F] hover:border-blue-500/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    1073
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Road Accident Helpline</span>
                    <span className="text-[10px] text-slate-400">Rapid Medical Extraction</span>
                  </div>
                </div>
                <Phone size={15} className="text-blue-400 group-hover:scale-110 transition-transform mr-1" />
              </a>
            </div>

            <button
              onClick={() => navigate('/sos')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldAlert size={16} />
              <span>Broadcast Live GPS SOS Distress</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
