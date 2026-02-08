import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Kanban',
      version: '1.0.0',
      description: 'Documentação da API do sistema Kanban',
      contact: {
        name: 'Suporte',
        email: 'suporte@kanban.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title', 'status'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID da tarefa',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              description: 'Título da tarefa',
              example: 'Implementar autenticação'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada',
              example: 'Implementar JWT para autenticação'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'done'],
              description: 'Status da tarefa',
              example: 'todo'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Prioridade da tarefa',
              example: 'medium'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        }
      }
    }
  },
  // IMPORTANTE: Use o caminho correto baseado em onde o arquivo compilado fica
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js')
  ]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);