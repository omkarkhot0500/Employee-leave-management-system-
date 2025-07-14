import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/PendingRequests.css";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const PendingRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [managerComment, setManagerComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/leave/pending");
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "manager") {
      toast.error("Access denied: Managers only");
      navigate("/");
      return;
    }
    fetchRequests();
    document.title = "Pending Requests";
  }, [user]);

  const openPopup = (id, action) => {
    setSelectedLeaveId(id);
    setSelectedAction(action);
    setManagerComment("");
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.patch(`/leave/${selectedLeaveId}/approve`, {
        status: selectedAction,
        managerComment: managerComment,
      });

      toast.success(`Leave ${selectedAction} successfully`);

      setSelectedLeaveId(null);
      setSelectedAction("");
      setManagerComment("");

      setRequests((prev) => prev.filter((l) => l._id !== selectedLeaveId));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Action failed";
      toast.error(msg);
    }
  };

  const closePopup = () => {
    setSelectedLeaveId(null);
    setSelectedAction("");
    setManagerComment("");
  };

  return (
    <div className="pending-requests-page">
      <div className="pending-requests-card">
        <h2>Pending Leave Requests</h2>

        {loading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((leave, index) => (
                  <tr key={leave._id}>
                    <td>{index + 1}</td>
                    <td>{leave.user?.name || "N/A"}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => openPopup(leave._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => openPopup(leave._id, "rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLeaveId && (
        <div className="pending-modal-overlay">
          <div className="pending-modal-content">
            <h3>
              Confirm{" "}
              {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
            </h3>
            <textarea
              placeholder="Enter manager comment..."
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
            />
            <div className="pending-modal-actions">
              <button onClick={handleConfirm} className="approve-btn">
                Confirm
              </button>
              <button onClick={closePopup} className="reject-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
