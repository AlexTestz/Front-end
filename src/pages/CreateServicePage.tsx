import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/CreateServicePage.css"; // Asegúrate de tener un archivo CSS para los estilos

export default function CreateServicePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !description || price <= 0) {
      setErrorMsg("❌ Please fill in all the fields correctly.");
      return;
    }

    const newService = {
      name,
      description,
      price,
    };

    try {
      const res = await axios.post("http://3.211.68.117:8000/api/services", newService);
      if (res.status === 201) {
        setSuccessMsg("✅ Service created successfully.");
        setTimeout(() => {
          navigate("/services"); // Redirigir a la lista de servicios después de la creación
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Error creating service:", err);
      setErrorMsg("❌ Error creating service.");
    }
  };

  return (
    <div className="create-service-container">
      <h1>Create a New Service</h1>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="create-service-form">
        <div className="form-group">
          <label>Service Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="create-service-button">
          Create Service
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
