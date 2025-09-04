<h1 align="center">🌾 Hami‑Kisaan</h1>
<p align="center"><b>AI‑Powered Farming Assistant</b></p>
<p align="center" style="max-width:600px; line-height:1.5;">
  Empowering farmers with AI — crop recommendations, disease detection, weather alerts, and a smart marketplace.
</p>

<p align="center">
  <img alt="Backend FastAPI" src="https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi&logoColor=white">
  <img alt="Frontend React" src="https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black">
  <img alt="Database Supabase" src="https://img.shields.io/badge/database-Supabase-3ECF8E?logo=supabase&logoColor=white">
  <img alt="License Restricted" src="https://img.shields.io/badge/license-Restricted-red">
</p>

<p align="center">
  <i>Developed by Immense Raj Subedi, Shital Gautam, and Ananta Pokhrel for a hackathon.</i><br/>
  <sub>Reproduction or deployment only with explicit permission. See Licensing.</sub>
</p>

---

<h2 style="color:#009688;">📑 Table of Contents</h2>
<ul>
  <li><a href="#🌟-core-features">Core Features</a></li>
  <li><a href="#📊-feature-overview">Feature Overview</a></li>
  <li><a href="#🖼️-screenshots">Screenshots</a></li>
  <li><a href="#🛠️-technology-stack">Technology Stack</a></li>
  <li><a href="#🧭-project-structure">Project Structure</a></li>
  <li><a href="#⚙️-backend-setup-fastapi--supabase">Backend Setup</a></li>
  <li><a href="#💻-frontend-setup-vite--react">Frontend Setup</a></li>
  <li><a href="#⚡-quick-start-commands">Quick Start</a></li>
  <li><a href="#📌-api-endpoints">API Endpoints</a></li>
  <li><a href="#🔗-frontend-→-backend-wiring">Frontend → Backend Wiring</a></li>
  <li><a href="#📦-usage-notes">Usage Notes</a></li>
  <li><a href="#📜-licensing--permissions">Licensing & Permissions</a></li>
</ul>

---

<h2 style="color:#009688;">🌟 Core Features</h2>
<div style="background:#f0f8ff; padding:15px; border-radius:10px;">
<ul>
<li><b>AI Crop Recommendations</b>
  <ul>
    <li>Optimal crops based on location, soil, season, weather, temperature</li>
    <li>Maximize yield and reduce crop failure</li>
  </ul>
</li>
<li><b>Plant Disease Detection</b>
  <ul>
    <li>Upload crop images for AI diagnosis</li>
    <li>Get disease info, harms, and organic solutions</li>
    <li>Map alerts flag infected areas in red</li>
  </ul>
</li>
<li><b>Weather Forecasts & Alerts</b>
  <ul>
    <li>Real-time & future predictions</li>
    <li>Extreme weather alerts</li>
  </ul>
</li>
<li><b>Map-Based Alerts</b>
  <ul>
    <li>Interactive outbreak visualization</li>
  </ul>
</li>
<li><b>Crop Information</b>
  <ul>
    <li>Guidance on growth, soil, fertilizers, irrigation, harvesting</li>
  </ul>
</li>
<li><b>Marketplace</b>
  <ul>
    <li>Manual + AI-assisted crop listings</li>
  </ul>
</li>
<li><b>Dashboard & Tutorials</b>
  <ul>
    <li>Central hub for weather, recommendations, alerts, notifications</li>
    <li>Step-by-step modern farming guides</li>
  </ul>
</li>
</ul>
</div>

---

<h2 style="color:#009688;">📊 Feature Overview</h2>
<table>
<tr>
<th>Area</th><th>Highlights</th><th>Status</th>
</tr>
<tr>
<td>Crop Recommendation</td><td>Location, soil, season, weather-aware suggestions</td><td>✅</td>
</tr>
<tr>
<td>Disease Detection</td><td>Image upload, diagnosis, organic remedies, map flags</td><td>✅</td>
</tr>
<tr>
<td>Weather</td><td>Real-time + forecast, extreme alerts</td><td>✅</td>
</tr>
<tr>
<td>Map Alerts</td><td>Outbreak visualization, risk awareness</td><td>✅</td>
</tr>
<tr>
<td>Marketplace</td><td>Manual + AI-assisted listings</td><td>✅</td>
</tr>
<tr>
<td>Tutorials</td><td>Practical, step-by-step guidance</td><td>✅</td>
</tr>
</table>

