# PruebaOrbi
Prueba tecnica BackEnd MID - Diseño e implementación de 2 microservicios que se comuniquen entre sí utilizando: gRPC, HTTP (REST API), RabbitMQ

## Servicios

### Service A (User Service)
- Gestión de usuarios (creación, consulta, actualización)
- Puerto: 50051 (gRPC), 3000 (HTTP)

### Service B (Notification Service)
- Envío de notificaciones y registro de logs
- Puerto: 50052 (gRPC), 3001 (HTTP)
- http://localhost:3001/api-docs/

## Requisitos
- Docker
- Docker Compose

## Instalación
```bash
git clone https://github.com/adnruiz/PruebaOrbi.git
cd service-a
npm i
cd service-b
npm i
cd PruebaOrbi
docker-compose up --build