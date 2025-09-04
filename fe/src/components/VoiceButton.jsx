import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMic } from "react-icons/io";
import { FaCircle } from "react-icons/fa";

const VoiceButton = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const countdownRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const startCountdown = async () => {
    setError("");
    
    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported in this browser.");
      return;
    }

    setIsCountingDown(true);
    setCountdown(3);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setIsCountingDown(false);
          startActualRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startActualRecording = async () => {
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
        uploadAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err.message || "Microphone access denied.");
      setIsCountingDown(false);
      setCountdown(0);
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

  const uploadAudio = async (audioBlob) => {
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
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (isCountingDown) {
      // Cancel countdown
      clearInterval(countdownRef.current);
      setIsCountingDown(false);
      setCountdown(0);
    } else if (isRecording) {
      // Stop recording
      stopRecording();
    } else {
      // Start countdown
      startCountdown();
    }
  };

  const getButtonClass = () => {
    let baseClass = "voice-routing";
    if (isCountingDown) baseClass += " counting-down";
    if (isRecording) baseClass += " recording";
    if (uploading) baseClass += " uploading";
    return baseClass;
  };

  return (
    <>
      <div className={getButtonClass()} onClick={handleClick}>
        {isCountingDown ? (
          <span className="countdown-text">{countdown}</span>
        ) : isRecording ? (
          <div className="recording-indicator">
            <FaCircle style={{ color: '#ff0000' }} />
          </div>
        ) : (
          <IoMdMic />
        )}
      </div>
      
      {/* Countdown Overlay */}
      {isCountingDown && (
        <div className="countdown-overlay">
          <div className="countdown-message">
            Recording starts in: {countdown}
          </div>
        </div>
      )}
      
      {/* Recording Overlay */}
      {isRecording && (
        <div className="recording-overlay">
          <div className="recording-message">
            <FaCircle style={{ color: '#ff0000', marginRight: '8px' }} />
            Recording... Click to stop
          </div>
        </div>
      )}
      
      {/* Uploading Overlay */}
      {uploading && (
        <div className="uploading-overlay">
          <div className="uploading-message">
            Processing your request...
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="error-overlay">
          <div className="error-message">
            {error}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceButton;
