import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import indexRoutes from './routes/indexRoute.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: '0.0.0.0', // Changed from 'localhost'
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => 'Hello, world!',
  });

  server.route(indexRoutes);

  
  await sequelize.sync();
  console.log('Database connected!');

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
