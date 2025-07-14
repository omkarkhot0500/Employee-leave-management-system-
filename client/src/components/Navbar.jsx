import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import { toast } from "react-toastify";
import "./styles/Navbar.css";
import logoImg from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <img src={logoImg} alt="Logo" className="logo-img" />
        </NavLink>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {!user ? (
          <>
            <NavLink
              to="/login"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Register
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>

            {user.role === "employee" && (
              <>
                <NavLink
                  to="/leave-request"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Request Leave
                </NavLink>
                <NavLink
                  to="/my-leaves"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  My Leaves
                </NavLink>
                <NavLink
                  to="/leave-balance"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Leave Balance
                </NavLink>
              </>
            )}

            {user.role === "manager" && (
              <>
                <NavLink
                  to="/pending"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Pending Requests
                </NavLink>
                <NavLink
                  to="/reset-leave"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Reset Balances
                </NavLink>
                <NavLink
                  to="/calendar"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Calendar
                </NavLink>
              </>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
