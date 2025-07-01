# Pet Host Front-end

Este proyecto es el **front-end** de Pet Host, desarrollado en **React + TypeScript** usando **Vite**.

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Pet_Host.git
   cd Pet_Host/Front-end
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` si necesitas variables de entorno (opcional).

## 🖥️ Uso

Inicia el servidor de desarrollo:
```bash
npm run dev
```
Abre tu navegador en [http://localhost:5173](http://localhost:5173) (o la URL que indique la terminal).

## 🌐 Conexión con el API Gateway

El front-end está configurado para consumir el API Gateway desplegado en AWS EC2:

```
http://3.214.168.136:8000
```

Las rutas principales son:
- **Usuarios:** `/api/users/register`, `/api/users/login`, `/api/users/change-password`
- **Clientes:** `/api/clients/`
- **Mascotas:** `/api/pets/`

Asegúrate de que el backend esté corriendo y permita conexiones desde el front-end.

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

## 📝 Notas

- Si cambias la IP o el puerto del API Gateway, actualiza la constante `API_BASE_URL` en `src/utils/api.ts` (si la tienes).
- El proyecto utiliza rutas protegidas, autenticación JWT y manejo de roles.
- Si tienes problemas de CORS, revisa la configuración del backend.

