Hami-Kisaan
============

Full-stack app providing AI-powered crop recommendations, plant disease detection, and weather alerts.

How to Run (Backend)
--------------------

1) Create and activate a virtual environment
   cd be
   python -m venv .venv
   . .venv\Scripts\activate

2) Install dependencies
   pip install -r requirements.txt

3) Environment variables (PowerShell example)
   $env:SUPABASE_URL = "<your-supabase-url>"
   $env:SUPABASE_SERVICE_ROLE = "<your-supabase-service-role-key>"
   $env:weather_api_key = "<your-weatherapi.com-key>"

4) Run the API
   uvicorn app:app --reload
   API base URL: http://127.0.0.1:8000

Available endpoints
-------------------
- GET    /                       Health check
- GET    /Crop_recommendation    Query: lat, lon
- GET    /Crop_info              Query: name
- POST   /disease_detection      Form: image; Query: lat, lon
- POST   /disease_detection_detailed/   JSON: { "disease_name": "string" }
- POST   /weatherforecast        JSON: { "latitude": number, "longitude": number }
- GET    /dashboard/data/        Query: latitude, longitude

Note: Update checkpoint path in be/Diseasedetect.py if different.

How to Run (Frontend)
---------------------

1) Install dependencies
   cd fe
   npm install

2) Configure backend base URL
   Create fe/.env with:
   VITE_BE_BASE_URL=http://127.0.0.1:8000

3) Run the dev server
   npm run dev
   App runs on the Vite URL (e.g., http://localhost:5173)

Frontend → Backend wiring
-------------------------
- DiseaseDetection.jsx uses:
  POST {VITE_BE_BASE_URL}/disease_detection?lat=..&lon=.. (image upload)
  POST {VITE_BE_BASE_URL}/disease_detection_detailed/ (JSON disease_name)
- Recommend.jsx uses:
  GET {VITE_BE_BASE_URL}/Crop_recommendation?lat=..&lon=..
  GET {VITE_BE_BASE_URL}/Crop_info?name=..
- WeatherAlerts.jsx uses:
  POST {VITE_BE_BASE_URL}/weatherforecast

Also see fe/src/api/beEndpoints.json where base_url is set to http://127.0.0.1:8000.

