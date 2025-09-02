import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/recorder.css"

const VoiceRoutingModal = ({ opened, setOpened }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError("");
    setAudioBlob(null);
    setAudioUrl("");
    setTranscript("");
    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err.message || "Microphone access denied.");
    }
  };

  const stopRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      setError(err.message || "Failed to stop recording.");
    } finally {
      setIsRecording(false);
    }
  };

  const upload = async () => {
    setError("");
    if (!audioBlob) {
      setError("No recording to upload.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", audioBlob, `routing-${Date.now()}.webm`);
      console.log("Uploading audio for routing...", formData);
      const res = await fetch("http://localhost:8000/transcribe/Findpage", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setError("Upload failed.");
        setUploading(false);
        return;
      }
      const result = await res.json();
      console.log("Transcription result:", result);
      navigate(result.page);
      setTranscript(result.transcription || "");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setOpened(false)
      setUploading(false);
    }
  };

  if (!opened) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <h2>Voice Routing</h2>
        <p>Record your command and we'll route you!</p>
        {uploading && <div>Please wait while we process your request. It may take a moment...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {!isRecording && !audioBlob && (
            <button className="button primary" onClick={startRecording}>
              Start Recording
            </button>
          )}
          {isRecording && (
            <button className="button" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
          {!!audioBlob && (
            <button className="button primary" onClick={upload} disabled={uploading}>
              {uploading ? "Uploading..." : "Transcribe & Route"}
            </button>
          )}
          <button className="button" onClick={() => setOpened(false)}>
            Close
          </button>
        </div>
        {!!audioBlob && (
          <audio controls src={audioUrl} style={{ width: "100%" }} />
        )}
        {transcript && (
          <div style={{ marginTop: 12 }}>
            <strong>Transcript:</strong> {transcript}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRoutingModal;