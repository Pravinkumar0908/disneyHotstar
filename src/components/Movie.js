import React, { useState, useEffect } from 'react';

const OMDB_API_KEY = ''; // Your OMDB API key

const requests = {
  popularShows: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=popular&plot=short`,
  comedyShows: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=comedy&plot=short`,
  familyShows: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=family&plot=short`,
  animeShows: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=anime&plot=short`,
};


function Tv() {
  const [tvShows, setTvShows] = useState({
    popularShows: [],
    comedyShows: [],
    familyShows: [],
    animeShows: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const [popularResponse, comedyResponse, familyResponse, animeResponse] = await Promise.all([
          fetch(requests.popularShows),
          fetch(requests.comedyShows),
          fetch(requests.familyShows),
          fetch(requests.animeShows),
        ]);

        if (!popularResponse.ok || !comedyResponse.ok || !familyResponse.ok || !animeResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const [popularData, comedyData, familyData, animeData] = await Promise.all([
          popularResponse.json(),
          comedyResponse.json(),
          familyResponse.json(),
          animeResponse.json(),
        ]);

        if (popularData.Response === 'False' || comedyData.Response === 'False' || familyData.Response === 'False' || animeData.Response === 'False') {
          throw new Error(popularData.Error || comedyData.Error || familyData.Error || animeData.Error);
        }

        setTvShows({
          popularShows: popularData.Search || [],
          comedyShows: comedyData.Search || [],
          familyShows: familyData.Search || [],
          animeShows: animeData.Search || [],
        });

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchTvShows();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}&plot=short`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        throw new Error(data.Error);
      }
      setSearchResults(data.Search || []);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  return (
    <div className="tv__container">
      {/* Search Input Section */}
      <div className="tv__search">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Movies, Shows and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='search' type="submit">Search</button>
        </form>
      </div>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="tv__category">
          <h2 className="tv__category__title">Search Results for "{searchQuery}"</h2>
          <div className="tv__row">
            {searchResults.map((show) => (
              <div key={show.imdbID} className="tv__item">
                <img src={show.Poster} alt={show.Title} />
                <div className="tv__item__details">
                  <h3>{show.Title}</h3>
                  <p>Released: {show.Year}</p>
                  <p>IMDb Rating: {show.imdbRating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Shows Section */}
      <div className="tv__category">
        <h2 className="tv__category__title">Popular Shows</h2>
        <div className="tv__row">
          {tvShows.popularShows.map((show) => (
            <div key={show.imdbID} className="tv__item">
              <img src={show.Poster} alt={show.Title} />
              <div className="tv__item__details">
                <h3>{show.Title}</h3>
                <p>Released: {show.Year}</p>
                <p>IMDb Rating: {show.imdbRating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comedy Shows Section */}
      <div className="tv__category">
        <h2 className="tv__category__title">Comedy Shows</h2>
        <div className="tv__row">
          {tvShows.comedyShows.map((show) => (
            <div key={show.imdbID} className="tv__item">
              <img src={show.Poster} alt={show.Title} />
              <div className="tv__item__details">
                <h3>{show.Title}</h3>
                <p>Released: {show.Year}</p>
                <p>IMDb Rating: {show.imdbRating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Shows Section */}
      <div className="tv__category">
        <h2 className="tv__category__title">Family Shows</h2>
        <div className="tv__row">
          {tvShows.familyShows.map((show) => (
            <div key={show.imdbID} className="tv__item">
              <img src={show.Poster} alt={show.Title} />
              <div className="tv__item__details">
                <h3>{show.Title}</h3>
                <p>Released: {show.Year}</p>
                <p>IMDb Rating: {show.imdbRating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Shows Section */}
      <div className="tv__category">
        <h2 className="tv__category__title">Anime Shows</h2>
        <div className="tv__row">
          {tvShows.animeShows.map((show) => (
            <div key={show.imdbID} className="tv__item">
              <img src={show.Poster} alt={show.Title} />
              <div className="tv__item__details">
                <h3>{show.Title}</h3>
                <p>Released: {show.Year}</p>
                <p>IMDb Rating: {show.imdbRating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tv;
