import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import mongoose from 'mongoose';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test-user-service');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(() => {
        userRepository = new UserRepository();
        userService = new UserService(userRepository);
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
        const userData = { name: 'Test User', email: 'test@example.com', age: 30 };
        const user = await userService.createUser(userData);
        
        expect(user).toHaveProperty('_id');
        expect(user.name).toBe(userData.name);
        expect(user.email).toBe(userData.email);
        expect(user.age).toBe(userData.age);
        });
    });
    /*
    describe('getUserById', () => {
        it('should return a user by id', async () => {
        const userData = { name: 'Test User', email: 'test@example.com', age: 30 };
        const createdUser = await userService.createUser(userData);
        const foundUser = await userService.getUserById(createdUser._id.toString());
        
        expect(foundUser).not.toBeNull();
        expect(foundUser?._id.toString()).toBe(createdUser._id.toString());
        });

        it('should return null for non-existent user', async () => {
        const foundUser = await userService.getUserById(new mongoose.Types.ObjectId().toString());
        expect(foundUser).toBeNull();
        });
    });
    */
});