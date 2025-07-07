import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/PetList.css"; // Import your CSS styles
export default function PetListPage() {
  const [pets, setPets] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
//obtener todas las mascotas
  const fetchPets = async () => {
    try {
      const res = await axios.get("http://3.211.68.117:8000/api/pets/");
      setPets(res.data);
    } catch (err) {
      console.error("❌ Error obtaining pets:", err);
      setErrorMsg("❌ The pets could not be loaded.");
    }
  };
//eliminar mascota
  // Confirmación antes de eliminar
  const deletePet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;

    try {
      await axios.delete(`http://3.211.68.117:8000/api/pets/${id}`);
      setPets((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err) {
      console.error("❌ Error deleting:", err);
      setErrorMsg("❌ The pet could not be deleted.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet: any) =>
    `${pet.name} ${pet.breed} ${pet.notes || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
   <div className="pet-list-container">
  <h1 className="pet-list-title">List of Pets</h1>

  <input
    type="text"
    placeholder="Search by name, breed, or notes.."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pet-search-input"
  />

  {errorMsg && <p className="pet-error-message">{errorMsg}</p>}

  <div className="pet-table-wrapper">
    <table className="pet-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Species</th>
          <th>Breed</th>
          <th>Age</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredPets.map((pet: any) => (
          <tr key={pet.id}>
            <td>{pet.name}</td>
            <td>{pet.species}</td>
            <td>{pet.breed}</td>
            <td>{pet.age}</td>
            <td>{pet.notes}</td>
            <td>
              <button
                className="btn-edit"
                onClick={() => navigate(`/edit-pet/${pet.id}`)}
              >
                Editar
              </button>
              <button
                className="btn-delete"
                onClick={() => deletePet(pet.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {filteredPets.length === 0 && (
          <tr>
            <td colSpan={6} className="no-pets-msg">
              There are no matching pets.
            </td>
          </tr>
        )}
      </tbody>
    </table>
          <button 
    type="button"
    onClick={() => navigate("/dashboard")}
    className="regresar-button"
  >
    Return
  </button>
  </div>
</div>
  );
} 