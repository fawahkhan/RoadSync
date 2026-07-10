import { Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full font-medium">
            💎 {user?.gems || 0}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full font-medium">
            🏆 {user?.badges?.length || 0}
          </span>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={18} />
        </button>

        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}