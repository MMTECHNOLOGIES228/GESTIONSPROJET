import  swaggerJSDoc  from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'manage projets service API',
      version: '1.0.0',
      description: 'API documentation for User Service',
    },
    servers: [
      {
        url: 'http://localhost:9001',
        description: 'Local server',
      },
      {
        url: 'http://195.26.241.68:5001',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Chemins des fichiers contenant des annotations Swagger
};

export default swaggerOptions;
