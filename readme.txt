# 🌾 Hami-Kisaan — AI-Powered Farming Assistant

Hami-Kisaan is a full-stack AI-powered agricultural platform that helps farmers make smarter decisions.

It integrates crop recommendations, plant disease detection, weather alerts, map-based disease tracking, and a marketplace for farmers to buy and sell crops.

> ⚠️ Note: This project was developed by Immense Raj Subedi, Shital Gautam, and Ananta Pokhrel for a hackathon. Any reproduction or deployment is only allowed with explicit permission. See Licensing.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [Screenshots](#-screenshots)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Backend Setup (FastAPI + Supabase)](#%EF%B8%8F-backend-setup-fastapi--supabase)
- [Frontend Setup (Vite + React)](#-frontend-setup-vite--react)
- [API Endpoints](#-api-endpoints)
- [Frontend → Backend Wiring](#-frontend--backend-wiring)
- [Usage Notes](#-usage-notes)
- [Licensing & Permissions](#-licensing--permissions)

---

## 🌟 Core Features

- **AI Crop Recommendations**
  - Suggests optimal crops based on location, soil type, season, weather, and temperature
  - Helps maximize yield and reduce crop failure
- **Plant Disease Detection**
  - Upload crop images for AI-based disease or pest detection
  - Detailed disease info, potential harms, and organic solutions
  - Automatic map alerts flag infected areas in red
- **Weather Forecasts & Alerts**
  - Real-time and future weather predictions
  - Extreme weather alerts for better planning
- **Map-Based Alerts**
  - Visualize disease outbreaks on an interactive map to take preventive measures
- **Crop Information**
  - Growth guidance, soil requirements, fertilizers, irrigation, and harvesting tips
- **Marketplace**
  - List crops via typing or AI-assisted form filling; buyers can search and purchase
- **Dashboard**
  - Central hub for weather, recommendations, disease alerts, and notifications
- **Tutorials**
  - Step-by-step guides for modern farming techniques

---

## 🖼️ Screenshots

![Crop Recommendation](Workflowdig/CropRecommendation.jpg)

![Disease Detection](Workflowdig/Disease_Detection.jpg)

![Weather Alerts](Workflowdig/Weatheralert.jpg)

![Voice-powered Listing](Workflowdig/Voicepoweredlisting.jpg)

---

## 🛠️ Technology Stack

- **Backend:** FastAPI, Python, Whisper AI, Supabase (PostgreSQL)
- **Frontend:** React, Vite
- **AI Models:** Faster Whisper for audio transcription, custom ML models for disease detection
- **Deployment:** Local dev-ready, cloud-ready (FastAPI compatible)

---

## ⚙️ Backend Setup (FastAPI + Supabase)

1. Create & activate virtual environment

```bash
cd be
python -m venv .venv
. .venv\Scripts\activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Set environment variables (PowerShell example)

```powershell
$env:SUPABASE_URL = "<your-supabase-url>"
$env:SUPABASE_SERVICE_ROLE = "<your-supabase-service-role-key>"
$env:weather_api_key = "<your-weatherapi.com-key>"
```

4. Run the backend API

```bash
uvicorn app:app --reload
```

Base URL: `http://127.0.0.1:8000`

> Tip: Update checkpoint path in `be/Diseasedetect.py` if different.

---

## 💻 Frontend Setup (Vite + React)

1. Install dependencies

```bash
cd fe
npm install
```

2. Configure backend base URL

Create `.env` in `fe/` with:

```env
VITE_BE_BASE_URL=http://127.0.0.1:8000
```

3. Run development server

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

---

## 📌 API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/` | GET | Health check |
| `/Crop_recommendation` | GET | Query: `lat`, `lon` |
| `/Crop_info` | GET | Query: `name` |
| `/disease_detection/` | POST | Form: `image`; Query: `lat`, `lon` |
| `/disease_detection_detailed/` | POST | JSON: `{ "disease_name": "string" }` |
| `/weatherforecast` | POST | JSON: `{ "latitude": number, "longitude": number }` |
| `/dashboard/data/` | GET | Query: `latitude`, `longitude` |
| `/transcribe` | POST | Audio transcription for marketplace or navigation |
| `/transcribe/Findpage` | POST | AI-based navigation to site pages |

---

## 🔗 Frontend → Backend Wiring

| Component | API Calls / Usage |
| --- | --- |
| `pages/DiseaseDetection.jsx` | POST ``${VITE_BE_BASE_URL}/disease_detection?lat=..&lon=..``; POST ``${VITE_BE_BASE_URL}/disease_detection_detailed/`` |
| `pages/Recommend.jsx` | GET ``${VITE_BE_BASE_URL}/Crop_recommendation?lat=..&lon=..``; GET ``${VITE_BE_BASE_URL}/Crop_info?name=..`` |
| `pages/WeatherAlerts.jsx` | POST ``${VITE_BE_BASE_URL}/weatherforecast`` |
| `pages/Dashboard.jsx` and `pages/MapAlerts.jsx` | GET `/dashboard/data` → temperature, rainfall, soil pH, altitude; red flags for detected diseases |
| `components/VoiceRecorder.jsx` | POST `/transcribe` → AI-assisted crop listing |

---

## 📦 Usage Notes

- Ensure Supabase keys are correctly configured
- Disease map alerts require latitude and longitude
- Marketplace supports both manual and AI-assisted crop listings
- All AI outputs are processed into clean JSON for frontend integration

---

## 📜 Licensing & Permissions

- Developed by Shital Gautam, Ananta Pokhrel, and Immense Raj Subedi for a hackathon
- Any reproduction, redistribution, or commercial deployment is strictly prohibited without explicit written permission
- For inquiries regarding use or collaboration, contact the developers

---

© 2025 Immense Raj Subedi, Shital Gautam, Ananta Pokhrel. All rights reserved.