import { Express } from 'express';

export function createSwaggerSpec() {
    return {
        openapi: '3.0.0',
        info: {
            title: 'Notification Service API',
            version: '1.0.0',
            description: 'API for managing notifications'
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Local server'
            }
        ],
        paths: {
            '/notifications': {
                post: {
                    summary: 'Send a notification',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        userId: {
                                            type: 'string',
                                            description: 'ID of the user to notify'
                                        },
                                        message: {
                                            type: 'string',
                                            description: 'Notification message'
                                        }
                                    },
                                    required: ['userId', 'message']
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Notification sent successfully'
                        },
                        500: {
                            description: 'Internal server error'
                        }
                    }
                }
            },
            '/notifications/{userId}': {
                get: {
                    summary: 'Get notifications for a user',
                    parameters: [
                        {
                            name: 'userId',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of notifications'
                        },
                        500: {
                            description: 'Internal server error'
                        }
                    }
                }
            }
        }
    };
}