import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ".components/EditPetPage.css"; // Assuming you have a CSS file for styles

export default function EditPetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ---------- fixed breed catalog ----------
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

  // ---------- status ----------
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

  // ---------- load pet ----------
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://3.211.68.117:8000/api/pets/${id}`);
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
        setErrorMsg("❌ Error loading pet data.");
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
// update pet
    try {
      await axios.put(`http://3.211.68.117:8000/api/pets/${id}`, {
        name: form.name,
        species: "Perro", // 
        breed: form.breed === "Other" ? customBreed : form.breed,
        age: parseInt(form.age),
        admission_date: form.admission_date,
        notes: form.notes,
      });

      setSuccessMsg("✅ Pet successfully updated.");
      setTimeout(() => navigate("/pets"), 1200);
    } catch (err) {
      console.error("❌ Error updating pet:", err);
      setErrorMsg("❌ The mascot could not be updated.");
    }
  };

  // ---------- UI ----------
  return (
 <div className="edit-pet-container">
      <h1 className="edit-pet-title">Edit Pet</h1>

      {errorMsg && <p className="edit-pet-error">{errorMsg}</p>}
      {successMsg && <p className="edit-pet-success">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="edit-pet-form">
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Breed */}
        <div>
          <label>Breed</label>
          <select
            value={form.breed}
            onChange={handleBreedSelect}
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

        {/* Breed personalizada */}
        {form.breed === "Other" && (
          <div>
            <label>Write the breed</label>
            <input
              type="text"
              value={customBreed}
              onChange={(e) => setCustomBreed(e.target.value)}
              required
            />
          </div>
        )}

        {/* Age */}
        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            min={0}
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label>Date of admission</label>
          <input
            type="date"
            name="admission_date"
            value={form.admission_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Notas */}
        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* Button */}
        <button type="submit" className="edit-pet-button">
          Save changes
        </button>
              <button 
    type="button"
    onClick={() => navigate("/dashboard")}
    className="regresar-button">
    Return
  </button>
      </form>
    </div>
  );
}