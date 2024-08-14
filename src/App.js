import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Home.css';
import './Banner.css';
import './Navbar.css';
import './App.css';
import './Loader.css';
import './Category.css';
import './Tv.css';
import './Footer.css';
import './Preview.css';
import './Login.css';
import './Search.css';
import './Profile.css';
import './Subscribe.css';

import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Home from './components/Home';
import Category from './components/Category';
import Tv from './components/Tv';
import Footer from './components/Footer';
import Preview from './components/Preview';
import Login from './components/Login';
import Search from './components/Search';
import Profile from './components/Profile';
import Movie from './components/Movie';
import Sports from './components/Sports';
import Subscribe from './components/Subscribe';

const TMDB_API_KEY = ''; // Replace with your TMDB API key

const requests = {
    fetchComedyMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US`,
    fetchBollywoodMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&language=en-US`,
    fetchActionMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US`,
    fetchCartoons: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10762&language=en-US`,
    fetchWebSeries: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10767&language=en-US`,
    fetchHindiSerials: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=hi&language=en-US`,
    fetchRomanceMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&language=en-US`,
    fetchHorrorMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&language=en-US`,
    fetchDramaMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=18&language=en-US`,
    fetchScienceFictionMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878&language=en-US`,
    fetchThrillerMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=53&language=en-US`,
    fetchActionTVShows: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10759&language=en-US`,
    fetchFantasyTVShows: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765&language=en-US`,
    fetchMusicMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10402&language=en-US`,
    fetchFamilyMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10751&language=en-US`,
    fetchKidsMovies: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&language=en-US`,
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [, setSearchQuery] = useState('');
    const [, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            setTimeout(() => setShowStatus(false), 8000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
            setTimeout(() => setShowStatus(false), 8000);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.results.length === 0) {
                throw new Error('No results found');
            }
            setSearchResults(data.results || []);
        } catch (error) {
            setError(error.message);
            console.error('Fetch error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                <Navbar onSearch={handleSearch} />
                <div className="app__content">
                    {error && <div className="error">{`Error: ${error}`}</div>}
                    <Routes>
                        <Route path="/myspace" element={<div>My Space Content</div>} />
                        <Route path="/tv" element={<Tv />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/banner" element={<Banner />} />
                        <Route path="/movies" element={<Home title="Latest Released Movies" fetchUrl={requests.fetchLatestReleasedMovies} />} />
                        <Route path="/categories" element={<Category />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/movie" element={<Movie />} />
                        <Route path="/Sports" element={<Sports />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/subscribe" element={<Subscribe />} /> {/* Add this line */}
                        <Route path="/preview/:id" element={<Preview />} />

                        <Route path="/" element={
                            <>
                                <Banner />
                                <Home title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
                                <Home title="Bollywood Movies" fetchUrl={requests.fetchBollywoodMovies} />
                                <Home title="Action Movies" fetchUrl={requests.fetchActionMovies} />
                                <Home title="Cartoons" fetchUrl={requests.fetchCartoons} />
                                <Home title="Web Series" fetchUrl={requests.fetchWebSeries} />
                                <Home title="Hindi Serials" fetchUrl={requests.fetchHindiSerials} />
                                <Home title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
                                <Home title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
                                <Home title="Drama Movies" fetchUrl={requests.fetchDramaMovies} />
                                <Home title="Science Fiction Movies" fetchUrl={requests.fetchScienceFictionMovies} />
                                <Home title="Thriller Movies" fetchUrl={requests.fetchThrillerMovies} />
                                <Home title="Action TV Shows" fetchUrl={requests.fetchActionTVShows} />
                                <Home title="Fantasy TV Shows" fetchUrl={requests.fetchFantasyTVShows} />
                                <Home title="Music Movies" fetchUrl={requests.fetchMusicMovies} />
                                <Home title="Family Movies" fetchUrl={requests.fetchFamilyMovies} />
                                <Home title="Kids Movies" fetchUrl={requests.fetchKidsMovies} />
                            </>
                        } />
                    </Routes>
                    <Footer />
                </div>
                {showStatus && (
                    <div className={`status-bar ${isOnline ? 'online' : 'offline'}`}>
                        {isOnline ? 'You are connected to the Internet' : 'No Internet Connection'}
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
