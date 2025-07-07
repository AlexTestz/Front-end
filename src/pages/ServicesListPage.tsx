

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/ServicesList.css"; // Asegúrate de tener los estilos necesarios

export default function ServicesListPage() {
  const [services, setServices] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Nuevo estado para el modal
  const [serviceToDelete, setServiceToDelete] = useState(null); // Estado para almacenar el servicio a eliminar
  const navigate = useNavigate();

  // Cargar los servicios desde la API
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://3.211.68.117:8000/api/services/"); // URL de tu API
      setServices(res.data); // Asegúrate de que la respuesta sea en el formato adecuado
    } catch (err) {
      console.error("❌ Error retrieving services:", err);
      setErrorMsg("❌ Services could not be loaded.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Función para manejar la eliminación
  const handleDelete = (id) => {
    setServiceToDelete(id); // Guardar el ID del servicio a eliminar
    setShowConfirmModal(true); // Mostrar el modal de confirmación
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://3.211.68.117:8000/api/services/${serviceToDelete}`);
      setServices((prev) => prev.filter(service => service.id !== serviceToDelete));
      setShowConfirmModal(false); // Cerrar el modal
    } catch (error) {
      console.error("❌ Error eliminando servicio:", error);
      setErrorMsg("❌ No se pudo eliminar el servicio.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false); // Cerrar el modal sin eliminar
  };

  return (
    <div className="services-list-container">
      <h1>Services List</h1>
      {errorMsg && <p>{errorMsg}</p>}

      <ul>
        {services.map((service: any) => (
          <li key={service.id}>
            {service.name} - {service.price} USD
            <button onClick={() => navigate(`/edit-service/${service.id}`)}>Edit</button>
            <button onClick={() => handleDelete(service.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Modal de Confirmación de eliminación */}
      {showConfirmModal && (
        <div className="confirm-delete-modal">
          <p>Are you sure you want to delete this service?</p>
          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}

      {/* Botón para ir a crear nuevo servicio */}
      <button onClick={() => navigate("/create-service")} className="new-service">Create New Service</button>
              <button onClick={() => navigate("/dashboard")} className="return-button">
    Return
  </button>
    </div>
  );
}
