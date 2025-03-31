import { sendNotification } from './grpc.client';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import * as grpc from '@grpc/grpc-js';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    static async createUser(call: any, callback: any) {
        try {
            const { name, email, age } = call.request;
            const userRepo = new UserRepository();
            const user = await userRepo.createUser({ name, email, age });
            
            // Enviar notificación a Service B via gRPC
            console.log('Attempting to send gRPC notification for user:', user.name);
            await sendNotification({
                userId: user._id.toString(),
                message: `New user created: ${name}`
            });
            console.log('gRPC notification sent successfully');

            callback(null, {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                age: user.age
            });
        } catch (error: any) {
            callback({
                code: grpc.status.INTERNAL,
                message: error.message
            });
        }
    }
}