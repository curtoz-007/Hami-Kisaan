import { useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import "../styles/recorder.css";

export default function VoiceRecorder({ onCropDataExtracted }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
      } catch {}
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Handle audio URL changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      console.log("Audio URL changed, setting up audio element:", audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const startRecording = async () => {
    setError("");
    setAudioBlob(null);
    setAudioUrl("");
    setUploadResult(null);
    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported in this browser.");
      return;
    }
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      console.log("Microphone access granted, stream:", stream);
      streamRef.current = stream;
      const pickMimeType = () => {
        const candidates = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/mp4",
          "audio/wav",
        ];
        for (const m of candidates) {
          try {
            if (window.MediaRecorder.isTypeSupported?.(m)) {
              console.log("Selected MIME type:", m);
              return m;
            }
          } catch {}
        }
        console.log("No specific MIME type supported, using default");
        return undefined;
      };
      const mimeType = pickMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available:", e.data.size, "bytes");
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setError(e.error?.message || "Recording error");
      };
      mediaRecorder.onstop = () => {
        console.log("Recording stopped, chunks:", chunksRef.current.length);
        if (!chunksRef.current.length) {
          setError("No audio data captured. Try recording again.");
          return;
        }
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        console.log("Created blob:", blob.size, "bytes, type:", blob.type);
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        console.log("Recorded blob & url:", blob, url);

        // Set up the audio element properly
        if (audioRef.current) {
          console.log("Setting audio source to:", url);
          audioRef.current.src = url;
          audioRef.current.load(); // Force reload the audio element

          // Add event listeners to debug playback
          audioRef.current.onloadedmetadata = () => {
            console.log(
              "Audio metadata loaded, duration:",
              audioRef.current.duration
            );
          };
          audioRef.current.oncanplay = () => {
            console.log("Audio can play");
          };
          audioRef.current.onerror = (e) => {
            console.error("Audio playback error:", e);
          };
          audioRef.current.onloadstart = () => {
            console.log("Audio loading started");
          };
          audioRef.current.onloadeddata = () => {
            console.log("Audio data loaded");
          };
        } else {
          console.error("Audio ref is null!");
        }
        // Stop mic
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      // Start recording with timeslice to ensure data is captured
      mediaRecorder.start(1000); // Request data every 1 second
      setIsRecording(true);
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Microphone access was denied.");
      } else if (err.name === "NotFoundError") {
        setError("No microphone found.");
      } else {
        setError(err.message || "Could not start recording.");
      }
    }
  };

  const stopRecording = () => {
    setError("");
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        console.log(
          "Stopping recording, current state:",
          mediaRecorderRef.current.state
        );
        try {
          mediaRecorderRef.current.requestData();
        } catch (e) {
          console.log("requestData failed:", e);
        }
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError(err.message || "Failed to stop recording.");
    } finally {
      setIsRecording(false);
    }
  };

  const reRecord = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    chunksRef.current = [];
    startRecording();
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
      const filename = `recording-${Date.now()}.webm`;
      formData.append("file", audioBlob, filename);
      const res = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Upload failed (${res.status})`);
      }

      const result = await res.json();
      console.log("Upload result:", result);
      setUploadResult(result);

      // Support both shapes: { crop_data: {...}, transcription?, success? } OR direct {...}
      const cropDataCandidate = result?.crop_data ?? result;
      const cropData =
        cropDataCandidate && typeof cropDataCandidate === "object"
          ? {
              crop_name: cropDataCandidate.crop_name ?? null,
              crop_unit: cropDataCandidate.crop_unit ?? null,
              price_per_unit: cropDataCandidate.price_per_unit ?? null,
              quantity: cropDataCandidate.quantity ?? null,
            }
          : null;

      const hasAnyCropField = !!(
        cropData &&
        (cropData.crop_name ||
          cropData.price_per_unit ||
          cropData.quantity ||
          cropData.crop_unit)
      );

      if (hasAnyCropField && onCropDataExtracted) {
        console.log("Extracted crop data:", cropData);
        onCropDataExtracted({
          name: cropData.crop_name || "",
          price: cropData.price_per_unit || "",
          unit: cropData.crop_unit || "per kg",
          quantity: cropData.quantity || "",
        });
      }

      const transcriptionText = result?.transcription
        ? String(result.transcription)
        : "";
      if (hasAnyCropField) {
        alert(
          `Upload successful!${
            transcriptionText ? `\n\nTranscription: ${transcriptionText}` : ""
          }\n\nForm auto-filled with: ${
            cropData.crop_name || "No crop detected"
          }`
        );
      } else {
        alert(
          `Upload successful!${
            transcriptionText ? `\n\nTranscription: ${transcriptionText}` : ""
          }\n\nNo crop information detected.`
        );
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="panel record-container" style={{ maxWidth: 520 }}>
      <h3 style={{ marginTop: 0 }}>Voice Recorder</h3>
      {isRecording && (
        <div
          style={{
            marginBottom: 12,
            padding: 8,
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: 4,
            color: "#c62828",
          }}
        >
          <FaCircle style={{ color: '#ff0000', marginRight: '8px' }} />
          Recording... Speak now!
        </div>
      )}
      {error && (
        <div className="error-message" style={{ marginBottom: 12 }}>
          <span className="error-icon">!</span>
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {!isRecording && !audioBlob && (
          <button className="button primary" onClick={startRecording}>
            Start Recording
          </button>
        )}
        {isRecording && (
          <button
            className="button"
            onClick={stopRecording}
            style={{ backgroundColor: "#ff4444", color: "white" }}
          >
            <FaCircle style={{ color: '#ff0000', marginRight: '8px' }} />
            Stop Recording
          </button>
        )}
        {!!audioBlob && (
          <>
            <audio
              key={audioUrl} // Force re-render when audio changes
              ref={audioRef}
              controls
              style={{ width: "100%" }}
              preload="metadata"
              crossOrigin="anonymous"
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="button" onClick={reRecord}>
                Re-record
              </button>
              <button
                className="button"
                onClick={() => {
                  if (audioRef.current) {
                    console.log("Testing audio playback...");
                    audioRef.current
                      .play()
                      .catch((e) => console.error("Play failed:", e));
                  }
                }}
              >
                Test Play
              </button>
              <button
                className="button primary"
                onClick={upload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {/* {audioBlob && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: "#f0f8ff",
                  borderRadius: 8,
                  border: "1px solid #b3d9ff",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#0066cc" }}>
                  Audio File Info:
                </h4>
                <p>
                  <strong>File Size:</strong> {audioBlob.size} bytes
                </p>
                <p>
                  <strong>File Type:</strong> {audioBlob.type}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {audioRef.current?.duration
                    ? `${audioRef.current.duration.toFixed(2)}s`
                    : "Loading..."}
                </p>
                <p>
                  <strong>Direct Link:</strong>{" "}
                  <a href={audioUrl} target="_blank" rel="noopener noreferrer">
                    Open in new tab
                  </a>
                </p>
              </div>
            )} */}
            {/* {uploadResult && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: "#f0f8ff",
                  borderRadius: 8,
                  border: "1px solid #b3d9ff",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", color: "#0066cc" }}>
                  Upload Result:
                </h4>
                <p>
                  <strong>Transcription:</strong> {uploadResult.transcription}
                </p>
                {uploadResult.crop_data && (
                  <div>
                    <p>
                      <strong>Extracted Data:</strong>
                    </p>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                      <li>
                        <strong>Crop:</strong>{" "}
                        {uploadResult.crop_data.crop_name || "Not detected"}
                      </li>
                      <li>
                        <strong>Quantity:</strong>{" "}
                        {uploadResult.crop_data.quantity || "Not detected"}
                      </li>
                      <li>
                        <strong>Unit:</strong>{" "}
                        {uploadResult.crop_data.crop_unit || "Not detected"}
                      </li>
                      <li>
                        <strong>Price:</strong>{" "}
                        {uploadResult.crop_data.price_per_unit ||
                          "Not detected"}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  );
}
