import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, SlidersHorizontal, Play, Sparkles, AlertCircle, Laptop } from 'lucide-react';
import Shortlist from './Shortlist';

export default function JobForm({ API_URL }) {
  const [jobTitle, setJobTitle] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); // Text tracking loaders
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState(null); // { matchResults, aiAnalysis }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResults(null);

    const skillsArray = requiredSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setErrorMsg('Please enter at least one required skill.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Run standard skill-overlap algorithm
      setLoadingStep('Calculating overlapping skill percentages & experience tiers...');
      const matchResponse = await axios.post(`${API_URL}/match`, {
        requiredSkills: skillsArray,
        minExperience: Number(minExperience) || 0
      });

      if (!matchResponse.data.success) {
        throw new Error(matchResponse.data.message || 'Matching algorithm failed.');
      }

      if (matchResponse.data.count === 0) {
        setErrorMsg('No candidates met the minimum experience threshold. Try adjusting experience values!');
        setLoading(false);
        return;
      }

      // Step 2: Query OpenRouter for reasoning
      setLoadingStep('Dispatching prompt parameters. Querying OpenRouter AI for GPT rank summaries...');
      const aiResponse = await axios.post(`${API_URL}/ai/shortlist`, {
        requiredSkills: skillsArray,
        minExperience: Number(minExperience) || 0
      });

      if (!aiResponse.data.success) {
        throw new Error(aiResponse.data.message || 'AI Shortlist failed.');
      }

      // Set results
      setResults({
        matchResults: matchResponse.data.data,
        aiAnalysis: aiResponse.data.aiAnalysis
      });

    } catch (error) {
      console.error('Shortlisting execution error:', error);
      setErrorMsg(
        error.response?.data?.message || 
        'Could not complete evaluation. Ensure your backend server is running and MongoDB is populated.'
      );
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setResults(null);
    setJobTitle('');
    setRequiredSkills('');
    setMinExperience('');
  };

  // Render evaluation panel if scores loaded
  if (results) {
    return (
      <Shortlist
        API_URL={API_URL}
        jobTitle={jobTitle || 'Custom Search'}
        requiredSkills={requiredSkills.split(',').map(s => s.trim()).filter(Boolean)}
        minExperience={Number(minExperience) || 0}
        matchResults={results.matchResults}
        aiAnalysis={results.aiAnalysis}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Run <span className="text-gradient">Shortlisting Matrix</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Specify core profiles metrics and query advanced algorithm weights combined with GPT reasoning.
        </p>
      </div>

      {/* Error Callout */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-400 flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading ? (
        <div className="p-12 rounded-2xl glass-card border-glassBorder flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Evaluator Processing</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">{loadingStep}</p>
          </div>
        </div>
      ) : (
        /* Requirements Form */
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card border-glassBorder space-y-6">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Job Designation Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  placeholder="e.g. Lead Senior MERN Stack Architect"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Required Skills</label>
                <span className="text-[10px] text-slate-500 font-medium">Split values with commas</span>
              </div>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  required
                  placeholder="e.g. React, Node.js, Express, MongoDB"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input"
                />
              </div>
            </div>

            {/* Experience Slider or Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Minimum Experience (Years)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  required
                  min="0"
                  step="1"
                  placeholder="e.g. 3"
                  className="w-full pl-10 pr-4 py-3 text-sm glass-input"
                />
              </div>
            </div>

          </div>

          {/* Trigger Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-gradient-primary hover:opacity-90 shadow-lg shadow-emerald-500/20 text-white text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current" />
              Analyze Candidates & Generate AI shortlist
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
