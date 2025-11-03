// 应用初始化
import { setupRoutes } from './routes.js';
import { initMiddleware } from './middleware.js';
import { logger } from './utils/logger.js';

export function initApp() {
  logger.info('Initializing application...');
  initMiddleware();
  setupRoutes();
  logger.info('Application started successfully');
}


