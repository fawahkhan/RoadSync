import { Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#E8FFE8] h-screen p-4 fixed left-0">
      <div className="flex items-center gap-2 mb-8">
        <Navigation2 className="text-blue-600" size={32} />
        <span className="text-xl font-bold text-blue-600">RoadSync</span>
      </div>
      
      <nav className="space-y-2">
        <SidebarLink to="/dashboard" icon="⌂" text="Dashboard" />
        <SidebarLink to="/routes" icon="🛣️" text="Routes" />
        <SidebarLink to="/smart-parking" icon="🅿️" text="Smart Parking" />
        <SidebarLink to="/utilities" icon="🔧" text="Utilities" />
        <SidebarLink to="/track-emissions" icon="🌱" text="Track CO2 Emissions" />
        <SidebarLink to="/report-crime" icon="⚠️" text="Report Emergencies/Crime" />
        <SidebarLink to="/profile" icon="👤" text="My Profile" />
        <SidebarLink to="/about" icon="ℹ️" text="About Us" />
      </nav>
    </div>
  );
}

function SidebarLink({ to, icon, text }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded-lg text-gray-700">
      <span>{icon}</span>
      <span>{text}</span>
    </Link>
  );
}