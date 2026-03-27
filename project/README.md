# RoadSync - Smart City Transportation Platform

> **"Navigate Smart, Stay Safe, Go Green."**

RoadSync is a smart city transportation and urban mobility web application built for the **AI/ML track** by **Team Snyft_5**. It combines intelligent routing, smart parking, AI-powered emission tracking, community safety reporting, a chatbot, and gamification into a single platform targeting **UN SDG 11** (Sustainable Cities) and **SDG 13** (Climate Action).

**Team Members:** Yoshita Singhal, Mohd Fawah Khan, Tarushi Agarwal, Sadhna Kumari, Nitesh Mishra

> **Building this project?** Read the full step-by-step implementation guide:
> **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**
> It covers folder structure, database models, authentication, API design, Gemini AI
> integration, frontend wiring, deployment, and common mistakes to avoid.

---

## Problem Statement (from PPT)

India's roads face multiple crises:
- **On-road threats** - Road accidents from overspeeding, wrong-side driving, phone use
- **Air pollution** - Road passenger transport accounts for 45.1% of travel emissions
- **Absent parking lots** - No organized parking management
- **Stagnant traffic** - Congestion during peak hours
- **Late reporting** - Delayed crime/emergency reporting

---

## Solution Architecture (from PPT)

```
                            RoadSync
                               |
            +------------------+------------------+
            |                  |                  |
    Traffic Management    Risk Management    Air Pollution Tracker
            |                  |                  |
    +-------+-------+    +----+----+         AI-powered predictive
    |       |       |    |         |         analytics of vehicle
  Smart   Speed  Adaptive Report  Nearby    carbon emissions
  Parking Limits  Nav    Crimes   Public         |
          Alerts System          Services     Gamify
                    |       |                 /    \
                    +--ChatBot--+          Badges  Points
```

---

## Project Status

### What's DONE (Frontend UI)

| Area | Status | Notes |
|------|--------|-------|
| Landing Page | Done | Hero section, CTAs |
| Auth UI (Login/Signup) | Done | Forms built, but mock auth only |
| Dashboard | Done | Emission chart (hardcoded), leaderboard |
| Smart Parking UI | Done | Location + time picker form |
| Route Planning | Done | Google Maps + directions + transport modes |
| CO2 Emission Tracker UI | Done | 3-step form with results display |
| Crime Reporting UI | Done | Form with file upload placeholder |
| Utilities Finder | Done | Map + quick buttons for nearby services |
| User Profile UI | Done | Gems, badges, achievements display |
| About Page | Done | Feature cards, mission, contact |
| Protected Routes | Done | Redirects to /auth if not logged in |
| Sidebar + Header + Footer | Done | Shared layout for all app pages |

### What's NOT DONE

| Area | Status | PPT Requirement |
|------|--------|-----------------|
| Backend Server (Node.js/Express) | Not started | Required per tech stack |
| Database (Supabase + MongoDB) | Not started | Required per tech stack |
| Real Authentication | Not started | Mock only - no persistence |
| AI/ML ChatBot | Not started | 24/7 chatbot mentioned in PPT |
| AI-Powered CO2 Prediction | Not started | Currently just a static form |
| Smart Parking Backend | Not started | Real-time monitoring per PPT |
| Traffic Signal Tracking | Not started | Mentioned in PPT |
| Speed Limit Identification | Not started | Mentioned in PPT |
| Adaptive Navigation System | Not started | Mentioned in PPT |
| Gamification Backend | Not started | Points/badges logic not implemented |
| File Uploads (Crime Reports) | Not started | UI placeholder only |
| API Integration | Not started | All data is hardcoded |
| Deployment | Not started | - |

**Current state:** Frontend UI prototype with mock data. No backend, no database, no AI/ML, no real authentication. All form submissions log to console.

---

## Tech Stack

### Frontend (Implemented)
- **React 19** - UI framework
- **Vite 6** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first styling
- **React Router DOM 7** - Client-side routing
- **@react-google-maps/api** - Google Maps embed & directions
- **Recharts** - Charts and data visualization
- **Lucide React** - Icon library

### Backend (Planned - NOT built)
- **Node.js + Express.js** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT + bcrypt** - Authentication and password hashing

### AI/ML (Planned - NOT built)
- **ChatBot** - 24/7 AI assistant for traffic/navigation help
- **CO2 Emission Predictor** - AI-powered predictive analytics for vehicle carbon emissions
- **Smart Parking AI** - Real-time parking space detection and monitoring

### APIs
- **Google Maps API** - Routes, directions, traffic, nearby places (partially integrated)
- Google Maps features still needed: traffic signal tracking, speed limit alerts

---

## Project Structure

