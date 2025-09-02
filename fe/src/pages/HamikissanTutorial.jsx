import React, { useState, useEffect } from 'react';
import '../styles/hamikissanTutorial.css';

const videoIds = [
  'FDGqWrDBPdA',
  'gNLQNgbzEdU',
  'J2X4k9q4Bss',
  '5X8KMdrPHC0',
  'WCzqst6XbzE',
  'ffPs7JuiQVc'
];

// Replace with your own API key or use env variable


const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;



// Helper to convert ISO 8601 duration to mm:ss
function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return `${hours ? hours + ':' : ''}${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

const HamikissanTutorial = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const idsString = videoIds.join(',');
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${idsString}&key=${API_KEY}`
        );
        const data = await response.json();

        const videos = data.items.map(item => ({
          id: item.id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
          description: item.snippet.description,
          views: `${item.statistics.viewCount} views`,
          duration: parseDuration(item.contentDetails.duration),
          timestamp: new Date(item.snippet.publishedAt).toLocaleDateString()
        }));

        setVideoData(videos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  const filteredVideos = videoData.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const VideoCard = ({ video, onClick }) => (
    <div className="tutorial-video-card" onClick={() => onClick(video)}>
      <div className="tutorial-video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="tutorial-video-overlay"></div>
        <div className="tutorial-play-button">
          <div className="tutorial-play-icon">▶</div>
        </div>
        <div className="tutorial-video-duration">{video.duration}</div>
      </div>
      <div className="tutorial-video-info">
        <div className="tutorial-video-channel-logo">
          {video.channel.charAt(0).toUpperCase()}
        </div>
        <div className="tutorial-video-details">
          <h3 className="tutorial-video-title">{video.title}</h3>
          <p className="tutorial-video-channel">{video.channel}</p>
          <p className="tutorial-video-meta">{video.views} • {video.timestamp}</p>
        </div>
      </div>
    </div>
  );

  const RelatedVideoCard = ({ video, onClick }) => (
    <div className="tutorial-related-video-card" onClick={() => onClick(video)}>
      <div className="tutorial-related-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="tutorial-related-overlay"></div>
        <div className="tutorial-related-play">▶</div>
        <div className="tutorial-related-duration">{video.duration}</div>
      </div>
      <div className="tutorial-related-info">
        <h4>{video.title}</h4>
        <p>{video.channel}</p>
        <p>{video.views}</p>
      </div>
    </div>
  );

  return (
    <div className="tutorial-container">
      {/* Search Bar */}
      <div className="tutorial-search-section">
        <div className="tutorial-search-container">
          <input
            type="text"
            placeholder="Search farming tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tutorial-search-input"
          />
          <button className="tutorial-search-button">Search</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="tutorial-main-content">
        {selectedVideo ? (
          <div className="tutorial-video-player-page">
            <button className="tutorial-back-button" onClick={() => setSelectedVideo(null)}>
              ← Back to Tutorials
            </button>

            <div className="tutorial-video-player-grid">
              <div className="tutorial-video-player-section">
                <div className="tutorial-video-iframe">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h2 className="tutorial-player-title">{selectedVideo.title}</h2>
                <div className="tutorial-player-meta">
                  <div className="tutorial-player-channel-logo">
                    {selectedVideo.channel.charAt(0).toUpperCase()}
                  </div>
                  <span className="tutorial-player-channel">{selectedVideo.channel}</span>
                  <span className="tutorial-player-views">{selectedVideo.views} • {selectedVideo.timestamp}</span>
                </div>
                <p className="tutorial-player-description">{selectedVideo.description}</p>
              </div>

              <div className="tutorial-related-videos">
                <h3>More Tutorials</h3>
                <div className="tutorial-related-videos-list">
                  {videoData.filter(v => v.id !== selectedVideo.id).map((video, index) => (
                    <RelatedVideoCard key={index} video={video} onClick={setSelectedVideo} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="tutorial-grid-page">
            <div className="tutorial-page-title">
              <h2>Farming Tutorial Library</h2>
              <p>Learn modern farming techniques to improve your harvest</p>
            </div>

            <div className="tutorial-category-pills">
              {['All Tutorials', 'Crop Management', 'Soil Health', 'Pest Control', 'Water Systems', 'Organic Methods', 'Equipment'].map((category, index) => (
                <button 
                  key={index} 
                  className={`tutorial-category-pill ${index === 0 ? 'tutorial-active-pill' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="tutorial-loading">
                <p>Loading farming tutorials...</p>
              </div>
            ) : (
              <div className="tutorial-video-grid">
                {filteredVideos.map((video, index) => (
                  <VideoCard key={index} video={video} onClick={setSelectedVideo} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HamikissanTutorial;
