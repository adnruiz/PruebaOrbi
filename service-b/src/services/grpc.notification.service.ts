import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../models/notification.model';

export class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    static async sendNotification(call: any, callback: any) {
        try {
            const { userId, message } = call.request;
            const notificationRepo = new NotificationRepository();
            await notificationRepo.createNotification({ userId, message });
            
            callback(null, { success: true });
        } catch (error: any) {
            callback({
                // code: grpc.status.INTERNAL,
                code: 200,
                message: error.message
            });
        }
    }
}