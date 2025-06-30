import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      role: "usuario",
    };

    try {
      console.log("📤 Enviando datos:", payload);

      const res = await axios.post("http://localhost:3006/api/users/register", payload);

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg("✅ Registro exitoso, redirigiendo al login...");
        setTimeout(() => {
          navigate("/create-client"); // Redirige a la página de creación de cliente
        }, 2000);
      }

    } catch (err: any) {
      console.error("❌ Error de respuesta:", err);

      const errorData = err.response?.data;
      let detail: string | string[] = "❌ Error inesperado del servidor.";

      if (Array.isArray(errorData?.detail)) {
        // Caso 422 Unprocessable Entity con múltiples validaciones
        detail = errorData.detail.map((e: any) => e.msg);
      } else if (typeof errorData?.detail === "string") {
        // Caso de HTTPException con mensaje plano
        detail = errorData.detail;
      } else if (typeof errorData?.message === "string") {
        // Fallback
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
        <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>

        {/* Mensajes de error (pueden ser lista o texto) */}
        {Array.isArray(errorMsg) ? (
          <ul className="text-red-600 text-sm mb-3 list-disc ml-5">
            {errorMsg.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ) : (
          errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
        )}

        {/* Mensaje de éxito */}
        {successMsg && <p className="text-green-600 text-sm mb-3">{successMsg}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Nombre de usuario</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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
          className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700 transition"
        >
          Registrarse
        </button>

        <p className="mt-3 text-sm text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </form>
    </div>
  );
}
