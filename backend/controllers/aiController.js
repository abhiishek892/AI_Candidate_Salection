import Candidate from '../models/Candidate.js';
import { callOpenRouter } from '../utils/openrouter.js';

// @desc    Evaluate candidates using OpenRouter AI
// @route   POST /api/ai/shortlist
export const aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ 
        success: false, 
        message: 'requiredSkills array is required.' 
      });
    }

    const minExp = Number(minExperience) || 0;

    // Fetch all candidates from MongoDB
    const candidates = await Candidate.find({});

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        aiAnalysis: 'No candidates registered in the system yet. Please add candidate profiles first.',
        data: []
      });
    }

    // Format candidate list for prompt as requested
    let candidateListPromptText = '';
    candidates.forEach((c, idx) => {
      candidateListPromptText += `${idx + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years - Projects & Bio: ${c.projectsBio}\n`;
    });

    // Match exact user template:
    // "Job requires: <skills> with <experience> years.
    // Candidates:
    // 1. Name - Skills - Experience
    // Rank them and explain why."
    const prompt = `Job requires: ${requiredSkills.join(', ')} with ${minExp} years.
Candidates:
${candidateListPromptText}
Rank them and explain why.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an elite talent acquisition expert. Analyze the candidates against the requirements, provide a ranked list, and write detailed explanations highlighting skill overlaps, experience levels, and projects. Output in beautiful, structured markdown.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const aiAnalysis = await callOpenRouter(messages);

    return res.status(200).json({
      success: true,
      aiAnalysis
    });
  } catch (error) {
    console.error('AI Shortlist error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Recruiter Assistant Chatbot
// @route   POST /api/ai/chatbot
export const aiChatbot = async (req, res) => {
  try {
    const { messages, message } = req.body;

    const systemPrompt = {
      role: 'system',
      content: `You are Antigravity Recruiter AI, an expert talent acquisition consultant.
You provide professional advice on:
- Designing coding tests and technical screening interviews.
- Sourcing candidate skills.
- Analyzing candidates.
- Career path planning and general hiring best practices.
Keep your answers highly professional, organized with bullet points, and directly actionable. If asked about the system candidates, guide the recruiter on using the matching or shortlist tabs.`
    };

    let apiMessages = [];

    if (messages && Array.isArray(messages)) {
      // Filter out system messages in user payload if any, then prepend our system persona
      const userHistory = messages.filter(msg => msg.role !== 'system');
      apiMessages = [systemPrompt, ...userHistory];
    } else if (message) {
      apiMessages = [
        systemPrompt,
        { role: 'user', content: message }
      ];
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either a messages array or a message string.' 
      });
    }

    const reply = await callOpenRouter(apiMessages);

    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('AI Chatbot error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
