import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClientsListPage.css"; // Import your CSS styles

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
 <div className="client-list-container">
  <h1 className="client-list-title"> Lista de Clientes</h1>

  {errorMsg && <p className="client-error-message">{errorMsg}</p>}

  <input
    type="text"
    placeholder="Buscar por nombre o email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="client-search-input"
  />

  <div className="client-table-wrapper">
    <table className="client-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredClients.map((client: any) => (
          <tr key={client.id}>
            <td>{client.name} {client.last_name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
              <button
                className="btn-edit"
                onClick={() => navigate(`/edit-client/${client.id}`)}
              >
                Editar
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteClient(client.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        {filteredClients.length === 0 && (
          <tr>
            <td colSpan={4} className="no-clients-msg">
              No hay clientes coincidentes.
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
    Regresar
  </button>
  </div>
</div>
  );
} 