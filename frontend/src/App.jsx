import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';
import JobForm from './pages/JobForm';
import Chatbot from './pages/Chatbot';
import SavedShortlists from './pages/SavedShortlists';
import { Cpu, HelpCircle, FileJson } from 'lucide-react';

const API_URL = 'https://ai-candidate-salection.onrender.com/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('candidates');

  // Page switching router
  const renderContent = () => {
    switch (activeTab) {
      case 'candidates':
        return (
          <Candidates
            API_URL={API_URL}
            onNavigateToAdd={() => setActiveTab('add-candidate')}
          />
        );
      case 'add-candidate':
        return (
          <AddCandidate
            API_URL={API_URL}
            onNavigateToCandidates={() => setActiveTab('candidates')}
          />
        );
      case 'job-form':
        return <JobForm API_URL={API_URL} />;
      case 'chatbot':
        return <Chatbot API_URL={API_URL} />;
      case 'saved-shortlists':
        return <SavedShortlists API_URL={API_URL} />;
      default:
        return (
          <Candidates
            API_URL={API_URL}
            onNavigateToAdd={() => setActiveTab('add-candidate')}
          />
        );
    }
  };

  return (
    <div className="flex bg-[#070B13] min-h-screen text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Sidebar Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header Status Bar */}
        <header className="px-8 py-4 border-b border-glassBorder/60 bg-[#0B0F19]/40 flex items-center justify-between shrink-0 sticky top-0 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Workspace:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-glassBorder text-slate-300 text-xs font-semibold">
              MERN Candidate Screener
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              API Server: <span className="text-emerald-400 font-bold">Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Mounting Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
}
