import { Application } from 'express';
import { createServer, Server } from 'http';

import logger from './core/logger';
import { serverConfigs } from './core/configs';

const { PORT, HOSTNAME } = serverConfigs;

const serverMethods = {
  initListenServer: (application: Application): void => {
    const httpServer: Server = createServer(application);
    httpServer.listen(PORT, HOSTNAME);
    httpServer.on('listening', () => {
      logger.info(`test app IS RUNNING ON PORT : ${PORT}`);
      logger.info(`Worker ${process.pid} started`);
    });
    httpServer.on('error', (e) => {
      logger.error(`COULD NOT START THE SERVER : ${e}`);
      process.exit(0);
    });
    httpServer.on('close', () => {
      logger.info('CLOSING THE SERVER ');
    });
  },
};

const listenServer = (application: Application): void => {
  serverMethods.initListenServer(application);
};
export default listenServer;
