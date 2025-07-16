import { useState, useEffect, useContext } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";

const LeaveRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Login first to access this page");
      navigate("/");
      return;
    }
    document.title = "Submit Leave Request";
    setTimeout(() => setIsVisible(true), 100);
  }, [user, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8 relative">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '500ms' }}></div>
      </div>

      <div className="max-w-2xl w-full mx-auto z-10">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Request Leave</h2>
          <p className="text-gray-600">Submit your leave request for approval</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-white/20 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="space-y-6">
            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                />
              </div>
            </div>

            {/* Leave Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Leave Type</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/70 appearance-none cursor-pointer"
              >
                <option value="">-- Select Leave Type --</option>
                <option value="vacation">Vacation Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Reason for Leave</label>
              <textarea
                placeholder="Please provide a detailed reason for your leave request..."
                rows="4"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm hover:bg-white/70 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className={`mt-6 bg-blue-50/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-sm text-blue-700 text-center">
            <span className="font-semibold">Note:</span> Your leave request will be reviewed by your manager and you'll receive a notification once approved or rejected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
