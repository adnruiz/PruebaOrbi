import { NotificationService } from '../services/notification.service';
import { NotificationRepository } from '../repositories/notification.repository';
import mongoose from 'mongoose';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let notificationRepository: NotificationRepository;
    let axiosMock: MockAdapter;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test-notification-service');
        axiosMock = new MockAdapter(axios);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        axiosMock.restore();
    });

    beforeEach(() => {
        notificationRepository = new NotificationRepository();
        notificationService = new NotificationService(notificationRepository);
    });

    describe('sendNotification', () => {
        it('should send a notification and log it', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const message = 'Test message';
        
        // Mock the HTTP call to Service A
        axiosMock.onGet(`http://service-a:3000/users/${userId}`).reply(200, {
            _id: userId,
            name: 'Test User',
            email: 'test@example.com',
            age: 30
        });

        await notificationService.sendNotification(userId, message);
        
        // Verify the notification was logged
        const notifications = await notificationRepository.getNotificationsByUserId(userId);
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toContain(message);
        });
    });
});