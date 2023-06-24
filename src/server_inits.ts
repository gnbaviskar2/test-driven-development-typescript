import express, { Application } from 'express';

const middlewareMethods = {
  initJsonBodyParser: (testApp: Application) => testApp.use(express.json()),
};

const serverInit = (): Application => {
  const testApp = express();

  // body parser middleware initialization
  middlewareMethods.initJsonBodyParser(testApp);

  return testApp;
};

export default serverInit;
