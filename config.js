// 配置管理
import { logger } from './utils/logger.js';

export async function loadConfig() {
  logger.info('Loading configuration...');
  return {
    database: {
      host: 'localhost',
      port: 3306
    },
    server: {
      port: 8080
    }
  };
}


