import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import "./styles/LeaveBalance.css";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Loader from "../components/Loader";

const LeaveBalance = () => {
  const {user} = useContext(AuthContext);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Leave Balance";
    const fetchBalance = async () => {
      try {
        const res = await axios.get("/leave/balance");
        setBalance(res.data);
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

  return (
    <div className="leave-balance-page">
      <div className="leave-balance-card">
        <h2>My Leave Balance</h2>

        {!balance ? (
          <Loader />
        ) : (
          <div className="balance-list">
            <div className="balance-item">
              <span>Vacation Leave</span>
              <strong>{balance.vacation} Days</strong>
            </div>

            <div className="balance-item">
              <span>Sick Leave</span>
              <strong>{balance.sick} Days</strong>
            </div>

            <div className="balance-item">
              <span>Other Leave</span>
              <strong>{balance.other} Days</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
