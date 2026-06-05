import { Navigation2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#E8FFE8] h-screen p-4 fixed left-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <Navigation2 className="text-blue-600" size={32} />
        <span className="text-xl font-bold text-blue-600">RoadSync</span>
      </div>
      
      <nav className="space-y-2">
        <SidebarLink to="/dashboard" icon="⌂" text="Dashboard" active={location.pathname} />
        <SidebarLink to="/routes" icon="🛣️" text="Routes" active={location.pathname} />
        <SidebarLink to="/smart-parking" icon="🅿️" text="Smart Parking" active={location.pathname} />
        <SidebarLink to="/utilities" icon="🔧" text="Utilities" active={location.pathname} />
        <SidebarLink to="/track-emissions" icon="🌱" text="Track CO₂ Emissions" active={location.pathname} />
        <SidebarLink to="/report-crime" icon="⚠️" text="Report Emergencies" active={location.pathname} />
        <SidebarLink to="/chat" icon="🤖" text="AI Assistant" active={location.pathname} />
        <SidebarLink to="/profile" icon="👤" text="My Profile" active={location.pathname} />
        <SidebarLink to="/about" icon="ℹ️" text="About Us" active={location.pathname} />
      </nav>
    </div>
  );
}

function SidebarLink({ to, icon, text, active }) {
  const isActive = active === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-blue-100'
      }`}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </Link>
  );
}