---

<h2 style="color:#009688;">🖼️ Screenshots</h2>
<p align="center">
<img src="Workflowdig/CropRecommendation.jpg" alt="Crop Recommendation" width="300">
<img src="Workflowdig/Disease_Detection.jpg" alt="Disease Detection" width="300">
<img src="Workflowdig/Weatheralert.jpg" alt="Weather Alerts" width="300">
<img src="Workflowdig/Voicepoweredlisting.jpg" alt="Voice Listing" width="300">
</p>

---

<h2 style="color:#009688;">🛠️ Technology Stack</h2>
<ul>
<li><b>Backend:</b> FastAPI, Python, Whisper AI, Supabase (PostgreSQL)</li>
<li><b>Frontend:</b> React, Vite</li>
<li><b>AI Models:</b> Faster Whisper, custom disease detection ML models</li>
<li><b>Deployment:</b> Local dev-ready, cloud-ready (FastAPI compatible)</li>
</ul>

---

<h2 style="color:#009688;">🧭 Project Structure</h2>
<pre>
Hami-Kisaan/
├─ be/                    # FastAPI backend
│  ├─ app.py              # Entry point
│  ├─ Bestcrop.py         # Crop recommendation
│  ├─ Diseasedetect.py    # Plant disease detection
│  ├─ weatherforecast.py  # Weather forecasts
│  ├─ Cropinfo.py         # Crop information
│  └─ AI/                 # AI training/inference assets
└─ fe/                    # React frontend (Vite)
   ├─ src/pages/          # Pages (Dashboard, Recommend, DiseaseDetection, ...)
   └─ src/components/     # Reusable components
</pre>

---

<h2 style="color:#009688;">⚙️ Backend Setup (FastAPI + Supabase)</h2>

<ol>
<li><b>Create & activate virtual environment</b>

<pre><code>cd be
python -m venv .venv
. .venv\Scripts\activate
</code></pre>
</li>

<li><b>Install dependencies</b>

<pre><code>pip install -r requirements.txt
</code></pre>
</li>

<li><b>Set environment variables (PowerShell)</b>

<pre><code>$env:SUPABASE_URL = "&lt;your-supabase-url&gt;"
$env:SUPABASE_SERVICE_ROLE = "&lt;your-supabase-service-role-key&gt;"
$env:weather_api_key = "&lt;your-weatherapi.com-key&gt;"
</code></pre>
</li>

<li><b>Run the backend API</b>

<pre><code>uvicorn app:app --reload
</code></pre>

Base URL: <code>http://127.0.0.1:8000</code>

<blockquote>Tip: Update checkpoint path in <code>be/Diseasedetect.py</code> if different.</blockquote>
</li>
</ol>

---

<h2 style="color:#009688;">💻 Frontend Setup (Vite + React)</h2>

<ol>
<li><b>Install dependencies</b>

<pre><code>cd fe
npm install
</code></pre>
</li>

<li><b>Configure backend base URL</b>

Create <code>.env</code> in <code>fe/</code> with:

<pre><code>VITE_BE_BASE_URL=http://127.0.0.1:8000
</code></pre>
</li>

<li><b>Run development server</b>

<pre><code>npm run dev
</code></pre>

Frontend URL: <code>http://localhost:5173</code>
</li>
</ol>

---

<h2 style="color:#009688;">⚡ Quick Start (Commands)</h2>

