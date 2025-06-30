import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PetListPage() {
  const [pets, setPets] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
//obtener todas las mascotas
  const fetchPets = async () => {
    try {
      const res = await axios.get("http://3.214.168.136:8000/api/pets/");
      setPets(res.data);
    } catch (err) {
      console.error("❌ Error al obtener mascotas:", err);
      setErrorMsg("❌ No se pudieron cargar las mascotas.");
    }
  };
//eliminar mascota
  // Confirmación antes de eliminar
  const deletePet = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta mascota?")) return;

    try {
      await axios.delete(`http://3.214.168.136:8000/api/pets/${id}`);
      setPets((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      setErrorMsg("❌ No se pudo eliminar la mascota.");
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
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">🐶 Lista de Mascotas</h1>

      <input
        type="text"
        placeholder="Buscar por nombre, raza o notas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded"
      />

      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Nombre</th>
              <th className="p-3">Especie</th>
              <th className="p-3">Raza</th>
              <th className="p-3">Edad</th>
              <th className="p-3">Notas</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.map((pet: any) => (
              <tr key={pet.id} className="border-t">
                <td className="p-3">{pet.name}</td>
                <td className="p-3">{pet.species}</td>
                <td className="p-3">{pet.breed}</td>
                <td className="p-3">{pet.age}</td>
                <td className="p-3">{pet.notes}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => navigate(`/edit-pet/${pet.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deletePet(pet.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredPets.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No hay mascotas coincidentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
