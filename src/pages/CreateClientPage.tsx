import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateClientPage() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name,
      last_name: lastname,
      email,
      phone,
      address,
    };

    console.log("📤 Enviando datos del cliente:", payload);

    try {
      const res = await axios.post("http://localhost:8000/api/clients", payload, {
        validateStatus: () => true,
      });

      if (res.status === 201 || res.status === 200) {
        const clientId = res.data.client?.id;

        setSuccessMsg("✅ Cliente registrado correctamente. Redirigiendo...");

        setTimeout(() => {
          // 🔁 Redirige a /create-pet con el clientId en la URL
          navigate(`/create-pet?clientId=${clientId}`);
        }, 2000);
      } else {
        const detail = res.data?.detail || res.data?.message || "❌ Error al registrar cliente.";
        setErrorMsg(`❌ ${detail}`);
      }
    } catch (err: any) {
      setErrorMsg("❌ Error inesperado en el servidor.");
      console.error("❌ Error al registrar cliente:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Datos del Cliente</h2>

        {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-3">{successMsg}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          Registrar Cliente
        </button>
      </form>
    </div>
  );
}
