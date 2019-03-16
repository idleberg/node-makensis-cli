#!/usr/bin/env node

import * as program from 'commander';
import { scaffold } from './commands';

// Action
program
  .parse(process.argv);

scaffold();
