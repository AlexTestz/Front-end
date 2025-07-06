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
        const res = await axios.get(`http://3.211.68.117:8000/api/clients/${id}`);
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
      await axios.put(`http://3.211.68.117:8000/api/clients/${id}`, form);
      setSuccessMsg("✅ Cliente actualizado correctamente.");
      setTimeout(() => navigate("/clients"), 1500);
    } catch (err) {
      console.error("❌ Error al actualizar cliente:", err);
      setErrorMsg("❌ No se pudo actualizar el cliente.");
    }
  };

  return (
     <div className="edit-client-container">
  <h1 className="edit-client-title">Editar Cliente</h1>

  {errorMsg && <p className="edit-client-error">{errorMsg}</p>}
  {successMsg && <p className="edit-client-success">{successMsg}</p>}

  <form onSubmit={handleSubmit} className="edit-client-form">
    {["name", "last_name", "email", "phone"].map((field) => (
      <div key={field}>
        <label>{field.replace("_", " ")}</label>
        <input
          type="text"
          name={field}
          value={(form as any)[field]}
          onChange={handleChange}
          required
        />
      </div>
    ))}

    <button className="edit-client-button">Guardar cambios</button>
      <button 
    type="button"
    onClick={() => navigate("/dashboard")}
    className="regresar-button">
    Regresar
  </button>
  </form>
</div>
  );
}