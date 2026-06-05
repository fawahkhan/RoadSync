import { Bell, User } from 'lucide-react';

export default function Header({ username = "Sofia" }) {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-700">Hello {username}!</h1>
        <div className="flex items-center gap-2">
          <span className="text-blue-500">💎 550 Gems</span>
          <span className="text-orange-500">🏆 15 Badges</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />
        <User className="cursor-pointer" />
      </div>
    </div>
  );
}