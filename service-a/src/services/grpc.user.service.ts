import { sendNotification } from './grpc.client';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    static async createUser(call: any, callback: any) {
        try {
        const { name, email, age } = call.request;
        const userRepo = new UserRepository();
        const user = await userRepo.createUser({ name, email, age });
        
        // Enviar notificación a Service B via gRPC
        await sendNotification({
            userId: user._id.toString(),
            message: `New user created: ${name}`
        });

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