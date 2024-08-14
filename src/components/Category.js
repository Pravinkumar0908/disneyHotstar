import React from 'react';

const Categories = () => {
  const brands = [
    { name: 'Disney', logo: require('../images/disney.jpg') }, 
    { name: 'Pixar', logo: require('../images/pixar.jpg') }, 
    { name: 'Marvel', logo: require('../images/marvel.jpg') }, 
    { name: 'Starmars', logo: require('../images/starmars.jpg') }, 
    { name: 'National', logo: require('../images/national.jpg') },
    { name: 'Hotstar', logo: require('../images/hotstarspecial.jpg') },
      






  ];
  
  const languages = [
    { code: 'हिन्दी', name: 'Hindi', image: require('../images/hindi.jpg') },
    { code: 'English', name: 'English', image: require('../images/english.jpg') },
    { code: 'தமிழ்', name: 'Tamil', image: require('../images/tamil.jpg') },
    { code: 'తెలుగు', name: 'Telugu', image: require('../images/telugu.jpg') },
    { code: 'മലയാളം', name: 'Malayalam', image: require('../images/malayalam.jpg') },
  ];
  
  const channels = [
    { name: 'hotstar specials', logo: require('../images/hotstarspecial.jpg') },
    { name: 'Star Plus', logo: require('../images/star-plus.jpg') },
    { name: 'Star Suvarna', logo: require('../images/star-suvarna.jpg') },
    { name: 'Vijay', logo: require('../images/vijay.jpg') },
    { name: 'Star Jalsha', logo: require('../images/star-jalsha.jpg') },
  ];

  return (
    <div className="categories-container">
      <div className="brands">
        {brands.map((brand, index) => (
          <div key={index} className="brand-item">
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
      
      <div className="section">
        <h2>Popular Languages</h2>
        <div className="item-list">
          {languages.map((lang, index) => (
            <div key={index} className="item">
              <img src={lang.image} alt={lang.name} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h2>Popular Channels</h2>
        <div className="item-list">
          {channels.map((channel, index) => (
            <div key={index} className="item">
              <img src={channel.logo} alt={channel.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
