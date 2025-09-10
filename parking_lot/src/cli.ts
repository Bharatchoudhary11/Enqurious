#!/usr/bin/env node
import fs from 'node:fs';
import readline from 'node:readline';
import { App } from './app.js';

const app = new App();

async function run() {
  const [, , inputFile] = process.argv;
  if (inputFile) {
    // File mode
    const content = fs.readFileSync(inputFile, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const out = app.handle(line);
      if (out === '__EXIT__') break;
      if (out != null && out !== '') console.log(out);
    }
    return;
  }

  // Interactive mode
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  rl.on('line', (line) => {
    const out = app.handle(line);
    if (out === '__EXIT__') {
      rl.close();
      return;
    }
    if (out != null && out !== '') console.log(out);
  });
}

run().catch((e) => {
  console.error(e?.message ?? String(e));
  process.exit(1);
});

