import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { SearchData } from '../../types/common.types';

const Home: React.FC = () => {
  const history = useHistory();
  const [searchData, setSearchData] = useState<SearchData>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    history.push({
      pathname: '/customer/search',
      state: searchData
    });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">WELCOME TO LUXURY HOTELS</h1>
            <p className="hero-subtitle">Book your stay and enjoy Luxury redefined at the most affordable rates.</p>
            
            {/* Search Form */}
            <form className="hero-search-form" onSubmit={handleSearch}>
              <div className="search-inputs">
                <div className="search-field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                  />
                </div>
                <div className="search-field">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  />
                </div>
                <div className="search-field">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  />
                </div>
                <div className="search-field">
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Luxury Redefined Section */}
      <section className="luxury-section">
        <div className="container">
          <h2 className="section-title">Luxury redefined</h2>
          <p className="section-description">
            Our rooms are designed to transport you into an environment made for leisure. 
            Take your mind off the day-to-day of home life and find a private paradise for yourself.
          </p>
          <div className="luxury-cards">
            <div className="luxury-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400" alt="Luxury Room" />
              </div>
              <div className="card-content">
                <h3>Luxury Room</h3>
                <p>Experience comfort and elegance in our luxury rooms</p>
                <button className="card-btn" onClick={() => history.push('/customer/search')}>
                  Explore
                </button>
              </div>
            </div>
            <div className="luxury-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" alt="Beach View" />
              </div>
              <div className="card-content">
                <h3>Beach View</h3>
                <p>Wake up to stunning ocean views every morning</p>
                <button className="card-btn" onClick={() => history.push('/customer/search')}>
                  Explore
                </button>
              </div>
            </div>
            <div className="luxury-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400" alt="Spa & Wellness" />
              </div>
              <div className="card-content">
                <h3>Spa & Wellness</h3>
                <p>Relax and rejuvenate at our world-class spa</p>
                <button className="card-btn" onClick={() => history.push('/customer/search')}>
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leave Your Worries Section */}
      <section className="worries-section">
        <div className="container">
          <h2 className="section-title">Leave your worries in the sand</h2>
          <p className="section-description">
            We love life at the beach. Being close to the ocean with access to endless sandy beach 
            ensures a relaxed state of mind. It seems like time stands still watching the ocean.
          </p>
          <div className="worries-cards">
            <div className="worry-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" alt="Beach" />
              </div>
              <div className="card-content">
                <h3>Private Beach</h3>
                <p>Exclusive access to pristine sandy beaches</p>
              </div>
            </div>
            <div className="worry-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" alt="Pool" />
              </div>
              <div className="card-content">
                <h3>Infinity Pool</h3>
                <p>Swim with breathtaking views of the ocean</p>
              </div>
            </div>
            <div className="worry-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400" alt="Restaurant" />
              </div>
              <div className="card-content">
                <h3>Fine Dining</h3>
                <p>Gourmet cuisine with oceanfront views</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Testimonials</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Calm, Serene, Retro – What a way to relax and enjoy!"
              </p>
              <p className="testimonial-author">Mr. and Mrs. Baxter, UK</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The best hotel experience we've ever had!"
              </p>
              <p className="testimonial-author">John Smith, USA</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Perfect location, amazing service, beautiful rooms."
              </p>
              <p className="testimonial-author">Maria Garcia, Spain</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h4>About Us</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#terms">Terms & Conditions</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Follow Us</h4>
              <ul className="social-links">
                <li><a href="#facebook">Facebook</a></li>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#instagram">Instagram</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Subscribe to our newsletter</h4>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SmartHotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

