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
  const [isVisible, setIsVisible] = useState(false);
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
    
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, [user]);

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

  const getLeaveTypeColor = (type) => {
    const colors = {
      'sick': 'bg-red-100 text-red-800',
      'casual': 'bg-blue-100 text-blue-800',
      'vacation': 'bg-green-100 text-green-800',
      'personal': 'bg-yellow-100 text-yellow-800',
      'maternity': 'bg-purple-100 text-purple-800',
      'paternity': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
              {animateText("Pending Leave Requests")}
            </h1>
          </div>

          {/* Subtitle with staggered animation */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Review and approve your team's leave requests efficiently
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-7xl mx-auto border border-white/20">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Pending Requests</h3>
                <p className="text-gray-600">All leave requests have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-l-lg">S.No.</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Employee</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Start Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">End Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Reason</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((leave, index) => (
                      <tr
                        key={leave._id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                        style={{
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-sm">
                                {leave.user?.name?.charAt(0)?.toUpperCase() || "N"}
                              </span>
                            </div>
                            <span className="text-gray-800 font-medium">{leave.user?.name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{new Date(leave.startDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-700">{new Date(leave.endDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-700 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              onClick={() => openPopup(leave._id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              onClick={() => openPopup(leave._id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div
          className={`transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md mx-auto mt-8 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Request Summary
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{requests.length}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedLeaveId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                selectedAction === 'approved' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {selectedAction === 'approved' ? (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
              </h3>
              <p className="text-gray-600">
                Are you sure you want to {selectedAction} this leave request?
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager Comment
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                rows="4"
                placeholder="Enter your comment (optional)..."
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                  selectedAction === 'approved' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
              </button>
              <button
                onClick={closePopup}
                className="flex-1 py-3 px-6 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating elements for visual interest */}
      <div className="fixed top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
      <div className="fixed top-1/2 right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
      <div className="fixed bottom-1/3 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-bounce" />
      
      {/* Required CSS animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PendingRequests;