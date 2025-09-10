#!/usr/bin/env node
import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';
import { App } from './app.js';

function runLine(app: App, line: string) {
  const out = app.handle(line);
  if (out && out !== '__EXIT__') console.log(out);
  return out;
}

async function runFile(filePath: string) {
  const app = new App();
  const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });
  for await (const line of rl) {
    const out = runLine(app, line);
    if (out === '__EXIT__') break;
  }
}

async function runInteractive() {
  const app = new App();
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: '' });
  rl.on('line', (line) => {
    const out = runLine(app, line);
    if (out === '__EXIT__') rl.close();
  });
}

async function main() {
  const [, , maybeFile] = process.argv;
  if (maybeFile) {
    await runFile(maybeFile);
  } else {
    await runInteractive();
  }
}

main();
