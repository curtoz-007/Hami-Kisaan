import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

def grounded_search(prompt: str) -> str:
    
    
   
    api_key = os.getenv("GEMINI_API_KEY")

    try:
        
        client = genai.Client(api_key=api_key)
    except Exception as e:
        return f"❌ Failed to create client: {e}"

    grounding_tool = types.Tool(google_search=types.GoogleSearch())

    config = types.GenerateContentConfig(tools=[grounding_tool])

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt,
            config=config,
        )

        output = response.text.strip()

        sources = []
        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
                for chunk in candidate.grounding_metadata.grounding_chunks:
                    if hasattr(chunk, 'web') and chunk.web:
                        sources.append(f"{chunk.web.title}: {chunk.web.uri}")

        if sources:
            output += "\n\nSources:\n" + "\n".join(f"• {s}" for s in sources)

        return output

    except Exception as e:
        return f"❌ Error making request: {e}"


# # how to use
# if __name__ == "__main__":
#     queries = [
#         "Who won the Euro 2024?",
#         "Latest AI developments in 2024?",
#         "Current weather in New York"
#     ]
    
#     for q in queries:
#         print(f"🔍 Query: {q}")
#         print("-"*50)
#         print(grounded_search(q))
#         print("="*50)

# print(grounded_search("Where is Lumbini ICT college located?"))
