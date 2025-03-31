import { Notification, INotification } from '../models/notification.model';

export class NotificationRepository {
    async createNotification(notificationData: { userId: string; message: string }): Promise<INotification> {
        const notification = new Notification(notificationData);
        return await notification.save();
    }

    async getNotificationsByUserId(userId: string): Promise<INotification[]> {
        return await Notification.find({ userId }).sort({ timestamp: -1 }).exec();
    }
}