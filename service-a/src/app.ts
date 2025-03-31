import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { startGrpcServer } from './config/grpc.server';
import { connectRabbitMQ } from './services/rabbitmq.service';
import { body } from 'express-validator';
import { createSwaggerSpec2 } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Swagger documentation
const swaggerSpec = createSwaggerSpec2();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database connection
mongoose.connect('mongodb://mongo:27017/user-service')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
app.post('/users', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer')
    ],
    (req: Request, res: Response, next: NextFunction) => {
        userController.createUser(req, res).catch(next);
    }
);
    
app.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    userController.getUser(req, res).catch(next);
});

app.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    userController.updateUser(req, res).catch(next);
});

// Start gRPC server
startGrpcServer();

// Connect to RabbitMQ
connectRabbitMQ().then(() => {
    console.log('Connected to RabbitMQ');
}).catch(err => {
    console.error('RabbitMQ connection error:', err);
});

// Start HTTP server
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});