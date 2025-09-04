import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import "../styles/DiseaseDetection.css";

export default function DiseaseDetection() {
  const BE_BASE_URL = `https://api1.xento.xyz`;
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);
  const [isLoadingDiseaseDetail, setIsLoadingDiseaseDetail] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const lastFetchedDisease = useRef(null);
  const hasFetched = useRef(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name, file.type, file.size);
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, etc.)');
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 5MB limit.');
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Dropped file:', file.name, file.type, file.size);
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera access is allowed.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
      console.log('Captured file:', file.name, file.type, file.size);
      if (file.size > MAX_FILE_SIZE) {
        setError('Captured photo exceeds 5MB limit.');
        setShowCamera(false);
        video.srcObject.getTracks().forEach(track => track.stop());
        return;
      }
      setSelectedFile(file);
      setPreview(canvas.toDataURL('image/jpeg'));
      setShowCamera(false);
      video.srcObject.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setError(null);
  };

  const fetchRecommendations = useCallback(async (disease) => {
    if (lastFetchedDisease.current === disease || hasFetched.current) return;

    setIsFetchingRecommendations(true);
    setError(null);

    try {
      const response = await fetch(`${BE_BASE_URL}/disease_detection_detailed/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease_name: disease }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Recommendations API error:', response.status, errorText);
        throw new Error(`Failed to fetch recommendations: ${response.status} ${errorText}`);
      }

      const content = await response.json();
      console.log('Recommendations response:', content);
      setRecommendations(content);
      lastFetchedDisease.current = disease;
      hasFetched.current = true;
      return content;
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
      console.error('Recommendations API Error:', err);
      return null;
    } finally {
      setIsFetchingRecommendations(false);
    }
  }, [BE_BASE_URL]);

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setRecommendations(null);
    lastFetchedDisease.current = null;
    hasFetched.current = false;

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => reject(new Error(`Geolocation failed: ${error.message}`))
        );
      });

      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`);

      const formData = new FormData();
      formData.append('image', selectedFile);
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key}=${value.name || value}`);
      }

      const url = new URL(`${BE_BASE_URL}/disease_detection`);
      url.searchParams.append('lat', latitude.toFixed(5));
      url.searchParams.append('lon', longitude.toFixed(5));

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Disease Detection API error:', response.status, errorText);
        throw new Error(`Failed to analyze image: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Disease Detection API response:', data);
      setResult(data);

      if (data.disease_detected) {
        await fetchRecommendations(data.disease_detected);
      } else {
        setError('No disease detected in the image.');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again later.');
      console.error('Error in analyzeImage:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setRecommendations(null);
    setError(null);
    lastFetchedDisease.current = null;
    hasFetched.current = false;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const diseaseName = params.get("name")?.trim().toLowerCase();

    const fetchDiseaseDetail = async () => {
      if (diseaseName && !hasFetched.current) {
        setIsLoadingDiseaseDetail(true);
        console.log("Fetching for disease name:", diseaseName);
        const result = await fetchRecommendations(diseaseName);
        console.log("Fetched disease details:", result);
        setIsLoadingDiseaseDetail(false);
      }
    };

    fetchDiseaseDetail();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [location.search, fetchRecommendations]);

  const hasQuery = !!new URLSearchParams(location.search).get("name");

  return (
    <div className="disease-page">
      <div className="container">
        <div className="disease-header">
          <h1>Plant Disease Detection</h1>
          <p>Upload a photo or capture a live image of your plant to get instant disease analysis</p>
        </div>

        {hasQuery && isLoadingDiseaseDetail && (
          <div className="loading-message">
            <span className="loading-spinner"></span>
            Loading disease details...
          </div>
        )}

        <div className="disease-content">
          {!hasQuery && (
            <div className="upload-section">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={selectedFile ? 'upload-area has-file' : 'upload-area'}
              >
                {!preview && !showCamera ? (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📸</div>
                    <h3>Upload or Capture Plant Image</h3>
                    <p>Drag & drop an image, upload from device, or use camera</p>
                    <div className="button-group">
                      <button
                        className="button primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Image
                      </button>
                      <button
                        className="button primary"
                        onClick={startCamera}
                      >
                        Open Camera
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : showCamera ? (
                  <div className="camera-preview">
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                    <div className="camera-controls">
                      <button
                        className="button primary"
                        onClick={capturePhoto}
                      >
                        Capture Photo
                      </button>
                      <button
                        className="button secondary"
                        onClick={closeCamera}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={preview} alt="Plant preview" />
                    <div className="preview-overlay">
                      <button
                        className="button secondary"
                        onClick={resetForm}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">
                    <FaExclamationTriangle />
                  </span>
                  {error}
                </div>
              )}

              {selectedFile && (
                <div className="file-info">
                  <div className="file-details">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button
                    className="button primary analyze-btn"
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="loading-spinner"></span>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Plant'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {(result || (hasQuery && recommendations)) && (
            <div className="results-section">
              <h2>Analysis Results</h2>
              <div className="result-card">
                <div className="result-header">
                  <div className="disease-icon">
                    {(result?.disease_detected || new URLSearchParams(location.search).get("name"))?.toLowerCase()?.includes('healthy') ?
                      <FaCheckCircle style={{ color: '#4CAF50' }} /> :
                      <FaExclamationTriangle style={{ color: '#FF9800' }} />
                    }
                  </div>
                  <div className="result-info">
                    <h3>
                      {result?.disease_detected
                        ? result.disease_detected.toLowerCase().includes('healthy')
                          ? 'Plant is Healthy'
                          : `Disease: ${result.disease_detected}`
                        : hasQuery
                          ? `Disease: ${new URLSearchParams(location.search).get("name")}`
                          : 'Unknown Disease'}
                    </h3>
                  </div>
                </div>

                <div className="result-details">
                  {isFetchingRecommendations ? (
                    <div className="loading-recommendations">
                      <span className="loading-spinner"></span>
                      Getting Recommendations...
                    </div>
                  ) : recommendations ? (
                    <>
                      <h4>Potential Harms</h4>
                      <p>{recommendations.Potential_Harms}</p>

                      <h4>Solutions</h4>
                      <p>{recommendations.Solution}</p>

                      <h4>Organic Solutions</h4>
                      <p>{recommendations.Organic_Solutions}</p>

                      <h4>Sources</h4>
                      <ul className="sources-list">
                        {recommendations.Sources?.map((source, index) => {
                          const [source_name, URL] = Object.entries(source)[0];
                          return (
                            <li key={index}>
                              <a href={URL} target="_blank" rel="noopener noreferrer" className="source-link">
                                {source_name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}
                </div>

                <div className="result-actions">
                  <button className="button secondary" onClick={resetForm}>
                    Analyze Another Image
                  </button>
                  <button className="button primary">
                    Get Detailed Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}