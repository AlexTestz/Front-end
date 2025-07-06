import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
        console.error("❌ Error al cargar clientes:", err);
        setErrorMsg("❌ No se pudieron cargar los clientes.");
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
      species: "Perro", // especie fija
      breed: breed === "Otro" ? customBreed : breed,
      age: parseInt(age),
      admission_date: admissionDate,
      notes,
      client_id: clientId,
    };

    console.log("📤 Registrando mascota:", payload);
//register pet
    try {
      const res = await axios.post("http://3.211.68.117:8000/api/pets/", payload, {
        validateStatus: () => true,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg("✅ Mascota registrada correctamente.");
        setName("");
        setBreed("");
        setCustomBreed("");
        setAge("");
        setAdmissionDate("");
        setNotes("");
        if (!clientIdFromUrl) setClientId("");
      } else {
        const detail = res.data?.detail || "❌ Error al registrar la mascota.";
        setErrorMsg(`❌ ${detail}`);
      }
    } catch (err: any) {
      console.error("❌ Error inesperado:", err);
      setErrorMsg("❌ Error inesperado al registrar la mascota.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Registrar Mascota</h1>

      {errorMsg && <p className="text-red-400 mb-3">❌ {errorMsg}</p>}
      {successMsg && <p className="text-green-400 mb-3">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        {!clientIdFromUrl && (
          <div>
            <label className="block mb-1 text-sm">Selecciona un cliente</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-3 py-2 text-black rounded"
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

        <div>
          <label className="block mb-1 text-sm">Nombre de la mascota</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Raza</label>
          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="">-- Selecciona raza --</option>
            {dogBreeds.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {breed === "Otro" && (
          <div>
            <label className="block mb-1 text-sm">Escribe la raza</label>
            <input
              type="text"
              value={customBreed}
              onChange={(e) => setCustomBreed(e.target.value)}
              required
              className="w-full px-3 py-2 text-black rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm">Edad</label>
          <input
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Fecha de admisión</label>
          <input
            type="date"
            value={admissionDate}
            onChange={(e) => setAdmissionDate(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded"
        >
          Registrar Mascota
        </button>
      </form>
    </div>
  );
}
