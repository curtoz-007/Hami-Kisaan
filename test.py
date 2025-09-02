import requests

url = "http://127.0.0.1:8000/disease_detection/"
params = {"lat": 27.7, "lon": 85.3}  # Query parameters
files = {"image": open("plant.jpg", "rb")}  # File upload


print("Msg sent")
response = requests.post(url, params=params, files=files)

print(response.status_code)
print(response.json())
                    