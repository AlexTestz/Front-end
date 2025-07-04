import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateReservationPage = () => {
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Cargar los clientes
  useEffect(() => {
    axios.get('/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error("Error fetching clients:", error));
  }, []);

  // Cargar las mascotas del cliente seleccionado
  useEffect(() => {
    if (selectedClient) {
      axios.get(`/api/pets?client_id=${selectedClient}`)
        .then(response => setPets(response.data))
        .catch(error => console.error("Error fetching pets:", error));
    }
  }, [selectedClient]);

  // Cargar los servicios
  useEffect(() => {
    axios.get('/api/services')
      .then(response => setServices(response.data))
      .catch(error => console.error("Error fetching services:", error));
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      clientId: selectedClient,
      petId: selectedPet,
      serviceId: selectedService,
      checkIn: checkIn,
      checkOut: checkOut
    };

    axios.post('/api/reservations', reservationData)
      .then(response => {
        console.log("Reservation Created:", response.data);
        alert("Reserva realizada con éxito");
      })
      .catch(error => console.error("Error creating reservation:", error));
  };

  return (
    <div>
      <h1>Formulario de Reserva</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente</label>
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            <option value="">Selecciona un Cliente</option>
            {clients.map(client => (
              <option key={client.clientId} value={client.clientId}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Mascota</label>
          <select value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)} disabled={!selectedClient}>
            <option value="">Selecciona una Mascota</option>
            {pets.map(pet => (
              <option key={pet.petId} value={pet.petId}>{pet.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Servicio</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Selecciona un Servicio</option>
            {services.map(service => (
              <option key={service.serviceId} value={service.serviceId}>{service.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Check-in</label>
          <input type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </div>

        <div>
          <label>Check-out</label>
          <input type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </div>

        <button type="submit">Registrar Reserva</button>
      </form>
    </div>
  );
};

export default CreateReservationPage;
