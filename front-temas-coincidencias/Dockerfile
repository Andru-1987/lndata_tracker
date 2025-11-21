# ==================================================
# ETAPA 1: Build (Generamos la carpeta dist)
# ==================================================
FROM node:25-alpine AS builder

WORKDIR /app

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies como 'vite' y 'terser')
# Usamos 'npm ci' que es más rápido y seguro para entornos de build
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el build (esto usará tu vite.config.js y terser)
RUN npm run build

# ==================================================
# ETAPA 2: Producción (Servimos con Nginx)
# ==================================================
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Limpiamos la carpeta por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos SOLO la carpeta dist generada en la Etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]