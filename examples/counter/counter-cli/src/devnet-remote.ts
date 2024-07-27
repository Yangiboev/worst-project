import { createLogger } from './logger-utils.js';
import { run } from './cli.js';
import { DevnetRemoteConfig } from './config.js';

const config = new DevnetRemoteConfig();
const logger = await createLogger(config.logDir);
await run(config, logger);
