import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const MoviePosters = ({ category, movies }) => (
  <div className="movie-category">
    <h2>{category}</h2>
    <div className="movie-posters">
      {movies.map((movie, index) => (
        <img key={index} src={movie.Poster} alt={movie.Title} className="movie-poster" />
      ))}
    </div>
  </div>
);

const Subscribe = () => {
  const [selectedPlan, setSelectedPlan] = useState('Super');
  const [billingCycle, setBillingCycle] = useState('Quarterly');
  const [movieCategories, setMovieCategories] = useState({
    action: [],
    comedy: [],
    drama: [],
    sciFi: [],
    love: [],
    bollywood: []
  });
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (searchTerm, page) => {
    const API_KEY = 'ffe81133'; // Replace with your actual API key
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie&page=${page}`);
      return response.data.Search || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  };

  const loadMoreMovies = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const action = await fetchMovies('aladdin', page);
    const comedy = await fetchMovies('comedy', page);
    const drama = await fetchMovies('drama', page);
    const sciFi = await fetchMovies('cute', page);
    const love = await fetchMovies('love', page);
    const bollywood = await fetchMovies('bollywood', page);

    setMovieCategories((prevCategories) => ({
      action: [...prevCategories.action, ...action],
      comedy: [...prevCategories.comedy, ...comedy],
      drama: [...prevCategories.drama, ...drama],
      sciFi: [...prevCategories.sciFi, ...sciFi],
      love: [...prevCategories.love, ...love],
      bollywood: [...prevCategories.bollywood, ...bollywood]
    }));

    setPage((prevPage) => prevPage + 1);
    setIsFetching(false);
  };

  useEffect(() => {
    loadMoreMovies();
  }, []);

  const handleScroll = useCallback((e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      loadMoreMovies();
    }
  }, [loadMoreMovies, isFetching]);

  const handleContinue = () => {
    navigate('/subscribe');
  };

  return (
    <div className="subscribe-container">
      <h1>Subscribe now and start streaming</h1>
      <div className="plans-comparison">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Super</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>All content</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Watch on TV or Laptop</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Ads free movies and shows (except sports)</td>
              <td>✗</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Number of devices that can be logged in</td>
              <td>2</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Max video quality</td>
              <td>Full HD <br />1080p</td>
              <td>4K 2160p<br /> + Dolby Vision</td>
            </tr>
            <tr>
              <td>Max audio quality<br /><b>Atoms Available</b></td>
              <td>Dolby Atmos</td>
              <td>Dolby Atmos</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="billing-cycle">
        <button
          className={billingCycle === 'Quarterly' ? 'active' : ''}
          onClick={() => setBillingCycle('Quarterly')}
        >
          Quarterly&nbsp;<i id="quarterly" className="bi bi-check"></i>
        </button>
        <button
          className={billingCycle === 'Yearly' ? 'active' : ''}
          onClick={() => setBillingCycle('Yearly')}
        >
          Yearly
        </button>
        <button
          className={billingCycle === 'Monthly' ? 'active' : ''}
          onClick={() => setBillingCycle('Monthly')}
        >
          Monthly
        </button>
      </div>
      <div className="plan-selection">
        <button
          className={`plan-button1 ${selectedPlan === 'Super' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('Super')}
        ><i id="super" className="bi bi-check"></i>
          Super
          <span className="price">₹<span id="month"></span>299/<span id="month">3Months</span></span>
        </button>
        <button
          className={`plan-button ${selectedPlan === 'Premium' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('Premium')}
        >
          Premium
          <span className="price">₹499/<span id="month">3Months</span></span>
        </button>
      </div>
      <button className="continue-button" onClick={handleContinue}>
        Continue with {selectedPlan}&nbsp;✓
      </button>

      <div className="movie-categories" onScroll={handleScroll}>
        <MoviePosters category="" movies={movieCategories.action} />
        <MoviePosters category="" movies={movieCategories.comedy} />
        <MoviePosters category="" movies={movieCategories.drama} />
        <MoviePosters category="" movies={movieCategories.sciFi} />
        <MoviePosters category="" movies={movieCategories.bollywood} />
        <MoviePosters category="" movies={movieCategories.love} />
      </div>
    </div>
  );
};

export default Subscribe;
