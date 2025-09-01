import requests
from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv


try:
    df = pd.read_csv('Datasets/crop_ecology_data.csv')
except FileNotFoundError:
    print("File not found")
    df = pd.DataFrame()



try:
    df1 = pd.read_csv('Datasets/Fertilizer_data.csv')
except FileNotFoundError:
    print("File not found")
    df1 = pd.DataFrame()

def get_crop_info(crop_name):

    # Case-insensitive match
    mask = df['Crop'].str.lower() == crop_name.lower()
    mask1 = df1['Crop'].str.lower() == crop_name.lower()
    
    # Define optimal columns for both datasets
    optimal_columns_df = [
        'Crop',
        'Ecology_Temp_Optimal_Min', 'Ecology_Temp_Optimal_Max',
        'Ecology_Rainfall_Annual_Optimal_Min', 'Ecology_Rainfall_Annual_Optimal_Max',
        'Ecology_Latitude_Optimal_Min', 'Ecology_Latitude_Optimal_Max',
        'Ecology_Altitude_Optimal_Min', 'Ecology_Altitude_Optimal_Max',
        'Ecology_Soil_PH_Optimal_Min', 'Ecology_Soil_PH_Optimal_Max',
        'Planting_Start_Month', 'Planting_End_Month',
        'Harvesting_Start_Month', 'Harvesting_End_Month'
    ]
    
    optimal_columns_df1 = [
        'Crop',
        'N_Required_kg_ha', 
        'P_Required_kg_ha', 
        'K_Required_kg_ha', 
        'Fertilizers', 
        'Usage_Period'
    ]

    
    # Select rows if they exist
    crop_rows = []
    if mask.any():
        crop_rows.append(df.loc[mask, optimal_columns_df].reset_index(drop=True))
    if mask1.any():
        crop_rows.append(df1.loc[mask1, optimal_columns_df1].drop(columns=['Crop']).reset_index(drop=True))

    if crop_rows: #if crop list not empty
        merged_row = pd.concat(crop_rows, axis=1)
        return merged_row
    else:
        return f"Crop '{crop_name}' not found in either dataset."
