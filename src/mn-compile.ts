#!/usr/bin/env node

import * as program from 'commander';
import * as getStdin from 'get-stdin';
import { compile } from './commands';
import { platform } from 'os';
import { input as inputCharsets, output as outputCharsets } from './charsets';

function parseCommands(value, dummyPrevious) {
  const trimmedValue = value.trim();

  try {
    return JSON.parse(trimmedValue);
  } catch (e) {
    return trimmedValue;
  }

}

// Action
program
  .usage('[script(s)] [options]')
  .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
  .option('-j, --json', 'prints output as JSON')
  .option('-W, --pause', 'pauses after execution')
  .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
  .option('-P, --ppo', 'preprocess to stdout/file')
  .option('-S, --safe-ppo', 'safely preprocess to stdout/file')
  .option('-b, --pre-execute <string>', 'executes script-commands before script', parseCommands)
  .option('-a, --post-execute <string>', 'executes script-commands after script', parseCommands)
  .option('-p, --priority <n>', 'process priority, where n is 5=realtime,4=high,3=above normal,2=normal,1=below normal,0=idle', parseInt)
  .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
  .option('-w, --wine', 'use Wine to run makensis')
  .option('-x, --strict', 'treat warnings as errors')
  .parse(process.argv);

const inputCharset = (typeof program.inputCharset !== 'undefined' && inputCharsets.includes(program.inputCharset.toUpperCase())) ? program.inputCharset.toUpperCase() : '';
const json = (typeof program.json === 'undefined') ? false : true;
const noCD = (typeof program.nocd === 'undefined') ? false : true;
const noConfig = (typeof program.noconfig === 'undefined') ? false : true;
const pause = (typeof program.pause === 'undefined') ? false : true;
const ppo = (typeof program.ppo === 'undefined') ? false : true;
const safePPO = (typeof program.safePpo === 'undefined') ? false : true;
const strict = (typeof program.strict === 'undefined') ? false : true;
const verbose = (program.verbose >= 0 && program.verbose <= 4) ? program.verbose : 2;
const wine = (typeof program.wine === 'undefined') ? false : true;
let outputCharset = (typeof program.outputCharset !== 'undefined' && outputCharsets.includes(program.outputCharset.toUpperCase())) ? program.outputCharset.toUpperCase() : '';
let priority = (program.priority >= 0 && program.priority <= 5) ? program.priority : 2;

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
  'priority': priority,
  'safePPO': safePPO,
  'strict': strict,
  'verbose': verbose,
  'wine': wine
};

if (program.preExecute) {
  options['preExecute'] = program.preExecute;
}

if (program.postExecute) {
  options['postExecute'] = program.postExecute;
}

(async () => {
  if (program.args.length) {
  program.args.forEach(scriptFile => {
    compile(scriptFile, options);
  });
} else {
  const stdin = await getStdin();

  if (stdin) {
    options['preExecute'] = stdin;
    compile('', options);
  } else {
    program.help();
  }
}
})();


