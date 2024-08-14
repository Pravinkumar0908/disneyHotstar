import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";


function Home({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const observerRef = useRef();
  const lastMovieRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const fetchMovies = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${fetchUrl}&page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      if (data.results.length === 0) {
        throw new Error('No more items found');
      }
      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMovies();
        }
      },
      { threshold: 1 }
    );

    if (lastMovieRef.current) {
      observerRef.current.observe(lastMovieRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [movies]);

  const handleClick = (id) => {
    if (isLoggedIn) {
      navigate(`/preview/${id}`);
    } else {
      alert('You need to be logged in to view this content.');
    }
  };

  if (error) return <div className="error">Error: {error}</div>;
  if (movies.length === 0 && !isLoading) return <div className="no-items">No items found</div>;

  return (
    <div className="home">
    <h2>{title}</h2>
    <div className="home__posters">
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="home__poster" 
          onClick={() => handleClick(movie.id)}
          ref={index === movies.length - 1 ? lastMovieRef : null}
        >
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
    {isLoading && <div className="loading">Loading more...</div>}
  </div>
  
  );
}

export default Home;
