import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../components/PetPage.css';

export default function CreatePetPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get("clientId");

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(clientIdFromUrl || "");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");
  const [age, setAge] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const dogBreeds = [
    "Labrador Retriever", "Pastor Alemán", "Bulldog", "Poodle", "Chihuahua",
    "Golden Retriever", "Rottweiler", "Shih Tzu","Beagle","Chihuahua","Husky","Otro"
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        //get clients from the API
        const res = await axios.get("http://3.211.68.117:8000/api/clients"); 
        setClients(res.data.clients);
      } catch (err) {
        console.error("❌ Error loading customers:", err);
        setErrorMsg("❌ Clients could not be loaded.");
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name,
      species: "Perro", // fixed species
      breed: breed === "Otro" ? customBreed : breed,
      age: parseInt(age),
      admission_date: admissionDate,
      notes,
      client_id: clientId,
    };

    console.log("📤 Registering a pet:", payload);
//register pet
    try {
      const res = await axios.post("http://3.211.68.117:8000/api/pets/", payload, {
        validateStatus: () => true,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg("✅ Pet properly registered.");
        setName("");
        setBreed("");
        setCustomBreed("");
        setAge("");
        setAdmissionDate("");
        setNotes("");
        if (!clientIdFromUrl) setClientId("");
      } else {
        const detail = res.data?.detail || "❌ Error registering pet.";
        setErrorMsg(`❌ ${detail}`);
      }
    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      setErrorMsg("❌ Unexpected error while registering your pet.");
    }
  };

  return (
    <div className="pet-form-container">
    <h1 className="pet-form-title">Register Pet</h1>

    {errorMsg && <p className="pet-error-message">{errorMsg}</p>}
    {successMsg && <p className="pet-success-message">{successMsg}</p>}

    <form onSubmit={handleSubmit} className="pet-form">
      {!clientIdFromUrl && (
        <div className="form-group">
          <label>Select a customer</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">-- Selecciona --</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.last_name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Pet's name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Breed</label>
        <select
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          required
        >
          <option value="">-- Select breed --</option>
          {dogBreeds.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {breed === "Other" && (
        <div className="form-group">
          <label>Write the breed</label>
          <input
            type="text"
            value={customBreed}
            onChange={(e) => setCustomBreed(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Age</label>
        <input
          type="number"
          min={0}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Date of admission</label>
        <input
          type="date"
          value={admissionDate}
          onChange={(e) => setAdmissionDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button type="submit" className="pet-submit-button">
        Register Pet
      </button>
    </form>
  </div>
);
}
