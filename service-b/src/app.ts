import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationRepository } from './repositories/notification.repository';
import { startGrpcServer } from './config/grpc.server';
import { connectRabbitMQ } from './services/rabbitmq.service';
import { createSwaggerSpec } from './config/swagger';

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://mongo:27017/notification-service')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize services
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

// Routes
app.post('/notifications', notificationController.sendNotification.bind(notificationController));
app.get('/notifications/:userId', notificationController.getNotifications.bind(notificationController));

// Swagger documentation
const swaggerSpec = createSwaggerSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start gRPC server
startGrpcServer();

// Connect to RabbitMQ
connectRabbitMQ()
    .then(() => console.log('RabbitMQ connection established'))
    .catch(err => console.error('Failed to connect to RabbitMQ:', err));
setInterval(() => {}, 1000);
// Start HTTP server
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});