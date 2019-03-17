#!/usr/bin/env node

import * as program from 'commander';
import { compile } from './commands';
import { platform } from 'os';
import { input as inputCharsets, output as outputCharsets } from './charsets';

// Action
program
  .usage('[script(s)] [options]')
  .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
  .option('-j, --json', 'prints output as JSON')
  .option('-W, --pause', 'pauses after execution')
  .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
  .option('-P, --ppo', 'preprocess to stdout/file')
  .option('-S, --safe-ppo', 'safely preprocess to stdout/file')
  .option('-p, --priority <n>', 'process priority, where n is 5=realtime,4=high,3=above normal,2=normal,1=below normal,0=idle', parseInt)
  .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
  .option('-w, --wine', 'use Wine to run makenis')
  .option('-x, --strict', 'treat warnings as errors')
  .parse(process.argv);

let inputCharset = (typeof program.inputCharset !== 'undefined' && inputCharsets.includes(program.inputCharset.toUpperCase())) ? program.inputCharset.toUpperCase() : '';
let noCD = (typeof program.nocd === 'undefined') ? false : true;
let noConfig = (typeof program.noconfig === 'undefined') ? false : true;
let outputCharset = (typeof program.outputCharset !== 'undefined' && outputCharsets.includes(program.outputCharset.toUpperCase())) ? program.outputCharset.toUpperCase() : '';
let pause = (typeof program.pause === 'undefined') ? false : true;
let ppo = (typeof program.ppo === 'undefined') ? false : true;
let priority = (program.priority >= 0 && program.priority <= 5) ? program.priority : null;
let json = (typeof program.json === 'undefined') ? false : true;
let safePPO = (typeof program.safePpo === 'undefined') ? false : true;
let strict = (typeof program.strict === 'undefined') ? false : true;
let verbose = (program.verbose >= 0 && program.verbose <= 4) ? program.verbose : null;
let wine = (typeof program.wine === 'undefined') ? false : true;

if (platform() === 'win32' || wine === true) {
  outputCharset = (typeof program.outputCharset !== 'undefined') ? program.outputCharset : '';
  priority = (typeof program.priority !== 'undefined') ? program.priority : '';
}

const options = {
  'inputCharset': inputCharset,
  'json': json,
  'noCD': noCD,
  'noConfig': noConfig,
  'outputCharset': outputCharset,
  'pause': pause,
  'ppo': ppo,
  'safePPO': safePPO,
  'priority': priority,
  'strict': strict,
  'verbose': verbose,
  'wine': wine
};

if (program.args.length) {
  program.args.forEach(scriptFile => {
    compile(scriptFile, options);
  });
} else {
  program.help();
}
