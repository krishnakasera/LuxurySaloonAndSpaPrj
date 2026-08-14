import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const services = [
  {
    id: 1,
    title: "Hair Cut",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df",
  },
  {
    id: 2,
    title: "Hair Spa",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388",
  },
  {
    id: 3,
    title: "Facial",
    price: "₹799",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
  },
  {
    id: 4,
    title: "Bridal Makeup",
    price: "₹4999",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
  },
  {
    id: 5,
    title: "Manicure",
    price: "₹599",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371",
  },
  {
    id: 6,
    title: "Pedicure",
    price: "₹699",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b",
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleBookNow = (service) => {
    const storedUser = localStorage.getItem("user");

    // If user is not logged in
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // User is logged in
    // Send selected service to appointment page
    navigate("/appointment", {
      state: {
        selectedService: service.title,
      },
    });
  };

  return (
    <>
      {/* Banner */}
      <section className="services-banner">
        <div className="banner-overlay">
          <h1>Our Services</h1>
          <p>Luxury Beauty & Spa Services</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <h2>Popular Services</h2>

        <div className="services-grid">
          {services.map((service) => (
            <div
              className="service-card"
              key={service.id}
            >
              <img
                src={service.image}
                alt={service.title}
              />

              <div className="service-content">
                <h3>{service.title}</h3>

                <p className="price">
                  {service.price}
                </p>

                <button
                  onClick={() =>
                    handleBookNow(service)
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="packages">
        <h2>Special Packages</h2>

        <div className="package-container">
          <div className="package-card">
            <h3>Silver Package</h3>
            <p>Hair Cut + Facial</p>
            <h4>₹999</h4>

            <button
              onClick={() =>
                handleBookNow({
                  title: "Silver Package",
                })
              }
            >
              Book Package
            </button>
          </div>

          <div className="package-card gold">
            <h3>Gold Package</h3>
            <p>Hair Spa + Facial + Manicure</p>
            <h4>₹1999</h4>

            <button
              onClick={() =>
                handleBookNow({
                  title: "Gold Package",
                })
              }
            >
              Book Package
            </button>
          </div>

          <div className="package-card">
            <h3>Platinum Package</h3>
            <p>Complete Beauty Care</p>
            <h4>₹3999</h4>

            <button
              onClick={() =>
                handleBookNow({
                  title: "Platinum Package",
                })
              }
            >
              Book Package
            </button>
          </div>
        </div>
      </section>

      {/* Why Services */}
      <section className="service-features">
        <h2>Why Our Services?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Premium Products</h3>
            <p>
              International quality beauty products.
            </p>
          </div>

          <div className="feature-card">
            <h3>Certified Experts</h3>
            <p>
              Experienced salon professionals.
            </p>
          </div>

          <div className="feature-card">
            <h3>Luxury Experience</h3>
            <p>
              Relaxing and comfortable atmosphere.
            </p>
          </div>

          <div className="feature-card">
            <h3>Affordable Pricing</h3>
            <p>
              Best beauty services at fair prices.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;