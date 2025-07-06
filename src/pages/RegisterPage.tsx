import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../components/RegisterPage.css';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | string[]>(""); // puede ser string o array
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      username,
      email,
      password,
      role: "admin", // Assuming the role is always 'user' for registration
    };

    try {
      console.log("📤 Sending data:", payload);

      const res = await axios.post("http://3.211.68.117:8000/api/users/register", payload);

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg("✅ Registro exitoso, redirigiendo al login...");
        setTimeout(() => {
          navigate("/"); // Redirige a la página de creación de cliente
        }, 2000);
      }

    } catch (err: any) {
      console.error("❌ Response error:", err);

      const errorData = err.response?.data;
      let detail: string | string[] = "❌ Unexpected server error.";

      if (Array.isArray(errorData?.detail)) {
        // Case 422 Unprocessable Entity with multiple validations
        detail = errorData.detail.map((e: any) => e.msg);
      } else if (typeof errorData?.detail === "string") {
        // Case of HTTPException with plain message
        detail = errorData.detail;
      } else if (typeof errorData?.message === "string") {
        // Fallback
        detail = errorData.message;
      }

      setErrorMsg(detail);
    }
  };

  return (
     <div className="register-form-container">
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Create account</h2>

      {Array.isArray(errorMsg) ? (
        <ul className="error-message-list">
          {errorMsg.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      ) : (
        errorMsg && <p className="error-message">{errorMsg}</p>
      )}

      {successMsg && <p className="success-message">{successMsg}</p>}

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="register-button">
        Sign up
      </button>
          
        <button
          type="button"
          onClick={() => navigate("/login")} // Esto redirige a la página de login
          className="initial-button"
        >
          Back to Home
        </button>

      <p className="login-link">
        Already have an account?{" "}
        <a href="/login">Log in here</a>
      </p>
    </form>
  </div>
);
}