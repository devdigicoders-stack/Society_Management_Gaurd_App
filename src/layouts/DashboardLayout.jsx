import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Bell, LogOut, Home, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'HOME',      path: '/',               icon: Home },
  { label: 'PROFILE',   path: '/profile',         icon: User },
  { label: 'SECURITY',  path: '/helpdesk',        icon: ShieldCheck },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('guard_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 font-sans">
      {/* Top Header Section with Gradient */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] px-5 pt-12 pb-20 rounded-b-[40px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-sm">
              <img src="https://api.dicebear.com/9.x/micah/svg?seed=Guard&backgroundColor=b6e3f4" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Hello {profile?.name || 'Guard'}!! 👋</p>
              <h1 className="text-white text-xl font-bold tracking-wide mt-0.5">{profile?.societyName || 'Security Portal'}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm">
              <MessageSquare size={18} />
            </button>
            <div className="relative">
              <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm">
                <Bell size={18} />
              </button>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content (Overlaps the header slightly) */}
      <main className="flex-1 overflow-x-hidden relative -mt-10">
        <div className="max-w-md mx-auto px-4 pb-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 transition-all ${
                  isActive ? 'text-[#06B6D4]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#06B6D4]' : ''} />
                <span className={`text-[9px] font-bold tracking-wider ${isActive ? 'text-[#06B6D4]' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
