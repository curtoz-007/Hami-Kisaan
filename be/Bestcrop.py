import requests
from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
import time
import asyncio
import httpx



load_dotenv()

try:
    df = pd.read_csv('Datasets/crop_ecology_data.csv')
except FileNotFoundError:
    print("File not found")
    df = pd.DataFrame()

# Convert column names to strings before using .str.contains
df.columns = df.columns.map(str)
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# For initialization of speed recommendation


crop_names = df["Crop"].to_numpy()
temp_opt_min = df["Ecology_Temp_Optimal_Min"].to_numpy()
temp_opt_max = df["Ecology_Temp_Optimal_Max"].to_numpy()
temp_abs_min = df["Ecology_Temp_Absolute_Min"].to_numpy()
temp_abs_max = df["Ecology_Temp_Absolute_Max"].to_numpy()

rain_opt_min = df["Ecology_Rainfall_Annual_Optimal_Min"].to_numpy()
rain_opt_max = df["Ecology_Rainfall_Annual_Optimal_Max"].to_numpy()
rain_abs_min = df["Ecology_Rainfall_Annual_Absolute_Min"].to_numpy()
rain_abs_max = df["Ecology_Rainfall_Annual_Absolute_Max"].to_numpy()

ph_opt_min = df["Ecology_Soil_PH_Optimal_Min"].to_numpy()
ph_opt_max = df["Ecology_Soil_PH_Optimal_Max"].to_numpy()
ph_abs_min = df["Ecology_Soil_PH_Absolute_Min"].to_numpy()
ph_abs_max = df["Ecology_Soil_PH_Absolute_Max"].to_numpy()

lat_opt_min = df["Ecology_Latitude_Optimal_Min"].to_numpy()
lat_opt_max = df["Ecology_Latitude_Optimal_Max"].to_numpy()
lat_abs_min = df["Ecology_Latitude_Absolute_Min"].to_numpy()
lat_abs_max = df["Ecology_Latitude_Absolute_Max"].to_numpy()

alt_opt_min = df["Ecology_Altitude_Optimal_Min"].to_numpy()
alt_opt_max = df["Ecology_Altitude_Optimal_Max"].to_numpy()
alt_abs_min = df["Ecology_Altitude_Absolute_Min"].to_numpy()
alt_abs_max = df["Ecology_Altitude_Absolute_Max"].to_numpy()

plant_start = df["Planting_Start_Month"].to_numpy()
plant_end = df["Planting_End_Month"].to_numpy()
harvest_start = df["Harvesting_Start_Month"].to_numpy()
harvest_end = df["Harvesting_End_Month"].to_numpy()




def recommend_crops(temp, rainfall, ph, latitude, altitude, month):
    scores = np.zeros(len(crop_names), dtype=int)

    # --- Temperature (max 7) ---
    scores += np.where((temp_opt_min <= temp) & (temp <= temp_opt_max), 7,
                       np.where((temp_abs_min <= temp) & (temp <= temp_abs_max), 2, -100))

    # --- Rainfall (max 5) ---
    scores += np.where((rain_opt_min <= rainfall) & (rainfall <= rain_opt_max), 5,
                       np.where((rain_abs_min <= rainfall) & (rainfall <= rain_abs_max), 2, -100))

    # --- Soil pH (max 7) ---
    scores += np.where((ph_opt_min <= ph) & (ph <= ph_opt_max), 7,
                       np.where((ph_abs_min <= ph) & (ph <= ph_abs_max), 2, -100))

    # --- Latitude (max 5) ---
    scores += np.where((lat_opt_min <= latitude) & (latitude <= lat_opt_max), 5,
                       np.where((lat_abs_min <= latitude) & (latitude <= lat_abs_max), 2, -100))

    # --- Altitude (max 9) ---
    scores += np.where((alt_opt_min <= altitude) & (altitude <= alt_opt_max), 9,
                       np.where((alt_abs_min <= altitude) & (altitude <= alt_abs_max), 2, -100))

    # --- Planting season (max 34) ---
    in_planting = ((plant_start <= plant_end) & ((plant_start <= month) & (month <= plant_end))) | \
                  ((plant_start > plant_end) & ((month >= plant_start) | (month <= plant_end)))
    scores += np.where(in_planting, 34, 0)

    # --- Harvesting season (max 34) ---
    in_harvesting = ((harvest_start <= harvest_end) & ((harvest_start <= month) & (month <= harvest_end))) | \
                    ((harvest_start > harvest_end) & ((month >= harvest_start) | (month <= harvest_end)))
    scores += np.where(in_harvesting, 34, 0)

    # --- Results --- 
    mask = scores > 0
    result = pd.DataFrame({"Crop": crop_names[mask], "Score": scores[mask], })
    return result.sort_values("Score", ascending=False).reset_index(drop=True)


async def fetch_soil_ph(lat, lon):
    url = f"https://soil.narc.gov.np/soil/api/?lat={lat}&lon={lon}"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Extract pH
            ph_value = data.get('ph')
            if ph_value is not None:
                # Remove spaces and convert to float
                return round(float(ph_value.strip()), 2)
            
            # Default pH if not found
            return 6.1
    except Exception:
        return 6.1



async def fetch_weather(lat, lon):
    weather_api_key = os.getenv("weather_api_key")
    url = f"https://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={lat},{lon}"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        if "error" in data:
            raise ValueError(f"Weather API error: {data['error']['message']}")
        return data["current"]["temp_c"]

async def fetch_rainfall(lat, lon):
    today = datetime.now(timezone.utc).date()
    one_year_ago = today - timedelta(days=365)
    url = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={lat}&longitude={lon}"
        f"&start_date={one_year_ago}&end_date={today}"
        "&daily=precipitation_sum&timezone=UTC"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        if "daily" in data and "precipitation_sum" in data["daily"]:
            return sum(p for p in data["daily"]["precipitation_sum"] if p is not None)
        return 0

async def fetch_altitude(lat, lon):
    url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        if "results" in data and len(data["results"]) > 0:
            return data["results"][0]["elevation"]
        return 0

async def get_crop_recommendations_from_location(lat: float, lon: float):
    # Run all fetches in parallel
    ph_task = fetch_soil_ph(lat, lon)
    weather_task = fetch_weather(lat, lon)
    rain_task = fetch_rainfall(lat, lon)
    alt_task = fetch_altitude(lat, lon)

    ph_soil, temp, rainfall, altitude = await asyncio.gather(ph_task, weather_task, rain_task, alt_task)

    if ph_soil is None:
        print("No pH data found. Using default 6.5")
        ph_soil = 6.5

    month = datetime.utcnow().month
    print(f"PH: {ph_soil}, Temp: {temp}, Rainfall: {rainfall}, Altitude: {altitude}, Month: {month}")

    # Call your synchronous recommendation function
    recommendations = recommend_crops(
        temp=temp,
        rainfall=rainfall,
        ph=ph_soil,
        latitude=lat,
        altitude=altitude,
        month=month
    )
    return recommendations


a = asyncio.run(get_crop_recommendations_from_location(27, 84))
print(a)