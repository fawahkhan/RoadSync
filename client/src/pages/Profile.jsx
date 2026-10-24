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
  Compass,
  Award,
  ShieldCheck,
  HeartHandshake,
  ArrowLeft
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
    <div className="flex flex-col select-none text-slate-100 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 rounded-lg bg-[#162032] text-slate-300 hover:text-white active:scale-95 transition-all md:hidden"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Driver Profile & Emergency Settings
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Manage your community reputation and SOS emergency broadcast list
            </p>
          </div>
        </div>

        <button className="p-2 rounded-xl bg-[#141C2B] border border-[#1E2B40] text-slate-400 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>

      {/* 2-Column Responsive Layout on Desktop/Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (lg:col-span-5): Profile Card & Metrics */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* User Hero Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#10B981] shadow-lg shrink-0">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {profile.name}
                  </h2>
                  <CheckCircle2 size={16} className="text-[#10B981]" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{profile.tagline}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Verified Road Leader
                </span>
              </div>
            </div>

            {/* 3 Metric Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#1E2B40]/70 text-center">
              <div className="p-3 rounded-2xl bg-[#162032]">
                <span className="text-lg font-black text-white block">{profile.tripsCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Trips Planned</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#162032]">
                <span className="text-lg font-black text-[#10B981] block">{profile.reportsCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Road Reports</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#162032]">
                <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                  <Star size={14} fill="currentColor" /> {profile.communityScore}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Trust Score</span>
              </div>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div className="p-3 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-1 shadow-xl">
            {[
              { label: 'My Saved Trips & Splits', desc: 'View past calculated routes', path: '/trips' },
              { label: 'Live Hazard Radar Map', desc: 'Active community road reports', path: '/radar' },
              { label: 'Roadside Assistance Hub', desc: 'Nearby mechanics & emergency SOS', path: '/sos' },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="p-3.5 rounded-2xl hover:bg-[#182337] cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>

          {/* Community Badges */}
          <div className="p-5 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              <span>Community Achievements</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px]">Road Scout</span>
                  <span className="text-[9px] text-slate-400">10+ Reports verified</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex items-center gap-2.5">
                <HeartHandshake size={20} className="text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px]">Fair Splitter</span>
                  <span className="text-[9px] text-slate-400">Zero disputes</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (lg:col-span-7): Emergency Contacts Hub */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 sm:p-6 rounded-3xl bg-[#131B2A] border border-[#1E2B40] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2B40]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Emergency SOS Contacts ({contacts.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Contacts alerted when you press the Emergency SOS button
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowContactModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                <Plus size={14} />
                <span>Add Contact</span>
              </button>
            </div>

            {/* Contacts List */}
            <div className="space-y-3">
              {contacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                  <ShieldAlert size={32} className="mx-auto text-slate-500 opacity-60" />
                  <p>No emergency contacts registered yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Add family members or close friends so they can receive your live GPS coordinates during an emergency.
                  </p>
                </div>
              ) : (
                contacts.map(c => (
                  <div
                    key={c.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#162032] border border-[#1E2B40] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1B2538] flex items-center justify-center text-white font-bold text-sm">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{c.name}</span>
                          <span className="px-2 py-0.2 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {c.relationship}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono mt-0.5 block">{c.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-2 rounded-xl bg-[#1E2B40] hover:bg-emerald-600 text-slate-200 hover:text-white transition-colors"
                        title="Call Contact"
                      >
                        <Phone size={15} />
                      </a>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove Contact"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Information Tip */}
            <div className="p-3 rounded-2xl bg-[#162032]/60 border border-[#1E2B40]/60 text-[11px] text-slate-400 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <span>
                RoadSync encodes these contacts directly into your device's offline state store, ensuring distress dispatches fire without server delays.
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#111827] rounded-3xl border border-[#1E2B40] p-6 space-y-4 animate-in fade-in-50 zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Add Emergency Contact</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Papa, Sister, Rohit"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number (with country code)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Relationship</label>
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#10B981]"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Doctor">Doctor / Caretaker</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-all mt-2"
              >
                Save Emergency Contact
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}