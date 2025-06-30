import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post("http://3.233.35.150:8000/api/users/login", {
        username_or_email: email,
        password,
      });

      const token = res.data.access_token;

      login(token);
      navigate("/dashboard");
    } catch (err: any) {
      const errorData = err.response?.data;
      let detail: string | string[] = "❌ Error inesperado del servidor..";

      if (Array.isArray(errorData?.detail)) {
        // Errores múltiples (por ejemplo, validación FastAPI)
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

        {/* Mostrar mensajes de error */}
        {Array.isArray(errorMsg) ? (
          <ul className="text-red-600 text-sm mb-3 list-disc ml-5">
            {errorMsg.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ) : (
          errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Entrar
        </button>

        <p className="mt-3 text-sm text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}
