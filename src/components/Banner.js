import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const TMDB_API_KEY = '58783adfbeee0eb3d75a34556e460e51'; // Replace with your TMDB API key

function Banner() {
  const [currentShow, setCurrentShow] = useState({
    title: 'Arjun Chor',
    description: 'Twin brothers on the opposite sides of the law get caught in a complex web of deceit, loyalty and betrayal.',
    year: '2024',
    seasons: '1 Season',
    languages: '7 Languages',
    rating: 'U/A 16+',
    genres: ['Thriller', 'Action', 'Drama', 'Organised Crime'],
    videoUrl: '',
    image: ''
  });

  const [shows, setShows] = useState([]);
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await response.json();
        if (data.results) {
          const fetchedShows = await Promise.all(data.results.map(async (movie) => {
            const detailResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=videos`);
            const detailData = await detailResponse.json();
            const trailer = detailData.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            return {
              id: movie.id,
              title: movie.title,
              image: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
              videoUrl: trailer ? trailer.key : '',
              description: detailData.overview,
              year: detailData.release_date.split('-')[0],
              seasons: '',
              languages: detailData.spoken_languages.map(lang => lang.english_name).join(', '),
              rating: detailData.vote_average.toFixed(1),
              genres: detailData.genres.map(genre => genre.name)
            };
          }));
          setShows(fetchedShows);
          setCurrentShow(fetchedShows[0]);
        }
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows();
  }, []);

  const handleSlideClick = (show) => {
    setCurrentShow(show);
    if (playerRef.current && playerRef.current.internalPlayer && show.videoUrl) {
      playerRef.current.internalPlayer.loadVideoById(show.videoUrl);
      if (isMuted) {
        playerRef.current.internalPlayer.mute();
      } else {
        playerRef.current.internalPlayer.unMute();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (playerRef.current && playerRef.current.internalPlayer) {
      if (isMuted) {
        playerRef.current.internalPlayer.unMute();
      } else {
        playerRef.current.internalPlayer.mute();
      }
    }
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    if (currentShow.videoUrl) {
      event.target.loadVideoById(currentShow.videoUrl);
      event.target.playVideo();
      if (isMuted) {
        event.target.mute();
      }
    }
  };

  return (
    <div className="banner" style={{ position: 'relative', overflow: 'hidden', color: 'white', height: '100vh' }}>
      {currentShow.videoUrl ? (
        <YouTube
          videoId={currentShow.videoUrl}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              controls: 0,
              mute: 1,
              modestbranding: 1,
              showinfo: 0,
              rel: 0,
              loop: 1,
              playlist: currentShow.videoUrl
            }
          }}
          onReady={onReady}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      ) : (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentShow.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          zIndex: 0
        }}></div>
      )}

      <div className="banner__contents" style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
        <h2 style={{ color: '#00ff00' }}>hotstar specials</h2>
        <h1 className="banner__title" style={{ fontSize: '3rem' }}>{currentShow.title}</h1>
        <p>{`${currentShow.year} • ${currentShow.seasons} • ${currentShow.languages} • ${currentShow.rating}`}</p>
        <p className="banner__description">{currentShow.description}</p>
        <div className="banner__genres">
          {currentShow.genres.map((genre, index) => (
            <span key={index} style={{ marginRight: '10px' }}>{genre}</span>
          ))}
        </div>
        <div className="banner__buttons" style={{ marginTop: '20px' }}>
          <button className="subscribe_watch" style={{ padding: '10px 20px', marginRight: '10px', background: '#1f80e0', border: 'none', color: 'white', cursor: 'pointer' }}>
            <i className="bi bi-play"></i> Subscribe to Watch
          </button>
          <button className="subscribe_watch_add" style={{ padding: '10px 20px', marginRight: '10px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>
        </div>
      </div>

      <div className="banner__slider" style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', zIndex: 2 }}>
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={5}
          spaceBetween={10}
          navigation
          autoplay={{ delay: 3000 }}
        >
          {shows.map((show) => (
            <SwiperSlide key={show.id}>
              <img 
                src={show.image} 
                alt={show.title} 
                style={{ cursor: 'pointer', borderRadius: '5px', width: '100%', height: 'auto' }}
                onClick={() => handleSlideClick(show)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="banner--fadeBottom" style={{ 
        height: '100%',
        backgroundImage: 'linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.61), #111)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}></div>
    </div>
  );
}

export default Banner;