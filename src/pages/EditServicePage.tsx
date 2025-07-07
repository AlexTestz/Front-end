import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/EditServicePage.css"; // Asegúrate de tener un archivo CSS para los estilos

export default function EditServicePage() {
  const { id } = useParams(); // Obtener el ID del servicio desde la URL
  const navigate = useNavigate();

  const [service, setService] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0, // Asegúrate de incluir el campo de duración
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Obtener los detalles del servicio a editar
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://3.211.68.117:8000/api/services/name/${id}`);

        setService(res.data); // Asegúrate de que la respuesta contiene los datos correctamente
      } catch (err) {
        setErrorMsg("❌ Error loading service data.");
        console.error(err);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones para asegurar que los campos estén completos
    if (!service.name || !service.description || service.price <= 0) {
      setErrorMsg("❌ Please fill in all fields correctly.");
      return;
    }

    try {
      // Hacer una solicitud PUT para actualizar el servicio
const res = await axios.put(
 `http://3.211.68.117:8000/api/services/${id}`,
  {
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration, // Asegúrate de incluir la duración si es necesaria
  }
);

      // Si la actualización es exitosa
      if (res.status === 200) {
        setSuccessMsg("✅ Service updated successfully.");
        setTimeout(() => navigate("/services"), 2000); // Redirigir a la lista de servicios
      }
    } catch (err) {
      console.error("❌ Error updating service:", err);
      setErrorMsg("❌ Error updating service.");
    }
  };
  return (
<div className="edit-service-container">
  <h1>Edit Service</h1>

  {errorMsg && <p className="error-message">{errorMsg}</p>}
  {successMsg && <p className="success-message">{successMsg}</p>}

  <form onSubmit={handleSubmit} className="edit-service-form">
    <div className="form-group">
      <label>Service Name</label>
      <input
        type="text"
        name="name"
        value={service.name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        name="description"
        value={service.description}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Price (USD)</label>
      <input
        type="number"
        name="price"
        value={service.price}
        onChange={handleChange}
        required
      />
    </div>

    {/* Campo de Duración */}
    <div className="form-group">
      <label>Duration (minutes)</label>
      <input
        type="number"
        name="duration"
        value={service.duration}
        onChange={handleChange}
        required
        min="1"  // Asegura que la duración sea al menos 1 minuto
      />
    </div>

    <button type="submit" className="edit-service-button">
      Save Changes
    </button>

    <button
      type="button"
      onClick={() => navigate("/services")}
      className="return-button"
    >
      Return to Services List
    </button>
  </form>
</div>
  );
}
