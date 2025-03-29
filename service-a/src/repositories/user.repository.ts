import { User, IUser } from '../models/user.model';

export class UserRepository {
    async createUser(userData: { name: string; email: string; age: number }): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    async getUserById(id: string): Promise<IUser | null> {
        return await User.findById(id).exec();
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        userData.updatedAt = new Date();
        return await User.findByIdAndUpdate(id, userData, { new: true }).exec();
    }
}