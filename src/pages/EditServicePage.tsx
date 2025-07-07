import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/EditServicePage.css"; 

export default function EditServicePage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [service, setService] = useState({
    name: "",
    description: "",
    price: 0, 
    duration: 0, 
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Get the details of the service to be edited
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://3.211.68.117:8000/api/services/${id}`);
        setService(res.data); // Make sure that the response contains the data correctly.
      } catch (err) {
        setErrorMsg("❌ Error loading service data.");
        console.error(err);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert price and duration to numbers
    if (name === "price" || name === "duration") {
      setService((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setService((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validations to ensure that fields are complete and values are valid
    if (!service.name || !service.description || service.price <= 0 || service.duration <= 0) {
      setErrorMsg("❌ Please fill in all fields correctly.");
      return;
    }

    try {
      // Make a PUT request to update the service
      const res = await axios.put(
        `http://3.211.68.117:8000/api/services/${id}`,
        {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration, // Duration included in the application
        }
      );

      if (res.status === 200) {
        setSuccessMsg("✅ Service updated successfully.");
        setTimeout(() => navigate("/services"), 2000); // Redirect to the list of services
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
            min="1"  
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
