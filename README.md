<<<<<<< HEAD
# 🪞 Mirror — Social Perception App

> See yourself through your friends' eyes. Anonymously.

Mirror is a viral social app where users share a link, friends answer anonymous psychological/meme-worthy questions about them, and AI (Gemini) generates a beautiful social archetype dashboard.

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Recharts, html2canvas |
| Backend | Node.js, Express.js, MongoDB/Mongoose, JWT |
| AI | Google Gemini 1.5 Flash |
| Deployment | Vercel (frontend) + Render/Railway (backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
mirror/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # LandingPage, RegisterPage, LoginPage, DashboardPage, AnswerPage, ResultsPage
│       ├── components/ # Navbar, ParticleField, TraitBar, ShareCard, Skeleton
│       ├── context/    # AuthContext
│       ├── services/   # api.js (axios)
│       └── utils/      # fingerprint.js
│
└── server/          # Express backend
    ├── controllers/ # auth, users, questions, responses, reports, share
    ├── models/      # User, Response, Report
    ├── routes/      # All API routes
    ├── services/    # geminiService.js, questionEngine.js
    ├── utils/       # parseGeminiResponse.js
    └── middleware/  # auth.js
```

---

## ⚙️ Local Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd mirror
npm run install:all
```

### 2. Backend environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://...your Atlas URI...
JWT_SECRET=any_random_long_string_here
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend environment

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

### 4. Run dev servers

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:client
```

App: http://localhost:5173  
API: http://localhost:5000

---

## 🔑 Getting Your API Keys

### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `server/.env` as `GEMINI_API_KEY`

### MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Add to `server/.env` as `MONGODB_URI`

---

## 🌐 Deployment

### Backend → Render.com

1. Push your code to GitHub
2. Create a new **Web Service** on Render
3. Set Root Directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `server/.env`

### Frontend → Vercel

1. Import repo on https://vercel.com
2. Set Root Directory to `client`
3. Framework: **Vite**
4. Add environment variables:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
   - `VITE_APP_URL` = `https://your-vercel-url.vercel.app`

---

## 🗺️ API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/share/:shareCode` | Get user by share code |
| GET | `/api/questions/generate` | Get fresh question set |
| POST | `/api/responses/:shareCode` | Submit friend responses |
| GET | `/api/reports/:shareCode` | Get AI-generated report |
| GET | `/api/share-card/:shareCode` | Get share card data |

---

## 🎭 App Flow

1. **Landing Page** → Users see the concept
2. **Register** → Create profile + pick vibe tags
3. **Dashboard** → Get shareable link
4. **Friend opens link** (`/u/:shareCode`) → Answers 9 questions anonymously
5. **Results** (`/results/:shareCode`) → See AI archetype dashboard
6. **Share card** → Download/share to social media

---

## 🤖 Gemini Integration

The AI analyzes all anonymous responses and returns:
- **Archetype** (e.g., "Chaos Philosopher")
- **Summary** — witty 2-3 sentence breakdown
- **Consensus** — percentage-style social observations
- **Trait scores** — chaos, trust, humor, mystery, intelligence, emotional unpredictability
- **Quotes** — anonymous-style short quotes
- **Share card text** — one viral-ready line

Fallback data is provided if AI fails — server never crashes.

---

## 🔒 Security Features

- Rate limiting (100 req/15min global, 5/hr on responses)
- JWT authentication
- Anonymous fingerprinting to prevent duplicate responses
- Input sanitization & length limits
- Helmet.js headers
- CORS configured per environment

---

## 📱 Share Card

The `ShareCard` component is designed for:
- Instagram stories (portrait format)
- WhatsApp sharing
- Twitter/X posts

Uses `html2canvas` for pixel-perfect screenshot generation.

---

## 🧩 Vibe Tags Available

> chaotic good, overthinking, main character, quiet menace, emotionally unavailable, surprisingly wholesome, chronically online, dangerous advice, midnight philosopher, accidentally iconic

---

Built with chaos, trust, and mystery. 🪞
=======
# mirror
>>>>>>> aeed22dfb568b10d676efc8a5e4399b9431503d6
