import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import { toast } from "react-toastify";
import logo from "../../src/assets/newlogorounded.jpeg";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const NavItem = ({ children, to, isActive = false, delay = 0 }) => (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <NavLink
        to={to}
        onClick={closeMenu}
        className={({ isActive: linkIsActive }) =>
          `relative px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
            linkIsActive || isActive
              ? "text-blue-600 bg-blue-50 shadow-md"
              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          }`
        }
      >
        {children}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
        )}
      </NavLink>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          {/* Logo Section */}
          <div
            className={`transform transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <NavLink
              to="/"
              onClick={closeMenu}
              className="flex items-center space-x-2 group"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!user ? (
              <>
                <NavItem to="/login" delay={200}>
                  Login
                </NavItem>
                <NavItem to="/register" delay={300}>
                  Register
                </NavItem>
              </>
            ) : (
              <>
                <NavItem to="/" delay={200}>
                  Home
                </NavItem>

                {user.role === "employee" && (
                  <>
                    <NavItem to="/leave-request" delay={300}>
                      Request Leave
                    </NavItem>
                    <NavItem to="/my-leaves" delay={400}>
                      My Leaves
                    </NavItem>
                    <NavItem to="/leave-balance" delay={500}>
                      Leave Balance
                    </NavItem>
                  </>
                )}

                {user.role === "manager" && (
                  <>
                    <NavItem to="/pending" delay={300}>
                      Pending Requests
                    </NavItem>
                    <NavItem to="/reset-leave" delay={400}>
                      Reset Balances
                    </NavItem>
                    <NavItem to="/calendar" delay={500}>
                      Calendar
                    </NavItem>
                  </>
                )}

                <div
                  className={`transform transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: "600ms" }}
                >
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform ${
                menuOpen ? "rotate-90" : ""
              } ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-2 bg-gray-50 rounded-lg p-4">
            {!user ? (
              <>
                <NavItem to="/login" delay={menuOpen ? 100 : 0}>
                  Login
                </NavItem>
                <NavItem to="/register" delay={menuOpen ? 200 : 0}>
                  Register
                </NavItem>
              </>
            ) : (
              <>
                <NavItem to="/" delay={menuOpen ? 100 : 0}>
                  Home
                </NavItem>

                {user.role === "employee" && (
                  <>
                    <NavItem to="/leave-request" delay={menuOpen ? 200 : 0}>
                      Request Leave
                    </NavItem>
                    <NavItem to="/my-leaves" delay={menuOpen ? 300 : 0}>
                      My Leaves
                    </NavItem>
                    <NavItem to="/leave-balance" delay={menuOpen ? 400 : 0}>
                      Leave Balance
                    </NavItem>
                  </>
                )}

                {user.role === "manager" && (
                  <>
                    <NavItem to="/pending" delay={menuOpen ? 200 : 0}>
                      Pending Requests
                    </NavItem>
                    <NavItem to="/reset-leave" delay={menuOpen ? 300 : 0}>
                      Reset Balances
                    </NavItem>
                    <NavItem to="/calendar" delay={menuOpen ? 400 : 0}>
                      Calendar
                    </NavItem>
                  </>
                )}

                <div
                  className={`transform transition-all duration-700 ${
                    menuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
