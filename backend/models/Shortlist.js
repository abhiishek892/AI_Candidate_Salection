import mongoose from 'mongoose';

const ShortlistSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  requiredSkills: {
    type: [String],
    required: true
  },
  minExperience: {
    type: Number,
    required: true
  },
  candidates: [{
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true
    },
    matchScore: {
      type: Number,
      required: true
    },
    rankCategory: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true
    },
    aiExplanation: {
      type: String
    },
    aiRank: {
      type: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Shortlist = mongoose.model('Shortlist', ShortlistSchema);
export default Shortlist;
