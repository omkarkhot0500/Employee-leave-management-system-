import { useState, useEffect, useContext } from "react";
import axios from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles/Register.css";
import { AuthContext } from "../auth/authContext";
import Loader from "../components/Loader";

const Register = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "manager",
    manager: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      toast("Logout first to Register!!");
      navigate("/");
    }
    document.title = "Register";
    const fetchManagers = async () => {
      try {
        const res = await axios.get("/user/managers");
        setManagers(res.data);
      } catch (err) {
        console.error("Error fetching managers:", err);
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.role === "manager") {
      delete formData.manager;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/register", formData);
      navigate("/login");
      toast.success(res.data.message || "Registration successful!");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="password-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        {formData.role === "employee" && (
          <select
            value={formData.manager}
            onChange={(e) =>
              setFormData({ ...formData, manager: e.target.value })
            }
            required
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        {loading ? <Loader /> : <button type="submit">Register</button>}
        <p className="redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
