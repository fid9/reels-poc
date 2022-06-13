/**
 * Bake release and buildTime post build
 * @version povio-nestjs-version@1.0
 */

/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');

const [, , filePath] = process.argv;
const dir = path.join(__dirname, '..');

if (!filePath) {
  console.error('Missing file parameter');
  process.exit(1);
}

const fileAbsPath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(fileAbsPath)) {
  console.error(`File does not exist: ${fileAbsPath}`);
  process.exit(1);
}

(async function () {
  let release = process.env.RELEASE;
  if (!release) {
    try {
      if (fs.existsSync('.git')) {
        const git = require('isomorphic-git');
        const ref = await git.resolveRef({fs, dir, ref: 'HEAD'});
        const statusMatrix = (await git.statusMatrix({fs, dir, ref})).filter(
          (row) => row[2] !== row[3],
        );
        if (statusMatrix.length > 0) {
          release = `${ref}-modified`;
          console.log(
            `WARNING: Uncommitted changes, setting release to ${release}`,
          );
        } else {
          release = ref;
        }
      } else {
        // no git and no env
        release = 'unknown';
      }
    } catch (e) {
      console.log(
        `WARNING: Could not fetch version from .git - ${e.toString()}`,
      );
      release = 'unknown';
    }
  }

  console.info(`Baking release ${release} into ${filePath}`);

  let fileContents = fs.readFileSync(fileAbsPath, 'utf-8');

  fileContents = fileContents.replace(/<<GIT_RELEASE>>/g, release);
  fileContents = fileContents.replace(
    /<<BUILD_TIME>>/g,
    new Date().toISOString(),
  );

  fs.writeFileSync(fileAbsPath, fileContents);

  // remove the old map since the offsets will be wrong
  if (fs.existsSync(`${fileAbsPath}.map`)) {
    fs.unlinkSync(`${fileAbsPath}.map`);
  }
})();
