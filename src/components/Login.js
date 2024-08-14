import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6MFdDJ3dtQu1ciyafWpqdoRa8GCp4CEo",
  authDomain: "your-project-id.firebaseapp.com",  // Update with your authDomain
  projectId: "project-486746459294-project-id",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    if (isPopupVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isPopupVisible]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/profile');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLoginClick = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setEmail('');
    setPassword('');
    setName('');
    setIsResetPassword(false); // Reset password form visibility
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'slide-in-left success-popup'
      },
      heightAuto: false
    });
  };

  const saveUserData = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showSuccessAlert('Successful login');
      closePopup();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await saveUserData(userCredential.user);
      showSuccessAlert('Account created successfully');
      closePopup();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserData(result.user);
      showSuccessAlert('Successful login with Google');
      closePopup();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: error.message,
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'Check your email for the password reset link.',
      });
      closePopup();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Password Reset Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation"></div>
      <button className="help-support">Help & Support</button>
      <div className="content-wrapper">
        <h1 className="main-title">Welcome to MovieStream</h1>
        <p className="subtitle">Dive into a world of endless entertainment</p>
        <button className="login-button" onClick={handleLoginClick}>Get Started</button>
      </div>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={closePopup}>&times;</button>
            <div className="popup-content">
              <h2 className="popup-title">
                {isResetPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}
              </h2>
              <div className="form-container">
                {isResetPassword ? (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button className="submit-button" onClick={handlePasswordReset}>
                      Send Password Reset Email
                    </button>
                    <p className="switch-mode" onClick={() => setIsResetPassword(false)}>
                      Back to {isLogin ? 'Login' : 'Sign Up'}
                    </p>
                  </>
                ) : (
                  <>
                    {!isLogin && (
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    )}
                    <input
                      type="email"
                      placeholder="Email"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      className="submit-button" 
                      onClick={isLogin ? handleEmailLogin : handleEmailSignup}
                    >
                      {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <button className="google-button" onClick={handleGoogleLogin}>
                      <i className="fab fa-google"></i> Continue with Google
                    </button>
                    <p className="switch-mode" onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </p>
                    <p className="switch-mode" onClick={() => setIsResetPassword(true)}>
                      Forgot your password? Reset it
                    </p>
                  </>
                )}
              </div>
              <p className="terms">
                By proceeding you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
