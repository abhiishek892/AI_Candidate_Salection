import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Call OpenRouter API with message prompt array
 * @param {Array} messages - Chat message objects [{ role: 'user', content: '...' }]
 * @param {string|null} modelOverride - Custom model name if needed
 * @returns {Promise<string>} AI text completion content
 */
export const callOpenRouter = async (messages, modelOverride = null) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = modelOverride || process.env.OPENROUTER_MODEL || 'openai/gpt-5.2';

  if (!apiKey || apiKey === 'your_key' || apiKey.trim() === '') {
    console.warn('⚠️ OpenRouter API Key is missing or default. Operating in Mock AI Demo Mode.');
    return getMockAIResponse(messages, model);
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://localhost:5000',
        'X-Title': 'AI Candidate Shortlister'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected OpenRouter completion format');
    }
  } catch (error) {
    console.error('❌ OpenRouter API request failed:', error.message);
    
    // Fallback: If openai/gpt-5.2 fails or returns 404, fallback to standard gemini
    if (model !== 'google/gemini-2.5-flash') {
      console.log('🔄 Attempting API fallback using google/gemini-2.5-flash...');
      return callOpenRouter(messages, 'google/gemini-2.5-flash');
    }
    
    console.warn('⚠️ API key invalid or API network issues. Graceful fallback to Mock AI Demo Mode.');
    return getMockAIResponse(messages, model);
  }
};

/**
 * Returns premium simulated AI answers to ensure seamless offline/keyless demonstration
 */
function getMockAIResponse(messages, model) {
  const lastMessage = messages[messages.length - 1].content;

  // Shortlister Ranking prompt
  if (lastMessage.includes('Rank them and explain why') || lastMessage.includes('Candidates:')) {
    return `### AI Candidate Evaluation and Shortlist Ranking

Here is the professional AI evaluation based on your specified job requirements.

#### 🏆 Ranked Standings:

1. **Rank 1**: **Excellent Match** (High alignment with required skills and senior experience).
2. **Rank 2**: **Highly Capable** (Medium-High skill overlap, missing 1 secondary skill but compensated by strong bio).
3. **Rank 3**: **Developing/Junior Match** (Below experience threshold, but shows high potential in basic skill categories).

---

#### 📋 Detailed Candidate Reasoning:

- **AI Analysis for Candidate #1**:
  - **Match Status**: **High**
  - **Rationale**: Demonstrates complete overlap of the requested tech stack with an impressive track record. Their experience years align perfectly with a senior level. Their projects bio indicates they have scaled identical services in their previous positions. Highly recommended.

- **AI Analysis for Candidate #2**:
  - **Match Status**: **Medium**
  - **Rationale**: Demonstrates solid knowledge of the core technologies, but lacks experience with secondary systems. With a slight runway for onboarding, they will succeed. Their projects show strong execution of responsive interfaces.

- **AI Analysis for Candidate #3**:
  - **Match Status**: **Low**
  - **Rationale**: Currently below the specified minimum years of experience. While their bio showcases strong academic projects, they will require active mentorship. Keep on file for junior openings.

*(Note: Operating in simulated demo mode. Set a valid OPENROUTER_API_KEY in backend/.env to query live GPT models!)*`;
  }

  // Chatbot prompt response
  return `🤖 **Recruiter AI Assistant (Demo Mode)**

I am here to assist you with all your recruiting, screening, and interview planning needs! 

Here are some helpful ideas to discuss with me:
- *"How should I screen candidates for senior React roles?"*
- *"Draft some tough interview questions for a Node.js developer."*
- *"Suggest soft skill criteria to test in a MERN stack interview."*

Regarding your message: *"${lastMessage}"*
In a full production setup with a live API key, I will analyze candidate databases, draft customized interview templates, and help screen candidate bios. Feel free to ask more questions!`;
}
