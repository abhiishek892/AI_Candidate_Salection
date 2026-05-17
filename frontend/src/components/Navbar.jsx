import React from 'react';
import { Users, UserPlus, Briefcase, MessageSquare, History, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'add-candidate', label: 'Add Profile', icon: UserPlus },
    { id: 'job-form', label: 'Run Matching', icon: Briefcase },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'saved-shortlists', label: 'Saved Runs', icon: History },
  ];

  return (
    <aside className="w-72 bg-[#0B0F19] border-r border-glassBorder flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="flex flex-col p-6 overflow-y-auto grow">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Shortlist<span className="text-gradient">AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Recruitment Suite</p>
          </div>
        </div>

        {/* System Active Badge */}
        <div className="mb-6 p-4 rounded-xl glass-card bg-emerald-950/20 border-emerald-500/10 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-xs text-slate-300 font-semibold">AI Models Active</p>
            <p className="text-[10px] text-slate-500">openai/gpt-5.2 (Fallback enabled)</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? 'text-white bg-slate-900 border-l-4 border-emerald-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-950/40 border-l-4 border-transparent'
                }`}
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer information */}
      <div className="p-6 border-t border-glassBorder">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300 border border-slate-700">
            R
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Recruiter Panel</p>
            <p className="text-[10px] text-slate-500">Standard Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
