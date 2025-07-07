# 🐾 Pet Host Front-end

This is the **front-end** of **Pet Host**, a pet hosting management system. Built with **React + TypeScript** using **Vite** for fast and modern development.

It communicates with a set of microservices through an **API Gateway** deployed on AWS.

---

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Pet_Host.git
   cd Pet_Host/Front-end


2. Instala dependencies:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` si necesitas variables de entorno (opcional).

## 🖥️ USAGE

Inicia el servidor de desarrollo:
```bash
npm run dev
```
Then open your browser at http://localhost:5173 (or as shown in your terminal).

🌐 API Gateway Connection

This front-end is configured to connect to the API Gateway deployed on AWS EC2:

```
http://44.212.219.15/
```

Main API Routes:
- **Users:** `/api/users/register`, `/api/users/login`, `/api/users/change-password`
- **Clients:** `/api/clients/`
- **Pets:** `/api/pets/`

Make sure the back-end is running and CORS settings are properly configured to allow communication.


## 🛠️ Tech Stack

Framework: React

Language: TypeScript

Build Tool: Vite

Routing: React Router DOM

State Management: React Context API

HTTP Client: Axios

Authentication: JWT-based

Styling: Tailwind CSS (optional)


## 📦 Estructura del proyecto

```
src/
  components/      # Componentes reutilizables
  context/         # Contextos de React (ej: Auth)
  pages/           # Páginas principales (Login, Registro, Dashboard, etc.)
  utils/           # Utilidades y helpers
  App.tsx          # Componente principal
  main.tsx         # Punto de entrada
```


## 📦 Features

🔐 Secure authentication with JWT

🧑‍💼 Role-based access control

🐶 Client and pet management UI

📊 Dashboard views

⚙️ Axios-based communication with back-end

🔁 Protected routes

🖼️ Clean and responsive design


## 📝 Notes

If you change the API Gateway IP or port, update the API_BASE_URL in src/utils/api.ts.

Ensure CORS is enabled on the back-end to avoid communication errors.

Run back-end services before using the front-end for full functionality.



