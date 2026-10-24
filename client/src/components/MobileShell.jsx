import BottomNav from './BottomNav';

export default function MobileShell({ children, hideNav = false }) {
  return (
    <div className="min-h-screen bg-[#050811] flex justify-center text-slate-100 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#0B0F17] min-h-screen flex flex-col relative shadow-2xl border-x border-[#1E2B40]/50">
        {/* Main Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-20">
          {children}
        </div>

        {/* Persistent Mobile Bottom Navigation */}
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
