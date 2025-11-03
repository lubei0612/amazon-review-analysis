// 主入口文件
import { initApp } from './app.js';
import { loadConfig } from './config.js';
import { setupDatabase } from './database.js';

async function main() {
  const config = await loadConfig();
  await setupDatabase(config);
  initApp();
}

main().catch(console.error);


