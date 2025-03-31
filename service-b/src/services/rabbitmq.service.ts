/*import * as amqp from 'amqplib/callback_api';
import { NotificationService } from './notification.service';
import { NotificationRepository } from '../repositories/notification.repository';

let channel: amqp.Channel;
const notificationService = new NotificationService(new NotificationRepository());

export async function connectRabbitMQ() {
    return new Promise<void>((resolve, reject) => {
        const retryInterval = 5000; // 5 seconds
        const maxRetries = 5;
        let retryCount = 0;

        const connect = () => {
            amqp.connect('amqp://guest:guest@rabbitmq:5672', (error: any, connection: any) => {
                if (error) {
                    console.error(`RabbitMQ connection attempt ${retryCount + 1}/${maxRetries} failed:`, error.message);
                    retryCount++;
                    
                    if (retryCount < maxRetries) {
                        setTimeout(connect, retryInterval);
                    } else {
                        reject(new Error(`Failed to connect to RabbitMQ after ${maxRetries} attempts`));
                    }
                    return;
                }

                console.log('Successfully connected to RabbitMQ');
                
                connection.on('error', (err: any) => {
                    console.error('RabbitMQ connection error:', err);
                });

                connection.on('close', () => {
                    console.log('RabbitMQ connection closed. Attempting to reconnect...');
                    setTimeout(connect, retryInterval);
                });

                connection.createChannel((err: any, ch: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    channel = ch;
                    console.log('RabbitMQ channel created');

                    channel.assertExchange('user_updates', 'fanout', { durable: false }, (err: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        console.log('Exchange "user_updates" asserted');

                        channel.assertQueue('', { exclusive: true }, (err: any, q: any) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            channel.bindQueue(q.queue, 'user_updates', '');
                            console.log(`Queue ${q.queue} bound to exchange`);

                            channel.consume(q.queue, (msg: amqp.Message | null) => {
                                if (msg) {
                                    console.log('DEBUG - Received RabbitMQ message:', msg.content.toString());
                                    try {
                                        const userData = JSON.parse(msg.content.toString());
                                        console.log('Received user update:', userData);
                                        notificationService.logUserUpdate(userData);
                                    } catch (parseError) {
                                        console.error('Error parsing message:', parseError);
                                    }
                                }
                            }, { noAck: true });

                            resolve();
                        });
                    });
                });
            });
        };

        connect();
    });
}
*/
import * as amqp from 'amqplib/callback_api';
import { NotificationService } from './notification.service';
import { NotificationRepository } from '../repositories/notification.repository';

let channel: amqp.Channel;
const notificationService = new NotificationService(new NotificationRepository());

export async function connectRabbitMQ() {
    return new Promise<void>((resolve, reject) => {
        amqp.connect('amqp://guest:guest@rabbitmq:5672', (error, connection) => {
            if (error) {
                console.error('RabbitMQ connection error:', error);
                reject(error);
                return;
            }

            connection.createChannel((err, ch) => {
                if (err) {
                    console.error('Channel creation error:', err);
                    reject(err);
                    return;
                }

                channel = ch;
                console.log('RabbitMQ channel created');

                // Assert exchange (same as Service-A)
                channel.assertExchange('user_updates', 'fanout', { durable: false }, (err) => {
                    if (err) {
                        console.error('Exchange assertion error:', err);
                        reject(err);
                        return;
                    }

                    // Create a non-exclusive queue
                    channel.assertQueue('user_updates_queue', { durable: false }, (err, q) => {
                        if (err) {
                            console.error('Queue assertion error:', err);
                            reject(err);
                            return;
                        }

                        console.log(`Queue ${q.queue} bound to exchange`);
                        channel.bindQueue(q.queue, 'user_updates', '');

                        // Start consuming
                        channel.consume(q.queue, (msg) => {
                            if (msg) {
                                console.log('Received raw message:', msg.content.toString());
                                try {
                                    const userData = JSON.parse(msg.content.toString());
                                    console.log('Processing update:', userData);
                                    notificationService.logUserUpdate(userData);
                                } catch (err) {
                                    console.error('Message processing error:', err);
                                }
                            }
                        }, { noAck: true });

                        resolve();
                    });
                });
            });
        });
    });
}