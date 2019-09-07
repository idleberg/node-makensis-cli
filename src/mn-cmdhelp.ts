#!/usr/bin/env node

import * as program from 'commander';
import { cmdhelp } from './commands';

// Action
program
  .usage('[command] [options]')
  .option('-j, --json', 'prints output as JSON')
  .option('-w, --wine', 'use Wine to run makensis')
  .parse(process.argv);

const options = {
  'json': (typeof program.json === 'undefined') ? false : true,
  'wine': (typeof program.wine === 'undefined') ? false : true
};

if (program.args.length) {
  cmdhelp(program.args[0], options);
} else {
  cmdhelp('', options);
}
