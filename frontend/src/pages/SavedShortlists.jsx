import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Calendar, CheckSquare, ChevronDown, ChevronUp, FolderKanban, Users, Eye } from 'lucide-react';

export default function SavedShortlists({ API_URL }) {
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchSavedShortlists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/match/saved`);
      if (response.data.success) {
        setShortlists(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching saved runs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedShortlists();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Saved Shortlist <span className="text-gradient">Runs</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Review, track, and compare historic shortlisting analyses.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm">Retrieving historic records...</p>
        </div>
      ) : shortlists.length === 0 ? (
        <div className="py-20 rounded-2xl glass-card border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6">
          <History className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-white font-bold text-lg">No Saved Runs Available</h3>
          <p className="text-slate-400 text-sm max-w-sm mt-1">
            Shortlist runs you save from the "Run Matching" portal will automatically display here for archival review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shortlists.map((run) => {
            const isExpanded = expandedId === run._id;
            return (
              <div
                key={run._id}
                className="rounded-2xl glass-card border-glassBorder overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleExpand(run._id)}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 text-left gap-4 hover:bg-slate-900/30 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-emerald-400" />
                      {run.jobTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(run.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        {run.candidates.length} candidate{run.candidates.length === 1 ? '' : 's'} shorty
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Required Skills</p>
                      <p className="text-xs text-slate-300 font-medium">{run.requiredSkills.join(', ')}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Candidates Drawer */}
                {isExpanded && (
                  <div className="p-6 bg-slate-950/50 border-t border-glassBorder/60 space-y-4">
                    <h4 className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest block mb-2">
                      Evaluation Standing
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {run.candidates.map((candWrap, idx) => {
                        // Handle possible deleted candidate records gracefully!
                        if (!candWrap.candidate) {
                          return (
                            <div key={idx} className="p-4 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs italic">
                              Candidate record removed from database
                            </div>
                          );
                        }

                        const cand = candWrap.candidate;
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-900 border border-glassBorder/50 flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="text-sm font-bold text-white">{cand.name}</h5>
                                <p className="text-[10px] text-slate-400">{cand.email}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-glassBorder text-slate-400 text-[10px] font-semibold">
                                {cand.experience} yrs exp
                              </span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-950 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Alignment</span>
                              <span className="text-sm font-extrabold text-emerald-400">
                                {candWrap.matchScore}% Overlap
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
