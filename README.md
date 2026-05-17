# ShortlistAI - AI Powered Candidate Shortlisting Suite

ShortlistAI is a premium MERN stack application built for modern recruiters and talent sourcers. It integrates a fast, local mathematical skill-overlap algorithm and experience filter with the deep cognitive reasoning of OpenAI models (via OpenRouter) to evaluate, categorize, and rank developer resumes against specific job descriptions. 

Additionally, recruiters can consult an interactive **AI Recruiter Assistant** chatbot to design coding tests, construct screening interview checklists, or analyze candidate profiles.

---

## 🌟 Primary Features

1. **Candidate Profile Database**: Full-text candidate browser enabling search (by name/project biography summaries) and active comma-separated skill queries.
2. **Dynamic Mathematical Shortlisting**: Calculates exact case-insensitive skill alignments ($matchedSkills / requiredSkills$) and filters candidates based on minimum experience constraints.
3. **OpenRouter AI Ranking**: Generates deep comparative reviews and ranked standouts with qualitative rationales using `openai/gpt-5.2` (with automatic fallback setups).
4. **Interactive Recruiter Chatbot**: Persistent multi-turn screening companion pre-loaded with clickable quick recruiting chips.
5. **Shortlist Archiving (Saved Runs)**: Persists shortlisting reports directly into MongoDB, grouping candidates by scores and retaining AI explanations.
6. **Data-Visualizer Matrix**: Integrates responsive Recharts Bar Graphs displaying candidate technical overlaps side-by-side.

---

## 📂 Project Architecture

```text
c:\Users\Lenovo\OneDrive\Desktop\ABCD\
 ├── backend/
 │    ├── controllers/        # Express handlers (candidates, matches, AI)
 │    ├── models/             # Mongoose schemas (Candidate, Shortlist)
 │    ├── routes/             # REST route mapping (candidate, match, AI)
 │    ├── utils/              # OpenRouter API native fetch client
 │    ├── server.js           # Database mount & application startup
 │    ├── seed.js             # 5-Candidate Database Seeder
 │    └── .env / .env.example # Configurations
 │
 └── frontend/
      ├── src/
      │    ├── components/    # Reusable UI (Navbar sidebar layout)
      │    ├── pages/         # View screens (AddProfile, Candidates, JobForm, Chatbot, SavedRuns)
      │    ├── App.jsx        # Routing context
      │    ├── main.jsx       # Mounting target
      │    └── index.css      # Custom scrollbars & glassmorphic aesthetics
      │
      ├── tailwind.config.js  # Styling contents configuration
      └── vite.config.js      # Vite compilation configurations
```

---

## ⚡ Setup & Startup Guide

### Prerequisites
- **Node.js** (v18 or higher is recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster connection URI)

---

### Step 1: Configure Backend Service

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment configuration template to create your `.env` file:
   ```bash
   copy .env.example .env
   ```

3. Open `.env` and fill in your variables:
   - **`MONGO_URI`**: Plug in your MongoDB Atlas URL or keep `mongodb://127.0.0.1:27017/shortlisting_db` for a local server.
   - **`OPENROUTER_API_KEY`**: Acquire a token from [OpenRouter](https://openrouter.ai/keys) and paste it here.
   
   > [!NOTE]
   > **Mock AI Demo Mode:** If you do not have an OpenRouter API key yet, you can leave it as `your_key`! The server will detect this and automatically engage a **Mock AI Simulation Mode**, generating incredibly realistic candidate analyses and chat bubble answers so you can demo the suite immediately without an active billing key!

4. Seed the database with the 5 pre-configured professional developer candidate profiles:
   ```bash
   npm run seed
   ```

5. Launch the Node/Express backend in development mode:
   ```bash
   npm run dev
   ```
   *The server will boot up successfully on port `5000`.*

---

### Step 2: Configure React Frontend

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
   *Vite will compile files and spin up a hot-reload host at `http://localhost:5173` (or similar).*

3. Open your browser and navigate to the address listed in the terminal to experience **ShortlistAI**!

---

## 🛠️ Tech Stack Specs

- **Database**: MongoDB (Mongoose schemas)
- **Backend API**: Node.js & Express.js (ES Module specifications)
- **AI Integrator**: OpenRouter API (`openai/gpt-5.2` with fail-safes and fallback models)
- **Frontend App**: React.js (compiled via Vite)
- **Design Sheets**: Tailwind CSS v3 (custom glassmorphic layouts, Inter/Outfit fonts, micro-animations)
- **Data Graphs**: Recharts Vector Charting Components
- **HTTP Client**: Axios (configured with modern backend endpoint mounts)
