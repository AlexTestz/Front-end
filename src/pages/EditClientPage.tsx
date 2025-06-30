import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
// Cargar datos del cliente al iniciar
  // Asegúrate de que el ID es válido antes de hacer la solicitud
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://3.214.168.136:8000/api/clients/${id}`);
        setForm(res.data.client);
      } catch (err) {
        setErrorMsg("❌ Error al cargar datos del cliente.");
        console.error(err);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
// Validar campos requeridos
//actualizar cliente
    try {
      await axios.put(`http://3.214.168.136:8000/api/clients/${id}`, form);
      setSuccessMsg("✅ Cliente actualizado correctamente.");
      setTimeout(() => navigate("/clients"), 1500);
    } catch (err) {
      console.error("❌ Error al actualizar cliente:", err);
      setErrorMsg("❌ No se pudo actualizar el cliente.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {["name", "last_name", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field.replace("_", " ")}</label>
            <input
              type="text"
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}

        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
