import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/authContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = "Home";
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const animateText = (text, baseDelay = 0) => {
    return text.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block mr-2">
        {word.split("").map((letter, letterIndex) => (
          <span
            key={letterIndex}
            className="inline-block transition-all duration-700"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${baseDelay + (wordIndex * word.length + letterIndex) * 30}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Welcome message */}
        <div
          className={`mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <h2 className="text-xl md:text-2xl text-gray-600 font-light">
            Welcome to <span className="text-blue-600 font-semibold">GAT LMS</span>
          </h2>
        </div>

        {/* Main animated title */}
        <div className="mb-8 overflow-hidden">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
            {animateText("Employee Leave Management System")}
          </h1>
        </div>

        {/* Subtitle with staggered animation */}
        <div
          className={`mb-12 transition-all duration-1000 delay-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your leave requests, approvals, and balances — all in one place.
          </p>
        </div>

        {/* Get Started button with animation */}
        {!user && (
          <div
            className={`transition-all duration-1000 delay-1500 ${
              isVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '500ms'}}></div>
      </div>
    </div>
  );
};

export default Home;