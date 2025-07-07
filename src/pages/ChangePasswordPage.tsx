import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/ChangePassword.css";



export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("❌ The new passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("❌ User not authenticated. Log in again.");
        return;
      }

      const res = await axios.put(
        "http://3.211.68.117:8000/api/users/change-password",
        {
          old_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true,
        }
      );

      if (res.status === 200) {
        setSuccessMsg("✅ Password successfully changed.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setErrorMsg(res.data?.detail || "❌ The password could not be changed.");
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
      setErrorMsg("❌ Unexpected error when changing password.");
    }
  };

  return (
    <div className="change-password-container">
  <h1 className="change-password-title"> Change Password</h1>

  {errorMsg && <p className="change-password-error">{errorMsg}</p>}
  {successMsg && <p className="change-password-success">{successMsg}</p>}

  <form onSubmit={handleSubmit} className="change-password-form">
    <div>
      <label>Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
    </div>

    <div>
      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>

    <div>
      <label>Confirm New Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>

    <button type="submit" className="change-password-button">
      Change Password
    </button>
                  <button 
    type="button"
    onClick={() => navigate("/dashboard")}
    className="regresar-button">
    Return
  </button>
  </form>
</div>
  );
} 
