import { useState, useRef } from "react";
import MapView from "../components/MapView";
import instructionsAudio from "../assets/instructions.wav";
import "../styles/mapAlerts.css";

const MapAlerts = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleReadInstructions = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(instructionsAudio);
    audioRef.current = audio;
    setPlaying(true);
    audio.play();
    audio.onended = () => setPlaying(false);
  };

  const handleStopInstructions = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
  };

  return (
    <div className="map-alerts-page">
      <h1 className="map-title">Disease Alerts!</h1>
      <div className="map-content">
        <div className="map-container">
          <MapView />
        </div>
        <aside
          style={{
            width: 320,
            minWidth: 220,
            height: "fit-content",
            position: "relative",
            top: "-50px",
            background: "#fff8e1",
            borderLeft: "2px solid #e0c68a",
            padding: "24px 18px",
            fontSize: "1.05rem",
            color: "#5d3a00",
            boxShadow: "0 0 12px #f5e6c1",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <h2 style={{ marginTop: 0, color: "#7c4a00", fontSize: "1.2rem" }}>
            नक्सा प्रयोग गर्ने तरिका
          </h2>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
            <li>
              रातो घेरा १० किलोमिटरको क्षेत्रफलमा रोग पत्ता लागेको स्थानलाई
              जनाउँछ।
            </li>
            <li>
              <b>रातो घेरा</b>मा क्लिक गर्दा त्यहाँ पत्ता लागेको रोगको विवरण
              देख्न सकिन्छ र हरियो बटनमा क्लिक गर्दा तपाईंले ती रोगको उपचार र थप
              विवरणहरू हेर्न सक्नुहुन्छ।
            </li>
            <li>
              <b>मानव आइकन</b> (नीलो) मा क्लिक गर्दा तपाईंको हालको स्थान
              देखिन्छ।
            </li>
            <li>नक्सामा स्क्रोल गरेर जुम इन/आउट गर्न सकिन्छ।</li>
            <li>नक्सामा विभिन्न प्रदेशहरूको सीमाना देख्न सकिन्छ।</li>
            <li>नयाँ रोग पत्ता लागेमा नक्सामा नयाँ घेरा देखिनेछ।</li>
          </ul>
          <div style={{ fontSize: "0.97rem", marginTop: 10, color: "#7c4a00" }}>
            <b>सूचना:</b> यदि तपाईंको स्थान देखिएन भने, कृपया लोकेशन अनुमति
            दिनुहोस्।
          </div>
          {!playing ? (
            <button
              onClick={handleReadInstructions}
              disabled={playing}
              style={{
                marginBottom: 12,
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: "1rem",
                cursor: playing ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: playing ? 0.7 : 1,
              }}
            >
              निर्देशनहरू सुनाउनुहोस्
            </button>
          ) : (
            <button
              onClick={handleStopInstructions}
              disabled={!playing}
              style={{
                marginBottom: 12,
                background: "#c62828",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: "1rem",
                cursor: !playing ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: !playing ? 0.7 : 1,
              }}
            >
              रोक्नुहोस्
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

export default MapAlerts;
