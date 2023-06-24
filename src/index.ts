import { Application } from 'express';

import serverInits from './server_inits';
import listenServer from './server';

const launchMethods = {
  begin: () => {
    const application: Application = serverInits();
    listenServer(application);
  },
};

launchMethods.begin();
