import requests
from pydantic import BaseModel
from fastapi import HTTPException
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

class LocationInput(BaseModel):
    latitude: float
    longitude: float
    days: int = 3


async def fetch_weather_forecast_async(lat: float, lon: float, days: int = 3):
    weather_api_key = os.getenv("weather_api_key")
    url = f"https://api.weatherapi.com/v1/forecast.json?key={weather_api_key}&q={lat},{lon}&days={days}"
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()
        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"]["message"])
        return data

async def analyze_forecast_for_alerts_async(lat: float, lon: float, days: int = 3):
    forecast_data = await fetch_weather_forecast_async(lat, lon, days)
    alerts = []
    for day in forecast_data["forecast"]["forecastday"]:
        date = day["date"]
        day_data = day["day"]
        max_temp = day_data["maxtemp_c"]
        total_precip = day_data["totalprecip_mm"]
        condition_text = day_data["condition"]["text"].lower()
        condition_code = day_data["condition"]["code"]

        if total_precip > 20:
            alerts.append(f"Alert for {date}: Heavy rain expected ({total_precip} mm). Take precautions for flooding.")
        elif total_precip < 1 and max_temp > 30:
            alerts.append(f"Alert for {date}: Dry and hot conditions (Precip: {total_precip} mm, Temp: {max_temp}°C). Monitor irrigation.")
        if "hail" in condition_text or condition_code in [1246, 1264, 1276]:
            alerts.append(f"Alert for {date}: Possible hail ({condition_text}). Protect crops with covers.")

        for hour in day["hour"]:
            hour_time = hour["time"]
            hour_precip = hour["precip_mm"]
            hour_condition = hour["condition"]["text"].lower()
            if hour_precip > 10:
                alerts.append(f"Alert for {hour_time}: Sudden heavy rain expected ({hour_precip} mm).")
            if "thunderstorm" in hour_condition:
                alerts.append(f"Alert for {hour_time}: Thunderstorm possible. Secure outdoor equipment.")
    
    return alerts if alerts else ["No significant weather threats detected."]
