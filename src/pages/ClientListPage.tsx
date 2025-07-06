import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ClientsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://3.211.68.117:8000/api/clients/");
      setClients(res.data.clients);
    } catch (err) {
      console.error("❌ Error al obtener clientes:", err);
      setErrorMsg("❌ No se pudieron cargar los clientes.");
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      await axios.delete(`http://3.211.68.117:8000/api/clients/${id}`);
      setClients((prev) => prev.filter((c: any) => c.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      setErrorMsg("❌ No se pudo eliminar el cliente.");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client: any) =>
    `${client.name} ${client.last_name} ${client.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">🧍 Lista de Clientes</h1>

      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client: any) => (
              <tr key={client.id} className="border-t">
                <td className="p-3">{client.name} {client.last_name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => navigate(`/edit-client/${client.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteClient(client.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay clientes coincidentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
