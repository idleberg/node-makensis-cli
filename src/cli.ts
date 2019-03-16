#!/usr/bin/env node

import * as program from 'commander';

// Action
program
  .version(require('../package.json').version)
  .description('CLI version of node-makensis')
  .command('hdrinfo', 'Print compilation flags').alias('flags')
  .command('compile <script>', 'Import repository', {isDefault: true})
  .command('version [options]', 'Import repository')
  .command('cmdhelp [options]', 'Import repository').alias('help')
  .command('license [options]', 'Import repository')
  .command('nsisdir', 'Import repository').alias('dir')
  .command('scaffold', 'Import repository').alias('new')
  .parse(process.argv);
