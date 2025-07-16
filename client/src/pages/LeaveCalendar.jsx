import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "../api/axiosInstance";
import { AuthContext } from "../auth/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./styles/LeaveCalendar.css";

const LeaveCalendar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "manager") {
      toast.error("Access denied: Managers only");
      navigate("/");
      return;
    }
    document.title = "Leave Calendar";
    fetchCalendar();
    
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, [user]);

  const fetchCalendar = async () => {
    try {
      const res = await axios.get("/leave/calendar");
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load calendar data");
    }
  };

  const animateText = (text, baseDelay = 0) => {
    return text.split(" ").map((word, wordIndex) => (
      <span
        key={wordIndex}
        className="inline-block mr-3"
        style={{
          animation: `slideInUp 0.8s ease-out ${baseDelay + wordIndex * 0.1}s both`,
        }}
      >
        {word.split("").map((letter, letterIndex) => (
          <span
            key={letterIndex}
            className="inline-block transition-all duration-300 hover:text-blue-400 hover:scale-110"
            style={{
              animation: `fadeInUp 0.6s ease-out ${
                baseDelay + wordIndex * 0.1 + letterIndex * 0.05
              }s both`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    ));
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        ev =>
          new Date(ev.start) <= date && date <= new Date(ev.end)
      );
      return (
        <div className="events-container">
          {dayEvents.map((e, idx) => (
            <div key={idx} className="event-dot">
              {e.title}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 transition-all duration-1000 ${
            isVisible ? "animate-pulse" : ""
          }`}
        />
        <div
          className={`absolute top-40 right-16 w-24 h-24 bg-purple-200 rounded-full opacity-40 transition-all duration-1000 ${
            isVisible ? "animate-bounce" : ""
          }`}
        />
        <div
          className={`absolute bottom-20 left-20 w-40 h-40 bg-indigo-200 rounded-full opacity-25 transition-all duration-1000 ${
            isVisible ? "animate-pulse" : ""
          }`}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Welcome message */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-lg text-gray-600 mb-4 font-medium">
              Manager Dashboard
            </p>
          </div>

          {/* Main animated title */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              {animateText("Team Leave Calendar")}
            </h1>
          </div>

          {/* Subtitle with staggered animation */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              View and manage your team's leave schedule at a glance
            </p>
          </div>
        </div>

        {/* Calendar Container */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="calendar-wrapper">
              <Calendar
                tileContent={tileContent}
                className="enhanced-calendar"
              />
            </div>
          </div>
        </div>

        {/* Calendar Legend */}
        <div
          className={`transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md mx-auto mt-8 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Calendar Legend
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span>Scheduled Leave</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span>Pending Approval</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>Approved Leave</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
      <div className="fixed top-1/2 right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
      <div className="fixed bottom-1/3 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
    </div>
  );
};

export default LeaveCalendar;