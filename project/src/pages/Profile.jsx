function Profile() {
    const userProfile = {
      name: 'Sofia',
      id: '785698XXXX',
      joinDate: 'Mar 2025',
      gems: 550,
      badges: 15,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    };
  
    const achievements = [
      { icon: '🌟', name: 'Early Adopter', description: 'Joined during beta' },
      { icon: '🚗', name: 'Road Master', description: '100 trips completed' },
      { icon: '♻️', name: 'Eco Warrior', description: 'Saved 50kg CO2' }
    ];
  
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">🔔</button>
            <button className="p-2 hover:bg-gray-100 rounded-full">⚙️</button>
          </div>
        </div>
  
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div>
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="opacity-90">ID: {userProfile.id}</p>
                <p className="opacity-90">Joined {userProfile.joinDate}</p>
              </div>
            </div>
            <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              ✏️
            </button>
          </div>
        </div>
  
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <span className="text-2xl mr-3">💎</span>
              <div>
                <p className="text-xl font-bold">{userProfile.gems}</p>
                <p className="text-sm text-gray-600">Gems Earned</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <span className="text-2xl mr-3">🏆</span>
              <div>
                <p className="text-xl font-bold">{userProfile.badges}</p>
                <p className="text-sm text-gray-600">Badges Collected</p>
              </div>
            </div>
          </div>
        </div>
  
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
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
  
        <div className="space-y-3">
          {[
            { icon: '🔒', label: 'Privacy Policy' },
            { icon: '🌐', label: 'Language' },
            { icon: '📋', label: 'Check your report status' },
            { icon: '💭', label: 'Feedback' }
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
  
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg mt-8 hover:bg-blue-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    );
  }
  
  export default Profile;