import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      setErrorMsg("❌ Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("❌ Usuario no autenticado. Inicia sesión de nuevo.");
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
        setSuccessMsg("✅ Contraseña cambiada correctamente.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setErrorMsg(res.data?.detail || "❌ No se pudo cambiar la contraseña.");
      }
    } catch (err) {
      console.error("❌ Error al cambiar contraseña:", err);
      setErrorMsg("❌ Error inesperado al cambiar contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Cambiar Contraseña</h1>

      {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Contraseña Actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
}
