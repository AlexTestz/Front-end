# Etapa de construcción
FROM node:18 AS build
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias y compilar
COPY package*.json tsconfig*.json vite.config.ts ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación con Vite
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copia el contenido generado por Vite a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para servir la app
EXPOSE 80

# Comando de inicio de Nginx
CMD ["nginx", "-g", "daemon off;"]