```
RoadSync/
└── RoadSync/
    └── project/
        ├── public/
        │   └── RoadSync.pdf            # Project presentation
        ├── src/
        │   ├── main.jsx               # App entry point (React DOM render)
        │   ├── App.jsx                 # Root component (Router + Layout)
        │   ├── index.css               # Tailwind CSS imports
        │   │
        │   ├── components/
        │   │   ├── Header.jsx          # Top bar - user greeting, gems/badges count
        │   │   ├── Sidebar.jsx         # Left nav menu - links to all pages
        │   │   ├── Footer.jsx          # Bottom bar - social links, quick nav
        │   │   └── ProtectedRoute.jsx  # Auth guard - redirects to /auth if not logged in
        │   │
        │   ├── contexts/
        │   │   └── AuthContext.jsx     # Auth state (mock) - signIn, signUp, signOut, user
        │   │
        │   ├── lib/                    # (Empty) Reserved for utility functions
        │   │
        │   └── pages/
        │       ├── Landing.jsx         # Hero page with CTAs (public)
        │       ├── Auth.jsx            # Login/Signup toggle form (public)
        │       ├── Dashboard.jsx       # User dashboard - emission chart, leaderboard
        │       ├── SmartParking.jsx    # Parking finder - location, time, booking
        │       ├── Routes.jsx          # Route planner - Google Maps + directions
        │       ├── TrackEmissions.jsx  # CO2 calculator - 3-step form with results
        │       ├── ReportCrime.jsx     # Crime/emergency report form
        │       ├── Utilities.jsx       # Nearby facilities finder (hospitals, etc.)
        │       ├── Profile.jsx         # User profile, achievements, settings
        │       └── About.jsx          # Feature cards, mission, contact info
        │
        ├── index.html                  # HTML shell
        ├── package.json                # Dependencies & scripts
        ├── vite.config.js              # Vite + Tailwind plugin config
        ├── tailwind.config.js          # Tailwind content paths
        ├── eslint.config.js            # Linting rules
        └── .env                        # Google Maps API key
```

---

## Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | Landing | Public | Hero section, signup/login CTAs |
| `/auth` | Auth | Public | Login & signup forms |
| `/dashboard` | Dashboard | Protected | Emission chart, leaderboard, stats |
| `/smart-parking` | SmartParking | Protected | Search & book parking spots |
| `/routes` | Routes | Protected | Plan routes with Google Maps |
| `/track-emissions` | TrackEmissions | Protected | 3-step CO2 emission calculator |
| `/report-crime` | ReportCrime | Protected | Report emergencies/crimes |
| `/utilities` | Utilities | Protected | Find hospitals, pharmacies, police, petrol |
| `/profile` | Profile | Protected | User stats, achievements, settings |
| `/about` | About | Protected | Features, mission, contact |

Protected routes redirect to `/auth` if the user is not logged in.

---

## Features Detail (Current State)

### 1. Authentication (Mock - needs real backend)
- Login/signup form with email & password
- `AuthContext` manages user state in memory
- `ProtectedRoute` component guards all app pages
- **No real auth** - sets user object on form submit, no validation, no persistence, no password hashing

### 2. Dashboard
- Line chart showing CO2 emission trends (2020-2024, hardcoded data)
- User leaderboard with gems & badge counts (hardcoded)
- Quick stats overview

### 3. Smart Parking (UI only - needs AI backend)
- Location search input
- Check-in / check-out time pickers
- "Book Parking" button (no backend action)
- **PPT promises:** Real-time monitoring, tracking available parking spaces

### 4. Route Planning (Partial - needs traffic/speed features)
- Google Maps embed with DirectionsService
- Transport mode selector: Car, Motorcycle, Bus, Walk, Bicycle
- Traffic layer toggle
- Start & end location inputs
- **PPT promises:** Traffic signal tracking, speed limit identification, adaptive navigation

### 5. CO2 Emission Tracker (UI only - needs AI/ML model)
- **Step 1:** Car details (company, model, engine type, cylinders)
- **Step 2:** Fuel & distance (fuel type, distance traveled, mileage)
- **Step 3:** Results (CO2 calculated, percentile ranking, gems earned)
- **PPT promises:** AI-powered predictive analytics for vehicle carbon emissions

### 6. Crime/Emergency Reporting (UI only - needs backend)
- Form fields: name, time, location, date, description
- File upload area (UI only, not functional)
- Submit button (logs to console)

### 7. Utilities Finder (Partial)
- Google Maps embed for nearby facility search
- Quick buttons: Hospitals, Pharmacies, Petrol Pumps, Police Stations
- Suggestion cards with ratings (hardcoded)

### 8. ChatBot (NOT BUILT)
- Mentioned in PPT as a core feature connecting Traffic Management and Risk Management
- Supposed to be a 24/7 AI chatbot
- **Chatbot subscription model** mentioned as a business/revenue plan
- No UI or backend exists for this

