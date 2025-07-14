import { useContext, useState } from "react";
import axios from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { AuthContext } from "../auth/authContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      toast("Logout first to login again!!");
      navigate("/");
    }
    document.title = "Login";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/auth/login", formData);
      login(res.data.token);
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        {loading ? <Loader /> : <button type="submit">Login</button>}
        <p className="redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
