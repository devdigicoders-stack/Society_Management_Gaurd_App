import React, { useState } from 'react';
import { Send, Phone, MessageSquare, ChevronRight, Package, BellRing, BookOpen, ClipboardList } from 'lucide-react';

const guides = [
  { icon: ClipboardList, text: 'How to log a new visitor entry' },
  { icon: Package, text: 'Handling delivery packages' },
  { icon: BellRing, text: 'What to do in case of an alarm' },
  { icon: BookOpen, text: 'Daily shift reporting guide' },
];

const Helpdesk = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Floating Page Header Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Helpdesk</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Raise a ticket or contact admin directly</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6]">
          <MessageSquare size={20} />
        </div>
      </div>

      {/* Emergency Card */}
      <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-[20px] p-5 shadow-[0_8px_30px_rgba(225,29,72,0.2)]">
        <h2 className="font-bold text-white mb-1">Emergency Contact</h2>
        <p className="text-rose-100 text-xs mb-4">For urgent issues, call the security office directly.</p>
        <a href="tel:+919876543210" className="flex items-center justify-center gap-2 w-full bg-white text-rose-600 font-bold py-3 rounded-2xl hover:bg-rose-50 active:scale-95 transition-all shadow-sm">
          <Phone size={18} />
          +91 98765 43210
        </a>
      </div>

      {/* Ticket Form */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6]">
            <MessageSquare size={16} />
          </div>
          <h2 className="font-extrabold text-slate-800 text-sm">Submit a Ticket</h2>
        </div>

        {submitted && (
          <div className="bg-emerald-50 text-emerald-600 text-xs font-bold p-3 rounded-2xl mb-4 border border-emerald-100">
            Your ticket has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Subject</label>
            <input
              type="text"
              required
              placeholder="Brief description of the issue"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Message</label>
            <textarea
              required
              rows={4}
              placeholder="Provide details about your issue..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-semibold placeholder:text-slate-400 resize-none"
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)]">
              Send Message
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Quick Guides */}
      <div className="bg-white rounded-[20px] overflow-hidden mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50">
        <div className="p-5 pb-3 border-b border-slate-50">
          <h2 className="font-extrabold text-slate-800 text-sm">Quick Help Guides</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {guides.map((guide, i) => {
            const Icon = guide.icon;
            return (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#3B82F6]">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{guide.text}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Helpdesk;
