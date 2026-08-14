import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/appointment");
  };

  return (
    <>
      {/* Welcome Section */}
      {user && (
        <section className="welcome-section">
          <div className="welcome-content">
            <h2>Welcome, {user.name}!</h2>

            <p>
              We're happy to have you at Luxury Salon & Spa.
              Discover our premium beauty and wellness services.
            </p>

            <button
              className="welcome-book-btn"
              onClick={handleBooking}
            >
              Book Your Appointment
            </button>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Luxury Salon & Spa</h1>

          <p>
            Experience beauty, wellness and relaxation with our premium
            salon services. Let our experts transform your style and
            confidence.
          </p>

          <div className="hero-buttons">
            <button
              className="book-btn"
              onClick={handleBooking}
            >
              Book Appointment
            </button>

            <button
              className="service-btn"
              onClick={() => navigate("/services")}
            >
              View Services
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
            alt="Luxury Salon"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>

        <div className="service-container">
          <div className="card">
            <h3>Hair Cut</h3>
            <p>
              Professional haircut and styling by our expert
              stylists.
            </p>

            <button onClick={() => navigate("/services")}>
              Explore
            </button>
          </div>

          <div className="card">
            <h3>Hair Spa</h3>
            <p>
              Healthy, smooth and shiny hair treatment for
              complete relaxation.
            </p>

            <button onClick={() => navigate("/services")}>
              Explore
            </button>
          </div>

          <div className="card">
            <h3>Facial</h3>
            <p>
              Glow-enhancing facial services using premium
              beauty products.
            </p>

            <button onClick={() => navigate("/services")}>
              Explore
            </button>
          </div>

          <div className="card">
            <h3>Bridal Makeup</h3>
            <p>
              Premium bridal makeover packages for your
              special day.
            </p>

            <button onClick={() => navigate("/services")}>
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h2>Why Choose Us?</h2>

        <div className="features">
          <div className="feature-box">
            <h3>Expert Stylists</h3>
            <p>
              Certified beauty professionals with years of
              experience.
            </p>
          </div>

          <div className="feature-box">
            <h3>Premium Products</h3>
            <p>
              We use high-quality and trusted beauty products.
            </p>
          </div>

          <div className="feature-box">
            <h3>Affordable Prices</h3>
            <p>
              Enjoy luxury beauty services at reasonable prices.
            </p>
          </div>

          <div className="feature-box">
            <h3>Online Booking</h3>
            <p>
              Book your appointment easily and quickly online.
            </p>
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="offer">
        <h2>Special Offer</h2>

        <h1>50% OFF</h1>

        <p>Hair Spa + Facial Combo Package</p>

        <button onClick={() => navigate("/offers")}>
          Claim Offer
        </button>
      </section>

      {/* Appointment Section */}
      <section className="appointment">
        <h2>Book Appointment</h2>

        {user ? (
          <>
            <p className="booking-message">
              Hello <strong>{user.name}</strong>, ready to
              book your next salon appointment?
            </p>

            <form>
              <input
                type="text"
                placeholder="Your Name"
                value={user.name || ""}
                readOnly
              />

              <input
                type="email"
                placeholder="Email Address"
                value={user.email || ""}
                readOnly
              />

              <input type="date" />

              <button
                type="button"
                onClick={() => navigate("/appointment")}
              >
                Continue Booking
              </button>
            </form>
          </>
        ) : (
          <div className="login-booking">
            <p>
              Please login to book your salon appointment.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login to Book
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;