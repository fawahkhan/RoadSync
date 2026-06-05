import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { emissionsAPI, usersAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Welcome */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {user?.name || 'User'} 👋
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Trips</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTrips}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total CO₂ Emitted</p>
          <p className="text-3xl font-bold text-orange-500">{(stats.totalCO2 / 1000).toFixed(1)} kg</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Your Gems</p>
          <p className="text-3xl font-bold text-purple-600">💎 {user?.gems || 0}</p>
        </div>
      </div>

      {/* Emission Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Emission Track</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}g CO₂`, 'Total Emissions']}
                />
                <Line
                  type="monotone"
                  dataKey="totalCO2"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-2">📊</p>
                <p>No emission data yet. Track your first trip!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <div className="space-y-4">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry) => (
              <div key={entry.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    entry.rank === 1 ? 'bg-yellow-400' :
                    entry.rank === 2 ? 'bg-gray-400' :
                    entry.rank === 3 ? 'bg-amber-600' : 'bg-blue-400'
                  }`}>
                    {entry.rank}
                  </div>
                  <span className="font-medium">{entry.name}</span>
                  {entry.id === user?.id && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-blue-500">💎 {entry.gems} Gems</span>
                  <span className="text-orange-500">🏆 {entry.badgeCount} Badges</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-400">
              <p className="text-4xl mb-2">🏆</p>
              <p>No leaderboard data yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}