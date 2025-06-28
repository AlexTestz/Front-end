import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORT CORREGIDA
import { useEffect, useState } from "react";

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
        console.error("❌ Error al decodificar token:", err);
      }
    }
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido {username}</h1>

      <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
        <button
          onClick={() => navigate("/create-client")}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Registrar cliente
        </button>

        <button
          onClick={() => navigate("/create-pet")}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition"
        >
          Registrar mascota
        </button>
          <button
          onClick={() => navigate("/clients")}
          className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition"
        >
          Ver clientes
        </button>
                <button
          onClick={() => navigate("/change-password")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cambiar Contraseña
        </button>

        <button
          onClick={() => navigate("/pets")}
          className="bg-yellow-600 text-white w-full py-2 rounded hover:bg-yellow-700 transition"
        >
          Ver mascotas
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
