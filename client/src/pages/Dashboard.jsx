import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { emissionsAPI, usersAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Zap, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalCO2: 0, avgCO2PerTrip: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [emissionRes, leaderboardRes] = await Promise.all([
          emissionsAPI.getSummary(),
          usersAPI.getLeaderboard(),
        ]);
        setChartData(emissionRes.data.monthly || []);
        setStats(emissionRes.data.stats || { totalTrips: 0, totalCO2: 0, avgCO2PerTrip: 0 });
        setLeaderboard(leaderboardRes.data.leaderboard || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Trips', value: stats.totalTrips, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total CO₂ Emitted', value: `${(stats.totalCO2 / 1000).toFixed(1)} kg`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Your Gems', value: `💎 ${user?.gems || 0}`, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${s.bg}`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emission History</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }} formatter={(value) => [`${value}g CO₂`, 'Emissions']} />
              <Line type="monotone" dataKey="totalCO2" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm">No emission data yet. Track your first trip!</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h2>
        <div className="space-y-1">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                    entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                  }`}>{entry.rank}</span>
                  <span className="font-medium text-gray-900">{entry.name}</span>
                  {entry.id === user?.id && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>💎 {entry.gems}</span>
                  <span>🏆 {entry.badgeCount}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-400">
              <p className="text-3xl mb-2">🏆</p>
              <p className="text-sm">No leaderboard data yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}