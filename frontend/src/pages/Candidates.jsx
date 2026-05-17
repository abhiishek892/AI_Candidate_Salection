import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Trash2, Mail, Briefcase, Plus, FilterX } from 'lucide-react';

export default function Candidates({ API_URL, onNavigateToAdd }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [minExp, setMinExp] = useState('');

  // Fetch candidates from API
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/candidates`, {
        params: {
          search,
          skills: skillsFilter,
          minExperience: minExp
        }
      });
      if (response.data.success) {
        setCandidates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce API calls slightly for query filters
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, skillsFilter, minExp]);

  const clearFilters = () => {
    setSearch('');
    setSkillsFilter('');
    setMinExp('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Candidate <span className="text-gradient">Database</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Browse, search, and filter through registered talent profiles.</p>
        </div>
        <button
          onClick={onNavigateToAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-primary hover:opacity-90 shadow-lg shadow-emerald-500/15 text-white text-sm transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Advanced Filter Box */}
      <div className="p-6 rounded-2xl glass-card border-glassBorder space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          Search & Filtering Systems
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Text search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search name, projects bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm glass-input"
            />
          </div>

          {/* Skill search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by skills (comma separated)..."
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm glass-input"
            />
          </div>

          {/* Min Experience */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium shrink-0">Min Experience:</span>
            <input
              type="number"
              placeholder="e.g. 3"
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full px-4 py-3 text-sm glass-input"
              min="0"
            />
            {(search || skillsFilter || minExp) && (
              <button
                onClick={clearFilters}
                title="Clear Filters"
                className="p-3 rounded-xl border border-glassBorder text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors shrink-0"
              >
                <FilterX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Candidates */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm">Searching applicant records...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="py-20 rounded-2xl glass-card border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6">
          <FilterX className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-white font-bold text-lg">No Talent Profiles Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mt-1">
            We couldn't find any profiles matching your search parameters. Try loosening your filters or register a new candidate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl glass-card border-glassBorder p-6 flex flex-col justify-between glass-card-hover"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{c.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-glassBorder text-slate-400 text-xs font-semibold shrink-0 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-cyan-400" />
                    {c.experience} {c.experience === 1 ? 'yr' : 'yrs'} exp
                  </span>
                </div>

                {/* Email */}
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-2 text-xs text-emerald-400 hover:underline mt-1.5 transition-colors"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  {c.email}
                </a>

                {/* Bio text */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-300 text-xs leading-relaxed italic">
                  "{c.projectsBio.length > 180 ? `${c.projectsBio.slice(0, 180)}...` : c.projectsBio}"
                </div>
              </div>

              {/* Skills Footer */}
              <div className="mt-5 pt-4 border-t border-glassBorder/50">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                  Primary Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
