from fastapi import FastAPI, HTTPException, UploadFile, File,  Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from Bestcrop import get_crop_recommendations_from_location,fetch_soil_ph,fetch_weather,fetch_rainfall,fetch_altitude
from weatherforecast import analyze_forecast_for_alerts_async, LocationInput as WeatherLocationInput
import pandas as pd
from faster_whisper import WhisperModel
import json
from callai import msg
from searchai import grounded_search
import os
from fastapi.responses import JSONResponse
import re
from Cropinfo import get_crop_info
from Diseasedetect import predict_plant_disease_from_image
from supabase import client, Client, create_client
from datetime import datetime
from PIL import Image
from io import BytesIO
import traceback
import asyncio
from pydantic import BaseModel


SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=os.cpu_count())

print("Model loaded ready to transcribe")

class DiseaseRequest(BaseModel):
    disease_name: str


app = FastAPI()

# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




def disease_detected(disease_name: str, latitude: float, longitude: float):
    """
    Insert the detected disease into Supabase.
    """
    try:
        print("Notifying related farmers...")

        # Data to insert
        data = {
            "disease_name": disease_name,
            "latitude": latitude,
            "longitude": longitude,
            # "detected_at": datetime.now(timezone.utc).isoformat()
        }

        # Insert record into Supabase
        insert_response = supabase.table("disease_detected").insert(data).execute()
        print("Inserted:", insert_response)

        return insert_response

    except Exception as e:
        print("Error inserting into Supabase:", e)
        return None


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/Crop_recommendation")
async def crop_recommendation(lat: float, lon: float):
    # Get recommendations (returns a pandas DataFrame)
    recommendations =  await get_crop_recommendations_from_location(lat, lon)


    if not isinstance(recommendations, pd.DataFrame):
        recommendations = pd.DataFrame(recommendations)
    
    
    recommendations = recommendations.astype(object).where(pd.notnull(recommendations), None)
    
    # Convert to list of dicts for JSON response
    return recommendations.to_dict(orient="records")



@app.post("/transcribe")
async def upload_audio(file: UploadFile = File(...)):

    print("Received request for transcription")

    try:
        # Save uploaded file temporarily
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Transcribe the audio
        segments, info = model.transcribe(file_path, beam_size=1, language="hi", vad_filter=True)
        text = " ".join([s.text for s in segments])

        print(f"Transcription complete, text = {text}")

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
  "crop_unit": "unit like per kg,per dozen , per piece, null",
  "price_per_unit": "price number or null",
  "quantity": "quantity number or null"
}}

Look for:
- Crop names (English)
- Quantities (numbers with per kilo,per piece, etc.)
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


# Disease Detection with AI our own


