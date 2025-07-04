import { useState, useEffect } from "react";
import axios from "axios";

const CreateReservationPage = () => {
  const [clients, setClients] = useState<any[]>([]);  // Asegúrate que clients sea un array
  const [pets, setPets] = useState<any[]>([]);  // Asegúrate que pets sea un array
  const [services, setServices] = useState<any[]>([]);  // Asegúrate que services sea un array
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar los clientes
  useEffect(() => {
    axios.get("/api/clients")
      .then(response => {
        if (Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          setClients([]);
          setErrorMsg("❌ Error al cargar los clientes.");
        }
      })
      .catch(error => {
        console.error("❌ Error al cargar los clientes:", error);
        setErrorMsg("❌ No se pudieron cargar los clientes.");
      });
  }, []);

  // Cargar las mascotas cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClient) {
      axios.get(`/api/pets?client_id=${selectedClient}`)
        .then(response => {
          if (Array.isArray(response.data)) {
            setPets(response.data);
          } else {
            setPets([]);
            setErrorMsg("❌ Error al cargar las mascotas.");
          }
        })
        .catch(error => {
          console.error("❌ Error al cargar las mascotas:", error);
          setErrorMsg("❌ No se pudieron cargar las mascotas.");
        });
    }
  }, [selectedClient]);

  // Cargar los servicios
  useEffect(() => {
    axios.get("/api/services")
      .then(response => {
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          setServices([]);
          setErrorMsg("❌ Error al cargar los servicios.");
        }
      })
      .catch(error => {
        console.error("❌ Error al cargar los servicios:", error);
        setErrorMsg("❌ No se pudieron cargar los servicios.");
      });
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservationData = {
      clientId: selectedClient,
      petId: selectedPet,
      serviceId: selectedService,
      checkIn,
      checkOut,
    };

    console.log("📤 Datos de la reserva:", reservationData);

    axios.post("/api/reservations", reservationData)
      .then(response => {
        console.log("Reserva creada:", response.data);
        alert("Reserva realizada con éxito.");
      })
      .catch(error => {
        console.error("❌ Error al crear la reserva:", error);
        setErrorMsg("❌ Error al crear la reserva.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Crear Reserva</h1>

      {errorMsg && <p className="text-red-400 mb-3">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1 text-sm">Cliente</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
          >
            <option value="">Selecciona un Cliente</option>
            {clients.map((client: any) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.last_name} ({client.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Mascota</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            required
            className="w-full px-3 py-2 text-black rounded"
            disabled={!selectedClient}
          >
            <option value="">Selecciona una Mascota</option>
            {pets.map((pet: any) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        <div>
