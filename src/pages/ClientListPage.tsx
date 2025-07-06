import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClientsList.css"; // Import your CSS styles

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
      console.error("❌ Error retrieving clients:", err);
      setErrorMsg("❌ Clients could not be loaded.");
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://3.211.68.117:8000/api/clients/${id}`);
      setClients((prev) => prev.filter((c: any) => c.id !== id));
    } catch (err) {
      console.error("❌ Error deleting:", err);
      setErrorMsg("❌ The client could not be deleted.");
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
  <h1 className="client-list-title"> Client List</h1>

  {errorMsg && <p className="client-error-message">{errorMsg}</p>}

  <input
    type="text"
    placeholder="Search by name or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="client-search-input"
  />

  <div className="client-table-wrapper">
    <table className="client-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
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
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteClient(client.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {filteredClients.length === 0 && (
          <tr>
            <td colSpan={4} className="no-clients-msg">
              There are no matching customers.
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