@app.post("/disease_detection/")
async def disease_detection(
    image: UploadFile = File(...),
    lat: float = Query(...),
    lon: float = Query(...)
):
    print(f"Received request for disease detection: lat={lat}, lon={lon}, filename={image.filename}")

    try:
        # Validate file type
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images (JPEG, PNG, etc.) are allowed.")

        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        image_bytes = await image.read()
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image size exceeds 5MB limit.")

        print(f"Image size: {len(image_bytes)} bytes")

        # Convert bytes to PIL Image
        try:
            image_pil = Image.open(BytesIO(image_bytes))
            print("Image successfully opened with PIL")
        except Exception as e:
            print(f"Error opening image: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

        # Predict disease (assuming synchronous function)
        try:
            disease_result = predict_plant_disease_from_image(image_pil)
            print(f"Prediction result: {disease_result}")
        except Exception as e:
            print(f"Error in predict_plant_disease_from_image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

        # Clean up disease name
        disease_result = disease_result.replace("_", " ").replace("___", " ").replace("__", " ")
        print(f"Cleaned disease result: {disease_result}")

        # Optionally store or process the result (replace disease_detected if needed)
        # If disease_detected is meant to be disease_detection_detailed, call it here
        # await disease_detection_detailed(DiseaseRequest(disease_name=disease_result))

        return {"disease_detected": disease_result}

    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
@app.post("/disease_detection_detailed/")
async def disease_detection_detailed(request: DiseaseRequest):
    disease_name = request.disease_name
    print(f"Request for details of disease: {disease_name}")

    try:
        search_prompt = (
            f"{disease_name} This is the disease of a plant detected from an image. "
"Provide a simple solution for general farmers. "
"Use trusted sources and keep the output concise. "
"Return the response in the following JSON structure:\n\n"
"{\n"
"  \"Potential_Harms\": \"Description of potential harms\",\n"
"  \"Solution\": \"Recommended solution for the disease\",\n"
"  \"Organic_Solutions\": \"Organic solutions for the disease\",\n"
"  \"Sources\": [\n"
"    {\"source_name_1\": \"Source_1_url\"},\n"
"    {\"source_name_2\": \"Source_2_url\"},\n"
"    {\"source_name_3\": \"Source_3_url\"}\n"
"  ]\n"
"}\n\n"
        )

        solution = grounded_search(search_prompt)
        print(f"AI response: {solution}")

        json_match = re.search(r"\{.*\}", solution, re.DOTALL)
        if not json_match:
            print("AI response does not contain valid JSON")
            return {
                "Potential_Harms": "",
                "Solution": "",
                "Organic_Solutions": "",
                "Sources": []
            }

        data = json.loads(json_match.group(0))
        print(f"Extracted JSON data: {data}")
        return data

    except Exception as e:
        print(f"Error processing disease details: {str(e)}")
        return {
            "Potential_Harms": "",
            "Solution": "",
            "Organic_Solutions": "",
            "Sources": []
        }

@app.get("/dashboard/data/")

async def get_dashboard_data(latitude:float, longitude:float):
    return {
        "weather": {
            "temperature": await fetch_weather(latitude, longitude),
            "rainfall": await fetch_rainfall(latitude, longitude),
            "soil_ph": await fetch_soil_ph(latitude, longitude),
            "altitude": await fetch_altitude(latitude, longitude),
        },
    }


@app.post("/weatherforecast")
async def weather_forecast(input_data: WeatherLocationInput):
    print(f"Received weather forecast request for lat: {input_data.latitude}, lon: {input_data.longitude}, days: {input_data.days}")
    try:
        alerts = await analyze_forecast_for_alerts_async(input_data.latitude, input_data.longitude, input_data.days)
        print("Returning weather forecast alerts")
        return {"alerts": alerts}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# Navigate page

@app.post("/transcribe/Findpage")
async def upload_audio(file: UploadFile = File(...)):
    print("Received request for routing")
    try:
        # Save uploaded file temporarily
        file_path = f"./temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Transcribe the audio
        segments, info = model.transcribe(file_path, beam_size=1, language="hi", vad_filter=True)
        text = " ".join([s.text for s in segments])
        print("Transcribed text:", text)  # Debug print

        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

        # AI prompt to extract crop data
        prompt = f"""Analyze the following user query and determine which page of the website the user wants to navigate to. 
                The query text may be in Hindi, English, or a mix of both:

                "{text}"

                Available pages, their routes, and functions:

                1) Crop Recommendation 
                route: "/recommend" 
                function: Suggests the best crops for the farmer to grow based on their location, soil type, season, weather conditions, and temperature. 
                Helps farmers make data-driven decisions for higher yield.

                2) Weather Forecast 
                route: "/weatheralerts" 
                function: Provides real-time and upcoming weather conditions, temperature, rainfall chances, and extreme weather alerts. 
                Helps farmers plan irrigation, fertilizer use, and crop protection.

                3) Disease Detection 
                route: "/disease" 
                function: Allows farmers to upload crop images for AI-based disease detection. 
                Identifies plant diseases, pests, or nutrient deficiencies and provides treatment suggestions.

                4) Crop Info 
                route: "/recommend" 
                function: Gives detailed information about crops (growth stages, soil requirements, fertilizer use, irrigation needs, harvesting tips). 
                Helps farmers manage crops effectively after choosing them.

                5) Dashboard 
                route: "/" 
                function: Main homepage/dashboard showing an overview of all features, shortcuts, and personalized recommendations.

                6) Alerts 
                route: "/alerts" 
                function: Displays map-based crop disease alerts and outbreaks in nearby regions. 
                Helps farmers take preventive measures before diseases spread.

                7) Explore 
                route: "/explore" 
                function: Online marketplace where farmers can sell their crops/vegetables/Fruits directly. 
                Encourages fair pricing and better market access. 

                8) Tutorial 
                route: "/tutorial" 
                function: Provides step-by-step tutorials, guides, and videos for farmers to learn modern agricultural techniques. 
                Includes best practices for planting, irrigation, pest control, and harvesting. It's a youtube for all the tutorial things. User can watch videos here

                9) Notification 
                route: "/notifications" 
                function: Shows all notifications relevant to farmers such as updates about their fields, reminders, weather warnings, and new government policies. 
                Ensures farmers don’t miss critical information.

                10) Not Found 
                route: "/404" 
                function: If the user query does not match any of the above pages, return this page indicating no relevant result.

                Return **ONLY** a valid JSON object in the following format:

                {{
                "page": "ROUTE_OF_THE_PAGE"
                }}
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
    