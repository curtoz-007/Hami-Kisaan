import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def grounded_search(prompt: str) -> str:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        if hasattr(response, 'text'):
            return response.text.strip()
        else:
            raise ValueError("No valid text found in response")
    except Exception as e:
        print(f"Error making request: {str(e)}")
        return f'{{"Potential_Harms": "", "Solution": "", "Organic_Solutions": "", "Sources": []}}'