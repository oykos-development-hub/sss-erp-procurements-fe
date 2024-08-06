import { exec } from 'child_process';

const env = { ...process.env };

var ClientLibraryCommand;

// Suppose RAT is Project (Repository) Access Token
if (env.GITLAB_RAT?.replace('=', '').trim()) {
  ClientLibraryCommand = `npm install git+https://oauth2:${env.GITLAB_RAT?.replace(
    '=',
    '',
  ).trim()}@${env.GITLAB_CLIENT_LIBRARY?.replace('=', '').trim()} --no-save`;
} else {
  ClientLibraryCommand = `npm install git+https://${env.GITLAB_USER?.replace(
    '=',
    '',
  ).trim()}:${env.GITLAB_PAT?.replace(
    '=',
    '',
  ).trim()}@${env.GITLAB_CLIENT_LIBRARY?.replace('=', '').trim()} --no-save`;
}
console.log(
  `\nNPM install Client Library initialized...\nCommand run - `,
  ClientLibraryCommand,
);

exec(ClientLibraryCommand, (err) => {
  if (err) {
    console.error(`NPM install Client Library error: ${err}`);
    return;
  }
  console.log(`\nNPM install Client Library completed!\n`);

  exec('node ./copy-public.cjs', (err) => {
    if (err) {
      console.error(`Copying /public assets from Client Library error: ${err}`);
      return;
    }
    console.log(`\nCopying /public assets from Client Library completed!\n`);
  });
});

