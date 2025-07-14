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

  useEffect(() => {
    if (!user || user.role !== "manager") {
      toast.error("Access denied: Managers only");
      navigate("/");
      return;
    }
    document.title = "Leave Calendar";
    fetchCalendar();
  }, [user]);

  const fetchCalendar = async () => {
    try {
      const res = await axios.get("/leave/calendar");
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load calendar data");
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        ev =>
          new Date(ev.start) <= date && date <= new Date(ev.end)
      );
      return (
        <ul className="day-events">
          {dayEvents.map((e, idx) => (
            <li key={idx}>{e.title}</li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="calendar-page">
      <h2>Team Leave Calendar</h2>
      <Calendar tileContent={tileContent} />
    </div>
  );
};

export default LeaveCalendar;
