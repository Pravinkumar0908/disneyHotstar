import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('Pravin Bairwa');
  const [email, setEmail] = useState('pravin@example.com');
  const [phone, setPhone] = useState('+91 9********4');

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'animated-popup'
      },
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            navigate('/');
            Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
          })
          .catch((error) => {
            console.error('Error logging out:', error);
          });
      }
    });
  };

  const handleEditClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update the user's profile in Firebase or your database
    console.log('Profile updated:', { name, email, phone });
    Swal.fire('Success', 'Profile updated successfully!', 'success');
    setIsModalVisible(false);
  };

  return (
    <div className={`profile-container ${isModalVisible ? 'blur-background' : ''}`}>
      <div className="header">
        <div className="subscription_info">
          <p className="subscription_info_title">Subscribe to enjoy Disney+ Hotstar</p>
          <p className="mobile_no">{phone}</p>
        </div>
        <div className="actions">
          <button className="subscribe-button">Subscribe</button>
          <p className="plans">Plan starts at 299</p>
          <button className="help-settings-button"><i className="bi bi-gear"></i>&nbsp;Help & Settings</button>
        </div>
      </div>
      <div className="line"></div>
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
      <i className="bi bi-pencil edit-icon" onClick={handleEditClick}>&nbsp;Edit</i>
      <div className="profiles-section">
        <h2>Profiles</h2>
        <div className="profiles">
          <div className="profile">
            <i id="check_icon" className="bi bi-check"></i>
            <img src="https://img.hotstar.com/image/upload/v1656431456/web-images/logo-d-plus.svg" alt="Pravin Bairwa" />
            <p>{name}</p>
          </div>
          <div className="profile">
            <img src="https://img10.hotstar.com/image/upload/f_auto,q_90,w_640/feature/myspace/my_space_login_in.png" alt="Kids" />
            <p>Kids</p>
          </div>
          <div className="profile1 add_profile">
            <i id="plus_icon" className="bi bi-plus"></i>
            <p id="add">Add</p>
          </div>
        </div>
      </div>
      <div className="continue-watching-section">
        <h2>Continue Watching for {name}</h2>
        <div className="continue-watching">
          <div className="item">
            <img src="https://via.placeholder.com/150" alt="Hate Story 2" />
            <p>Hate Story 2</p>
            <p id="time">1h 25m left</p>
          </div>
          <div className="item">
            <img src="https://via.placeholder.com/150" alt="Sanak" />
            <p>Sanak</p>
            <p id="time">1h 50m left</p>
          </div>
          <div className="item">
            <img src="https://via.placeholder.com/150" alt="Kalki" />
            <p>Kalki</p>
            <p id="time">1h 55m left</p>
          </div>
        </div>
        <a href="#" className="view-all">View All</a>
      </div>

      {isModalVisible && (
        <div className="edit-profile-modal">
          <div className="modal-overlay" onClick={handleModalClose}></div>
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleFormSubmit}>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Full Name" 
                required 
              />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
              />
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Phone Number" 
                required 
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleModalClose}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
