import { NotificationRepository } from '../repositories/notification.repository';
import { INotification } from '../models/notification.model';
import axios from 'axios';

export class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    async sendNotification(userId: string, message: string): Promise<void> {
        // Primero obtener información del usuario desde Service A
        try {
            const response = await axios.get(`http://service-a:3000/users/${userId}`);
            const user = response.data;
            
            const fullMessage = `Notification for ${user.name} (${user.email}): ${message}`;
            
            await this.notificationRepository.createNotification({
                userId,
                message: fullMessage
            });
        } catch (error: any) {
            console.error('Error sending notification:', error.message);
            throw error;
        }
    }

    async logUserUpdate(userData: any): Promise<void> {
        console.log('Attempting to log update for:', userData.email);
        try {
            const message = `User updated: ${userData.name} (${userData.email})`;
            await this.notificationRepository.createNotification({
                userId: userData.userId,
                message
            });
            console.log('Notification successfully created');
        } catch (error) {
            console.error('Failed to create notification:', error);
            throw error;
        }
    }
    
    async getNotificationsByUserId(userId: string): Promise<INotification[]> {
        return this.notificationRepository.getNotificationsByUserId(userId);
    }
}