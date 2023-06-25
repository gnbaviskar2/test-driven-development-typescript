import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

import apiRoutes from './routes';
import errorMiddleware from './middlewares/error.middleware';

if (process.env.NODE_ENV === 'test') {
  // if node env is test, over ride all process env for test
  const envConfig = dotenv.parse(
    fs.readFileSync(path.resolve(__dirname, '../.env.test'))
  );

  // over ride all process env for test
  _.map(envConfig, (value, key) => {
    process.env[key] = value;
  });
}

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
