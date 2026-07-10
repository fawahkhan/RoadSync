import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-64 pl-10 pr-4 py-2 bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-full text-sm outline-none transition-all focus:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </Button>

        <div className="h-8 w-px bg-border mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.name || 'Urban Citizen'}</p>
            <p className="text-xs text-muted-foreground mt-1">Level 4 Explorer</p>
          </div>
          <Avatar className="h-10 w-10 border border-border shadow-sm ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'default'}`} />
            <AvatarFallback>UX</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}