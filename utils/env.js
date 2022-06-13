const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

/**
 * Load from .env.${STAGE||local} or .env
 */
function parseDotEnv(root = path.join(__dirname, '..')) {
  const configPath = findDotEnv(root);
  if (configPath) {
    // eslint-disable-next-line no-console
    const env = dotenv.parse(fs.readFileSync(configPath));
    env.ENV_FILE_PATH = configPath;
    return env;
  }
  return {};
}

function findDotEnv(root = path.join(__dirname, '..', '..')) {
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

module.exports = {
  findDotEnv,
  parseDotEnv,
};
