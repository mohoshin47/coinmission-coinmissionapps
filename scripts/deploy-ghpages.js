import { execSync } from 'child_process';

function run(cmd, options = {}) {
  console.log(`> ${cmd}`);
  const finalOptions = {
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_SSH_COMMAND: 'ssh -o StrictHostKeyChecking=accept-new',
    },
    ...options,
  };
  execSync(cmd, finalOptions);
}

try {
  // ensure we have a clean state
  run('git fetch --all');
  const current = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log('Current branch:', current);

  // create orphan branch for deploy
  run('git checkout --orphan gh-pages-temp');

  // add dist contents as the working tree and commit
  run('git --work-tree dist add --all');
  run('git --work-tree dist commit -m "gh-pages deploy"');

  // push to gh-pages branch
  run('git push origin HEAD:gh-pages --force');

  // switch back and cleanup
  run('git checkout -f ' + current);
  run('git branch -D gh-pages-temp');

  console.log('Manual deploy complete.');
} catch (err) {
  console.error('Manual deploy failed:', err.message);
  process.exit(1);
}
