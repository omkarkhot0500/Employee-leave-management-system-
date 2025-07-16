import { useEffect, useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import "./styles/ResetBalances.css";
import Loader from "../components/Loader";

const ResetBalances = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [newBalance, setNewBalance] = useState({
    vacation: "",
    sick: "",
    other: "",
  });

  useEffect(() => {
    if (!user || user.role !== "manager") {
      toast.error("Access denied: Managers only");
      navigate("/");
      return;
    }
    fetchEmployees();
    document.title = "Reset Leave Balance";
    
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, [user, navigate]);

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

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/user/managed-employees");
      setEmployees(res.data);
    } catch (err) {
      toast.error("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setNewBalance({
      vacation: employee.leaveBalance.vacation,
      sick: employee.leaveBalance.sick,
      other: employee.leaveBalance.other,
    });
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setNewBalance({ vacation: "", sick: "", other: "" });
  };

  const handleReset = async () => {
    try {
      await axios.put(`/user/reset-balance/${selectedEmployee._id}`, {
        vacation: Number(newBalance.vacation),
        sick: Number(newBalance.sick),
        other: Number(newBalance.other),
      });
      toast.success("Leave balance updated successfully");
      closeModal();
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === selectedEmployee._id
            ? {
                ...emp,
                leaveBalance: {
                  vacation: Number(newBalance.vacation),
                  sick: Number(newBalance.sick),
                  other: Number(newBalance.other),
                },
              }
            : emp
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update balance.");
    }
  };

  const getBalanceColor = (balance, type) => {
    if (balance <= 3) return 'text-red-600 bg-red-50';
    if (balance <= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
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
              {animateText("Reset Leave Balances")}
            </h1>
          </div>

          {/* Subtitle with staggered animation */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage and update your team's leave balances with ease
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
            ) : employees.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Employees Found</h3>
                <p className="text-gray-600">No employees are currently assigned to your management.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-l-lg">S.No.</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Employee</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Vacation</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Sick</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Other</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr
                        key={emp._id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                        style={{
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-sm">
                                {emp.name?.charAt(0)?.toUpperCase() || "N"}
                              </span>
                            </div>
                            <div>
                              <div className="text-gray-800 font-medium">{emp.name}</div>
                              <div className="text-gray-500 text-sm">Employee</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{emp.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBalanceColor(emp.leaveBalance.vacation)}`}>
                            {emp.leaveBalance.vacation} days
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBalanceColor(emp.leaveBalance.sick)}`}>
                            {emp.leaveBalance.sick} days
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBalanceColor(emp.leaveBalance.other)}`}>
                            {emp.leaveBalance.other} days
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={() => openModal(emp)}
                          >
                            Reset Balance
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className={`transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Employees</h3>
              <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Avg Vacation Balance</h3>
              <div className="text-3xl font-bold text-green-600">
                {employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.leaveBalance.vacation, 0) / employees.length) : 0}
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Avg Sick Balance</h3>
              <div className="text-3xl font-bold text-purple-600">
                {employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.leaveBalance.sick, 0) / employees.length) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 transform transition-all duration-300 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Reset Leave Balance
              </h3>
              <p className="text-gray-600">
                Update leave balances for <span className="font-semibold">{selectedEmployee.name}</span>
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vacation Leave (days)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={newBalance.vacation}
                  onChange={(e) =>
                    setNewBalance({ ...newBalance, vacation: e.target.value })
                  }
                  placeholder="Enter vacation days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sick Leave (days)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={newBalance.sick}
                  onChange={(e) =>
                    setNewBalance({ ...newBalance, sick: e.target.value })
                  }
                  placeholder="Enter sick days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Leave (days)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={newBalance.other}
                  onChange={(e) =>
                    setNewBalance({ ...newBalance, other: e.target.value })
                  }
                  placeholder="Enter other leave days"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Update Balance
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
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

export default ResetBalances;