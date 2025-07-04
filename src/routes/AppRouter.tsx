import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import CreateClientPage from "../pages/CreateClientPage";
import CreatePetPage from "../pages/CreatePetPage"; // Asegúrate que exista
import ClientListPage from "../pages/ClientListPage";
import PetListPage from "../pages/PetListPage";
import EditPetPage from "../pages/EditPetPage";
import EditClientPage from "../pages/EditClientPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";





export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-client" element={<CreateClientPage />} />
        <Route path="/create-pet" element={<CreatePetPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/pets" element={<PetListPage />} />
        <Route path="/edit-pet/:id" element={<EditPetPage />} />
        <Route path="/edit-client/:id" element={<EditClientPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        
        {/* Ruta protegida para el dashboard */}


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
