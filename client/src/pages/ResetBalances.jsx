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
  }, [user, navigate]);

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

  return (
    <div className="reset-balances-page">
      <div className="reset-balances-card">
        <h2>Reset Employee Leave Balances</h2>

        {loading ? (
          <Loader />
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Vacation</th>
                <th>Sick</th>
                <th>Other</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp._id}>
                  <td>{index + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.leaveBalance.vacation}</td>
                  <td>{emp.leaveBalance.sick}</td>
                  <td>{emp.leaveBalance.other}</td>
                  <td>
                    <button
                      className="reset-btn"
                      onClick={() => openModal(emp)}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedEmployee && (
        <div className="reset-modal-overlay">
          <div className="reset-modal-content">
            <h3>Reset Leave Balance for {selectedEmployee.name}</h3>
            <label>Vacation:</label>
            <input
              type="number"
              value={newBalance.vacation}
              onChange={(e) =>
                setNewBalance({ ...newBalance, vacation: e.target.value })
              }
            />
            <label>Sick:</label>
            <input
              type="number"
              value={newBalance.sick}
              onChange={(e) =>
                setNewBalance({ ...newBalance, sick: e.target.value })
              }
            />
            <label>Other:</label>
            <input
              type="number"
              value={newBalance.other}
              onChange={(e) =>
                setNewBalance({ ...newBalance, other: e.target.value })
              }
            />

            <div className="reset-modal-actions">
              <button onClick={handleReset} className="reset-approve-btn">
                Confirm
              </button>
              <button onClick={closeModal} className="reset-reject-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetBalances;
