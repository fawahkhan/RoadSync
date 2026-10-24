import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function MobileShell({ children, hideNav = false, fullBleed = false }) {
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30">
      {/* Desktop / Tablet Top Navigation Header */}
      <Navbar />

      {/* Main Screen Content */}
      <main className={`flex-1 w-full flex flex-col ${
        fullBleed 
          ? 'w-full' 
          : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-6'
      } ${hideNav ? 'pb-4' : 'pb-20 md:pb-8'}`}>
        {children}
      </main>

      {/* Persistent Mobile Bottom Navigation (Only on screens < md) */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
