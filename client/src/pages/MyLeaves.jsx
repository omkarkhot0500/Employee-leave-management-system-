import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
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
  const [isVisible, setIsVisible] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Leave Requests";
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
    
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'other': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8 relative">
      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '500ms'}}></div>
      </div>

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div
          className={`text-center mb-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Leave Requests
          </h2>
          <p className="text-gray-600">
            View and manage your leave requests
          </p>
        </div>

        {/* Main Content */}
        <div
          className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-1000 delay-300 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No leave requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50/50 border-b border-blue-200/50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">S.No.</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Start</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">End</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Reason</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Manager Comment</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave, index) => (
                      <tr key={leave._id} className="border-b border-gray-200/50 hover:bg-blue-50/30 transition-colors duration-200">
                        <td className="py-4 px-6 text-gray-700">{index + 1}</td>
                        <td className="py-4 px-6 text-gray-700">{new Date(leave.startDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-700">{new Date(leave.endDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={leave.managerComment}>
                          {leave.managerComment || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                            </span>
                            {leave.status === "pending" && (
                              <div className="flex space-x-2">
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 rounded transition-colors duration-200"
                                  onClick={() => openEditModal(leave)}
                                  title="Edit"
                                />
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="text-red-600 hover:text-red-800 cursor-pointer p-1 rounded transition-colors duration-200"
                                  onClick={() => handleDelete(leave._id)}
                                  title="Delete"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {leaves.map((leave, index) => (
                  <div key={leave._id} className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                          {leave.leaveType}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dates:</span>
                        <span className="text-gray-800">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reason:</span>
                        <p className="text-gray-800 mt-1">{leave.reason}</p>
                      </div>
                      {leave.managerComment && (
                        <div>
                          <span className="text-gray-600">Manager Comment:</span>
                          <p className="text-gray-800 mt-1">{leave.managerComment}</p>
                        </div>
                      )}
                    </div>

                    {leave.status === "pending" && (
                      <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 transition-colors duration-200"
                          onClick={() => openEditModal(leave)}
                          title="Edit"
                        />
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="text-red-600 hover:text-red-800 cursor-pointer p-2 transition-colors duration-200"
                          onClick={() => handleDelete(leave._id)}
                          title="Delete"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Leave Request</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date:</label>
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) =>
                      setEditData({ ...editData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date:</label>
                  <input
                    type="date"
                    value={editData.endDate}
                    onChange={(e) =>
                      setEditData({ ...editData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type:</label>
                <select
                  value={editData.leaveType}
                  onChange={(e) =>
                    setEditData({ ...editData, leaveType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason:</label>
                <textarea
                  rows="3"
                  value={editData.reason}
                  onChange={(e) =>
                    setEditData({ ...editData, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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