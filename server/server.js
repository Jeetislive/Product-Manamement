import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import indexRoutes from './routes/indexRoute.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: 'localhost',
    routes: {
      cors: true,
    },
  });

  server.route(indexRoutes);

  await sequelize.sync();
  console.log('Database connected!');

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
