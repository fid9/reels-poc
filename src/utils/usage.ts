import * as os from 'os';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usage() {
  return {
    freemem: os.freemem(),
    totalmem: os.totalmem(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };
}
