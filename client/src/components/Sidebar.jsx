import { Navigation2, LayoutDashboard, MapPin, Car, Wrench, Leaf, ShieldAlert, MessageSquare, User, Info, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const mainLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/routes', icon: MapPin, text: 'Routes' },
  ];
  const toolLinks = [
    { to: '/smart-parking', icon: Car, text: 'Smart Parking' },
    { to: '/utilities', icon: Wrench, text: 'Utilities' },
    { to: '/track-emissions', icon: Leaf, text: 'Track CO₂' },
    { to: '/report-crime', icon: ShieldAlert, text: 'Report Incident' },
    { to: '/chat', icon: MessageSquare, text: 'AI Assistant' },
  ];
  const accountLinks = [
    { to: '/profile', icon: User, text: 'My Profile' },
    { to: '/about', icon: Info, text: 'About' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <Navigation2 className="text-teal-600" size={26} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">RoadSync</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-6">
        <NavGroup label="Main" links={mainLinks} active={location.pathname} />
        <NavGroup label="Tools" links={toolLinks} active={location.pathname} />
        <NavGroup label="Account" links={accountLinks} active={location.pathname} />
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function NavGroup({ label, links, active }) {
  return (
    <div>
      <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <div className="space-y-0.5">
        {links.map(link => <SidebarLink key={link.to} {...link} active={active} />)}
      </div>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, text, active }) {
  const isActive = active === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium relative ${
        isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-600 rounded-r-full" />}
      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      <span>{text}</span>
    </Link>
  );
}