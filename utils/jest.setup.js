/**
 * Make Jest Errors within beforeAll visible
 * @version nestjs-template-jest-setup@1.0
 * @see https://github.com/facebook/jest/issues/8688
 */
if (!global._beforeAll) {
  global._beforeAll = global.beforeAll;
  global.beforeAll = (...args) => {
    global._beforeAll(async (done) => {
      try {
        await args[0]();
      } catch (e) {
        // the test will not fail if before all fails, so we need to .exit
        //  but the console.log is captured
        //  so we need to push to stderr, wait for it to write-out and then quit

        // exit on beforeAll exception
        process.stderr.write(e.stack + '\n');
        process.exit(1);
      }
      done();
    }, args[1]);
  };
}
