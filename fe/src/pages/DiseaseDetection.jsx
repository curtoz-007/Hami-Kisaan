import { useState, useRef } from 'react'
import "../styles/DiseaseDetection.css";

export default function Diseasedetection() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setError(null)
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
      } else {
        setError('Please select a valid image file (JPEG, PNG, etc.)')
        setSelectedFile(null)
        setPreview(null)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
        setError(null)
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera access is allowed.')
      console.error('Camera error:', err)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
      setSelectedFile(file)
      setPreview(canvas.toDataURL('image/jpeg'))
      setShowCamera(false)
      video.srcObject.getTracks().forEach(track => track.stop())
    }, 'image/jpeg')
  }

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    setShowCamera(false)
    setError(null)
  }

  const analyzeImage = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords

      const formData = new FormData()
      formData.append('image', selectedFile)

      const url = new URL('http://localhost:8000/disease_detection')
      url.searchParams.append('lat', latitude)
      url.searchParams.append('lon', longitude)

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        throw new Error('Failed to analyze image')
      }
    } catch (err) {
      setError('Failed to analyze image or get location. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="disease-page">
      <div className="container">
        <div className="disease-header">
          <h1>Plant Disease Detection</h1>
          <p>Upload a photo or capture a live image of your plant to get instant disease analysis</p>
        </div>

        <div className="disease-content">
          <div className="upload-section">
            <div 
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
                 className={selectedFile ? 'upload-area has-file' : 'upload-area'}>
              
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
                <span className="error-icon">⚠️</span>
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

          {result && (
            <div className="results-section">
              <h2>Analysis Results</h2>
              <div className="result-card">
                <div className="result-header">
                  <div className="disease-icon">
                    {result.disease_detected.toLowerCase().includes('healthy') ? '✅' : '⚠️'}
                  </div>
                  <div className="result-info">
                    <h3>
                      {result.disease_detected.toLowerCase().includes('healthy') 
                        ? 'Plant is Healthy' 
                        : `Disease: ${result.disease_detected}`}
                    </h3>
                  </div>
                </div>
                
                <div className="result-details">
                  <h4>Potential Harms</h4>
                  <p>{result.Potential_Harms}</p>

                  <h4>Solutions</h4>
                  <p>{result.Solution}</p>

                  <h4>Organic Solutions</h4>
                  <p>{result.Organic_Solutions}</p>

                  <h4>Fungicide Solutions</h4>
                  <p>{result.Insecticide_Solutions}</p>

                  <h4>Sources</h4>
                  <ul className="sources-list">
                    {result.Sources.map((source, index) => {
                      const [source_name, URL] = Object.entries(source)[0]
                      return (
                        <li key={index}>
                          <a href={URL} target="_blank" rel="noopener noreferrer" className="source-link">
                            {source_name}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
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

          <div className="tips-section">
            <h2>Tips for Better Results</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📱</div>
                <h3>Clear Photos</h3>
                <p>Take photos in good lighting with the affected area clearly visible</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🔍</div>
                <h3>Close-up Shots</h3>
                <p>Focus on the specific symptoms or affected parts of the plant</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🌞</div>
                <h3>Natural Light</h3>
                <p>Use natural daylight for the most accurate color representation</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📏</div>
                <h3>Multiple Angles</h3>
                <p>Take photos from different angles for comprehensive analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}