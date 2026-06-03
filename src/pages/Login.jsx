import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(phone, password);
      if (success) navigate('/');
      else setError('Invalid credentials. Please try again.');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-5 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Hero / Logo Section */}
      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgba(59,130,246,0.3)]">
          <ShieldCheck size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">GuardApp</h1>
        <p className="text-xs font-semibold text-slate-500">Society Security Management Portal</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative z-10 border border-slate-50">
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-slate-800">Welcome back 👋</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-[11px] font-bold p-3 rounded-2xl mb-5 flex items-start gap-2 border border-rose-100">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold placeholder:text-slate-400 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-12 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold placeholder:text-slate-400 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="text-[10px] font-bold text-slate-400 mt-8 relative z-10">
        GuardApp v1.0 · Society Management System
      </p>
    </div>
  );
};

export default Login;
