import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    const storedUser = localStorage.getItem("user");

    // User is not logged in
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // User is logged in
    navigate("/appointment");
  };

  return (
    <>
      {/* Banner */}
      <section className="about-banner">
        <div className="overlay">
          <h1>About Us</h1>
          <p>Where Beauty Meets Luxury</p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
            alt="Luxury Salon"
          />
        </div>

        <div className="about-content">
          <h2>Welcome to Luxury Salon & Spa</h2>

          <p>
            We are dedicated to providing premium beauty,
            wellness, and spa services. Our experienced
            professionals use high-quality products and
            modern techniques to enhance your beauty and
            confidence.
          </p>

          <p>
            From hair styling and skincare to bridal makeup
            and spa therapies, we offer a complete range of
            services designed to make you look and feel your
            best.
          </p>

          <button onClick={handleBooking}>
            Book Appointment
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <h2>10+</h2>
          <p>Years Experience</p>
        </div>

        <div className="stat-card">
          <h2>5000+</h2>
          <p>Happy Clients</p>
        </div>

        <div className="stat-card">
          <h2>20+</h2>
          <p>Beauty Experts</p>
        </div>

        <div className="stat-card">
          <h2>50+</h2>
          <p>Premium Services</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="box">
          <h2>Our Mission</h2>

          <p>
            To provide exceptional beauty and wellness
            experiences through expert care, innovative
            techniques, and premium products.
          </p>
        </div>

        <div className="box">
          <h2>Our Vision</h2>

          <p>
            To become the most trusted and preferred salon
            & spa brand by delivering excellence in every
            service.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Us?</h2>

        <div className="choose-container">
          <div className="choose-card">
            <h3>Expert Stylists</h3>
            <p>
              Highly trained beauty professionals.
            </p>
          </div>

          <div className="choose-card">
            <h3>Premium Products</h3>
            <p>
              International quality beauty products.
            </p>
          </div>

          <div className="choose-card">
            <h3>Luxury Experience</h3>
            <p>
              Relaxing and comfortable environment.
            </p>
          </div>

          <div className="choose-card">
            <h3>Affordable Pricing</h3>
            <p>
              Luxury services at competitive prices.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;