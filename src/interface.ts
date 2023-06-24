import { Application } from 'express';
import { Server } from 'http';

export interface expressHttpObjType {
  testApp: Application;
  httpServer: Server;
}
