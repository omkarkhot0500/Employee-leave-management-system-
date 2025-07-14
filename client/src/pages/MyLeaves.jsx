import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/MyLeaves.css";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";

const MyLeaves = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Leave Requests";
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/leave/my-requests");
        setLeaves(res.data);
      } catch (err) {
        toast.error("Failed to load your leaves.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error("Login first to access this page");
      navigate("/");
      return;
    }
  }, [user]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave request?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/leave/delete-leave/${id}`);
      toast.success(res.data.message || "Leave request deleted");
      setLeaves((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (leave) => {
    setEditData({
      id: leave._id,
      startDate: leave.startDate.split("T")[0],
      endDate: leave.endDate.split("T")[0],
      reason: leave.reason,
      leaveType: leave.leaveType,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (new Date(editData.endDate) < new Date(editData.startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }
    try {
      const res = await axios.put(`/leave/update-leave/${editData.id}`, {
        startDate: editData.startDate,
        endDate: editData.endDate,
        reason: editData.reason,
        leaveType: editData.leaveType,
      });

      toast.success(res.data.message);

      setLeaves((prev) =>
        prev.map((l) => (l._id === editData.id ? res.data.leave : l))
      );

      setEditModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="my-leaves-page">
      <div className="my-leaves-card">
        <h2>My Leave Requests</h2>

        {loading ? (
          <Loader />
        ) : leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Start</th>
                <th>End</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Manager Comment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={leave._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.managerComment || "N/A"}</td>
                  <td>
                    <span className={`status ${leave.status}`}>
                      {leave.status.charAt(0).toUpperCase() +
                        leave.status.slice(1)}
                    </span>

                    {leave.status === "pending" && (
                      <>
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="edit-icon"
                          onClick={() => openEditModal(leave)}
                          title="Edit"
                        />
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="delete-icon"
                          onClick={() => handleDelete(leave._id)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h3>Edit Leave Request</h3>
            <div className="date-group">
              <div className="form-field">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={editData.startDate}
                  onChange={(e) =>
                    setEditData({ ...editData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <label>End Date:</label>
                <input
                  type="date"
                  value={editData.endDate}
                  onChange={(e) =>
                    setEditData({ ...editData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <label>Leave Type:</label>
            <select
              value={editData.leaveType}
              onChange={(e) =>
                setEditData({ ...editData, leaveType: e.target.value })
              }
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick</option>
              <option value="other">Other</option>
            </select>
            <label>Reason:</label>
            <textarea
              rows="3"
              value={editData.reason}
              onChange={(e) =>
                setEditData({ ...editData, reason: e.target.value })
              }
            />
            <div className="edit-modal-actions">
              <button onClick={handleEditSave} className="approve-btn">
                Save
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="reject-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
