import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

const requirements = [
  { label: 'At least 8 characters',  test: p => p.length >= 8        },
  { label: 'One uppercase letter',   test: p => /[A-Z]/.test(p)      },
  { label: 'One number',             test: p => /\d/.test(p)         },
  { label: 'One special character',  test: p => /[^A-Za-z0-9]/.test(p) },
];

const PasswordField = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-4 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold text-slate-800"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const metCount = requirements.filter(r => r.test(newPass)).length;
  const strength = (metCount / requirements.length) * 100;
  
  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-rose-500';
    if (strength <= 50) return 'bg-amber-500';
    if (strength <= 75) return 'bg-blue-500';
    return 'bg-emerald-500';
  };
  const getStrengthText = () => {
    if (strength <= 25) return { text: 'Weak', color: 'text-rose-500' };
    if (strength <= 50) return { text: 'Fair', color: 'text-amber-500' };
    if (strength <= 75) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-emerald-500' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm) { setError('Passwords do not match.'); return; }
    if (metCount < requirements.length) { setError('Password does not meet all requirements.'); return; }
    setSuccess(true);
    setCurrent(''); setNewPass(''); setConfirm('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Floating Page Header Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Change Password</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Keep your account secure with a strong password</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6]">
          <ShieldCheck size={20} />
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-600 text-xs font-bold p-4 rounded-[20px] border border-emerald-100 flex items-center gap-2">
          <CheckCircle2 size={16} /> Password updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-rose-50 text-rose-600 text-xs font-bold p-4 rounded-[20px] border border-rose-100">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField label="Current Password" value={current} onChange={e => setCurrent(e.target.value)} />
          
          <hr className="border-slate-100" />
          
          <PasswordField label="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} />

          {/* Strength Bar */}
          {newPass.length > 0 && (
            <div className="-mt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
              <p className={`text-[10px] font-bold mt-1.5 ${getStrengthText().color}`}>
                {getStrengthText().text}
              </p>
            </div>
          )}

          <PasswordField label="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)] mt-2"
          >
            <Lock size={16} />
            Update Password
          </button>
        </form>
      </div>

      {/* Requirements Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <ShieldCheck size={16} />
          </div>
          <h2 className="font-extrabold text-slate-800 text-sm">Password Requirements</h2>
        </div>
        <div className="space-y-3">
          {requirements.map(({ label, test }) => {
            const met = test(newPass);
            return (
              <div key={label} className="flex items-center gap-2.5">
                {met ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
                <span className={`text-xs ${met ? 'text-emerald-600 font-bold' : 'text-slate-500 font-semibold'} transition-colors`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
