import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ CORRECTED IMPORT
import { useEffect, useState } from "react";
import '../components/dashboard.css';  // Import the CSS file for styles

interface TokenPayload {
  username: string;
  role: string;
}

export default function Dashboard() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    }
  }, [token]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title ">Welcome, {username}</h1>

      <div className="dashboard-buttons">
        <button
          onClick={() => navigate("/create-client")}
          className="btn btn-blue"
        >
          Register customer
        </button>

        <button
          onClick={() => navigate("/create-pet")}
          className="btn btn-green"
        >
          Register pet
        </button>

        <button
          onClick={() => navigate("/clients")}
          className="btn btn-purple"
        >
          View customers
        </button>

        <button
          onClick={() => navigate("/change-password")}
          className="btn btn-blue"
        >
          Change Password
        </button>

        <button
          onClick={() => navigate("/pets")}
          className="btn btn-yellow"
        >
          View pets
        </button>

         <button
          onClick={() => navigate("/services")}
          className="btn btn-yellow"
        >
          Services
        </button>

        <button
          onClick={logout}
          className="btn btn-red"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
