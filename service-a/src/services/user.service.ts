import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { publishUserUpdated } from './rabbitmq.service';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(userData: { name: string; email: string; age: number }): Promise<IUser> {
        return this.userRepository.createUser(userData);
    }

    async getUserById(id: string): Promise<IUser | null> {
        return this.userRepository.getUserById(id);
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await this.userRepository.updateUser(id, userData);
        if (updatedUser) {
        await publishUserUpdated(updatedUser);
        }
        return updatedUser;
    }
}