# 🤖 CareFlow AI Engine — Setup Guide
## Your Role: AI / Smart Logic Engineer

---

## 📁 Project Structure

```
careflow-ai/
├── src/
│   ├── index.js                          ← Entry point (starts the server)
│   ├── routes/
│   │   ├── emergency.js                  ← Emergency routing API
│   │   ├── priority.js                   ← Priority scoring API
│   │   ├── drugConflict.js               ← Drug conflict detection API
│   │   └── health.js                     ← Health check
│   ├── services/
│   │   ├── emergencyRoutingService.js    ← 🧠 Core routing algorithm
│   │   ├── priorityService.js            ← 🧠 Priority scoring logic
│   │   ├── drugConflictService.js        ← 🧠 Drug interaction database
│   │   └── mapsService.js               ← 🗺️ Google Maps integration
│   └── test/
│       └── testAll.js                    ← Test runner (no server needed)
├── .env.example                          ← Copy this to .env
├── package.json
└── README.md
```

---

## 🚀 STEP-BY-STEP SETUP

### Step 1 — Install Node.js
Download from: https://nodejs.org/en/download
- Choose the LTS version (20.x or 22.x)
- After install, verify:
```bash
node --version   # should show v20.x or higher
npm --version    # should show 10.x or higher
```

### Step 2 — Install project dependencies
```bash
cd careflow-ai
npm install
```

### Step 3 — Setup environment variables
```bash
# Copy the example file
cp .env.example .env

# Open .env and edit it:
# - Add your Google Maps API Key (or leave as-is to use Haversine fallback)
# - Set the backend URL (your backend engineer's server)
```

### Step 4 — Get a Google Maps API Key (for real routing)
1. Go to: https://console.cloud.google.com
2. Create a new project: "CareFlow"
3. Enable these APIs:
   - Distance Matrix API
   - Maps JavaScript API
   - Directions API
4. Go to Credentials → Create API Key
5. Copy the key into your `.env` file as `GOOGLE_MAPS_API_KEY`

> ⚠️ Without the API key, the system uses Haversine (straight-line distance).
> It will still work for the hackathon — routing is still intelligent.

### Step 5 — Run tests (no server needed)
```bash
npm test
```
This runs all 3 AI modules and prints results to console.

### Step 6 — Start the server
```bash
npm run dev    # development mode with auto-restart
# or
npm start      # production mode
```

Server runs at: http://localhost:5000

---

## 🔗 API Endpoints

### Emergency Routing
```
POST http://localhost:5000/api/ai/emergency/route
POST http://localhost:5000/api/ai/emergency/maps-link
GET  http://localhost:5000/api/ai/emergency/test    ← Quick demo
```

### Priority Scoring
```
POST http://localhost:5000/api/ai/priority/score
POST http://localhost:5000/api/ai/priority/batch    ← Sort entire queue
GET  http://localhost:5000/api/ai/priority/test     ← Quick demo
```

### Drug Conflict Detection
```
POST http://localhost:5000/api/ai/drugs/check
GET  http://localhost:5000/api/ai/drugs/test        ← Quick demo
```

### Health Check
```
GET  http://localhost:5000/api/ai/health
```

---

## 📡 Example API Calls (test with curl or Postman)

### Emergency Routing
```bash
curl -X POST http://localhost:5000/api/ai/emergency/route \
  -H "Content-Type: application/json" \
  -d '{
    "patientLocation": { "lat": 11.9139, "lng": 79.8145 },
    "condition": "cardiac_arrest",
    "hospitals": [
      {
        "id": "h1",
        "name": "JIPMER",
        "lat": 11.9344, "lng": 79.8096,
        "icuAvailable": 8,
        "totalBeds": 200, "occupiedBeds": 140,
        "specialties": ["emergency", "cardiology"]
      }
    ]
  }'
```

### Drug Conflict Check
```bash
curl -X POST http://localhost:5000/api/ai/drugs/check \
  -H "Content-Type: application/json" \
  -d '{
    "newMedications": ["Warfarin"],
    "existingMedications": ["Aspirin"]
  }'
```

### Priority Score
```bash
curl -X POST http://localhost:5000/api/ai/priority/score \
  -H "Content-Type: application/json" \
  -d '{
    "condition": "cardiac_arrest",
    "conditionType": "emergency",
    "isEmergency": true,
    "age": 65,
    "vitalSigns": {
      "heartRate": 140,
      "oxygenSat": 86
    }
  }'
```

---

## 🔌 How Frontend & Backend Connect to Your AI Engine

### Patient App (Frontend) — Emergency Button Flow:
```
1. Patient presses Emergency Button
2. Browser gets GPS: navigator.geolocation.getCurrentPosition()
3. Frontend sends to Backend: { lat, lng, condition }
4. Backend fetches hospital list from DB
5. Backend calls YOUR AI:
   POST http://localhost:5000/api/ai/emergency/route
6. AI returns: { bestHospital, mapsLink, allRanked }
7. Frontend shows: "Connecting to JIPMER..." + opens Google Maps link
```

### Hospital Dashboard — Drug Conflict:
```
1. Doctor adds new prescription in dashboard
2. Dashboard frontend sends to backend
3. Backend calls YOUR AI:
   POST http://localhost:5000/api/ai/drugs/check
4. AI returns: { safe: false, conflicts: [...] }
5. Dashboard shows: "⚠️ CONFLICT: Warfarin + Aspirin"
```

### Google Maps Navigation Link:
```
The mapsLink returned looks like:
https://www.google.com/maps/dir/?api=1&origin=11.9139,79.8145&destination=11.9344,79.8096&travelmode=driving

When patient clicks this → opens Google Maps with turn-by-turn navigation
Works on both Android and iOS
```

---

## 🏆 Demo Flow (for judges)

1. Open http://localhost:5000/api/ai/emergency/test → shows best hospital with Maps link
2. Open http://localhost:5000/api/ai/priority/test  → shows triage queue
3. Open http://localhost:5000/api/ai/drugs/test     → shows conflict detection
4. Open http://localhost:5000/api/ai/health         → shows system status

---

## ⚡ Port Configuration

| Service          | Port  |
|------------------|-------|
| AI Engine        | 5000  |
| Backend (target) | 4000  |
| Patient App      | 3000  |
| Hospital Dashboard | 3001 |

Share http://localhost:5000 with your team as the AI base URL.
