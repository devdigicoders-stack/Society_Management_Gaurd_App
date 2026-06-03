import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchApi } from '../services/api';

const RecentActivities = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchApi('/guests/guard');
        if (res.success) setEntries(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activities = entries.map(entry => {
    let action = '';
    let color = '';
    if (entry.status === 'APPROVED') { action = 'Guest approved'; color = 'bg-[#3B82F6]'; }
    else if (entry.status === 'ENTERED') { action = 'Guest entered'; color = 'bg-emerald-500'; }
    else if (entry.status === 'EXITED') { action = 'Guest exited'; color = 'bg-slate-500'; }
    else if (entry.status === 'REJECTED') { action = 'Guest rejected'; color = 'bg-rose-500'; }
    else { action = 'Guest pending'; color = 'bg-amber-500'; }
    
    const timeString = entry.updatedAt ? new Date(entry.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
    return {
      _id: entry._id,
      action,
      sub: `${entry.guestName} · ${timeString}`,
      color,
      date: new Date(entry.updatedAt || entry.createdAt).toLocaleDateString()
    };
  });

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 text-base">Recent Activities</h1>
            <p className="text-xs text-slate-400">Activity timeline</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm mt-3">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10">
             <p className="text-slate-500 font-semibold text-sm">No recent activities found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity._id} className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col justify-between">
                <div>
                  <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-extrabold text-white uppercase tracking-wider mb-2 ${activity.color}`}>
                    {activity.action.split(' ')[0]}
                  </span>
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight mb-1">{activity.action}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{activity.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{activity.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
