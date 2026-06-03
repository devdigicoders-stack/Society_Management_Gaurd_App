import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, LogIn, LogOut, Clock, Check, AlertCircle, Filter, X } from 'lucide-react';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusMap = {
  PENDING:  { label: 'Pending',  bg: 'bg-amber-100',   text: 'text-amber-700',   icon: Clock },
  APPROVED: { label: 'Approved', bg: 'bg-blue-100',     text: 'text-blue-700',    icon: Check },
  ENTERED:  { label: 'Inside',   bg: 'bg-emerald-100',  text: 'text-emerald-700', icon: LogIn },
  EXITED:   { label: 'Exited',   bg: 'bg-slate-100',    text: 'text-slate-600',   icon: LogOut },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-100',     text: 'text-rose-700',    icon: AlertCircle },
};

const filters = ['ALL', 'PENDING', 'APPROVED', 'ENTERED', 'EXITED', 'REJECTED'];

const AllEntries = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user?._id) loadEntries();
  }, [user?._id]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/guests/guard');
      if (res.success) setEntries(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkEntry = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/guests/${id}/entry`, { method: 'PATCH' });
      if (res.success) {
        await loadEntries();
        setSelectedGuest(null);
      }
    } catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const handleMarkExit = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetchApi(`/guests/${id}/exit`, { method: 'PATCH' });
      if (res.success) {
        await loadEntries();
        setSelectedGuest(null);
      }
    } catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  };

  const filtered = entries.filter(e => {
    const matchSearch =
      e.guestName?.toLowerCase().includes(search.toLowerCase()) ||
      e.guestPhone?.includes(search) ||
      e.purpose?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'ALL' || e.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 text-base">All Entries</h1>
            <p className="text-xs text-slate-400">{entries.length} total records</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone or purpose..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all font-semibold text-slate-700 placeholder:font-normal placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {f === 'ALL' ? `All (${entries.length})` : `${statusMap[f]?.label} (${entries.filter(e => e.status === f).length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm mt-3">Loading entries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Filter size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-600 font-semibold">No entries found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(entry => {
              const s = statusMap[entry.status] || statusMap.PENDING;
              const StatusIcon = s.icon;
              return (
                <div
                  key={entry._id}
                  onClick={() => setSelectedGuest(entry)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-lg font-extrabold text-[#3B82F6]">
                      {entry.guestName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{entry.guestName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{entry.guestPhone} · {entry.purpose}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{formatTime(entry.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 ${s.bg} ${s.text}`}>
                    <StatusIcon size={11} />
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Bottom Sheet */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedGuest(null)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl relative z-10 pb-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800">Guest Details</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${statusMap[selectedGuest.status]?.bg} ${statusMap[selectedGuest.status]?.text}`}>
                  {statusMap[selectedGuest.status]?.label}
                </span>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Guest Name',   value: selectedGuest.guestName },
                { label: 'Phone',        value: selectedGuest.guestPhone },
                { label: 'Purpose',      value: selectedGuest.purpose },
                { label: 'Vehicle',      value: selectedGuest.vehicleNumber || '—' },
                { label: 'Entry Time',   value: formatTime(selectedGuest.entryTime) },
                { label: 'Exit Time',    value: formatTime(selectedGuest.exitTime) },
                { label: 'Logged At',    value: formatTime(selectedGuest.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="px-5 flex gap-3">
              {selectedGuest.status === 'APPROVED' && (
                <button
                  onClick={() => handleMarkEntry(selectedGuest._id)}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-60"
                >
                  {actionLoading ? '...' : '✓ Mark Entry'}
                </button>
              )}
              {selectedGuest.status === 'ENTERED' && (
                <button
                  onClick={() => handleMarkExit(selectedGuest._id)}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-slate-800 text-white font-bold text-sm rounded-2xl hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-60"
                >
                  {actionLoading ? '...' : '→ Mark Exit'}
                </button>
              )}
              {selectedGuest.status !== 'APPROVED' && selectedGuest.status !== 'ENTERED' && (
                <div className="flex-1 py-3 text-center text-slate-400 text-sm font-semibold">
                  No actions available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEntries;
