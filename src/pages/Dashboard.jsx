import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, LogIn, Clock, TrendingUp, ShieldCheck, Search, Plus, X, Loader2, LogOut, ChevronRight } from 'lucide-react';

const statusMap = {
  PENDING:  { label: 'Pending',  bg: 'bg-amber-100', text: 'text-amber-700' },
  APPROVED: { label: 'Approved', bg: 'bg-[#3B82F6]/10',  text: 'text-[#3B82F6]' },
  ENTERED:  { label: 'In',       bg: 'bg-emerald-100', text: 'text-emerald-700' },
  EXITED:   { label: 'Exited',   bg: 'bg-slate-100', text: 'text-slate-600' },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-100',  text: 'text-rose-700' },
};

const recentActivities = [
  { action: 'Guest entry approved', sub: 'Rajesh Kumar · 10:30 AM', color: 'bg-emerald-500' },
  { action: 'Delivery received',    sub: 'Amazon Package · 09:45 AM', color: 'bg-[#3B82F6]' },
  { action: 'Shift started',        sub: 'Morning Duty · 08:00 AM', color: 'bg-[#06B6D4]' },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newEntry, setNewEntry] = useState({ guestName: '', guestPhone: '', flatOwner: '', purpose: 'Visitor', vehicleNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [flatOwners, setFlatOwners] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await fetchApi('/flat-owners');
        if (res.success) {
          setFlatOwners(res.data || []);
        }
        
        const guestsRes = await fetchApi('/guests/guard');
        if (guestsRes.success) {
          setEntries(guestsRes.data || []);
        } else {
          setEntries([]);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Find the selected flat owner to extract societyId as fallback
    const selectedOwner = flatOwners.find(o => {
      const uId = o.user && typeof o.user === 'object' ? o.user._id : o.user;
      // also handle fallback where we use flatowner ID
      return uId === newEntry.flatOwner || o._id === newEntry.flatOwner;
    });
    
    const resolvedSocietyId = profile?.societyId || (selectedOwner && selectedOwner.societyId);

    try {
      const res = await fetchApi('/guests/', { 
        method: 'POST', 
        body: JSON.stringify({ 
          ...newEntry, 
          societyId: resolvedSocietyId 
        }) 
      });
      if (res.success) {
        setEntries([res.data, ...entries]);
        setShowModal(false);
        setNewEntry({ guestName: '', guestPhone: '', flatOwner: '', purpose: 'Visitor', vehicleNumber: '' });
      }
    } catch (err) { alert(err.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleMarkEntry = async (id) => {
    const res = await fetchApi(`/guests/${id}/entry`, { method: 'PATCH' });
    if (res.success) {
      setEntries(entries.map(e => e._id === id ? { ...e, status: 'ENTERED' } : e));
      setSelectedGuest(null);
    }
  };

  const handleMarkExit = async (id) => {
    const res = await fetchApi(`/guests/${id}/exit`, { method: 'PATCH' });
    if (res.success) {
      setEntries(entries.map(e => e._id === id ? { ...e, status: 'EXITED' } : e));
      setSelectedGuest(null);
    }
  };

  const filtered = entries.filter(e =>
    e.guestName?.toLowerCase().includes(search.toLowerCase()) ||
    e.guestPhone?.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Active Duty Floating Card (Overlaps the top gradient from layout) */}
      <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <ShieldCheck size={24} className="text-[#3B82F6]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Duty Status</p>
            <h3 className="text-sm font-extrabold text-slate-800">Shift: {profile?.shift || 'Morning'}</h3>
            <p className="text-xs font-semibold text-slate-500">Gate {profile?.gateNumber || 'A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-start">
          {[
            { img: '/delivery_avatar.png', label: 'Delivery' },
            { img: '/service_avatar.png', label: 'Service' },
            { img: '/emergency_avatar.png', label: 'Emergency' },
            { img: '/reports_avatar.png', label: 'Reports' },
          ].map(({ img, label }) => (
            <button key={label} className="flex flex-col items-center gap-2 group active:scale-90 transition-transform w-[60px]">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl p-1 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md">
                <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entry Log (Styled like Gate Updates) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-extrabold text-slate-800">Entry Log</h2>
          <button className="text-xs font-bold text-[#3B82F6] flex items-center">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {/* Add Visitor Button as first item */}
            <button onClick={() => setShowModal(true)} className="min-w-[70px] flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <div className="w-16 h-16 rounded-[20px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 relative hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors">
                <Plus size={24} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3B82F6] rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm">
                  <Plus size={14} strokeWidth={3} />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600">New Entry</span>
            </button>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-300" size={24} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold py-4">
                No recent entries
              </div>
            ) : (
              filtered.map(entry => {
                const status = statusMap[entry.status] || statusMap.PENDING;
                return (
                  <div key={entry._id} onClick={() => setSelectedGuest(entry)} className="min-w-[70px] flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 flex items-center justify-center relative overflow-hidden shadow-sm">
                      <span className="text-xl font-extrabold text-[#3B82F6]">{entry.guestName?.charAt(0).toUpperCase()}</span>
                      
                      {entry.status === 'ENTERED' && (
                        <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[9px] font-bold text-center py-0.5">
                          In
                        </div>
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[11px] font-extrabold text-slate-800 truncate">{entry.guestName.split(' ')[0]}</p>
                      <p className="text-[9px] font-semibold text-slate-500 truncate">{entry.purpose}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity (Styled like Community Buzz) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-extrabold text-slate-800">Recent Activity</h2>
          <button className="text-xs font-bold text-[#3B82F6] flex items-center">
            View All <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {recentActivities.map((activity, i) => (
            <div key={i} className="min-w-[240px] bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col justify-between">
              <div>
                <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-extrabold text-white uppercase tracking-wider mb-2 ${activity.color}`}>
                  {activity.action.split(' ')[0]}
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm leading-tight mb-1">{activity.action}</h3>
                <p className="text-xs font-semibold text-slate-500">{activity.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">New Guest Entry</h3>
                <p className="text-xs font-semibold text-slate-500">Fill in visitor details</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {[
                { label: 'Guest Name', key: 'guestName', placeholder: 'Enter full name', req: true },
                { label: 'Phone Number', key: 'guestPhone', placeholder: '+91 00000 00000', req: true },
                { label: 'Purpose', key: 'purpose', placeholder: 'e.g. Delivery, Visit', req: true },
                { label: 'Vehicle No. (Optional)', key: 'vehicleNumber', placeholder: 'MH 00 XX 0000', req: false },
              ].map(({ label, key, placeholder, req }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">{label}</label>
                  <input
                    type="text"
                    required={req}
                    placeholder={placeholder}
                    value={newEntry[key]}
                    onChange={e => setNewEntry({ ...newEntry, [key]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold placeholder:text-slate-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Flat Owner</label>
                <select
                  required
                  value={newEntry.flatOwner}
                  onChange={e => setNewEntry({ ...newEntry, flatOwner: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold text-slate-700"
                >
                  <option value="">Select Flat Owner</option>
                  {flatOwners.length === 0 ? (
                    <option value="">No Flat Owners (Data empty)</option>
                  ) : (
                    flatOwners.map((o, idx) => {
                      const userId = (o.user.id && o._id) ? o.user._id : (typeof o.user === 'string' ? o.user : o._id);
                      const userName = (o.user.name ) ? o.user.name : `Owner ${idx + 1} (No Name)`;
                      return (
                        <option key={o._id || idx} value={userId}>
                          {userName} ({o.flatNumber || 'N/A'}, {o.tower || 'N/A'})
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="w-full py-4 bg-[#3B82F6] text-white font-bold text-sm rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-70">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Send for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Guest Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedGuest(null)}></div>
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Manage Guest</h3>
                <span className={`badge ${statusMap[selectedGuest.status]?.bg} ${statusMap[selectedGuest.status]?.text} mt-1 inline-block`}>
                  {statusMap[selectedGuest.status]?.label || selectedGuest.status}
                </span>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500">Name</p>
                <p className="font-semibold text-slate-800">{selectedGuest.guestName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Phone</p>
                <p className="font-semibold text-slate-800">{selectedGuest.guestPhone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Purpose</p>
                <p className="font-semibold text-slate-800">{selectedGuest.purpose}</p>
              </div>
              {selectedGuest.vehicleNumber && (
                <div>
                  <p className="text-xs font-bold text-slate-500">Vehicle</p>
                  <p className="font-semibold text-slate-800">{selectedGuest.vehicleNumber}</p>
                </div>
              )}
              <div className="pt-4 flex gap-3">
                {selectedGuest.status === 'APPROVED' && (
                  <button onClick={() => handleMarkEntry(selectedGuest._id)} className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors">
                    Mark Entry
                  </button>
                )}
                {selectedGuest.status === 'ENTERED' && (
                  <button onClick={() => handleMarkExit(selectedGuest._id)} className="flex-1 py-3 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors">
                    Mark Exit
                  </button>
                )}
                {selectedGuest.status !== 'APPROVED' && selectedGuest.status !== 'ENTERED' && (
                  <div className="w-full text-center py-3 text-slate-500 text-sm font-semibold">
                    No actions available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
