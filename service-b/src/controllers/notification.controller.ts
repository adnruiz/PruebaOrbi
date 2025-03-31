import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    async sendNotification(req: Request, res: Response) {
        try {
            const { userId, message } = req.body;
            await this.notificationService.sendNotification(userId, message);
            res.status(200).json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getNotifications(req: Request, res: Response) {
        try {
            const notifications = await this.notificationService.getNotificationsByUserId(req.params.userId);
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}