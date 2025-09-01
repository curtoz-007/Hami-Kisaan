import os
from dotenv import load_dotenv
import google.generativeai as genai
from dotenv import load_dotenv
# Load environment variables from .env
load_dotenv()

# Ensure key is read (use uppercase for consistency)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise Exception("Missing GEMINI_API_KEY in environment variables")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def msg(prompt: str) -> str:
    """
    Sends a prompt to Gemini API and returns the text response.
    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()


# text = msg("""
#     Rewrite this in Nepali and find out whats the user is saying
#      मुझ सवंग 40 किलो टमाटर शा, मुझ इसलाए प्रदेक रूप 40 रिपा किलो को धर्ले वेतना छाहांचुव।""")

# print(text)