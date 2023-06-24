export default {
  environment: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 8001,
  HOSTNAME: process.env.HOSTNAME ? process.env.HOSTNAME : '127.0.0.1',
  LOG_DIR: process.env.LOG_DIR ? process.env.LOG_DIR : '/tmp/testAppLogs',
};
