import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    message: string;
    timestamp: Date;
}

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);