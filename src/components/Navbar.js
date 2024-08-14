import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate('/subscribe');
  };

  return (
    <div className="navbar">
      <img
        className="navbar__logo"
        src="https://img.hotstar.com/image/upload/v1656431456/web-images/logo-d-plus.svg"
        alt="Disney+ Hotstar Logo"
      />
      <button className="subscribe" onClick={handleSubscribeClick}>Subscribe</button>
      <nav className="navbar__nav">
        <Link to="/login" className={`navbar__link ${location.pathname === '/login' ? 'active' : ''}`}>
          <i className="bi bi-person-circle"></i>
          <span className="navbar__text">My Space</span>
        </Link>
        <Link to="/search" className={`navbar__link ${location.pathname === '/search' ? 'active' : ''}`}>
          <i className="bi bi-search"></i>
          <span className="navbar__text">Search</span>
        </Link>
        <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="bi bi-house"></i>
          <span className="navbar__text">Home</span>
        </Link>
        <Link to="/tv" className={`navbar__link ${location.pathname === '/tv' ? 'active' : ''}`}>
          <i className="bi bi-tv"></i>
          <span className="navbar__text">TV</span>
        </Link>
        <Link to="/movies" className={`navbar__link ${location.pathname === '/movies' ? 'active' : ''}`}>
          <i className="bi bi-film"></i>
          <span className="navbar__text">Movies</span>
        </Link>
        <Link to="/sports" className={`navbar__link ${location.pathname === '/sports' ? 'active' : ''}`}>
          <i className="bi bi-trophy"></i>
          <span className="navbar__text">Sports</span>
        </Link>
        <Link to="/categories" className={`navbar__link ${location.pathname === '/categories' ? 'active' : ''}`}>
          <i className="bi bi-grid"></i>
          <span className="navbar__text">Categories</span>
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
