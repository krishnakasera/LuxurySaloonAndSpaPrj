import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AdminServices.css";

const API_URL = "http://localhost:5000/api/services";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  category: "General",
  status: "Active",
};

const AdminServices = () => {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("adminToken");

  // =====================================
  // AXIOS CONFIG
  // =====================================

  const getConfig = () => {
    if (!token) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =====================================
  // FETCH SERVICES
  // =====================================

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      const serviceData = response.data.services || [];

      setServices(serviceData);
    } catch (err) {
      console.error("Fetch services error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchServices();
  }, []);

  // =====================================
  // CLEAR MESSAGES
  // =====================================

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // OPEN ADD MODAL
  // =====================================

  const handleAddService = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =====================================
  // OPEN EDIT MODAL
  // =====================================

  const handleEditService = (service) => {
    setEditingId(service._id);

    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration || "",
      image: service.image || "",
      category: service.category || "General",
      status: service.status || "Active",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =====================================
  // CLOSE MODAL
  // =====================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =====================================
  // CREATE / UPDATE SERVICE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Admin login required.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price === "" ||
      !formData.duration.trim()
    ) {
      setError(
        "Name, description, price and duration are required."
      );
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim(),
        image: formData.image.trim(),
        category: formData.category.trim() || "General",
        status: formData.status,
      };

      if (editingId) {
        // UPDATE
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          payload,
          getConfig()
        );

        const updatedService = response.data.service;

        setServices((prev) =>
          prev.map((service) =>
            service._id === editingId
              ? updatedService
              : service
          )
        );

        setSuccess("Service updated successfully.");
      } else {
        // CREATE
        const response = await axios.post(
          API_URL,
          payload,
          getConfig()
        );

        const newService = response.data.service;

        setServices((prev) => [
          newService,
          ...prev,
        ]);

        setSuccess("Service created successfully.");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error("Save service error:", err);

      if (err.response?.status === 401) {
        setError(
          "Your admin session has expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to save service."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE SERVICE
  // =====================================

  const handleDeleteService = async (id) => {
    if (!token) {
      setError("Admin login required.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axios.delete(
        `${API_URL}/${id}`,
        getConfig()
      );

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      setSuccess("Service deleted successfully.");
    } catch (err) {
      console.error("Delete service error:", err);

      if (err.response?.status === 401) {
        setError(
          "Your admin session has expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to delete service."
        );
      }
    }
  };

  // =====================================
  // SEARCH + FILTER
  // =====================================

  const filteredServices = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return services.filter((service) => {
      const matchesSearch =
        !searchValue ||
        service.name
          ?.toLowerCase()
          .includes(searchValue) ||
        service.description
          ?.toLowerCase()
          .includes(searchValue) ||
        service.category
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        service.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    services,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    const categoryList = services
      .map((service) => service.category)
      .filter(Boolean);

    return [...new Set(categoryList)];
  }, [services]);

  // =====================================
  // STATISTICS
  // =====================================

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.status === "Active"
  ).length;

  const inactiveServices = services.filter(
    (service) => service.status === "Inactive"
  ).length;

  const categoriesCount = new Set(
    services
      .map((service) => service.category)
      .filter(Boolean)
  ).size;

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // GET INITIAL
  // =====================================

  const getInitial = (name) => {
    if (!name) {
      return "S";
    }

    return name.charAt(0).toUpperCase();
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/admin-login";
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-services-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <header className="services-page-header">

        <div className="services-header-content">

          <span className="services-eyebrow">
            ADMIN PANEL
          </span>

          <h1>Service Management</h1>

          <p>
            Create, update and manage all salon
            services from one place.
          </p>

        </div>

        <div className="services-header-actions">

          <button
            type="button"
            className="services-refresh-btn"
            onClick={fetchServices}
            disabled={loading}
          >
            <span className="refresh-icon">
              ↻
            </span>

            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="services-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =================================
          ALERTS
      ================================= */}

      {success && (
        <div className="service-alert service-success">
          <span>✓</span>
          {success}
        </div>
      )}

      {error && (
        <div className="service-alert service-error">
          <span>!</span>
          {error}
        </div>
      )}

      {/* =================================
          STATISTICS
      ================================= */}

      <section className="service-stats-grid">

        <div className="service-stat-card">

          <div className="service-stat-icon total">
            ✦
          </div>

          <div className="service-stat-content">
            <span>Total Services</span>
            <strong>{totalServices}</strong>
            <small>All salon services</small>
          </div>

        </div>

        <div className="service-stat-card">

          <div className="service-stat-icon active">
            ✓
          </div>

          <div className="service-stat-content">
            <span>Active Services</span>
            <strong>{activeServices}</strong>
            <small>Currently available</small>
          </div>

        </div>

        <div className="service-stat-card">

          <div className="service-stat-icon inactive">
            −
          </div>

          <div className="service-stat-content">
            <span>Inactive Services</span>
            <strong>{inactiveServices}</strong>
            <small>Currently hidden</small>
          </div>

        </div>

        <div className="service-stat-card">

          <div className="service-stat-icon category">
            ◈
          </div>

          <div className="service-stat-content">
            <span>Categories</span>
            <strong>{categoriesCount}</strong>
            <small>Service categories</small>
          </div>

        </div>

      </section>

      {/* =================================
          SERVICE MANAGEMENT
      ================================= */}

      <section className="services-management-card">

        {/* TOP SECTION */}

        <div className="services-management-header">

          <div>
            <h2>All Services</h2>

            <p>
              {filteredServices.length}{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}{" "}
              found
            </p>
          </div>

          <button
            type="button"
            className="add-service-btn"
            onClick={handleAddService}
          >
            <span>+</span>
            Add Service
          </button>

        </div>

        {/* =================================
            FILTER BAR
        ================================= */}

        <div className="services-filter-bar">

          <div className="service-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

          <div className="service-filter">

            <label>Category</label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          <div className="service-filter">

            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

          {(search ||
            categoryFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setSearch("");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
            >
              Reset
            </button>
          )}

        </div>

        {/* =================================
            LOADING
        ================================= */}

        {loading ? (
          <div className="services-loading">

            <div className="loading-spinner"></div>

            <h3>Loading services...</h3>

            <p>
              Please wait while we fetch your
              salon services.
            </p>

          </div>
        ) : filteredServices.length === 0 ? (

          /* =================================
             EMPTY STATE
          ================================= */

          <div className="services-empty">

            <div className="empty-service-icon">
              ✦
            </div>

            <h3>
              {services.length === 0
                ? "No Services Yet"
                : "No Services Found"}
            </h3>

            <p>
              {services.length === 0
                ? "Start by adding your first salon service."
                : "Try changing your search or filter options."}
            </p>

            {services.length === 0 && (
              <button
                type="button"
                className="empty-add-btn"
                onClick={handleAddService}
              >
                + Add Your First Service
              </button>
            )}

          </div>

        ) : (

          /* =================================
             TABLE
          ================================= */

          <div className="services-table-wrapper">

            <table className="services-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredServices.map(
                  (service, index) => (

                    <tr key={service._id}>

                      {/* NUMBER */}

                      <td className="service-number">
                        {index + 1}
                      </td>

                      {/* SERVICE */}

                      <td>

                        <div className="service-info">

                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="service-image"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                                e.currentTarget.nextSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}

                          <div
                            className="service-image-placeholder"
                            style={{
                              display: service.image
                                ? "none"
                                : "flex",
                            }}
                          >
                            {getInitial(
                              service.name
                            )}
                          </div>

                          <div className="service-name-area">

                            <strong>
                              {service.name}
                            </strong>

                            <span>
                              {service.description}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="category-badge">
                          {service.category ||
                            "General"}
                        </span>
                      </td>

                      {/* PRICE */}

                      <td>
                        <span className="service-price">
                          {formatPrice(
                            service.price
                          )}
                        </span>
                      </td>

                      {/* DURATION */}

                      <td>
                        <span className="duration-value">
                          ◷ {service.duration}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`service-status ${
                            service.status ===
                            "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          <span className="status-dot"></span>

                          {service.status}
                        </span>

                      </td>

                      {/* CREATED */}

                      <td>
                        <span className="created-date">
                          {formatDate(
                            service.createdAt
                          )}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="service-actions">

                          <button
                            type="button"
                            className="action-btn edit-btn"
                            title="Edit service"
                            onClick={() =>
                              handleEditService(
                                service
                              )
                            }
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="action-btn delete-btn"
                            title="Delete service"
                            onClick={() =>
                              handleDeleteService(
                                service._id
                              )
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* =================================
          ADD / EDIT MODAL
      ================================= */}

      {showModal && (
        <div
          className="service-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              handleCloseModal();
            }
          }}
        >

          <div className="service-modal">

            {/* MODAL HEADER */}

            <div className="service-modal-header">

              <div>
                <span className="modal-eyebrow">
                  {editingId
                    ? "UPDATE SERVICE"
                    : "NEW SERVICE"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Service"
                    : "Add New Service"}
                </h2>

                <p>
                  {editingId
                    ? "Update the details of this salon service."
                    : "Add a new service to your salon."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              className="service-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                {/* NAME */}

                <div className="form-group full-width">

                  <label>
                    Service Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Hair Spa"
                    required
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="form-group full-width">

                  <label>
                    Description
                    <span>*</span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the service..."
                    rows="4"
                    required
                  />

                </div>

                {/* PRICE */}

                <div className="form-group">

                  <label>
                    Price
                    <span>*</span>
                  </label>

                  <div className="input-with-prefix">
                    <span>₹</span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="999"
                      min="0"
                      required
                    />
                  </div>

                </div>

                {/* DURATION */}

                <div className="form-group">

                  <label>
                    Duration
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 60 min"
                    required
                  />

                </div>

                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Hair"
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

                {/* IMAGE */}

                <div className="form-group full-width">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/service-image.jpg"
                  />

                </div>

              </div>

              {/* IMAGE PREVIEW */}

              {formData.image && (
                <div className="image-preview-section">

                  <span>Image Preview</span>

                  <img
                    src={formData.image}
                    alt="Service preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>
              )}

              {/* FORM ACTIONS */}

              <div className="service-form-actions">

                <button
                  type="button"
                  className="cancel-service-btn"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-service-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Service"
                    : "Create Service"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminServices;