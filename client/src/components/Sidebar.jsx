import { Navigation2, LayoutDashboard, MapPin, Car, Wrench, Leaf, ShieldAlert, MessageSquare, User, Info, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

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
    <aside className="w-72 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 flex flex-col z-40 transition-all duration-300">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <Navigation2 className="text-primary" size={24} />
        </div>
        <span className="text-xl font-bold text-sidebar-foreground tracking-tight bg-clip-text">RoadSync</span>
      </div>

      <nav className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-8 scrollbar-hide">
        <NavGroup label="Overview" links={mainLinks} active={location.pathname} />
        <NavGroup label="Mobility Tools" links={toolLinks} active={location.pathname} />
        <NavGroup label="Settings" links={accountLinks} active={location.pathname} />
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all text-sm font-medium group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function NavGroup({ label, links, active }) {
  return (
    <div>
      <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50">{label}</p>
      <div className="space-y-1 relative">
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
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium z-10 ${
        isActive ? 'text-primary-foreground' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 bg-primary rounded-xl z-[-1] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={18} className={isActive ? "text-primary-foreground" : "text-sidebar-foreground/50"} />
      <span className="relative z-10">{text}</span>
    </Link>
  );
}