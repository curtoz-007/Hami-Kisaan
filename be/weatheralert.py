import requests
from pydantic import BaseModel
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

class LocationInput(BaseModel):
    latitude: float
    longitude: float
    days: int = 3

def fetch_weather_forecast(lat: float, lon: float, days: int = 3):
    """
    Fetch weather forecast for the specified location and number of days.
    
    Args:
        lat (float): Latitude of the location
        lon (float): Longitude of the location
        days (int): Number of forecast days (1 to 10, depending on API plan)
    
    Returns:
        dict: Forecast data from WeatherAPI
    
    Raises:
        ValueError: If the API returns an error
        requests.exceptions.RequestException: If the HTTP request fails
    """
    weather_api_key = os.getenv("weather_api_key")
    url = f"https://api.weatherapi.com/v1/forecast.json?key={weather_api_key}&q={lat},{lon}&days={days}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if "error" in data:
            raise ValueError(f"Weather API error: {data['error']['message']}")
        return data
    except requests.exceptions.RequestException as e:
        raise requests.exceptions.RequestException(f"Failed to fetch forecast: {str(e)}")

def analyze_forecast_for_alerts(lat: float, lon: float, days: int = 3):
    """
    Analyze weather forecast for conditions harmful to crops and generate alerts.
    
    Args:
        lat (float): Latitude
        lon (float): Longitude
        days (int): Number of forecast days
    
    Returns:
        list: List of alerts for potentially harmful weather conditions
    """
    try:
        forecast_data = fetch_weather_forecast(lat, lon, days)
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
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")