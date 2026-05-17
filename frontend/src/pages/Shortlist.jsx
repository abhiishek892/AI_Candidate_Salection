import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Save, CheckCircle2, ChevronRight, AlertCircle, Info, BookmarkCheck } from 'lucide-react';

export default function Shortlist({
  API_URL,
  jobTitle,
  requiredSkills,
  minExperience,
  matchResults,
  aiAnalysis,
  onReset
}) {
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Prepare chart data
  const chartData = matchResults.map(item => ({
    name: item.candidate.name,
    score: item.matchScore,
  }));

  // Define progress bar colors based on rating tier
  const getScoreColorClass = (score) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getScoreTextClass = (score) => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 75) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (score >= 40) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
  };

  // Compute missing required skills for each candidate
  const getMissingSkills = (candidateSkills) => {
    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase().trim());
    return requiredSkills.filter(
      reqSkill => !candidateSkillsLower.includes(reqSkill.toLowerCase().trim())
    );
  };

  // Save Shortlist to Database
  const handleSaveShortlist = async () => {
    setSaving(true);
    setSavedStatus(null);
    try {
      const candidatesPayload = matchResults.map(item => ({
        candidateId: item.candidate._id,
        matchScore: item.matchScore,
        rankCategory: item.rankCategory,
        aiExplanation: item.candidate.projectsBio // bio as placeholder explanation
      }));

      const response = await axios.post(`${API_URL}/match/save`, {
        jobTitle,
        requiredSkills,
        minExperience,
        candidates: candidatesPayload
      });

      if (response.data.success) {
        setSavedStatus({ type: 'success', message: 'Shortlist successfully saved to database!' });
      }
    } catch (error) {
      console.error('Error saving shortlist:', error);
      setSavedStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save shortlist.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Control buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Evaluation Report
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Shortlist for <span className="text-gradient">{jobTitle}</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Required: <span className="text-slate-200 font-semibold">{requiredSkills.join(', ')}</span> | Min Exp:{' '}
            <span className="text-slate-200 font-semibold">{minExperience} yrs</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-3 rounded-xl border border-glassBorder text-slate-300 font-semibold hover:bg-slate-800/40 text-sm transition-all"
          >
            Run New Match
          </button>
          <button
            onClick={handleSaveShortlist}
            disabled={saving || savedStatus?.type === 'success'}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-primary hover:opacity-90 shadow-lg shadow-emerald-500/15 text-white text-sm transition-all disabled:opacity-50 disabled:translate-y-0 hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : savedStatus?.type === 'success' ? 'Saved Report' : 'Save Run'}
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {savedStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            savedStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
          }`}
        >
          {savedStatus.type === 'success' ? (
            <BookmarkCheck className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{savedStatus.message}</span>
        </div>
      )}

      {/* Main Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Candidate match list and chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recharts Bar Graph (Bonus Feature) */}
          <div className="p-6 rounded-2xl glass-card border-glassBorder">
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Technical Fit Matrix (Match Scores)
            </h3>
            {chartData.length === 0 ? (
              <p className="text-xs text-slate-500">No data available for scores visualizer.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      axisLine={{ stroke: '#1E293B' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      axisLine={{ stroke: '#1E293B' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '0.75rem',
                        color: '#F8FAFC',
                      }}
                      itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.score >= 75 ? '#10B981' : entry.score >= 40 ? '#F59E0B' : '#EF4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Candidate Profile Cards list */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Shortlisted Candidates ({matchResults.length})
            </h3>

            {matchResults.map((item, idx) => {
              const missingSkills = getMissingSkills(item.candidate.skills);
              return (
                <div
                  key={item.candidate._id}
                  className="p-6 rounded-2xl glass-card border-glassBorder space-y-4 glass-card-hover"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">
                        {item.candidate.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.candidate.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-bold ${getScoreBadgeClass(
                        item.matchScore
                      )}`}
                    >
                      {item.rankCategory} Fit
                    </span>
                  </div>

                  {/* Math Score Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">Skill Alignment</span>
                      <span className={getScoreTextClass(item.matchScore)}>{item.matchScore}% Overlap</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-900">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${getScoreColorClass(
                          item.matchScore
                        )}`}
                        style={{ width: `${item.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 bg-slate-950/30 border border-slate-900/60 p-3 rounded-xl leading-relaxed">
                    <span className="font-semibold text-slate-400 block mb-0.5">Projects / Background:</span>
                    {item.candidate.projectsBio}
                  </p>

                  {/* Skills lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Matched */}
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                        Matched Required ({item.matchedSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.matchedSkills.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic">None matched</span>
                        ) : (
                          item.matchedSkills.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold"
                            >
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Missing */}
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                        Missing Required ({missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.length === 0 ? (
                          <span className="text-[10px] text-emerald-400/80 font-medium flex items-center gap-1">
                            ✓ Fully covered!
                          </span>
                        ) : (
                          missingSkills.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-rose-500/5 border border-rose-500/10 text-rose-400/80 text-[10px] font-medium"
                            >
                              {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: AI OpenRouter Ranking & reasoning */}
        <div className="space-y-6">
          <div className="rounded-2xl glass-card border-glassBorder p-6 border-emerald-500/20 shadow-emerald-950/20 glow-effect relative overflow-hidden flex flex-col h-full bg-slate-950/45">
            {/* Glowing background bubble */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-none">GPT Rank Reasoning</h3>
                <span className="text-[10px] text-slate-500">Powered by OpenRouter AI</span>
              </div>
            </div>

            {/* AI response content */}
            <div className="grow overflow-y-auto max-h-[580px] pr-2 text-xs text-slate-300 leading-relaxed space-y-3 font-normal whitespace-pre-line border border-slate-900 p-4 rounded-xl bg-slate-950/30">
              {aiAnalysis}
            </div>

            {/* Bottom Note */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-glassBorder flex items-start gap-2.5 text-[10px] text-slate-400 leading-snug">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                AI ranking uses OpenAI/GPT LLM reasoning based on candidate backgrounds, tech overlaps, and bio details.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
