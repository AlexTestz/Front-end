import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../components/ClientPage.css'; 

export default function CreateClientPage() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      name,
      last_name: lastname,
      email,
      phone,
      address,
    };

    console.log("📤 Sending customer data:", payload);
// Registrar cliente
    try {
      const res = await axios.post("http://3.211.68.117:8000/api/clients", payload, {
        validateStatus: () => true,
      });

      if (res.status === 201 || res.status === 200) {
        const clientId = res.data.client?.id;

        setSuccessMsg("✅ Customer successfully registered. Redirecting...");

        setTimeout(() => {
          // 🔁 Redirect to /create-pet with the clientId in the URL
          navigate(`/create-pet?clientId=${clientId}`);
        }, 2000);
      } else {
        const detail = res.data?.detail || res.data?.message || "❌ Error al registrar cliente.";
        setErrorMsg(`❌ ${detail}`);
      }
    } catch (err: any) {
      setErrorMsg("❌ Unexpected server error.");
      console.error("❌ Error registering customer:", err);
    }
  };

  return (
    <div className="client-form-container">
      <form onSubmit={handleSubmit} className="client-form">
        <h2>Customer Data</h2>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Last name</label>
          <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button type="submit">Register Customer</button>
        <div className="regresar">
  <button 
    type="button"
    onClick={() => navigate("/dashboard")}
    className="bg-gray-500 text-white w-full py-2 rounded mt-3 hover:bg-gray-600 transition"
  >
    Return
  </button>
</div>

      </form>
    </div>
  );
}