import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TMDB_API_KEY = '58783adfbeee0eb3d75a34556e460e51'; // Replace with your TMDB API key

const requests = {
  popularShows: `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`,
  comedyShows: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35`, // Comedy genre ID is 35
  familyShows: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10751`, // Family genre ID is 10751
  animeShows: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16`, // Anime genre ID is 16
};

function Search() {
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
  const [recentSearches, setRecentSearches] = useState([]);
  const [relatedShows, setRelatedShows] = useState([]);

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

        setTvShows({
          popularShows: popularData.results || [],
          comedyShows: comedyData.results || [],
          familyShows: familyData.results || [],
          animeShows: animeData.results || [],
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
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.results || []);
      setRecentSearches(prev => [...new Set([query, ...prev])].slice(0, 5)); // Add recent search
      setIsLoading(false);

      // Fetch related shows if there are search results
      if (data.results.length > 0) {
        const firstShowId = data.results[0].id; // Take the first result for related shows
        fetchRelatedShows(firstShowId);
      } else {
        setRelatedShows([]);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const fetchRelatedShows = async (showId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${showId}/recommendations?api_key=${TMDB_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRelatedShows(data.results || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  const handleRemoveRecentSearch = (query) => {
    setRecentSearches(recentSearches.filter(item => item !== query));
  };

  return (
    <div className="tv__container1">
      {/* Search Input Section */}
      <div className="tv__search1">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Movies, Shows and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="recent__searches">
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((query, index) => (
              <li key={index}>
                <span onClick={() => handleSearch(query)}>{query}</span>
                <button onClick={() => handleRemoveRecentSearch(query)}><i className="bi bi-x-circle"></i></button>
              </li>
            ))}
          </ul>
        </div>
        <h2 className="search__category__title">Trending in India</h2>
      </div>

      {/* Loading and Error Handling */}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {/* Search Results Section */}
      {searchQuery && searchResults.length > 0 ? (
        <>
          <div className="search_category">
            <h2>Search Results</h2>
            <div className="search__row">
              {searchResults.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Shows Section */}
          <div className="search_category">
            <h2>Related Shows</h2>
            <div className="search__row">
              {relatedShows.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Popular Shows Section */}
          <div className="search_category">
            <h2>Popular Shows</h2>
            <div className="search__row">
              {tvShows.popularShows.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comedy Shows Section */}
          <div className="search_category">
            <h2>Comedy Shows</h2>
            <div className="search__row">
              {tvShows.comedyShows.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Shows Section */}
          <div className="search_category">
            <h2>Family Shows</h2>
            <div className="search__row">
              {tvShows.familyShows.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anime Shows Section */}
          <div className="search_category">
            <h2>Anime Shows</h2>
            <div className="search__row">
              {tvShows.animeShows.map((show) => (
                <div key={show.id} className="search__item">
                  <Link to={`/preview/${show.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} />
                  </Link>
                  <div className="search__item__detail">
                    <h3 className="search_item_title">{show.name}</h3>
                    <p>{show.first_air_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
