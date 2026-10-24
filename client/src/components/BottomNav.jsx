import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, SlidersHorizontal, ShieldAlert, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Map', path: '/radar', icon: Map },
    { label: 'Trips', path: '/trips', icon: SlidersHorizontal },
    { label: 'SOS', path: '/sos', icon: ShieldAlert },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-[#1E2B40] px-2 py-1.5 safe-bottom shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive ? 'text-[#10B981]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === 'SOS' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
                {item.label === 'Map' && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium tracking-tight ${
                isActive ? 'text-[#10B981] font-bold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