<table>
<tr><th>Target</th><th>Commands</th></tr>
<tr><td>Backend</td><td><code>cd be</code> → <code>python -m venv .venv</code> → <code>. .venv\Scripts\activate</code> → <code>pip install -r requirements.txt</code> → <code>uvicorn app:app --reload</code></td></tr>
<tr><td>Frontend</td><td><code>cd fe</code> → <code>npm install</code> → create <code>.env</code> with <code>VITE_BE_BASE_URL=http://127.0.0.1:8000</code> → <code>npm run dev</code></td></tr>
</table>

---

<h2 style="color:#009688;">📌 API Endpoints</h2>

<table>
<tr><th>Endpoint</th><th>Method</th><th>Description</th></tr>
<tr><td><code>/</code></td><td>GET</td><td>Health check</td></tr>
<tr><td><code>/Crop_recommendation</code></td><td>GET</td><td>Query: <code>lat</code>, <code>lon</code></td></tr>
<tr><td><code>/Crop_info</code></td><td>GET</td><td>Query: <code>name</code></td></tr>
<tr><td><code>/disease_detection/</code></td><td>POST</td><td>Form: <code>image</code>; Query: <code>lat</code>, <code>lon</code></td></tr>
<tr><td><code>/disease_detection_detailed/</code></td><td>POST</td><td>JSON: <code>{ "disease_name": "string" }</code></td></tr>
<tr><td><code>/weatherforecast</code></td><td>POST</td><td>JSON: <code>{ "latitude": number, "longitude": number, "days": number }</code></td></tr>
<tr><td><code>/dashboard/data/</code></td><td>GET</td><td>Query: <code>latitude</code>, <code>longitude</code></td></tr>
<tr><td><code>/transcribe</code></td><td>POST</td><td>Audio transcription for marketplace or navigation</td></tr>
<tr><td><code>/transcribe/Findpage</code></td><td>POST</td><td>AI-based navigation to site pages</td></tr>
</table>

---

<h2 style="color:#009688;">🔗 Frontend → Backend Wiring</h2>

<table>
<tr><th>Component</th><th>API Calls / Usage</th></tr>
<tr><td><code>pages/DiseaseDetection.jsx</code></td><td>POST <code>${VITE_BE_BASE_URL}/disease_detection?lat=..&amp;lon=..</code>; POST <code>${VITE_BE_BASE_URL}/disease_detection_detailed/</code></td></tr>
<tr><td><code>pages/Recommend.jsx</code></td><td>GET <code>${VITE_BE_BASE_URL}/Crop_recommendation?lat=..&amp;lon=..</code>; GET <code>${VITE_BE_BASE_URL}/Crop_info?name=..</code></td></tr>
<tr><td><code>pages/WeatherAlerts.jsx</code></td><td>POST <code>${VITE_BE_BASE_URL}/weatherforecast</code></td></tr>
<tr><td><code>pages/Dashboard.jsx</code> &amp; <code>pages/MapAlerts.jsx</code></td><td>GET <code>/dashboard/data</code> → temperature, rainfall, soil pH, altitude; red flags for detected diseases</td></tr>
<tr><td><code>components/VoiceRecorder.jsx</code></td><td>POST <code>/transcribe</code> → AI-assisted crop listing</td></tr>
</table>

---

<h2 style="color:#009688;">📦 Usage Notes</h2>

<ul>
<li>Ensure Supabase keys are correctly configured</li>
<li>Disease map alerts require latitude and longitude</li>
<li>Marketplace supports both manual and AI-assisted crop listings</li>
<li>All AI outputs are processed into clean JSON for frontend integration</li>
</ul>

---

<h2 style="color:#009688;">📜 Licensing & Permissions</h2>

<ul>
<li>Developed by Shital Gautam, Ananta Pokhrel, and Immense Raj Subedi for a hackathon</li>
<li>Any reproduction, redistribution, or commercial deployment is strictly prohibited without explicit written permission</li>
<li>For inquiries regarding use or collaboration, contact the developers</li>
</ul>

---

<p align="center"><sub>© 2025 Immense Raj Subedi, Shital Gautam, Ananta Pokhrel. All rights reserved.</sub></p>

