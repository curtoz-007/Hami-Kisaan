from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import os

app_speech = FastAPI()

# ✅ Load model once at startup
model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=os.cpu_count())

print("Model loaded ready to transcribe")

@app_speech.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    file_path = f"./temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Transcribe
    segments, info = model.transcribe(file_path, beam_size=1, language="hi", vad_filter=True)
    text = " ".join([s.text for s in segments])

    return {"transcription": text}



