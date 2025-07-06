import { useState } from "react"; 
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Adjust the path so that it points to /context/AuthContext
import { useNavigate } from "react-router-dom";
import '../components/LoginPage.css'; // Make sure the CSS is in the same directory.

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | string[]>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error msg

    try {
      const res = await axios.post("http://3.211.68.117:8000/api/users/login", {
        username_or_email: email,
        password,
        role: "user", // Assuming the role is always 'user' for login
      });

      const token = res.data.access_token;

      login(token);
      navigate("/dashboard");
    } catch (err: any) {
      const errorData = err.response?.data;
      let detail: string | string[] = "❌ Unexpected server error.";

      if (Array.isArray(errorData?.detail)) {
        detail = errorData.detail.map((e: any) => e.msg);
      } else if (typeof errorData?.detail === "string") {
        detail = errorData.detail;
      } else if (typeof errorData?.message === "string") {
        detail = errorData.message;
      }

      setErrorMsg(detail);
    }
  };

  return (

    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >
        <h2 className="login-title tracking-tight text-2xl font-bold text-center">Log in</h2>


        {/* Mostrar mensajes de error */}
        {Array.isArray(errorMsg) ? (
          <ul className="error-messages">
            {errorMsg.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ) : (
          errorMsg && <p className="error-message">{errorMsg}</p>
        )}

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
        >
          Enter
        </button>

        <p className="signup-link">
          Don't have an account?{" "}
          <a href="/register" className="signup-link-text">
            Register here
          </a>
        </p>
      </form>
    </div>

  );
  
}
