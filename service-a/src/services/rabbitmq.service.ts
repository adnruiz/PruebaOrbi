import * as amqp from 'amqplib/callback_api';
import { IUser } from '../models/user.model';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
    return new Promise<void>((resolve, reject) => {
        amqp.connect('amqp://rabbitmq', (error, connection) => {
        if (error) {
            reject(error);
            return;
        }

        connection.createChannel((err, ch) => {
            if (err) {
            reject(err);
            return;
            }

            channel = ch;
            channel.assertExchange('user_updates', 'fanout', { durable: false });
            resolve();
        });
        });
    });
}

export async function publishUserUpdated(user: IUser) {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }

    channel.publish(
        'user_updates',
        '',
        Buffer.from(JSON.stringify({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        age: user.age,
        updatedAt: user.updatedAt
        }))
    );
}