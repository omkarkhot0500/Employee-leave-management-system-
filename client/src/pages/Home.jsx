import React, { useContext, useEffect } from "react";
import "./styles/Home.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/authContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>
          Welcome to <span className="highlight">HyScaler</span>
        </h1>
        <h2>Employee Leave Management System</h2>
        <p>
          Streamline your leave requests, approvals, and balances — all in one
          place.
        </p>
        {!user && (
          <Link to="/login" className="home-btn">
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
