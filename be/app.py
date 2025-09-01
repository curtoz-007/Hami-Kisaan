from fastapi import FastAPI
from Bestcrop import recommend_crops_from_location

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/Crop_recommendation")
def crop_recommendation(lat: float, lon: float):
    return recommend_crops_from_location(lat, lon)