import { useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/LeaveRequest.css";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

const LeaveRequest = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Login first to access this page");
      navigate("/"); 
      return;
    }
    document.title = "Submit Leave Request";
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

    try {
      const res = await axios.post("/leave/request", formData);
      toast.success(res.data.message || "Leave request submitted!");
      setFormData({ startDate: "", endDate: "", reason: "", leaveType: "" });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to submit leave request."
      );
    }
  };

  return (
    <div className="leave-request-page">
      <form className="leave-request-form" onSubmit={handleSubmit}>
        <h2>Request Leave</h2>

        <div className="date-group">
          <div className="form-field">
            <label>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label>End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>
        </div>

        <label>Leave Type</label>
        <select
          value={formData.leaveType}
          onChange={(e) =>
            setFormData({ ...formData, leaveType: e.target.value })
          }
          required
        >
          <option value="">-- Select Leave Type --</option>
          <option value="vacation">Vacation Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Reason for leave"
          rows="4"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default LeaveRequest;
