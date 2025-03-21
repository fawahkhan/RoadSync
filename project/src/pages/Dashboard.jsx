import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const emissionData = [
  { year: 2020, value: 170.4 },
  { year: 2021, value: 142.8 },
  { year: 2022, value: 95.6 },
  { year: 2023, value: 68.2 },
  { year: 2024, value: 45.5 },
];

const leaderboardData = [
  { id: 1, name: "John", gems: 550, badges: 11 },
  { id: 2, name: "Jack", gems: 520, badges: 25 },
  { id: 3, name: "Joe", gems: 510, badges: 15 },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Emission Track</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <LineChart width={600} height={300} data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <div className="space-y-4">
          {leaderboardData.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.id}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-blue-500">💎 {user.gems} Gems</span>
                <span className="text-orange-500">🏆 {user.badges} Badges</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}