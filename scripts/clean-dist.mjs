import glob from 'glob';
import { execSync } from 'child_process';

glob('packages/*/dist', (err, matches) => {
  if (err) {
    console.warn(err);

    return;
  }

  if (matches.length) {
    matches.forEach((dir) => {
      execSync(`rm -rf ${dir}`);
      console.log(`Successfully removed ${dir}`);
    });
  } else {
    console.log('Did not find any dist folder under packages');
  }
});
