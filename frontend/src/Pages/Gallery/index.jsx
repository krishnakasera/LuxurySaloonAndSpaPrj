import React from "react";
import "./Gallery.css";

const galleryImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
    title: "Hair Styling",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    title: "Salon Interior",
  },
   {
  id: 3,
  image:
    "https://i.pinimg.com/736x/22/35/d3/2235d35fe1852a9e716d667df6af8082.jpg",
  title: "Indian Bridal Makeup",
},
  
    
  ,

  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
    title: "Facial Treatment",
  },

  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388",
    title: "Hair Spa",
  },

  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371",
    title: "Nail Care",
  },
];

const Gallery = () => {
  return (
    <>
      {/* Gallery Banner */}

      <section className="gallery-banner">
        <div className="gallery-overlay">
          <h1>Our Gallery</h1>

          <p>
            Beauty, Luxury & Style
          </p>
        </div>
      </section>

      {/* Gallery Section */}

      <section className="gallery-section">
        <h2>Salon Moments</h2>

        <div className="gallery-grid">

          {galleryImages.map((item) => (
            <div
              className="gallery-card"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.title}
              />

              <div className="gallery-content">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}

        </div>
      </section>
    </>
  );
};

export default Gallery;