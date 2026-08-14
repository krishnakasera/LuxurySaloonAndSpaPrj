import React from "react";
import { useNavigate } from "react-router-dom";
import "./Offers.css";

const offers = [
  {
    id: 1,
    title: "Hair Spa Special",
    discount: 50,
    price: 2000,
    description:
      "Get smooth, shiny and healthy hair with our premium hair spa treatment.",
    service: "Hair Spa",
    includedServices: [
      "Hair Wash",
      "Deep Conditioning",
      "Scalp Massage",
      "Hair Spa Treatment",
    ],
  },
  {
    id: 2,
    title: "Bridal Package",
    discount: 30,
    price: 10000,
    description:
      "Complete bridal makeover package designed for your special day.",
    service: "Bridal Makeup",
    includedServices: [
      "Bridal Makeup",
      "Hair Styling",
      "Facial",
      "Manicure & Pedicure",
      "Draping",
    ],
  },
  {
    id: 3,
    title: "Facial + Manicure",
    discount: 40,
    price: 2500,
    description:
      "Refresh your skin and hands with our facial and manicure combo.",
    service: "Facial + Manicure",
    includedServices: [
      "Deep Cleansing Facial",
      "Face Massage",
      "Manicure",
      "Hand Massage",
    ],
  },
  {
    id: 4,
    title: "Weekend Spa Offer",
    discount: 25,
    price: 4000,
    description:
      "Relax and rejuvenate yourself with our luxury weekend spa treatment.",
    service: "Body Spa",
    includedServices: [
      "Body Scrub",
      "Body Massage",
      "Steam Therapy",
      "Relaxation Treatment",
    ],
  },

  // ==============================
  // SILVER PACKAGE
  // ==============================

  {
    id: 5,
    title: "Silver Package Offer",
    discount: 20,
    price: 5000,
    description:
      "An affordable beauty package covering essential salon services.",
    service: "Silver Package",
    includedServices: [
      "Hair Cut & Styling",
      "Basic Facial",
      "Manicure",
      "Pedicure",
      "Hair Wash",
    ],
  },

  // ==============================
  // GOLD PACKAGE
  // ==============================

  {
    id: 6,
    title: "Gold Package Offer",
    discount: 30,
    price: 8000,
    description:
      "Upgrade your salon experience with our complete Gold beauty package.",
    service: "Gold Package",
    includedServices: [
      "Premium Hair Spa",
      "Advanced Facial",
      "Manicure",
      "Pedicure",
      "Hair Styling",
      "Head Massage",
    ],
  },

  // ==============================
  // PLATINUM PACKAGE
  // ==============================

  {
    id: 7,
    title: "Platinum Package Offer",
    discount: 40,
    price: 12000,
    description:
      "Enjoy our premium salon experience with luxurious beauty treatments.",
    service: "Platinum Package",
    includedServices: [
      "Luxury Hair Spa",
      "Premium Facial",
      "Manicure & Pedicure",
      "Hair Styling",
      "Full Body Massage",
      "Head Massage",
      "Skin Treatment",
    ],
  },
];


// Calculate discounted price
const getDiscountedPrice = (price, discount) => {
  return price - (price * discount) / 100;
};


