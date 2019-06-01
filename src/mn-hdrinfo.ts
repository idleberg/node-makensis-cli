#!/usr/bin/env node

import * as program from 'commander';
import { hdrinfo } from './commands';

// Action
program
  .usage('[options]')
  .option('-j, --json', 'prints output as JSON')
  .option('-w, --wine', 'use Wine to run makenis')
  .parse(process.argv);

const options = {
  'json': (typeof program.json === 'undefined') ? false : true,
  'wine': (typeof program.wine === 'undefined') ? false : true
};

hdrinfo(options);