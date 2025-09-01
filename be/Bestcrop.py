import requests
from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

try:
    df = pd.read_csv('Datasets/crop_ecology_data.csv')
except FileNotFoundError:
    print("File not found")
    df = pd.DataFrame()

df.columns = df.columns.map(str)
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]


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




def fetch_soil_ph(lat, lon):
    url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&property=phh2o&depth=0-5cm&value=mean"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if 'properties' in data and 'layers' in data['properties'] and data['properties']['layers']:
            ph_mean = data['properties']['layers'][0]['depths'][0]['values']['mean']
            if ph_mean is not None:
                return round(ph_mean / 10.0, 1)
        return None
    except Exception as e:
        return None



def get_crop_recommendations_from_location(lat: float, lon: float):
    weather_api_key = os.getenv("weather_api_key")
    weather_url = f"https://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={lat},{lon}"
    weather_response = requests.get(weather_url, timeout=10)
    weather_response.raise_for_status()
    weather_data = weather_response.json()
    if "error" in weather_data:
        raise ValueError(f"Weather API error: {weather_data['error']['message']}")
    temp = weather_data["current"]["temp_c"]
    today = datetime.now(timezone.utc).date()
    one_year_ago = today - timedelta(days=365)
    rain_url = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={lat}&longitude={lon}"
        f"&start_date={one_year_ago}&end_date={today}"
        "&daily=precipitation_sum&timezone=UTC"
    )
    rain_response = requests.get(rain_url, timeout=10)
    rain_response.raise_for_status()
    rain_data = rain_response.json()
    if "daily" in rain_data and "precipitation_sum" in rain_data["daily"]:
        rainfall = sum(p for p in rain_data["daily"]["precipitation_sum"] if p is not None)
    else:
        raise ValueError("No precipitation data found.")
    alt_url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
    alt_response = requests.get(alt_url, timeout=10)
    alt_response.raise_for_status()
    alt_data = alt_response.json()
    if "results" in alt_data and len(alt_data["results"]) > 0:
        altitude = alt_data["results"][0]["elevation"]
    else:
        raise ValueError("No elevation data found.")
    month = datetime.utcnow().month
    ph_soil = fetch_soil_ph(lat, lon)

    if ph_soil is None:
        print("No pH data found.")
        ph_soil = 6.5  
    print(ph_soil)

    recommendations = recommend_crops(
        temp=temp,
        rainfall=rainfall,
        ph=ph_soil,
        latitude=lat,
        altitude=altitude,
        month=month
    )
    return recommendations


a= get_crop_recommendations_from_location(27.705, 84.410)
print(a)

