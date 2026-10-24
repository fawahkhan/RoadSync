import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  SlidersHorizontal, 
  ShieldAlert, 
  User, 
  Home, 
  Navigation,
  Radio
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(StorageService.getProfile());
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Hazard Radar', path: '/radar', icon: Map, badge: 'Live' },
    { label: 'Trip Splitter', path: '/trips', icon: SlidersHorizontal },
    { label: 'Roadside & SOS', path: '/sos', icon: ShieldAlert, alert: true },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#1E2B40]/70 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass size={20} className="text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white">
              Road<span className="text-[#10B981]">Sync</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#131B2A] text-emerald-400 border border-emerald-500/30">
              v2
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 bg-[#131B2A]/80 p-1.5 rounded-2xl border border-[#1E2B40]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#1A2438]'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {item.alert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live GPS Chip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131B2A] border border-[#1E2B40] text-slate-300 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-slate-300">GPS Active</span>
          </div>

          {/* Quick SOS Trigger */}
          <button
            onClick={() => navigate('/sos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95"
            title="Emergency Roadside SOS"
          >
            <ShieldAlert size={14} className="text-current" />
            <span>SOS</span>
          </button>

          {/* User Profile Avatar Link */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#131B2A] border border-[#1E2B40] hover:border-emerald-500/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#10B981]/50">
              <img
                src={profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
              {profile?.name?.split(' ')[0] || 'Driver'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
