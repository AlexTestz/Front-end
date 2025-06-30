import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditPetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ---------- catálogo fijo de razas ----------
  const dogBreeds = [
    "Labrador Retriever",
    "Pastor Alemán",
    "Bulldog",
    "Poodle",
    "Chihuahua",
    "Golden Retriever",
    "Rottweiler",
    "Shih Tzu",
    "Beagle",
    "Husky",
    "Otro",
  ];

  // ---------- estado ----------
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    admission_date: "",
    notes: "",
  });
  const [customBreed, setCustomBreed] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ---------- cargar mascota ----------
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/pets/${id}`);
        const { name, breed, age, admission_date, notes } = res.data;
        setForm({
          name,
          breed: dogBreeds.includes(breed) ? breed : "Otro",
          age: age.toString(),
          admission_date,
          notes: notes || "",
        });
        if (!dogBreeds.includes(breed)) setCustomBreed(breed);
      } catch (err) {
        console.error(err);
        setErrorMsg("❌ Error al cargar datos de la mascota.");
      }
    };
    fetchPet();
  }, [id]);

  // ---------- handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreedSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, breed: value }));
    if (value !== "Otro") setCustomBreed("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.put(`http://localhost:8000/api/pets/${id}`, {
        name: form.name,
        species: "Perro", // 🎯 especie fija
        breed: form.breed === "Otro" ? customBreed : form.breed,
        age: parseInt(form.age),
        admission_date: form.admission_date,
        notes: form.notes,
      });

      setSuccessMsg("✅ Mascota actualizada correctamente.");
      setTimeout(() => navigate("/pets"), 1200);
    } catch (err) {
      console.error("❌ Error al actualizar mascota:", err);
      setErrorMsg("❌ No se pudo actualizar la mascota.");
    }
  };

  // ---------- UI ----------
  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Editar Mascota</h1>

      {errorMsg && <p className="text-red-400 mb-3">{errorMsg}</p>}
      {successMsg && <p className="text-green-400 mb-3">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Nombre */}
        <div>
          <label className="block mb-1 text-sm">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        {/* Raza */}
        <div>
          <label className="block mb-1 text-sm">Raza</label>
          <select
            value={form.breed}
            onChange={handleBreedSelect}
            className="w-full px-3 py-2 text-black rounded"
            required
          >
            <option value="">-- Selecciona raza --</option>
            {dogBreeds.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Raza personalizada */}
        {form.breed === "Otro" && (
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

        {/* Edad */}
        <div>
          <label className="block mb-1 text-sm">Edad</label>
          <input
            type="number"
            name="age"
            min={0}
            value={form.age}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1 text-sm">Fecha de admisión</label>
          <input
            type="date"
            name="admission_date"
            value={form.admission_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block mb-1 text-sm">Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black rounded"
          />
        </div>

        {/* Submit */}
        <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
