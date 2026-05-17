import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Briefcase, FileText, CheckCircle2, AlertCircle, Plus, Send } from 'lucide-react';

export default function AddCandidate({ API_URL, onNavigateToCandidates }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    projectsBio: ''
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/candidates`, {
        ...formData,
        experience: Number(formData.experience)
      });

      if (response.data.success) {
        showNotification('success', 'Candidate profile registered successfully!');
        setFormData({
          name: '',
          email: '',
          skills: '',
          experience: '',
          projectsBio: ''
        });
        // Wait and redirect
        setTimeout(() => {
          onNavigateToCandidates();
        }, 1200);
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      const errMsg = error.response?.data?.message || 'Failed to submit candidate profile.';
      showNotification('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Compute live skills badge list to wow the user
  const liveSkillsBadges = formData.skills
    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Register <span className="text-gradient">Candidate</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">Enroll an applicant profile to enable shortlisting and chat screening.</p>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/35 text-rose-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card border-glassBorder space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alexander Pierce"
                className="w-full pl-10 pr-4 py-3 text-sm glass-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alex@example.com"
                className="w-full pl-10 pr-4 py-3 text-sm glass-input"
              />
            </div>
          </div>

          {/* Skills (Comma Separated) */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                Technical Skills (Comma Separated)
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Type comma to add multiple</span>
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind"
                className="w-full pl-10 pr-4 py-3 text-sm glass-input"
              />
            </div>

            {/* Live Tag Previews */}
            {liveSkillsBadges.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-900/60">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                  Skills Preview:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {liveSkillsBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold animate-pulse"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
              Years of Experience
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="number"
                name="experience"
                required
                min="0"
                step="0.5"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full pl-10 pr-4 py-3 text-sm glass-input"
              />
            </div>
          </div>

          {/* Projects and Bio */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
              Projects & Biography
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <textarea
                name="projectsBio"
                required
                rows="4"
                value={formData.projectsBio}
                onChange={handleChange}
                placeholder="Detail candidate's core projects, portfolio summaries, and professional achievements..."
                className="w-full pl-10 pr-4 py-3 text-sm glass-input resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="grow flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-gradient-primary hover:opacity-90 text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting applicant profile...' : 'Register Applicant Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
