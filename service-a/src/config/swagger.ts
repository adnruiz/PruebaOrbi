import { Express } from 'express';

export const swaggerSpec = createSwaggerSpec2();

export function createSwaggerSpec2() {
    return {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API for managing users'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        paths: {
            '/users': {
                post: {
                    summary: 'Create a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'User created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input data'
                        },
                        500: {
                            description: 'Internal server error'
                        }
                    }
                }
            },
            '/users/{id}': {
                get: {
                    summary: 'Get a user by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User details',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found'
                        },
                        500: {
                            description: 'Internal server error'
                        }
                    }
                },
                put: {
                    summary: 'Update a user',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'User updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input data'
                        },
                        404: {
                            description: 'User not found'
                        },
                        500: {
                            description: 'Internal server error'
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Full name of the user'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com',
                            description: 'Email address of the user'
                        },
                        age: {
                            type: 'integer',
                            example: 30,
                            description: 'Age of the user',
                            minimum: 1
                        }
                    },
                    required: ['name', 'email', 'age']
                }
            }
        }
    };
}