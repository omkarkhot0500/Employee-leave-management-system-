import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Loader from "../components/Loader";

const LeaveBalance = () => {
  const {user} = useContext(AuthContext);
  const [balance, setBalance] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Leave Balance";
    const fetchBalance = async () => {
      try {
        const res = await axios.get("/leave/balance");
        setBalance(res.data);
        // Trigger animations after data loads
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        toast.error("Failed to load leave balance.");
      }
    };

    fetchBalance();
  }, []);

  useEffect(()=>{
    if (!user) {
          toast.error("Login first to access this page");
          navigate("/");
          return;
        }
  },[user])

  const leaveTypes = [
    { 
      key: 'vacation', 
      label: 'Vacation Leave', 
      icon: '🏖️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800'
    },
    { 
      key: 'sick', 
      label: 'Sick Leave', 
      icon: '🏥',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800'
    },
    { 
      key: 'other', 
      label: 'Other Leave', 
      icon: '📋',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '500ms'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              My Leave Balance
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your available leave days across different categories
            </p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {!balance ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : (
            leaveTypes.map((leaveType, index) => (
              <div
                key={leaveType.key}
                className={`transform transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`${leaveType.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/50 backdrop-blur-sm`}>
                  {/* Icon and Label */}
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{leaveType.icon}</div>
                    <h3 className={`text-lg font-semibold ${leaveType.textColor}`}>
                      {leaveType.label}
                    </h3>
                  </div>

                  {/* Balance Display */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${leaveType.textColor} mb-2`}>
                      {balance[leaveType.key]}
                    </div>
                    <div className={`text-sm font-medium ${leaveType.textColor} opacity-70`}>
                      Days Available
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 bg-white/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${leaveType.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        width: isVisible ? `${Math.min((balance[leaveType.key] / 30) * 100, 100)}%` : '0%',
                        transitionDelay: `${800 + index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Card */}
        {balance && (
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Total Available Leave Days
              </h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {balance.vacation + balance.sick + balance.other}
              </div>
              <p className="text-gray-600">
                Combined across all leave categories
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;