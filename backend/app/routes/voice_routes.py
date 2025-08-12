from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import tempfile
import os
from gtts import gTTS
import speech_recognition as sr
from typing import Dict, Any

router = APIRouter()

@router.post("/speech-to-text", response_model=Dict[str, Any])
async def speech_to_text(
    audio_file: UploadFile = File(...), 
    language: str = Form("en")
) -> Dict[str, Any]:
    """
    Transcribe speech from an uploaded audio file to text, supporting multiple languages.
    """
    temp_path = None
    try:
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            contents = await audio_file.read()
            tmp.write(contents)
            temp_path = tmp.name

        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language=language)
        return {"text": text, "error": None}
    except sr.UnknownValueError:
        return {"text": "", "error": "Speech unintelligible"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT failed: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/text-to-speech")
def text_to_speech(
    text: str = Form(...), 
    language: str = Form("en"), 
    slow: bool = Form(False)
):
    """
    Generate speech audio from text input. Returns MP3 stream, supporting multiple languages.
    """
    temp_path = None
    try:
        tts = gTTS(text=text, lang=language, slow=slow)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tts.write_to_fp(tmp)
            temp_path = tmp.name

        def iterfile():
            with open(temp_path, "rb") as f:
                yield from f
            os.remove(temp_path)

        return StreamingResponse(iterfile(), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
