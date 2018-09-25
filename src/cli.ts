// Dependencies
import * as program from 'commander';
import { extname } from 'path';
import { platform } from 'os';

// Local exports
const meta = require('../package.json');
import * as charsets from './charsets';
import {
  cmdhelp,
  compile,
  hdrinfo,
  license,
  nsisdir,
  version
} from './commands';

// Action
program
  .version(meta.version)
  .description('CLI version of node-makensis')
  .arguments('[command] [file.nsi]')
  .usage('[command] [file.nsi] [options]')
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
  .action(function(cmd, filePath, flags) {

    let inputCharset = (typeof flags.inputCharset !== 'undefined' && charsets.input.indexOf(flags.inputCharset.toUpperCase()) !== -1) ? flags.inputCharset.toUpperCase() : '';
    let noCD = (typeof flags.nocd === 'undefined') ? false : true;
    let noConfig = (typeof flags.noconfig === 'undefined') ? false : true;
    let outputCharset = (typeof flags.outputCharset !== 'undefined' && charsets.output.indexOf(flags.outputCharset.toUpperCase()) !== -1) ? flags.outputCharset.toUpperCase() : '';
    let pause = (typeof flags.pause === 'undefined') ? false : true;
    let ppo = (typeof flags.ppo === 'undefined') ? false : true;
    let priority = (flags.priority >= 0 && flags.priority <= 5) ? flags.priority : null;
    let json = (typeof flags.json === 'undefined') ? false : true;
    let safePPO = (typeof flags.safePpo === 'undefined') ? false : true;
    let strict = (typeof flags.strict === 'undefined') ? false : true;
    let verbose = (flags.verbose >= 0 && flags.verbose <= 4) ? flags.verbose : null;
    let wine = (typeof flags.wine === 'undefined') ? false : true;

    if (platform() === 'win32' || wine === true) {
      outputCharset = (typeof flags.outputCharset !== 'undefined') ? flags.outputCharset : '';
      outputCharset = (typeof flags.priority !== 'undefined') ? flags.priority : '';
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

    switch (cmd) {
      case 'f':
      case 'flags':
      case 'hdrinfo':
      case 'i':
      case 'info':
        hdrinfo(options);
        break;
      case 'v':
      case 'version':
        version(options);
        break;
      case 'cmdhelp':
      case 'help':
        filePath = (typeof filePath === 'undefined') ? '' : filePath;
        cmdhelp(filePath, options);
        break;
      case 'h':
      case 'help':
        program.help();
        break;
      case 'd':
      case 'dir':
      case 'nsisdir':
        nsisdir(options);
        break;
        break;
      case 'l':
      case 'license':
        license(options);
        break;
      default:
        if (typeof cmd !== 'undefined' && (extname(cmd) === '.nsi' || extname(cmd) === '.bnsi')) {
          compile(cmd, options);
          break;
        }

        program.help();
    }
  })
.parse(process.argv);

if (program.args.length === 0) program.help();
