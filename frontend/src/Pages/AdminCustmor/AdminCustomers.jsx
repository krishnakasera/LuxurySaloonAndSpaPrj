
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AdminCustomers.css";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const token = localStorage.getItem("adminToken");

  // =====================================
  // FETCH CUSTOMERS
  // =====================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Admin login required.");
        setCustomers([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Customers response:", response.data);

      const customerData = Array.isArray(response.data.customers)
        ? response.data.customers
        : [];

      setCustomers(customerData);
    } catch (err) {
      console.error("Fetch customers error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        setError("Session expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load customers."
        );
      }

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD CUSTOMERS
  // =====================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =====================================
  // SORT HANDLER
  // =====================================

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((previousOrder) =>
        previousOrder === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // =====================================
  // FILTER + SEARCH + SORT
  // =====================================

  const processedCustomers = useMemo(() => {
    let result = [...customers];

    // SEARCH
    const searchValue = search.toLowerCase().trim();

    if (searchValue) {
      result = result.filter((customer) => {
        return (
          customer.name?.toLowerCase().includes(searchValue) ||
          customer.email?.toLowerCase().includes(searchValue) ||
          customer.phone?.toLowerCase().includes(searchValue)
        );
      });
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      result = result.filter((customer) => {
        const status = customer.status || "active";

        return status.toLowerCase() === statusFilter;
      });
    }

    // SORT
    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortField === "name") {
        valueA = a.name || "";
        valueB = b.name || "";
      } else if (sortField === "email") {
        valueA = a.email || "";
        valueB = b.email || "";
      } else if (sortField === "phone") {
        valueA = a.phone || "";
        valueB = b.phone || "";
      } else {
        valueA = new Date(a.createdAt || 0).getTime();
        valueB = new Date(b.createdAt || 0).getTime();
      }

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();

        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }

        return 0;
      }

      return sortOrder === "asc"
        ? valueA - valueB
        : valueB - valueA;
    });

    return result;
  }, [
    customers,
    search,
    statusFilter,
    sortField,
    sortOrder,
  ]);

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================
  // GET STATUS
  // =====================================

  const getStatus = (customer) => {
    return customer.status || "Active";
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
  // STATISTICS
  // =====================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      (customer.status || "active").toLowerCase() === "active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) =>
      (customer.status || "").toLowerCase() === "inactive"
  ).length;

  // =====================================
  // SORT ICON
  // =====================================

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return "↕";
    }

    return sortOrder === "asc" ? "↑" : "↓";
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-customers-page">

      {/* ================= HEADER ================= */}

      <header className="customers-header">
        <div>
          <span className="page-label">
            ADMIN PANEL
          </span>

          <h1>Customer Management</h1>

          <p>
            View, search and manage all salon customers.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={fetchCustomers}
          >
            ↻ Refresh
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= STATISTICS ================= */}

      <section className="customer-stats">

        <div className="customer-stat-card">
          <div className="stat-icon total">
            👥
          </div>

          <div>
            <p>Total Customers</p>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon active">
            ✓
          </div>

          <div>
            <p>Active Customers</p>
            <h2>{activeCustomers}</h2>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon inactive">
            ○
          </div>

          <div>
            <p>Inactive Customers</p>
            <h2>{inactiveCustomers}</h2>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="stat-icon appointment">
            📅
          </div>

          <div>
            <p>Showing</p>
            <h2>{processedCustomers.length}</h2>
          </div>
        </div>

      </section>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="customer-error">
          {error}
        </div>
      )}

      {/* ================= CUSTOMER SECTION ================= */}

      <section className="customers-container">

        {/* TOOLBAR */}

        <div className="customers-toolbar">

          <div className="toolbar-title">
            <h2>All Customers</h2>

            <p>
              {processedCustomers.length} customer
              {processedCustomers.length !== 1 ? "s" : ""}
              {" "}found
            </p>
          </div>

          <div className="customer-actions">

            {/* SEARCH */}

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>

            {/* STATUS FILTER */}

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="customer-loading">
            <div className="loading-spinner"></div>
            <p>Loading customers...</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          processedCustomers.length === 0 && (
            <div className="no-customers">

              <div className="empty-icon">
                👤
              </div>

              <h3>
                No Customers Found
              </h3>

              <p>
                Try changing your search or filter.
              </p>

            </div>
          )}

        {/* ================= TABLE ================= */}

        {!loading &&
          processedCustomers.length > 0 && (

            <div className="customer-table-container">

              <table className="customers-table">

                <thead>
                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          handleSort("name")
                        }
                      >
                        Customer
                        <span>
                          {getSortIcon("name")}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          handleSort("email")
                        }
                      >
                        Email
                        <span>
                          {getSortIcon("email")}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          handleSort("phone")
                        }
                      >
                        Phone
                        <span>
                          {getSortIcon("phone")}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          handleSort("createdAt")
                        }
                      >
                        Registered
                        <span>
                          {getSortIcon("createdAt")}
                        </span>
                      </button>
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {processedCustomers.map(
                    (customer, index) => {

                      const status =
                        getStatus(customer);

                      return (
                        <tr
                          key={customer._id}
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <div className="customer-info">

                              <div className="customer-avatar">
                                {customer.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <strong>
                                  {customer.name ||
                                    "Unknown Customer"}
                                </strong>

                                <small>
                                  Customer
                                </small>
                              </div>

                            </div>
                          </td>

                          <td>
                            <span className="email-text">
                              {customer.email ||
                                "N/A"}
                            </span>
                          </td>

                          <td>
                            {customer.phone ||
                              "N/A"}
                          </td>

                          <td>
                            {formatDate(
                              customer.createdAt
                            )}
                          </td>

                          <td>
                            <span
                              className={`customer-status ${status.toLowerCase()}`}
                            >
                              <span className="status-dot"></span>
                              {status}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>

    </div>
  );
};

export default AdminCustomers;

