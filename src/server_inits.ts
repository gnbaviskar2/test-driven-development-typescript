import express, { Application } from 'express';

import apiRoutes from './routes';
import errorMiddleware from './middlewares/error.middleware';

const middlewareMethods = {
  initJsonBodyParser: (testApp: Application) => testApp.use(express.json()),

  initApiRoutes: (testApp: Application) => {
    testApp.use('/api', apiRoutes);
  },

  initErrorFormatMiddleware: (testApp: Application) => {
    testApp.use(errorMiddleware);
  },
};

const serverInit = (): Application => {
  const testApp = express();

  // body parser middleware initialization
  middlewareMethods.initJsonBodyParser(testApp);

  // init app routes
  middlewareMethods.initApiRoutes(testApp);

  // init error middleware
  middlewareMethods.initErrorFormatMiddleware(testApp);

  return testApp;
};

export default serverInit;
