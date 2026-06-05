import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../lib/api';

function Profile() {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [vehicleInfo, setVehicleInfo] = useState(user?.vehicleInfo || {});
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile({ name, vehicleInfo });
      await refreshUser();
      setEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const achievements = user?.badges?.length > 0
    ? user.badges.map(b => ({
        icon: b.icon || '🌟',
        name: b.name,
        description: `Earned ${new Date(b.earnedAt).toLocaleDateString()}`,
      }))
    : [
        { icon: '🌟', name: 'No badges yet', description: 'Start using RoadSync to earn badges!' },
      ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(false); setName(user?.name || ''); }}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-400 flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold bg-white/20 rounded px-2 py-1 text-white placeholder-white/70"
              />
            ) : (
              <h2 className="text-2xl font-bold">{user?.name}</h2>
            )}
            <p className="opacity-90">{user?.email}</p>
            <p className="opacity-90">Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <span className="text-2xl mr-3">💎</span>
            <div>
              <p className="text-xl font-bold">{user?.gems || 0}</p>
              <p className="text-sm text-gray-600">Gems Earned</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <span className="text-2xl mr-3">🏆</span>
            <div>
              <p className="text-xl font-bold">{user?.badges?.length || 0}</p>
              <p className="text-sm text-gray-600">Badges Collected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <span className="text-2xl mr-4">{achievement.icon}</span>
              <div>
                <p className="font-semibold">{achievement.name}</p>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Info */}
      {editing && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Company</label>
              <input
                type="text"
                value={vehicleInfo.company || ''}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, company: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Toyota"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Model</label>
              <input
                type="text"
                value={vehicleInfo.model || ''}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Camry"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fuel Type</label>
              <select
                value={vehicleInfo.fuelType || ''}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, fuelType: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cylinders</label>
              <select
                value={vehicleInfo.cylinders || ''}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, cylinders: parseInt(e.target.value) || '' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {[
          { icon: '🌐', label: 'Language' },
          { icon: '📋', label: 'Check your report status' },
          { icon: '💭', label: 'Feedback' },
        ].map((item, index) => (
          <button
            key={index}
            className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-lg mt-8 hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;