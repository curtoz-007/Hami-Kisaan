import pandas as pd
import numpy as np

try:
    df = pd.read_csv('Datasets/crop_ecology_data.csv')
except FileNotFoundError:
    print("File not found")
    df = pd.DataFrame()

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
images = df["Image"].to_numpy()




def recommend_crops(temp, rainfall, ph, latitude, altitude, month):
    scores = np.zeros(len(crop_names), dtype=int)

    # --- Temperature ---
    scores += np.where((temp_opt_min <= temp) & (temp <= temp_opt_max), 3,
                       np.where((temp_abs_min <= temp) & (temp <= temp_abs_max), 1, -100))

    # --- Rainfall ---
    scores += np.where((rain_opt_min <= rainfall) & (rainfall <= rain_opt_max), 2,
                       np.where((rain_abs_min <= rainfall) & (rainfall <= rain_abs_max), 1, -100))

    # --- Soil pH ---
    scores += np.where((ph_opt_min <= ph) & (ph <= ph_opt_max), 3,
                       np.where((ph_abs_min <= ph) & (ph <= ph_abs_max), 1, -100))

    # --- Latitude ---
    scores += np.where((lat_opt_min <= latitude) & (latitude <= lat_opt_max), 2,
                       np.where((lat_abs_min <= latitude) & (latitude <= lat_abs_max), 1, -100))

    # --- Altitude ---
    scores += np.where((alt_opt_min <= altitude) & (altitude <= alt_opt_max), 4,
                       np.where((alt_abs_min <= altitude) & (altitude <= alt_abs_max), 1, -100))

    # --- Planting season ---
    in_planting = ((plant_start <= plant_end) & ((plant_start <= month) & (month <= plant_end))) | \
                  ((plant_start > plant_end) & ((month >= plant_start) | (month <= plant_end)))
    scores += np.where(in_planting, 15, 0)

    # --- Harvesting season ---
    in_harvesting = ((harvest_start <= harvest_end) & ((harvest_start <= month) & (month <= harvest_end))) | \
                    ((harvest_start > harvest_end) & ((month >= harvest_start) | (month <= harvest_end)))
    scores += np.where(in_harvesting, 15, 0)

    # --- Results ---
    mask = scores > 0
    result = pd.DataFrame({"Crop": crop_names[mask], "Score": scores[mask], "Image": images[mask]})
    return result.sort_values("Score", ascending=False).reset_index(drop=True)


a = recommend_crops(20, 500, 6.5, 35, 1000, 5)
print(a)


