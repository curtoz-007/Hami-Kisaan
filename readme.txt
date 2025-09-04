```markdown
# 🌾 Hami-Kisaan — AI-Powered Farming Assistant

**Hami-Kisaan** is a full-stack AI-powered agricultural platform designed to help farmers make smarter decisions.  
It integrates **crop recommendations, plant disease detection, weather alerts, map-based disease tracking**, and a **marketplace for farmers** to buy and sell crops.

> ⚠️ **Note:** This project was developed by ** Immense Raj Subedi , Shital Gautam and  Ananta Pokhrel, ** for a hackathon.  
> Any reproduction or deployment of the application is **only allowed with explicit permission**. Refer to the licensing section below.

---

## 🌟 Core Features

1️⃣ **AI Crop Recommendations**  
- Suggests optimal crops based on location, soil type, season, weather, and temperature.  
- Helps farmers maximize yield and reduce crop failure.  

2️⃣ **Plant Disease Detection**  
- Upload crop images for AI-based detection of diseases or pests.  
- Provides detailed disease info, potential harms, and organic solutions.  
- Automatic map alerts: infected areas flagged in red on a live map.  

3️⃣ **Weather Forecasts & Alerts**  
- Real-time and future weather predictions.  
- Extreme weather alerts for better planning of irrigation and crop protection.  

4️⃣ **Map-Based Alerts**  
- Visualize crop disease outbreaks on an interactive map.  
- Helps farmers take preventive measures before diseases spread.  

5️⃣ **Crop Information**  
- Detailed guidance on crop growth, soil requirements, fertilizer, irrigation, and harvesting tips.  

6️⃣ **Marketplace**  
- Farmers can list crops via typing or AI-assisted form filling.  
- Buyers can search and purchase crops directly.  
- Encourages fair pricing and better market access.  

7️⃣ **Dashboard**  
- Central hub displaying weather, crop recommendations, disease alerts, and notifications.  

8️⃣ **Tutorial Section**  
- Step-by-step videos and guides for modern farming techniques.  
- Covers planting, irrigation, pest control, and harvesting.  

9️⃣ **Notifications**  
- Updates about fields, government policies, weather warnings, and reminders.  

---

## ⚙️ Backend Setup (FastAPI + Supabase)

1️⃣ **Create & activate virtual environment**
```bash
cd be
python -m venv .venv
. .venv\Scripts\activate
```

2️⃣ **Install dependencies**

```bash
pip install -r requirements.txt
```

3️⃣ **Set environment variables (PowerShell example)**

```powershell
$env:SUPABASE_URL = "<your-supabase-url>"
$env:SUPABASE_SERVICE_ROLE = "<your-supabase-service-role-key>"
$env:weather_api_key = "<your-weatherapi.com-key>"
```

4️⃣ **Run the backend API**

```bash
uvicorn app:app --reload
```

🌐 Base URL: `http://127.0.0.1:8000`

📌 **Key Endpoints**

| Endpoint                       | Method | Description                                       |
| ------------------------------ | ------ | ------------------------------------------------- |
| `/`                            | GET    | Health check                                      |
| `/Crop_recommendation`         | GET    | Query: lat, lon                                   |
| `/Crop_info`                   | GET    | Query: name                                       |
| `/disease_detection/`          | POST   | Form: image; Query: lat, lon                      |
| `/disease_detection_detailed/` | POST   | JSON: { "disease\_name": "string" }               |
| `/weatherforecast`             | POST   | JSON: { "latitude": number, "longitude": number } |
| `/dashboard/data/`             | GET    | Query: latitude, longitude                        |
| `/transcribe`                  | POST   | Audio transcription for marketplace or navigation |
| `/transcribe/Findpage`         | POST   | AI-based navigation to site pages                 |

💡 **Note:** Update checkpoint path in `be/Diseasedetect.py` if different.

---

## 💻 Frontend Setup (Vite + React)

1️⃣ **Install dependencies**

```bash
cd fe
npm install
```

2️⃣ **Configure backend base URL**

```text
Create .env in fe/:
VITE_BE_BASE_URL=http://127.0.0.1:8000
```

3️⃣ **Run development server**

```bash
npm run dev
```

🌐 Frontend URL: `http://localhost:5173`

---

## 🔗 Frontend → Backend Wiring

| Component                  | API Calls / Usage                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **DiseaseDetection.jsx**   | POST `{VITE_BE_BASE_URL}/disease_detection?lat=..&lon=..`, POST `{VITE_BE_BASE_URL}/disease_detection_detailed/` |
| **Recommend.jsx**          | GET `{VITE_BE_BASE_URL}/Crop_recommendation?lat=..&lon=..`, GET `{VITE_BE_BASE_URL}/Crop_info?name=..`           |
| **WeatherAlerts.jsx**      | POST `{VITE_BE_BASE_URL}/weatherforecast`                                                                        |
| **Marketplace.jsx**        | POST `/transcribe` → AI-assisted crop listing, manual form also available                                        |
| **Dashboard & Map Alerts** | GET `/dashboard/data` → temperature, rainfall, soil pH, altitude; red flags for detected diseases                |

---

## 🛠️ Technology Stack

* **Backend:** FastAPI, Python, Whisper AI, Supabase (DB)
* **Frontend:** React, Vite
* **Database:** Supabase (PostgreSQL)
* **AI Models:** Faster Whisper for audio transcription, custom ML models for disease detection
* **Deployment:** Local dev-ready, cloud-ready (FastAPI compatible)

---

## 📦 Usage Notes

* Ensure Supabase keys are correctly configured.
* Disease map alerts require latitude and longitude.
* Marketplace supports both manual and AI-assisted crop listings.
* All AI outputs are processed into clean JSON for frontend integration.

---

## 📜 Licensing & Permissions

* This project is developed by **Shital Gautam, Ananta Pokhrel, and Immense Raj Subedi** for a hackathon.
* Any reproduction, redistribution, or commercial deployment of the app is **strictly prohibited** without explicit written permission.
* For inquiries regarding use or collaboration, contact the developers.

---

## 🌱 Hami-Kisaan ensures smarter farming, better yields, and fairer markets for farmers!

© 2025 Immense Raj Subedi, Shital Gautam, Ananta Pokhrel. All rights reserved.

```