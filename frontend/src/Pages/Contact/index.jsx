import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <>
      <section className="contact-banner">
        <div className="contact-overlay">
          <h1>Contact Us</h1>
          <p>We're Here To Help You Look Your Best</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-info">
          <h2>Get In Touch</h2>

          <div className="info-box">
            <h3>📍 Address</h3>
            <p>Luxury Salon & Spa, Varanasi, Uttar Pradesh</p>
          </div>

          <div className="info-box">
            <h3>📞 Phone</h3>
            <p>+91 9876543210</p>
          </div>

          <div className="info-box">
            <h3>📧 Email</h3>
            <p>info@luxurysalon.com</p>
          </div>

          <div className="info-box">
            <h3>🕒 Working Hours</h3>
            <p>Mon - Sun : 9:00 AM - 9:00 PM</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Message</h2>

          <form>
            <input type="text" placeholder="Your Name" />

            <input type="email" placeholder="Your Email" />

            <input type="tel" placeholder="Phone Number" />

            <textarea
              rows="5"
              placeholder="Your Message"
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      <section className="map-section">
        <h2>Find Us</h2>

        {/* <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18"
          allowFullScreen=""
          loading="lazy"
        ></iframe> */}
      </section>
    </>
  );
};

export default Contact;