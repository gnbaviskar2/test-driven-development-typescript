import express, { Application } from 'express';

import apiRoutes from './routes';

const middlewareMethods = {
  initJsonBodyParser: (testApp: Application) => testApp.use(express.json()),

  initApiRoutes: (testApp: Application) => {
    testApp.use('/api', apiRoutes);
  },
};

const serverInit = (): Application => {
  const testApp = express();

  // body parser middleware initialization
  middlewareMethods.initJsonBodyParser(testApp);

  // init app routes
  middlewareMethods.initApiRoutes(testApp);

  return testApp;
};

export default serverInit;
