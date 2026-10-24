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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F1726] border-t border-[#1E2B40] px-3 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive ? 'text-[#10B981]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === 'SOS' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${
                isActive ? 'text-[#10B981] font-semibold' : 'text-slate-400'
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
