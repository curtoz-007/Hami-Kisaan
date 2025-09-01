from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from Bestcrop import get_crop_recommendations_from_location
import pandas as pd
from faster_whisper import WhisperModel
import json
from callai import msg
from searchai import grounded_search
import os
from fastapi.responses import JSONResponse
import re
from Cropinfo import get_crop_info



app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/Crop_recommendation")
def crop_recommendation(lat: float, lon: float):
    # Get recommendations (returns a pandas DataFrame)
    recommendations = get_crop_recommendations_from_location(lat, lon)
    
    
    if not isinstance(recommendations, pd.DataFrame):
        recommendations = pd.DataFrame(recommendations)
    
    
    recommendations = recommendations.astype(object).where(pd.notnull(recommendations), None)
    
    # Convert to list of dicts for JSON response
    return recommendations.to_dict(orient="records")



@app.post("/transcribe")
async def upload_audio(file: UploadFile = File(...)):


    model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=os.cpu_count())

    print("Model loaded ready to transcribe")
    try:
        # Save uploaded file temporarily
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Transcribe the audio
        segments, info = model.transcribe(file_path, beam_size=1, language="hi", vad_filter=True)
        text = " ".join([s.text for s in segments])

        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

        # AI prompt to extract crop data
        prompt = f"""
Analyze this text and extract crop information. The text may be in Hindi, English, or mixed languages:
"{text}"

Common Hindi crop names and their English equivalents:
- टमाटर, गोलवेदा, गोलभेडा = Tomato
- आलू = Potato
- प्याज = Onion
- गोल वेडा = Round Gourd
- भिंडी = Okra
- बैंगन = Brinjal
- मिर्च = Chili
- धनिया = Coriander
- पालक = Spinach
- गोभी = Cabbage
- चावल = Rice
- गेहूं = Wheat
- मक्का = Corn

Extract the following information and return ONLY a valid JSON object:

{{
  "crop_name": "English crop name or null",
  "crop_unit": "unit like kg, kilo, per kg or null",
  "price_per_unit": "price number or null",
  "quantity": "quantity number or null"
}}

Look for:
- Crop names (English)
- Quantities (numbers with kg, kilo,per piece, etc.)
- Prices (numbers with rupees, rs, per kg, per piece, etc.)
- Units (kg, kilo, per kg, etc.)

Return ONLY the JSON object. No explanations, no markdown, no extra text.
"""

        # Call AI and get output
        message = msg(prompt)
        print("Raw AI output:", message)  # Debug print


        # Extract JSON from AI string
        json_match = re.search(r"\{.*\}", message, re.DOTALL)
        if not json_match:
            raise HTTPException(status_code=500, detail="Could not extract JSON from AI output")

        data = json.loads(json_match.group(0))

        # Return as proper JSON
        return JSONResponse(content=data)

    except Exception as e:
        # Cleanup temp file if exists
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))
    



@app.get("/Crop_info")
def crop_info(name):
    # Get recommendations (returns a pandas DataFrame)
    recommendations = get_crop_info(name)
    
    
    if not isinstance(recommendations, pd.DataFrame):
        recommendations = pd.DataFrame(recommendations)
    
    
    recommendations = recommendations.astype(object).where(pd.notnull(recommendations), None)
    
    # Convert to list of dicts for JSON response
    return recommendations.to_dict(orient="records")