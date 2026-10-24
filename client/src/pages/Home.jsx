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
  CheckCircle2
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
    setRecentHazards(list.slice(0, 3));
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/trips');
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] select-none text-slate-100 p-4 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Road<span className="text-[#10B981]">Sync</span>
          </span>
        </div>

        <button 
          onClick={() => navigate('/radar')}
          className="relative p-2 rounded-xl bg-[#141C2B] border border-[#1E2B40] text-slate-300 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
        </button>
      </div>

      {/* Hero Greeting */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">
          Hello, Fellow Driver
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
          Let's make every journey safer and smarter.
        </h1>
        <p className="text-xs text-slate-400">
          Real-time road hazards, route costs and quick roadside help.
        </p>
      </div>

      {/* Quick Destination Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Where are you heading?"
          className="w-full bg-[#141C2B] border border-[#1E2B40] hover:border-[#10B981]/50 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] shadow-lg transition-colors cursor-pointer"
          onClick={() => navigate('/trips')}
        />
      </form>

      {/* 3 Core Feature Cards (Exact Mockup Match) */}
      <div className="space-y-3">
        {/* Card 1: Live Hazard Radar */}
        <div
          onClick={() => navigate('/radar')}
          className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] hover:border-rose-500/50 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                Live Hazard Radar
              </h2>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                See real-time road hazards reported by the community
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />
        </div>

        {/* Card 2: Trip & Cost Splitter */}
        <div
          onClick={() => navigate('/trips')}
          className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] hover:border-emerald-500/50 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Trip & Cost Splitter
              </h2>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Plan your trip, calculate costs and split fairly
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />
        </div>

        {/* Card 3: Roadside Assistance */}
        <div
          onClick={() => navigate('/sos')}
          className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] hover:border-blue-500/50 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Roadside Assistance
              </h2>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Find nearby help & share your live location
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors shrink-0" />
        </div>
      </div>

      {/* Live Recent Alerts Strip */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Active Road Alerts</span>
          </h2>
          <button 
            onClick={() => navigate('/radar')}
            className="text-[11px] font-semibold text-[#10B981] hover:underline"
          >
            Open Map →
          </button>
        </div>

        <div className="space-y-2">
          {recentHazards.map(h => (
            <div
              key={h.id}
              onClick={() => navigate('/radar')}
              className="p-3 rounded-xl bg-[#141C2B] border border-[#1E2B40] hover:border-slate-600 cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  {h.category}
                </span>
                <span className="text-slate-200 font-medium line-clamp-1">
                  {h.locationName}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                {h.upvotes} upvotes
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
