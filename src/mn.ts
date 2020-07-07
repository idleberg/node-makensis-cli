#!/usr/bin/env node

import * as pkg from '../package.json';
import * as program from 'commander';
import * as updateNotifier from 'update-notifier';

// Action
updateNotifier({pkg}).notify();

program
  .version(pkg['version'])
  .usage('[sub-command] [script] [options]')
  .description('CLI version of node-makensis')
  .command('hdrinfo', 'Print compilation flags').alias('flags')
  .command('compile [script]', 'Compiles script(s)', { isDefault: true })
  .command('version [options]', 'Import repository')
  .command('cmdhelp [command] [options]', 'Prints out help for single or all commands').alias('help')
  .command('license [options]', 'Prints license')
  .command('nsisdir', 'Prints NSIS installation folder').alias('dir')
  .command('scaffold', 'Creates custom made NSIS script').alias('new')
  .parse(process.argv);