const Offers = () => {
  const navigate = useNavigate();

  const handleClaimOffer = (offer) => {
    const storedUser = localStorage.getItem("user");

    // Check login
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const finalPrice = getDiscountedPrice(
      offer.price,
      offer.discount
    );

    const savings = offer.price - finalPrice;

    // Send offer information to Appointment page
    navigate("/appointment", {
      state: {
        selectedService: offer.service,
        offerName: offer.title,
        discount: offer.discount,
        originalPrice: offer.price,
        finalPrice: finalPrice,
        savings: savings,
        includedServices: offer.includedServices,
      },
    });
  };


  const handleMembership = (membership) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    navigate("/appointment", {
      state: {
        selectedService: `${membership} Membership`,
        offerName: `${membership} Membership`,
        membership: membership,
      },
    });
  };


  return (
    <>
      {/* ==============================
          BANNER
      ============================== */}

      <section className="offers-banner">
        <div className="offers-overlay">
          <h1>Special Offers</h1>
          <p>Exclusive Deals & Premium Packages For You</p>
        </div>
      </section>


      {/* ==============================
          OFFERS
      ============================== */}

      <section className="offers-section">

        <h2>Current Offers</h2>

        <p className="offers-subtitle">
          Save more on your favorite salon services and premium packages.
        </p>


        <div className="offers-grid">

          {offers.map((offer) => {

            const finalPrice = getDiscountedPrice(
              offer.price,
              offer.discount
            );

            const savings = offer.price - finalPrice;

            return (
              <div
                className="offer-card"
                key={offer.id}
              >

                {/* DISCOUNT */}

                <span className="discount">
                  {offer.discount}% OFF
                </span>


                {/* TITLE */}

                <h3>{offer.title}</h3>


                {/* SERVICE */}

                <p className="offer-service">
                  {offer.service}
                </p>


                {/* DESCRIPTION */}

                <p className="offer-description">
                  {offer.description}
                </p>


                {/* SERVICES INCLUDED */}

                <div className="included-services">

                  <h4>Services Included:</h4>

                  <ul>
                    {offer.includedServices.map(
                      (service, index) => (
                        <li key={index}>
                          ✓ {service}
                        </li>
                      )
                    )}
                  </ul>

                </div>


                {/* PRICE */}

                <div className="offer-price">

                  <span className="old-price">
                    ₹{offer.price.toLocaleString("en-IN")}
                  </span>

                  <span className="new-price">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>

                </div>


                {/* SAVINGS */}

                <div className="offer-discount-info">

                  Save ₹{savings.toLocaleString("en-IN")}

                  {" "}({offer.discount}% OFF)

                </div>


                {/* CLAIM */}

                <button
                  type="button"
                  onClick={() =>
                    handleClaimOffer(offer)
                  }
                >
                  Claim Offer
                </button>

              </div>
            );
          })}

        </div>

      </section>


      {/* ==============================
          MEMBERSHIP SUBSCRIPTIONS
      ============================== */}

      <section className="membership">

        <h2>Salon Membership Plans</h2>

        <p className="membership-subtitle">
          Choose the membership that matches your beauty needs
        </p>


        <div className="membership-grid">


          {/* ==============================
              SILVER MEMBERSHIP
          ============================== */}

          <div className="membership-card silver">

            <h3>Silver Membership</h3>

            <p className="membership-price">
              ₹2,999 <span>/ Year</span>
            </p>

            <p>
              Perfect for customers who want regular
              salon services at affordable prices.
            </p>

            <ul>
              <li>✓ 10% Discount on All Services</li>
              <li>✓ Priority Booking</li>
              <li>✓ 1 Free Hair Spa</li>
              <li>✓ 1 Free Basic Facial</li>
              <li>✓ Exclusive Silver Offers</li>
            </ul>

            <button
              type="button"
              onClick={() =>
                handleMembership("Silver")
              }
            >
              Subscribe Now
            </button>

          </div>


          {/* ==============================
              GOLD MEMBERSHIP
          ============================== */}

          <div className="membership-card gold">

            <span className="popular">
              MOST POPULAR
            </span>

            <h3>Gold Membership</h3>

            <p className="membership-price">
              ₹4,999 <span>/ Year</span>
            </p>

            <p>
              Our most popular membership for customers
              who regularly enjoy premium salon services.
            </p>

            <ul>
              <li>✓ 20% Discount on All Services</li>
              <li>✓ Priority Booking</li>
              <li>✓ 3 Free Hair Spa Sessions</li>
              <li>✓ 2 Free Premium Facials</li>
              <li>✓ Free Head Massage</li>
              <li>✓ Exclusive Gold Offers</li>
            </ul>

            <button
              type="button"
              onClick={() =>
                handleMembership("Gold")
              }
            >
              Subscribe Now
            </button>

          </div>


          {/* ==============================
              PLATINUM MEMBERSHIP
          ============================== */}

          <div className="membership-card platinum">

            <h3>Platinum Membership</h3>

            <p className="membership-price">
              ₹7,999 <span>/ Year</span>
            </p>

            <p>
              The ultimate luxury membership with maximum
              savings and premium salon benefits.
            </p>

            <ul>
              <li>✓ 30% Discount on All Services</li>
              <li>✓ VIP Priority Booking</li>
              <li>✓ 6 Free Hair Spa Sessions</li>
              <li>✓ 4 Free Premium Facials</li>
              <li>✓ 2 Free Body Spa Sessions</li>
              <li>✓ Free Head Massage</li>
              <li>✓ VIP Exclusive Offers</li>
            </ul>

            <button
              type="button"
              onClick={() =>
                handleMembership("Platinum")
              }
            >
              Subscribe Now
            </button>

          </div>

        </div>

      </section>
    </>
  );
};

export default Offers;
