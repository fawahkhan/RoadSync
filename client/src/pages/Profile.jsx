import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../lib/api';
import { Award } from 'lucide-react';

function Profile() {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [vehicleInfo, setVehicleInfo] = useState(user?.vehicleInfo || {});
  const [saving, setSaving] = useState(false);

  const inputCls = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none";

  const handleLogout = async () => { await signOut(); navigate('/'); };
  const handleSave = async () => {
    setSaving(true);
    try { await usersAPI.updateProfile({ name, vehicleInfo }); await refreshUser(); setEditing(false); }
    catch (error) { console.error('Profile update failed:', error); }
    finally { setSaving(false); }
  };

  const achievements = user?.badges?.length > 0
    ? user.badges.map(b => ({ icon: b.icon || '🌟', name: b.name, description: `Earned ${new Date(b.earnedAt).toLocaleDateString()}` }))
    : [{ icon: '🌟', name: 'No badges yet', description: 'Start using RoadSync to earn badges!' }];

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">Edit Profile</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => { setEditing(false); setName(user?.name || ''); }} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {editing ? (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} text-center mb-2`} />
          ) : (
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{user?.name}</h2>
          )}
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-1">Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xl font-bold text-gray-900">💎 {user?.gems || 0}</p>
              <p className="text-xs text-gray-500">Gems</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xl font-bold text-gray-900">🏆 {user?.badges?.length || 0}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {editing && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Company</label>
                  <input type="text" value={vehicleInfo.company || ''} onChange={(e) => setVehicleInfo({...vehicleInfo, company: e.target.value})} className={inputCls} placeholder="e.g. Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Model</label>
                  <input type="text" value={vehicleInfo.model || ''} onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})} className={inputCls} placeholder="e.g. Camry" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Fuel Type</label>
                  <select value={vehicleInfo.fuelType || ''} onChange={(e) => setVehicleInfo({...vehicleInfo, fuelType: e.target.value})} className={inputCls}>
                    <option value="">Select</option><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="cng">CNG</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Cylinders</label>
                  <select value={vehicleInfo.cylinders || ''} onChange={(e) => setVehicleInfo({...vehicleInfo, cylinders: parseInt(e.target.value) || ''})} className={inputCls}>
                    <option value="">Select</option><option value="3">3</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="12">12</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={18} className="text-teal-600" /> Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[{ icon: '🌐', label: 'Language' }, { icon: '📋', label: 'Report Status' }, { icon: '💭', label: 'Feedback' }].map((item, i) => (
              <button key={i} className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-sm border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="text-gray-900 font-medium">{item.label}</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;