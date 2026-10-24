import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Car, 
  ShieldAlert, 
  Star, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Phone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X,
  Compass
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'Family' });

  useEffect(() => {
    setProfile(StorageService.getProfile());
    setContacts(StorageService.getEmergencyContacts());
  }, []);

  function handleAddContact(e) {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const updated = StorageService.addEmergencyContact(newContact);
    setContacts([...updated]);
    setNewContact({ name: '', phone: '', relationship: 'Family' });
    setShowContactModal(false);
  }

  function handleDeleteContact(id) {
    const updated = StorageService.deleteEmergencyContact(id);
    setContacts([...updated]);
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] select-none text-slate-100 p-4 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Road<span className="text-[#10B981]">Sync</span>
          </span>
        </div>

        <button className="p-2 rounded-xl bg-[#141C2B] border border-[#1E2B40] text-slate-400 hover:text-white">
          <Settings size={18} />
        </button>
      </div>

      {/* User Hero Card */}
      <div className="p-5 rounded-3xl bg-[#141C2B] border border-[#1E2B40] space-y-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#10B981] shadow-lg">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{profile.name}</span>
              <CheckCircle2 size={15} className="text-[#10B981]" />
            </h2>
            <p className="text-xs text-slate-400">{profile.tagline}</p>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1E2B40]/70 text-center">
          <div className="p-2 rounded-xl bg-[#162032]">
            <span className="text-base font-black text-white block">{profile.tripsCount}</span>
            <span className="text-[10px] text-slate-400">Trips Planned</span>
          </div>

          <div className="p-2 rounded-xl bg-[#162032]">
            <span className="text-base font-black text-[#10B981] block">{profile.reportsCount}</span>
            <span className="text-[10px] text-slate-400">Road Reports</span>
          </div>

          <div className="p-2 rounded-xl bg-[#162032]">
            <span className="text-base font-black text-amber-400 flex items-center justify-center gap-1">
              <Star size={13} fill="currentColor" /> {profile.communityScore}
            </span>
            <span className="text-[10px] text-slate-400">Score</span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section (Crucial for SOS) */}
      <div className="p-4 rounded-2xl bg-[#141C2B] border border-[#1E2B40] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency SOS Contacts
            </h3>
          </div>
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#10B981] hover:underline"
          >
            <Plus size={13} />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="space-y-2">
          {contacts.map(c => (
            <div
              key={c.id}
              className="p-2.5 rounded-xl bg-[#162032] border border-[#1E2B40] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-white block">{c.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
              </div>
              <button
                onClick={() => handleDeleteContact(c.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Navigation Items */}
      <div className="p-2 rounded-2xl bg-[#141C2B] border border-[#1E2B40] space-y-1">
        {[
          { label: 'My Saved Trips', desc: 'View past calculated routes', path: '/trips' },
          { label: 'Live Hazard Radar', desc: 'Active community reports map', path: '/radar' },
          { label: 'Roadside Assistance', desc: 'Nearby mechanics & SOS button', path: '/sos' },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            className="p-3 rounded-xl hover:bg-[#162032] cursor-pointer transition-colors flex items-center justify-between"
          >
            <div>
              <h4 className="text-xs font-semibold text-white">{item.label}</h4>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111827] rounded-3xl border border-[#1E2B40] p-5 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Add Emergency Contact</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mom, Brother, Partner"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Phone Number (with country code)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold active:scale-95 transition-all"
              >
                Save Contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}