import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Sparkles, MessageSquare, ShieldAlert, Cpu } from 'lucide-react';

export default function Chatbot({ API_URL }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AI Recruiter Assistant. I can help you draft screening templates, write deep technical interview questions, suggest screening checklists, or advice on candidate credentials. What is on your hiring docket today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Pre-defined quick chips to make testing quick & extremely cool
  const promptChips = [
    "How should I screen candidates for senior React roles?",
    "Draft 3 difficult interview questions for Node.js experience.",
    "Give me soft skill checklist items for MERN developers.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Clear input if sending from keyboard input
    if (!textToSend) {
      setInput('');
    }

    const newUserMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Send the active chat log array so OpenRouter holds complete conversation history!
      const response = await axios.post(`${API_URL}/ai/chatbot`, {
        messages: updatedMessages
      });

      if (response.data.success) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: response.data.reply }
        ]);
      }
    } catch (error) {
      console.error('Error querying recruiter chatbot:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "❌ Sorry, I encountered a communication error. Please ensure your backend service is running and API credentials are correct." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      {/* Title Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Recruiter AI <span className="text-gradient">Assistant</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Chat in real-time regarding candidate credentials, interview templates, or standard job listings.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="grow rounded-2xl glass-card border-glassBorder flex flex-col overflow-hidden bg-slate-950/40 relative">
        {/* Background mesh glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
        
        {/* Messages Pane */}
        <div className="grow overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile icon bubble */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                msg.role === 'user'
                  ? 'bg-slate-900 border-glassBorder text-slate-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {msg.role === 'user' ? 'R' : <Cpu className="w-4 h-4" />}
              </div>

              {/* Chat Bubble Text */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-gradient-primary text-white font-medium rounded-tr-none shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800/80 shadow-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Bouncing Loader */}
          {loading && (
            <div className="flex gap-3 mr-auto items-center max-w-[80%] animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        {messages.length === 1 && !loading && (
          <div className="px-6 py-3 border-t border-slate-900 bg-slate-950/20">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
              Suggested Recruiting Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3.5 py-1.5 rounded-lg border border-glassBorder bg-slate-900/40 text-slate-400 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/5 text-xs font-medium text-left transition-all duration-300"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-glassBorder bg-slate-950/60 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            placeholder="Type your recruitment queries here (e.g. 'draft interview checklist')..."
            className="grow py-3 px-4 text-sm glass-input"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="p-3.5 rounded-xl bg-gradient-primary text-white hover:opacity-90 shadow-md shadow-emerald-500/10 transition-all shrink-0 disabled:opacity-40 disabled:-translate-y-0 hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
