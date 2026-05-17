import Candidate from '../models/Candidate.js';
import Shortlist from '../models/Shortlist.js';

// @desc    Match candidates based on skills overlap & experience
// @route   POST /api/match
export const matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ 
        success: false, 
        message: 'requiredSkills must be a valid array.' 
      });
    }

    const experienceLimit = minExperience !== undefined ? Number(minExperience) : 0;

    // Fetch all candidates from the database
    const candidates = await Candidate.find({});

    // Filter candidates by minimum experience and calculate overlap
    const results = candidates
      .filter(c => c.experience >= experienceLimit)
      .map(c => {
        const candidateSkillsLower = c.skills.map(s => s.toLowerCase().trim());
        const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase().trim());

        // Find intersection of skills
        const overlap = candidateSkillsLower.filter(s => requiredSkillsLower.includes(s));
        
        let score = 0;
        if (requiredSkillsLower.length > 0) {
          score = overlap.length / requiredSkillsLower.length;
        } else if (candidateSkillsLower.length > 0) {
          score = 1;
        }

        const matchScorePercent = Math.round(score * 100);

        // Classify match score (High: >= 75%, Medium: 40-74%, Low: < 40%)
        let rankCategory = 'Low';
        if (matchScorePercent >= 75) {
          rankCategory = 'High';
        } else if (matchScorePercent >= 40) {
          rankCategory = 'Medium';
        }

        const matchedSkillsList = c.skills.filter(s => 
          requiredSkillsLower.includes(s.toLowerCase().trim())
        );

        return {
          candidate: c,
          matchScore: matchScorePercent,
          matchedSkills: matchedSkillsList,
          rankCategory
        };
      });

    // Sort descending by score
    results.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Match candidates controller error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save a matching shortlist
// @route   POST /api/match/save
export const saveShortlist = async (req, res) => {
  try {
    const { jobTitle, requiredSkills, minExperience, candidates } = req.body;

    if (!jobTitle || !requiredSkills || !candidates || !Array.isArray(candidates)) {
      return res.status(400).json({
        success: false,
        message: 'jobTitle, requiredSkills, and candidates array are required to save shortlist.'
      });
    }

    const shortlist = new Shortlist({
      jobTitle,
      requiredSkills,
      minExperience: Number(minExperience) || 0,
      candidates: candidates.map(item => ({
        candidate: item.candidateId || item.candidate?._id || item.candidate,
        matchScore: Number(item.matchScore),
        rankCategory: item.rankCategory || 'Low',
        aiExplanation: item.aiExplanation || '',
        aiRank: item.aiRank || null
      }))
    });

    await shortlist.save();
    return res.status(201).json({ success: true, data: shortlist });
  } catch (error) {
    console.error('Save shortlist error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all saved shortlists
// @route   GET /api/match/saved
export const getSavedShortlists = async (req, res) => {
  try {
    const shortlists = await Shortlist.find({})
      .populate('candidates.candidate')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: shortlists.length, data: shortlists });
  } catch (error) {
    console.error('Get saved shortlists error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
