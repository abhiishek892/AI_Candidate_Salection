import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Candidate email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  skills: {
    type: [String],
    required: [true, 'Candidate must have at least one skill'],
    validate: [
      {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Candidate skills must not be empty'
      }
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Candidate experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  projectsBio: {
    type: String,
    required: [true, 'Candidate projects and bio are required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Setup indexes for search optimization
CandidateSchema.index({ skills: 1 });
CandidateSchema.index({ name: 'text', projectsBio: 'text' });

const Candidate = mongoose.model('Candidate', CandidateSchema);
export default Candidate;