### 9. Gamification System (UI only - needs backend)
- Gems earned from eco-friendly actions
- Badges for milestones
- Leaderboard ranking
- **No actual tracking** - all values are hardcoded

---

## What Needs To Be Done

### Phase 1: Backend Setup
- [ ] Initialize Node.js + Express.js server project
- [ ] Set up MongoDB Atlas free cluster
- [ ] Configure CORS, environment variables, middleware
- [ ] Set up project folder structure (routes, controllers, models, middleware, services)

### Phase 2: Authentication (JWT + bcrypt)
- [ ] Implement real user registration with bcrypt password hashing
- [ ] Implement login with JWT token generation
- [ ] Add token storage on frontend (localStorage)
- [ ] Connect `AuthContext.jsx` to real API endpoints
- [ ] Persist login state across page refreshes
- [ ] Add token expiry handling

### Phase 3: Database Models & API Endpoints
- [ ] **Users** - Profile, gems, badges, vehicle info (MongoDB)
- [ ] **ParkingSpots** - GeoJSON location, availability, price, real-time status
- [ ] **ParkingBookings** - User, spot, check-in/out, status
- [ ] **EmissionRecords** - User, car details, fuel, distance, CO2 result, date
- [ ] **CrimeReports** - User, location, description, attachments, status
- [ ] **Achievements/Badges** - Definitions and user unlock tracking
- [ ] **GemsTransactions** - Log of all gems earned/spent
- [ ] **ChatMessages** - Chatbot conversation history (MongoDB)

### Phase 4: AI/ML Features
- [ ] **ChatBot** - Integrate an AI chatbot (e.g., OpenAI API, Gemini, or custom model) for 24/7 traffic/navigation assistance
- [ ] **CO2 Emission Predictor** - Build or integrate an ML model for predicting vehicle carbon emissions based on car specs + fuel + distance
- [ ] **Smart Parking AI** - Real-time parking availability detection system
- [ ] Add chatbot UI page/component on frontend
- [ ] Connect emission tracker form to the ML prediction API
- [ ] Add chatbot subscription tier logic (business model from PPT)

### Phase 5: Google Maps Advanced Features
- [ ] Traffic signal tracking and display on routes
- [ ] Speed limit identification and alerts during navigation
- [ ] Adaptive navigation system (re-routing based on traffic)
- [ ] Improve utilities finder with live Google Places API data

### Phase 6: Frontend-Backend Integration
- [ ] Replace all mock/hardcoded data with real API calls
- [ ] Add loading states, error handling, and toast notifications
- [ ] Implement real file upload for crime reports (Cloudinary)
- [ ] Connect dashboard charts to real user emission data
- [ ] Make gamification (gems/badges) functional with real backend tracking
- [ ] Add proper form validation with backend error messages

### Phase 7: Additional Features
- [ ] Admin panel for managing parking spots and reviewing crime reports
- [ ] Real-time parking availability updates (WebSocket or polling)
- [ ] Push notifications for bookings and safety alerts
- [ ] Mobile responsiveness improvements
- [ ] PWA support for offline access

### Phase 8: Deployment
- [ ] Deploy backend (Railway, Render, or AWS)
- [ ] Deploy frontend (Vercel or Netlify)
- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure custom domain and SSL
- [ ] Set up CI/CD pipeline
- [ ] Monitoring and error logging

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Maps API key

### Installation
```bash
cd RoadSync/RoadSync/project
npm install
```

### Running Development Server
```bash
npm run dev
```
The app starts at `http://localhost:5173` by default.

### Building for Production
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file in the `project/` directory:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## Layout Architecture

```
Landing Page (/)          Auth Page (/auth)
     |                         |
     +--------> Login --------->+
                                |
                          ProtectedRoute
                                |
                    +-----------+-----------+
                    |                       |
                Sidebar              Main Content Area
              (fixed left)          (ml-64 offset)
                    |                  |         |
                Nav Links           Header    Footer
                                      |
                              Page Components
                        (Dashboard, Parking, etc.)
```

All authenticated pages share the Sidebar + Header + Footer layout. The sidebar is fixed at 256px width on the left, and the main content area fills the remaining space.

---

## SDGs Targeted

- **SDG 11 - Sustainable Cities & Communities:** Reducing congestion, improving road safety, building safer and more efficient communities
- **SDG 13 - Climate Action:** Reducing environmental impact of transportation, carbon emission tracking to lower carbon footprint

## Impact Goals (from PPT)

- Decrease average travel time by 20-30% during peak hours
- Increase parking space utilization by 50%
- Lower PM 2.5 and PM 10 levels by 15-20% over two years
- Decrease traffic violations by 40%
- Expand to multiple cities for real-time traffic and emission tracking
- Centralized platform for pollution, traffic, and crime data analysis
