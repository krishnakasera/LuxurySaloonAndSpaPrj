import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Appointment.css";

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // GET LOGGED-IN USER
  // ==============================

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // ==============================
  // GET OFFER INFORMATION
  // ==============================

  const selectedService =
    location.state?.selectedService || "";

  const offerName =
    location.state?.offerName || "";

  const discount =
    Number(location.state?.discount) || 0;

  // Price coming from Offers page
  const offerOriginalPrice =
    Number(location.state?.originalPrice) || 0;

  const offerFinalPrice =
    Number(location.state?.finalPrice) || 0;

  const offerSavings =
    Number(location.state?.savings) || 0;

  const includedServices =
    location.state?.includedServices || [];

  const membership =
    location.state?.membership || "";

  // ==============================
  // STATE
  // ==============================

  const [booking, setBooking] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
    service: selectedService,
    date: "",
    time: "",
  });

  const [services, setServices] = useState([]);

  const [originalPrice, setOriginalPrice] =
    useState(offerOriginalPrice);

  const [loadingServices, setLoadingServices] =
    useState(true);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==============================
  // FETCH SERVICES
  // ==============================

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);

        const response = await axios.get(
          "http://localhost:5000/api/services"
        );

        console.log(
          "Services from backend:",
          response.data
        );

        const serviceList =
          response.data.services || [];

        setServices(serviceList);

        // =================================
        // IF OFFER HAS ITS OWN PRICE
        // USE OFFER PRICE
        // =================================

        if (offerOriginalPrice > 0) {
          setOriginalPrice(offerOriginalPrice);
          return;
        }

        // =================================
        // OTHERWISE FIND SERVICE PRICE
        // =================================

        if (selectedService) {
          const matchedService =
            serviceList.find(
              (service) =>
                service.name?.trim().toLowerCase() ===
                selectedService.trim().toLowerCase()
            );

          if (matchedService) {
            setOriginalPrice(
              Number(matchedService.price) || 0
            );
          } else {
            setOriginalPrice(0);
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch services:",
          error
        );

        // If offer already has price,
        // don't show backend error
        if (offerOriginalPrice <= 0) {
          setError(
            "Unable to load service prices. Please try again."
          );
        }
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [selectedService, offerOriginalPrice]);

  // ==============================
  // CALCULATE PRICE
  // ==============================

  const savedAmount =
    discount > 0
      ? (originalPrice * discount) / 100
      : 0;

  const calculatedFinalPrice =
    originalPrice - savedAmount;

  // If Offers page has already calculated price,
  // use that price.
  const finalPrice =
    offerFinalPrice > 0
      ? offerFinalPrice
      : calculatedFinalPrice;

  const actualSavings =
    offerSavings > 0
      ? offerSavings
      : savedAmount;

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // HANDLE SERVICE CHANGE
  // ==============================

  const handleServiceChange = (e) => {
    const selectedName = e.target.value;

    setBooking({
      ...booking,
      service: selectedName,
    });

    const matchedService =
      services.find(
        (service) =>
          service.name?.trim().toLowerCase() ===
          selectedName.trim().toLowerCase()
      );

    if (matchedService) {
      setOriginalPrice(
        Number(matchedService.price) || 0
      );
    } else {
      setOriginalPrice(0);
    }
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check login
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Check service price
    if (originalPrice <= 0) {
      setError(
        "The selected service price is not available. Please contact the salon."
      );
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // APPOINTMENT DATA
      // ==============================

      const appointmentData = {
        ...booking,

        offerName: offerName || "",

        membership: membership || "",

        discount: discount,

        originalPrice: originalPrice,

        discountAmount: actualSavings,

        finalPrice: finalPrice,

        includedServices: includedServices,
      };

      console.log(
        "Appointment data:",
        appointmentData
      );

      // ==============================
      // SEND TO BACKEND
      // ==============================

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        appointmentData
      );

      console.log(
        "Appointment saved:",
        response.data
      );

      setBookingSuccess(true);

    } catch (error) {
      console.error(
        "Appointment booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Appointment booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // THANK YOU PAGE
  // ==============================

  if (bookingSuccess) {
    return (
      <div className="thank-you-page">

        <div className="thank-you-box">

          <div className="success-icon">
            ✓
          </div>

          <h1>Thank You!</h1>

          <h2>
            Thank you for choosing
            Luxury Salon & Spa
          </h2>

          <p className="success-text">
            Your appointment has been booked
            successfully.
          </p>

          {/* ==============================
              BOOKING SUMMARY
          ============================== */}

          <div className="booking-summary">

            <h3>Appointment Summary</h3>

            <div className="summary-row">
              <span>Name</span>
              <strong>{booking.name}</strong>
            </div>

            <div className="summary-row">
              <span>Email</span>
              <strong>{booking.email}</strong>
            </div>

            <div className="summary-row">
              <span>Phone</span>
              <strong>{booking.phone}</strong>
            </div>

            <div className="summary-row">
              <span>Address</span>
              <strong>{booking.address}</strong>
            </div>

            <div className="summary-row">
              <span>Service</span>
              <strong>{booking.service}</strong>
            </div>

            {/* OFFER */}

            {offerName && (
              <div className="summary-row">
                <span>Offer</span>
                <strong>{offerName}</strong>
              </div>
            )}

            {/* MEMBERSHIP */}

            {membership && (
              <div className="summary-row">
                <span>Membership</span>
                <strong>
                  {membership} Membership
                </strong>
              </div>
            )}

            {/* ORIGINAL PRICE */}

            <div className="summary-row">
              <span>Original Price</span>

              <strong>
                ₹
                {originalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            {/* DISCOUNT */}

            {discount > 0 && (
              <div className="summary-row discount-summary">
                <span>
                  Discount ({discount}%)
                </span>

                <strong>
                  -₹
                  {actualSavings.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            )}

            {/* FINAL PRICE */}

            <div className="summary-row final-summary">
              <span>Final Price</span>

              <strong>
                ₹
                {finalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            {/* DATE */}

            <div className="summary-row">
              <span>Appointment Date</span>
              <strong>{booking.date}</strong>
            </div>

            {/* TIME */}

            <div className="summary-row">
              <span>Appointment Time</span>
              <strong>{booking.time}</strong>
            </div>

          </div>


          {/* INCLUDED SERVICES */}

          {includedServices.length > 0 && (
            <div className="confirmed-services">

              <h3>Services Included</h3>

              <ul>
                {includedServices.map(
                  (service, index) => (
                    <li key={index}>
                      ✓ {service}
                    </li>
                  )
                )}
              </ul>

            </div>
          )}


          <p className="redirect-message">
            Your appointment has been saved
            in our system.
          </p>


          <button
            onClick={() =>
              navigate("/my-appointments")
            }
          >
            Go to My Appointments
          </button>

        </div>
      </div>
    );
  }

  // ==============================
  // APPOINTMENT FORM
  // ==============================

  return (
    <div className="appointment-page">

      <div className="appointment-box">

        <h1>Book Your Appointment</h1>

        <p className="appointment-subtitle">
          Choose your service and preferred
          date and time.
        </p>

        {/* ERROR */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        {/* OFFER BANNER */}

        {offerName && (
          <div className="selected-offer">

            <span className="offer-label">
              SPECIAL OFFER
            </span>

            <h3>{offerName}</h3>

            {discount > 0 && (
              <p>
                You are getting{" "}
                <strong>
                  {discount}% OFF
                </strong>
              </p>
            )}

          </div>
        )}


        {/* MEMBERSHIP */}

        {membership && (
          <div className="selected-membership">

            <span>
              MEMBERSHIP
            </span>

            <h3>
              {membership} Membership
            </h3>

          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <label>Your Name</label>

          <input
            type="text"
            name="name"
            value={booking.name}
            readOnly
          />


          {/* EMAIL */}

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={booking.email}
            readOnly
          />


          {/* PHONE */}

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            value={booking.phone}
            readOnly
          />


          {/* ADDRESS */}

          <label>Address</label>

          <textarea
            name="address"
            placeholder="Enter your address"
            value={booking.address}
            onChange={handleChange}
            required
          />


          {/* SERVICE */}

          <label>
            Select Service
          </label>

          <select
            name="service"
            value={booking.service}
            onChange={handleServiceChange}
            required
          >

            <option value="">
              -- Select Service --
            </option>

            {services
              .filter(
                (service) =>
                  service.status !== "Inactive"
              )
              .map((service) => (
                <option
                  key={service._id}
                  value={service.name}
                >
                  {service.name} - ₹
                  {Number(service.price).toLocaleString(
                    "en-IN"
                  )}
                </option>
              ))}

          </select>


          {/* ==============================
              INCLUDED SERVICES
          ============================== */}

          {includedServices.length > 0 && (
            <div className="appointment-included">

              <h3>
                Services Included
              </h3>

              <ul>
                {includedServices.map(
                  (service, index) => (
                    <li key={index}>
                      ✓ {service}
                    </li>
                  )
                )}
              </ul>

            </div>
          )}


          {/* ==============================
              PRICE SUMMARY
          ============================== */}

          {booking.service && originalPrice > 0 && (

            <div className="price-summary">

              <h3>Price Summary</h3>

              <div className="price-row">

                <span>
                  Original Price
                </span>

                <strong>
                  ₹
                  {originalPrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {discount > 0 && (
                <div className="price-row discount-row">

                  <span>
                    Discount ({discount}%)
                  </span>

                  <strong>
                    -₹
                    {actualSavings.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              )}


              <div className="price-row final-price-row">

                <span>
                  Final Price
                </span>

                <strong>
                  ₹
                  {finalPrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>
          )}


          {/* DATE */}

          <label>
            Appointment Date
          </label>

          <input
            type="date"
            name="date"
            value={booking.date}
            onChange={handleChange}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            required
          />


          {/* TIME */}

          <label>
            Appointment Time
          </label>

          <input
            type="time"
            name="time"
            value={booking.time}
            onChange={handleChange}
            required
          />


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              loading ||
              loadingServices ||
              originalPrice <= 0
            }
          >

            {loading
              ? "Booking..."
              : loadingServices
              ? "Loading Price..."
              : "Confirm Appointment"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default Appointment;

