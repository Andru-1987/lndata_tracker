FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Instalar Node.js para el servidor de autenticación
RUN apk add --no-cache nodejs npm

# Copiar build de React
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para el servidor de auth
WORKDIR /app

# Copiar servidor de autenticación
COPY server/ ./server/
COPY package*.json ./

# Instalar solo dependencias del servidor
RUN npm ci --only=production

# Exponer puertos
EXPOSE 80 3001

# Script de inicio
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]