import Candidate from '../models/Candidate.js';

// @desc    Add Candidate
// @route   POST /api/candidates
export const createCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, projectsBio } = req.body;

    if (!name || !email || !skills || experience === undefined || !projectsBio) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (name, email, skills, experience, projectsBio) are required.' 
      });
    }

    // Check if email already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ 
        success: false, 
        message: `Candidate with email ${email} already exists.` 
      });
    }

    // Process skills into clean array
    let processedSkills = [];
    if (Array.isArray(skills)) {
      processedSkills = skills.map(s => s.trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      processedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (processedSkills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Skills must contain at least one skill value.' 
      });
    }

    const candidate = new Candidate({
      name,
      email,
      skills: processedSkills,
      experience: Number(experience),
      projectsBio
    });

    await candidate.save();
    return res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    console.error('Create candidate error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Candidates (with search and filters)
// @route   GET /api/candidates
export const getCandidates = async (req, res) => {
  try {
    const { search, skills, minExperience } = req.query;
    const query = {};

    // Search by name or bio (case-insensitive fuzzy match)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { projectsBio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skills (comma separated, matching any of them case-insensitively)
    if (skills) {
      const skillQueries = skills.split(',').map(s => s.trim());
      if (skillQueries.length > 0) {
        query.skills = {
          $in: skillQueries.map(skill => new RegExp(`^${skill}$`, 'i'))
        };
      }
    }

    // Filter by minimum experience
    if (minExperience !== undefined && minExperience !== '') {
      query.experience = { $gte: Number(minExperience) };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    console.error('Get candidates error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
