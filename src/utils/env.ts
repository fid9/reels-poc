import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load from .env.${STAGE||local} or .env
 */
export function parseDotEnv(
  root = path.join(__dirname, '..', '..'),
): Record<string, string> {
  const configPath = findDotEnv(root);
  if (configPath) {
    // eslint-disable-next-line no-console
    return dotenv.parse(fs.readFileSync(configPath));
  }
  return {};
}

export function findDotEnv(
  root = path.join(__dirname, '..', '..'),
): string | undefined {
  let configPath = path.join(root, `.env.${process.env.STAGE || 'local'}`);
  if (!fs.existsSync(configPath)) {
    configPath = path.join(root, '.env');
  }
  if (fs.existsSync(configPath)) {
    // eslint-disable-next-line no-console
    return configPath;
  }
  return undefined;
}
