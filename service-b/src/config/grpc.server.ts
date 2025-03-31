import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { NotificationService as NotificationServiceHandler } from '../services/grpc.notification.service';

const PROTO_PATH = path.join(__dirname, '../../protos/notification.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification as any;

export function startGrpcServer() {
    const server = new grpc.Server();
    
    server.addService(notificationProto.NotificationService.service, {
        sendNotification: NotificationServiceHandler.sendNotification
    });

    server.bindAsync(
        '0.0.0.0:50052',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error('Failed to start gRPC server:', err);
                return;
            }
            console.log(`gRPC server running on port ${port}`);
            server.start();
        }
    );
}