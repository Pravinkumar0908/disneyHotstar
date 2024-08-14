import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { BsFillPlayFill, BsFillPauseFill, BsFillVolumeUpFill, BsFillVolumeMuteFill, BsFillSkipStartFill, BsFillSkipEndFill, BsX } from 'react-icons/bs';

const TMDB_API_KEY = ''; // Replace with your actual TMDB API key
const YOUTUBE_API_KEY = ''; // Replace with your actual YouTube API key

function Preview() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('episodes');
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [videoId, setVideoId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const youtubePlayerRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Fetch movie details
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
                const data = await response.json();
                if (data.status_code) {
                    throw new Error(data.status_message);
                }
                setMovie(data);

                // Fetch YouTube video with additional details
                fetchYouTubeVideo(
                    data.title, 
                    data.overview, 
                    data.release_date, 
                    data.credits?.cast.map(actor => actor.name) || []
                );
                
                // Fetch related movies
                fetchRelatedMovies(data.id);
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        };

        const fetchRelatedMovies = async (movieId) => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US`);
                const data = await response.json();
                setRelatedMovies(data.results);
            } catch (error) {
                console.error('Error fetching related movies:', error);
            }
        };

        const fetchYouTubeVideo = async (title, overview, releaseDate, actors) => {
            try {
                // Create a more descriptive search query
                const actorsString = actors.join(' '); // Join actors' names into a single string
                const searchQuery = `${title} ${actorsString} ${releaseDate.split('-')[0]}`; // Title, actors, and release year

                const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`);
                const data = await response.json();

                // Filter and select a relevant video
                const filteredItems = data.items.filter(item => item.snippet.title.toLowerCase().includes(title.toLowerCase()));

                if (filteredItems.length > 0) {
                    setVideoId(filteredItems[0].id.videoId);
                } else if (data.items.length > 0) {
                    setVideoId(data.items[0].id.videoId);
                }
            } catch (error) {
                console.error('Error fetching YouTube video:', error);
            }
        };

        fetchMovie();
    }, [id]);

    const handleSubscribeToWatch = () => {
        // Add your logic here
        if (videoId) {
            setIsPlaying(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                }
            }, 100);
        } else {
            alert("Sorry, no video available for this movie.");
        }
    };
    
    const togglePlayPause = () => {
        if (youtubePlayerRef.current) {
            if (isPlaying) {
                youtubePlayerRef.current.pauseVideo();
                setIsPlaying(false);
            } else {
                youtubePlayerRef.current.playVideo();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (youtubePlayerRef.current) {
            if (isMuted) {
                youtubePlayerRef.current.unMute();
                setIsMuted(false);
            } else {
                youtubePlayerRef.current.mute();
                setIsMuted(true);
            }
        }
    };

    const playNextVideo = () => {
        // Implement logic to play the next video
    };

    const playPreviousVideo = () => {
        // Implement logic to play the previous video
    };

    const handleVideoClose = () => {
        setIsPlaying(false);
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="preview">
            {movie && (
                <>
                    <div className="preview__background">
                        <img 
                            className="preview__poster" 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                        />
                    </div>
                    <div className="preview__content">
                        <h1>{movie.title}</h1>
                        <p>
                            <strong>Released:</strong> {movie.release_date}&nbsp;&nbsp;
                            <span>{movie.original_language.toUpperCase()}</span>&nbsp;&nbsp;
                            <span className="for_watching">{movie.adult ? '18+' : 'PG'}</span>
                        </p>
                        <p>{movie.overview}</p>
                        <p><strong>Actors:</strong> {movie.credits?.cast.map(actor => actor.name).join(', ')}</p>
                        <button className='subscribe_watch' onClick={handleSubscribeToWatch}>Subscribe To Watch</button>
                        <button className='subscribe_watch_add'>+</button>
                    </div>
                </>
            )}

            {isPlaying && videoId && (
                <div className="video-container" ref={videoRef}>
                    <YouTube 
                        videoId={videoId} 
                        opts={{ 
                            playerVars: {
                                autoplay: 1,
                                controls: 1,
                                fs: 1,
                            },
                        }}
                        onReady={(event) => {
                            youtubePlayerRef.current = event.target;
                        }}
                    />
                    <button onClick={togglePlayPause} className="control-btn">
                        {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
                    </button>
                    <button onClick={toggleMute} className="control-btn">
                        {isMuted ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                    </button>
                    <button onClick={playPreviousVideo} className="control-btn">
                        <BsFillSkipStartFill />
                    </button>
                    <button onClick={playNextVideo} className="control-btn">
                        <BsFillSkipEndFill />
                    </button>
                    <button onClick={handleVideoClose} className="close-video">
                        <BsX />
                    </button>
                </div>
            )}

            <div className="banner__nav">
                <nav>
                    <ul>
                        <li className={`epi_nav ${activeSection === 'episodes' ? 'active' : ''}`}>
                            <a href="#episodes" onClick={() => setActiveSection('episodes')}>Episodes</a>
                        </li>
                        <li className={activeSection === 'more-like-this' ? 'active' : ''}>
                            <a href="#more-like-this" onClick={() => setActiveSection('more-like-this')}>More Like This</a>
                        </li>
                        <li className={activeSection === 'trailers' ? 'active' : ''}>
                            <a href="#trailers" onClick={() => setActiveSection('trailers')}>Trailers & More</a>
                        </li>
                        <li className={activeSection === 'extras' ? 'active' : ''}>
                            <a href="#extras" onClick={() => setActiveSection('extras')}>Extras</a>
                        </li>
                    </ul>
                </nav>
            </div>

            {activeSection === 'episodes' && movie && (
                <div id="episodes" className="banner__section">
                    <h2>Episodes</h2>
                    <div className="episodes__list">
                        {relatedMovies.map((relatedMovie, index) => (
                            <div key={index} className="episode">
                                <img src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`} alt={relatedMovie.title} className="episode__poster" />
                                <div className="episode__info">
                                    <h3>{relatedMovie.title}</h3>
                                    <p><strong>Released:</strong> {relatedMovie.release_date}</p>
                                    <p>{relatedMovie.overview}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'more-like-this' && (
                <div id="more-like-this" className="banner__section">
                    <h2>More Like This</h2>
                    <div className="more-like-this__list">
                        {relatedMovies.map((relatedMovie, index) => (
                            <div key={index} className="more-like-this__item">
                                <img src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`} alt={relatedMovie.title} />
                                <p>{relatedMovie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'trailers' && (
                <div id="trailers" className="banner__section">
                    <h2>Trailers & More</h2>
                    {/* Add your trailers list here */}
                </div>
            )}

            {activeSection === 'extras' && (
                <div id="extras" className="banner__section">
                    <h2>Extras</h2>
                    {/* Add your extras list here */}
                </div>
            )}
        </div>
    );
}

export default Preview;
