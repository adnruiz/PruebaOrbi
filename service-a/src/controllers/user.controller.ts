import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        console.log('DEBUG - Update request received');
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}