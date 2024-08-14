import React from 'react';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer__section">
        <h4>Company</h4>
        <ul>
          <li><a href="#about">About Us</a></li>
          <li><a href="#careers">Careers</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h4>View Website in</h4>
        <ul>
          <li><a href="#english">✔ English</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h4>Need Help?</h4>
        <ul>
          <li><a href="#help">Visit Help Center</a></li>
          <li><a href="#feedback">Share Feedback</a></li>
        </ul>
      </div>
      <div className="footer__section">
        <h4>Connect with Us</h4>
        <div className="footer__social">
          <a href="#facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#instagram"><i className="fab fa-instagram-f"></i></a>
          <a href="#twitter"><i className="fab fa-twitter"></i></a>
        </div>
        <div className="footer__apps">
          <a href="#googleplay"><img src="https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346101/google-playstore" alt="Google Play" /></a>
          <a href="#appstore"><img src="https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346071/ios-appstore" alt="App Store" /></a>
        </div>
      </div>
      <div className="footer__section footer__section--full">
        <p>© 2024 STAR. All Rights Reserved.</p>
        <ul className="footer__legal">
          <li><a href="#terms">Terms Of Use</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
