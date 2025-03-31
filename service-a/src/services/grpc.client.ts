import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../protos/notification.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification as any;

export async function sendNotification(data: { userId: string; message: string }): Promise<void> {
    const client = new notificationProto.NotificationService(
        'service-b:50052',
        grpc.credentials.createInsecure()
    );

    return new Promise((resolve, reject) => {
        client.sendNotification(
            { userId: data.userId, message: data.message },
            (err: grpc.ServiceError | null, response: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}