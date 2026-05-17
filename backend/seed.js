import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Candidate from './models/Candidate.js';

dotenv.config();

const sampleCandidates = [
  {
    name: "Sarah Jenkins",
    email: "sarah.j@innovatetech.io",
    skills: ["React", "Node.js", "Express", "MongoDB", "Redux", "TypeScript", "Tailwind CSS"],
    experience: 6,
    projectsBio: "Principal engineer for a digital asset exchange platform serving 3M+ active profiles. Optimized complex Mongoose pipelines and indexed MongoDB, scaling data throughput by 42%. Built custom React dashboard designs utilizing glassmorphism tiles."
  },
  {
    name: "David Chen",
    email: "dchen@codestack.com",
    skills: ["React", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Figma"],
    experience: 3.5,
    projectsBio: "Creative frontend programmer specialized in high-performance Webpack setups and fluid responsive dashboards. Crafted multiple open-source CSS styling libraries and maintains premium UI design templates."
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@cloudscale.net",
    skills: ["Node.js", "Express", "MongoDB", "Docker", "AWS", "Redis", "GraphQL"],
    experience: 5,
    projectsBio: "Core infrastructure developer centered on low-latency microservices. Architected backend pipelines using Express and Node clusters, containerized workloads via Docker, and set up Redis layers for memory caches."
  },
  {
    name: "Amit Patel",
    email: "amit.patel@dataflow.org",
    skills: ["Python", "FastAPI", "React", "PostgreSQL", "Tailwind CSS"],
    experience: 4,
    projectsBio: "Full stack developer holding rich experience in FastAPI data ingestion routines. Integrated relational database streams into elegant responsive web pages, providing real-time data flow graphs to clients."
  },
  {
    name: "Liam O'Connor",
    email: "liam.oc@devacademy.com",
    skills: ["React", "JavaScript", "CSS"],
    experience: 1.5,
    projectsBio: "Enthusiastic junior frontend dev focused on accessible HTML/CSS guidelines and building clean React reusable components. Energetic contributor to modular component repositories."
  }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shortlisting_db';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('🔌 Connected to MongoDB for seeding sample candidates...');
    
    // Wipe current candidates
    await Candidate.deleteMany({});
    console.log('🧹 Cleared existing candidate logs.');
    
    // Seed candidate listings
    await Candidate.insertMany(sampleCandidates);
    console.log('🎉 Seeded 5 professional candidate profiles into Shortlisting DB!');
    
    mongoose.connection.close();
    console.log('🔌 DB connection closed gracefully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Seeder script failed:', error.message);
    process.exit(1);
  });
