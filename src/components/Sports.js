import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

function Sports() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data for demonstration
    const dummyCategories = [
      { id: 1, name: 'Football', logo: 'https://via.placeholder.com/300x200?text=Football', info: 'The beautiful game.' },
      { id: 2, name: 'Basketball', logo: 'https://via.placeholder.com/300x200?text=Basketball', info: 'Fast-paced and exciting.' },
      { id: 3, name: 'Tennis', logo: 'https://via.placeholder.com/300x200?text=Tennis', info: 'The game of precision.' },
      { id: 4, name: 'Cricket', logo: 'https://via.placeholder.com/300x200?text=Cricket', info: 'A game of strategy.' },
      { id: 5, name: 'Rugby', logo: 'https://via.placeholder.com/300x200?text=Rugby', info: 'Rough and tough.' }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setCategories(dummyCategories);
      setLoading(false);
    }, 1000); // Simulate loading time
  }, []);

  if (loading) return <div className="sports__loading">Loading...</div>;

  return (
    <div className="sports">
      <h1 className="sports__title">Sports Categories</h1>
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={3}
        spaceBetween={20}
        navigation
        autoplay={{ delay: 3000 }}
        className="sports__swiper"
      >
        {categories.map(category => (
          <SwiperSlide key={category.id}>
            <div className="sports__slide">
              <img 
                src={category.logo} 
                alt={category.name} 
                className="sports__logo"
              />
              <h3 className="sports__name">{category.name}</h3>
              <p className="sports__info">{category.info}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx>{`
        .sports {
          padding: 20px;
          background-color: #f0f0f0;
        }

        .sports__title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .sports__swiper {
          position: relative;
          width: 100%;
        }

        .sports__slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .sports__slide:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .sports__logo {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .sports__logo:hover {
          opacity: 0.8;
        }

        .sports__name {
          font-size: 1.5rem;
          margin: 10px 0;
          color: #333;
        }

        .sports__info {
          font-size: 1rem;
          color: #666;
          padding: 0 10px;
        }

        .sports__loading {
          text-align: center;
          font-size: 1.5rem;
          color: #333;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default Sports;
